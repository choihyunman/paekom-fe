import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createSignaling } from "@/lib/signaling";
import { ICE_CONFIG } from "@/lib/iceServers";
import { useCallStore } from "@/stores/callStore";

const DEMO = import.meta.env.VITE_DEMO_MODE;

export function useWebRTC(roomId: string, signalingUrl: string) {
  const { micOn, camOn } = useCallStore();
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localRef = useRef<MediaStream | null>(null);
  const [local, setLocal] = useState<MediaStream | null>(null);
  const [remote, setRemote] = useState<MediaStream | null>(null);
  const [connected, setConnected] = useState(false);

  // StrictMode/재마운트 대비용 취소 플래그
  const abortedRef = useRef(false);

  const signaling = useMemo(
    () =>
      createSignaling(signalingUrl, async (msg) => {
        const pc = pcRef.current;
        if (!pc || pc.signalingState === "closed") return;

        if (msg.type === "offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          signaling.send({ type: "answer", roomId, sdp: answer });
        } else if (msg.type === "answer") {
          await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        } else if (msg.type === "ice" && msg.candidate) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
          } catch {}
        }
      }),
    [roomId, signalingUrl]
  );

  const safeClosePc = (pc?: RTCPeerConnection | null) => {
    if (!pc) return;
    try {
      pc.getSenders().forEach((s) => s.track?.stop());
    } catch {}
    try {
      pc.close();
    } catch {}
  };

  const leave = useCallback(() => {
    abortedRef.current = true; // 이후 비동기 작업 무시
    try {
      signaling.send({ type: "leave", roomId });
    } catch {}
    safeClosePc(pcRef.current);
    pcRef.current = null;
    try {
      localRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}
    localRef.current = null;
    setLocal(null);
    setRemote(null);
    setConnected(false);
    try {
      signaling.close();
    } catch {}
  }, [roomId, signaling]);

  useEffect(() => {
    if (DEMO) {
      // 시그널링 없이 로컬만
      (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocal(stream);
        setRemote(null); // 상대 없음 → 대기화면/사진
        setConnected(false);
      })();
      return; // WebRTC 로직 건너뛰기
    }

    abortedRef.current = false;

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

      // 🔒 cleanup/재마운트로 무효화된 경우 즉시 중단
      if (
        abortedRef.current ||
        pcRef.current !== pc ||
        pc.signalingState === "closed"
      ) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      stream.getAudioTracks().forEach((t) => (t.enabled = micOn));
      stream.getVideoTracks().forEach((t) => (t.enabled = camOn));

      localRef.current = stream;
      setLocal(stream);

      // 🔒 addTrack 전에 다시 한 번 PC 상태 확인
      if (pcRef.current === pc && pc.connectionState !== "closed") {
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      }

      signaling.send({ type: "join", roomId });
      const offer = await pc.createOffer();

      // 🔒 setLocalDescription 전에 다시 확인
      if (
        !abortedRef.current &&
        pcRef.current === pc &&
        pc.connectionState !== "closed"
      ) {
        await pc.setLocalDescription(offer);
        signaling.send({ type: "offer", roomId, sdp: offer });
      }
    })();

    return () => {
      abortedRef.current = true;
      // 이 effect에서 만든 pc만 닫기(새로운 pc가 이미 만들어졌을 수 있음)
      if (pcRef.current === pc) {
        leave();
      } else {
        safeClosePc(pc); // 로컬 pc만 안전 종료
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // mic/cam 토글 동기화
  useEffect(() => {
    const s = localRef.current;
    if (!s) return;
    s.getAudioTracks().forEach((t) => (t.enabled = micOn));
  }, [micOn]);

  useEffect(() => {
    const s = localRef.current;
    if (!s) return;
    s.getVideoTracks().forEach((t) => (t.enabled = camOn));
  }, [camOn]);

  return { local, remote, connected, leave };
}
