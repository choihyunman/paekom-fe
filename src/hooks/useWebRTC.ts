import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createSignaling } from "@/lib/signaling";
import { ICE_CONFIG } from "@/lib/iceServers";
import { useCallStore } from "@/stores/callStore";

const DEMO = import.meta.env.VITE_DEMO_MODE === "true";

export function useWebRTC(roomId: string, signalingUrl: string) {
  const { micOn, camOn } = useCallStore();

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localRef = useRef<MediaStream | null>(null);
  const abortedRef = useRef(false);

  const [local, setLocal] = useState<MediaStream | null>(null);
  const [remote, setRemote] = useState<MediaStream | null>(null);
  const [connected, setConnected] = useState(false);

  /* -------------------- 공통 cleanup -------------------- */
  const cleanupAll = useCallback(() => {
    abortedRef.current = true;

    try {
      localRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}

    try {
      pcRef.current?.getSenders().forEach((s) => s.track?.stop());
      pcRef.current?.close();
    } catch {}

    localRef.current = null;
    pcRef.current = null;

    setLocal(null);
    setRemote(null);
    setConnected(false);
  }, []);

  /* -------------------- signaling -------------------- */
  const signaling = useMemo(
    () =>
      createSignaling(signalingUrl, async (msg) => {
        const pc = pcRef.current;
        if (!pc || pc.signalingState === "closed") return;

        if (msg.type === "offer") {
          await pc.setRemoteDescription(msg.sdp);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          signaling.send({ type: "answer", roomId, sdp: answer });
        } else if (msg.type === "answer") {
          await pc.setRemoteDescription(msg.sdp);
        } else if (msg.type === "ice" && msg.candidate) {
          try {
            await pc.addIceCandidate(msg.candidate);
          } catch {}
        }
      }),
    [roomId, signalingUrl]
  );

  /* -------------------- leave -------------------- */
  const leave = useCallback(() => {
    try {
      signaling.send({ type: "leave", roomId });
    } catch {}

    cleanupAll();

    try {
      signaling.close();
    } catch {}
  }, [roomId, signaling, cleanupAll]);

  /* -------------------- main effect -------------------- */
  useEffect(() => {
    abortedRef.current = false;

    if (DEMO) {
      (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localRef.current = stream;
        setLocal(stream);
      })();

      return cleanupAll;
    }

    const pc = new RTCPeerConnection(ICE_CONFIG);
    pcRef.current = pc;

    const inbound = new MediaStream();
    pc.ontrack = (e) => {
      e.streams[0]?.getTracks().forEach((t) => inbound.addTrack(t));
      setRemote(inbound);
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        signaling.send({
          type: "ice",
          roomId,
          candidate: e.candidate.toJSON(),
        });
      }
    };

    pc.onconnectionstatechange = () => {
      setConnected(pc.connectionState === "connected");
    };

    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (abortedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      stream.getAudioTracks().forEach((t) => (t.enabled = micOn));
      stream.getVideoTracks().forEach((t) => (t.enabled = camOn));

      localRef.current = stream;
      setLocal(stream);

      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      signaling.send({ type: "join", roomId });
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      signaling.send({ type: "offer", roomId, sdp: offer });
    })();

    return leave;
  }, [roomId]);

  /* -------------------- mic / cam toggle -------------------- */
  useEffect(() => {
    localRef.current?.getAudioTracks().forEach((t) => (t.enabled = micOn));
  }, [micOn]);

  useEffect(() => {
    localRef.current?.getVideoTracks().forEach((t) => (t.enabled = camOn));
  }, [camOn]);

  /* -------------------- page exit -------------------- */
  useEffect(() => {
    const onPageHide = () => cleanupAll();
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [cleanupAll]);

  return { local, remote, connected, leave };
}
