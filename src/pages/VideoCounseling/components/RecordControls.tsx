import { useState } from "react";
import { useStereoRecorder } from "@/hooks/useStereoRecorder";
import { useUploadSttMutation } from "@/hooks/useSttQueries";
import { Lock, Loader2 } from "lucide-react";
import { startBooking, completeBooking } from "@/api/booking";
import { sttApi } from "@/api";

export default function RecordControls({
  localStream,
  remoteStream,
  onStart,
  onEnd,
  ended = false,
  bookingId,
}: {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onStart?: () => void;
  onEnd?: () => void;
  ended?: boolean;
  bookingId?: number;
}) {
  const { isRecording, start, stopAndGetFile } = useStereoRecorder({
    localStream,
    remoteStream,
    filenamePrefix: "paekom_call",
  });
  const uploadMut = useUploadSttMutation();

  // 종료 버튼 누른 뒤 업로드까지 잠금용
  const [stopping, setStopping] = useState(false);

  const handleStart = async () => {
    if (ended) return;
    if (!localStream) {
      alert("마이크/카메라 권한을 확인해 주세요.");
      return;
    }
    try {
      if (bookingId) {
        await startBooking(bookingId);
      }
      start();
      onStart?.();
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "상담 시작 중 오류가 발생했습니다.");
    }
  };

  const handleEnd = async () => {
    // UI를 즉시 종료 상태로 전환 (부모 ended=true)
    onEnd?.();
    setStopping(true);
    try {
      const file = await stopAndGetFile(); // stop → File

      // 1. 상담 종료 API 호출
      if (bookingId) {
        await completeBooking(bookingId);
      }

      // 2. STT 업로드
      if (file && file.size > 0) {
        const sttId = await uploadMut.mutateAsync({ file, bookingId });

        // 3. Report 요청
        if (sttId) {
          await sttApi.requestSttReport(sttId, bookingId);
        }
      }
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "상담 종료/업로드 중 오류가 발생했습니다.");
    } finally {
      setStopping(false); // ended는 이미 true라 재시작은 불가
    }
  };

  const startDisabled =
    ended || !localStream || stopping || uploadMut.isPending;

  const showEndBusy = stopping || uploadMut.isPending;

  return (
    <div className="flex items-center rounded-full bg-white p-1 shadow">
      {/* 녹음 중이거나 종료 처리 중이면 '종료' 뷰 고정 */}
      {isRecording || showEndBusy ? (
        <button
          onClick={isRecording ? handleEnd : undefined}
          disabled={showEndBusy}
          className="rounded-full bg-rose-500 px-4 py-2 font-semibold text-white disabled:opacity-60"
          title="상담 종료(자동 업로드)"
        >
          {showEndBusy ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              업로드 중...
            </span>
          ) : (
            "■ 상담 종료"
          )}
        </button>
      ) : (
        <button
          onClick={handleStart}
          disabled={startDisabled}
          aria-disabled={startDisabled}
          title={
            ended ? "상담이 종료되어 다시 시작할 수 없습니다" : "상담 시작"
          }
          className={`rounded-full px-4 py-2 font-semibold transition ${
            startDisabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-sky-500 text-white hover:bg-sky-600"
          }`}
        >
          {ended ? (
            <span className="inline-flex items-center gap-1">
              <Lock className="h-4 w-4" /> 상담 종료됨
            </span>
          ) : (
            "● 상담 시작"
          )}
        </button>
      )}
    </div>
  );
}
