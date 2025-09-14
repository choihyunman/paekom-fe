import { useCallStore } from "@/stores/callStore";
// (선택) 아이콘 쓰고 싶으면: npm i lucide-react
// import { Video, VideoOff, Mic, MicOff, MessageSquare } from "lucide-react";

export default function CallControls() {
  const { micOn, camOn, toggleMic, toggleCam } = useCallStore();

  const btnBase =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white text-slate-700 shadow transition hover:ring-2 hover:ring-sky-200";
  const off = "bg-rose-50 border-rose-200 text-rose-700 hover:ring-rose-200";

  return (
    <div className="flex items-center gap-2 rounded-full bg-white p-2 shadow">
      <button
        onClick={toggleCam}
        aria-label="카메라"
        className={`${btnBase} ${camOn ? "" : off}`}
        title="카메라"
      >
        {/* 아이콘 사용시 <Video className="h-5 w-5" /> / <VideoOff .../> */}
        {camOn ? "📷" : "📷"}
      </button>
      <button
        onClick={toggleMic}
        aria-label="마이크"
        className={`${btnBase} ${micOn ? "" : off}`}
        title="마이크"
      >
        {micOn ? "🎤" : "🔇"}
      </button>
      <button aria-label="채팅" className={btnBase} title="채팅">
        💬
      </button>
    </div>
  );
}
