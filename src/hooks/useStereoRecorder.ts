// src/hooks/useStereoRecorder.ts
import { useCallback, useEffect, useRef, useState } from "react";

type Args = {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  filenamePrefix?: string;
};

export function useStereoRecorder({
  localStream,
  remoteStream,
  filenamePrefix = "call",
}: Args) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const destRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const mergerRef = useRef<ChannelMergerNode | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [isRecording, setIsRecording] = useState(false);

  const buildGraph = useCallback(() => {
    if (!localStream) return null;
    const ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;

    const dest = ctx.createMediaStreamDestination();
    destRef.current = dest;

    const merger = ctx.createChannelMerger(2);
    mergerRef.current = merger;

    // L channel: local
    ctx.createMediaStreamSource(localStream).connect(merger, 0, 0);
    // R channel: remote (있을 때만)
    if (remoteStream && remoteStream.getAudioTracks().length) {
      ctx.createMediaStreamSource(remoteStream).connect(merger, 0, 1);
    }

    merger.connect(dest);
    return dest.stream;
  }, [localStream, remoteStream]);

  const start = useCallback(() => {
    if (!localStream) throw new Error("로컬 오디오 스트림이 없습니다.");

    const mixed = buildGraph();
    if (!mixed) throw new Error("오디오 그래프 생성 실패");

    const prefer = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
    ];
    const mimeType = prefer.find((t) => MediaRecorder.isTypeSupported(t)) || "";

    const rec = new MediaRecorder(mixed, mimeType ? { mimeType } : undefined);
    recorderRef.current = rec;
    chunksRef.current = [];

    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };

    rec.start();
    setIsRecording(true);
  }, [buildGraph, localStream]);

  // ✅ 상담 종료용: stop을 기다렸다가 File 생성해 반환
  const stopAndGetFile = useCallback(async (): Promise<File> => {
    const rec = recorderRef.current;
    if (!rec) throw new Error("녹음기가 없습니다.");

    // stop 이벤트를 한 번 기다린 뒤 blob 구성
    if (rec.state !== "inactive") {
      await new Promise<void>((resolve) => {
        rec.addEventListener("stop", () => resolve(), { once: true });
        rec.stop();
      });
    }
    setIsRecording(false);

    const mime = rec.mimeType || "audio/webm";
    const ext = mime.includes("mp4")
      ? "mp4"
      : mime.includes("ogg")
      ? "ogg"
      : "webm";
    const blob = new Blob(chunksRef.current, { type: mime });
    chunksRef.current = [];

    // 그래프 정리
    try {
      mergerRef.current?.disconnect();
    } catch {}
    try {
      destRef.current?.disconnect();
    } catch {}
    try {
      audioCtxRef.current?.close();
    } catch {}
    mergerRef.current = null;
    destRef.current = null;
    audioCtxRef.current = null;

    return new File([blob], `${filenamePrefix}_${Date.now()}.${ext}`, {
      type: mime,
    });
  }, [filenamePrefix]);

  useEffect(
    () => () => {
      // 언마운트 안전 정리
      try {
        if (recorderRef.current && recorderRef.current.state !== "inactive")
          recorderRef.current.stop();
      } catch {}
      try {
        audioCtxRef.current?.close();
      } catch {}
    },
    []
  );

  return { isRecording, start, stopAndGetFile };
}
