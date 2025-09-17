// src/hooks/useCallTimer.ts
import { useEffect, useRef, useState } from "react";

export function useCallTimer(running: boolean, resetOnStop = true) {
  const [secs, setSecs] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // 시작
    if (running) {
      // resume 지원: 기존 초 유지하며 이어서
      const base = startedAtRef.current ?? Date.now() - secs * 1000;
      startedAtRef.current = base;

      intervalRef.current = window.setInterval(() => {
        const diff = Math.max(
          0,
          Date.now() - (startedAtRef.current ?? Date.now())
        );
        setSecs(Math.floor(diff / 1000));
      }, 1000) as unknown as number;

      return () => {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
      };
    }

    // 멈춤
    if (!running) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      startedAtRef.current = null;
      if (resetOnStop) setSecs(0);
    }
  }, [running]);

  // mm:ss 포맷
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}
