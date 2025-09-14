import { useEffect, useRef } from "react";

export default function VideoTile({
  stream,
  muted,
  label,
  mirrored = false,
}: {
  stream: MediaStream | null;
  muted?: boolean;
  label?: string;
  mirrored?: boolean;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
      ref.current.play().catch(() => {});
    }
  }, [stream]);

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 text-sm font-semibold text-slate-700">{label}</div>
      )}
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={muted}
        className={`w-full h-full rounded-lg bg-black object-cover md:h-48 
          ${mirrored ? "transform -scale-x-100" : ""}
        `}
      />
    </div>
  );
}
