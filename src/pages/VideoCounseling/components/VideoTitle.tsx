import { useEffect, useRef } from "react";

export default function VideoTitle({
  stream,
  muted,
  label,
  mirrored,
}: {
  stream: MediaStream | null;
  muted?: boolean;
  label?: string;
  mirrored?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (stream) {
      v.srcObject = stream;

      // 크롬 자동재생 정책/타이밍 이슈 방지
      const p = v.play();
      if (p) p.catch(() => {});
    } else {
      v.srcObject = null;
    }
  }, [stream]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className={`h-full w-full object-cover ${
          mirrored ? "-scale-x-100" : ""
        }`}
      />
      {label && (
        <div className="absolute left-2 top-2 rounded bg-black/40 px-2 py-1 text-xs text-white">
          {label}
        </div>
      )}
    </div>
  );
}
