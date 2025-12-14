import React from "react";
import { useParams } from "react-router-dom";
import { useWebRTC } from "@/hooks/useWebRTC";
import VideoTitle from "./components/VideoTitle";
import RecordControls from "./components/RecordControls";
import { Users, ShieldCheck, MessageSquareHeart } from "lucide-react";
import counselorImg from "@/assets/counselor.png";
import { useCallTimer } from "@/hooks/useCallTimer";
import { useBookingStore } from "@/stores/bookingStore";
import { useBookingListStore } from "@/stores/bookingListStore";
import { useHeader } from "@/components/shared/AppHeader";

type CallState = "idle" | "active" | "ended";
const SIGNALING_URL = import.meta.env.VITE_WEBSOCKET_URL;

export default function VideoCounselingPage() {
  const { roomId = "room1", id: bookingIdParam } = useParams<{
    roomId?: string;
    id?: string;
  }>();
  const [showCounselor, setShowCounselor] = React.useState(false);
  const [callState, setCallState] = React.useState<CallState>("idle");
  const { booking, setBooking } = useBookingStore();
  const { bookings, fetchBookings } = useBookingListStore();
  const { setHeader, reset } = useHeader();

  // 헤더 설정
  React.useEffect(() => {
    setHeader({
      title: "화상 상담",
      showBack: true,
      backTo: "/",
      backLabel: "홈으로",
    });
    return reset;
  }, [setHeader, reset]);

  // URL에서 받은 booking id로 booking 정보 설정
  React.useEffect(() => {
    if (bookingIdParam) {
      const bookingId = parseInt(bookingIdParam, 10);
      if (!isNaN(bookingId)) {
        // bookingListStore에서 해당 id의 booking 찾기
        const foundBooking = bookings.find((b) => b.id === bookingId);
        if (foundBooking) {
          // BookingListItem을 ApiBooking 형식으로 변환
          setBooking({
            id: foundBooking.id,
            scheduledDate: foundBooking.date,
            scheduledTime: foundBooking.time,
            status: foundBooking.status,
          });
        } else if (bookings.length === 0) {
          // 목록이 비어있으면 새로고침 시도
          fetchBookings({ force: true });
        }
      }
    }
  }, [bookingIdParam]); // bookingIdParam만 의존성으로

  // bookings가 업데이트된 후 다시 찾기
  React.useEffect(() => {
    if (bookingIdParam && bookings.length > 0) {
      const bookingId = parseInt(bookingIdParam, 10);
      if (!isNaN(bookingId)) {
        const foundBooking = bookings.find((b) => b.id === bookingId);
        if (foundBooking && (!booking || booking.id !== foundBooking.id)) {
          setBooking({
            id: foundBooking.id,
            scheduledDate: foundBooking.date,
            scheduledTime: foundBooking.time,
            status: foundBooking.status,
          });
        }
      }
    }
  }, [bookings, bookingIdParam, booking, setBooking]);

  // 진행 타이머
  const isRunning = callState === "active";
  const elapsed = useCallTimer(isRunning);

  const {
    local: localStream,
    remote: remoteStream,
    leave,
  } = useWebRTC(roomId, SIGNALING_URL);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <main className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[2fr_1fr]">
        {/* 무대 */}
        <section className="relative min-h-[520px] rounded-2xl bg-gradient-to-b from-sky-100 to-sky-200 p-6 shadow">
          {/* 🔁 우선순위: 종료 화면 > 원격영상 > 상담사 이미지 > 대기 */}
          {callState === "ended" ? (
            <div className="flex h-[420px] w-full flex-col items-center justify-center rounded-xl bg-white/30 text-slate-800 backdrop-blur">
              <h3 className="mb-1 text-xl font-semibold">
                상담이 종료되었습니다
              </h3>
              <p className="text-slate-600">기록은 안전하게 저장됩니다.</p>
            </div>
          ) : remoteStream ? (
            <div className="h-[420px] w-full overflow-hidden rounded-xl">
              <VideoTitle stream={remoteStream} />
            </div>
          ) : showCounselor ? (
            <div className="h-[420px] w-full overflow-hidden rounded-xl">
              {remoteStream ? (
                <video
                  autoPlay
                  playsInline
                  ref={(el) => {
                    if (el && remoteStream) el.srcObject = remoteStream;
                  }}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <img
                  src={counselorImg}
                  alt="상담사"
                  className="h-full w-full rounded-xl object-cover"
                />
              )}
            </div>
          ) : (
            <div className="flex h-[420px] w-full flex-col items-center justify-center rounded-xl bg-white/30 text-slate-800 backdrop-blur">
              <Users className="mb-1" />
              <h3 className="mb-1 text-xl font-semibold">상담사 대기 중</h3>
              <p className="text-slate-600">전문 상담사가 곧 연결됩니다</p>
              {/* 중앙 시작 버튼을 쓰고 싶다면 아래 주석 해제 (종료 후 비활성화) */}
              {/* <button disabled={callState==='ended'} className="mt-4 rounded-lg bg-sky-400 px-4 py-2 font-semibold text-white shadow disabled:opacity-50">상담 시작하기</button> */}
            </div>
          )}

          {/* 하단 컨트롤 바 */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
            <RecordControls
              localStream={localStream}
              remoteStream={remoteStream}
              ended={callState === "ended"}
              bookingId={booking?.id}
              onStart={() => {
                setShowCounselor(true);
                setCallState("active");
              }}
              onEnd={() => {
                setShowCounselor(false);
                setCallState("ended");
                // 카메라와 마이크 연결 끊기
                leave();
              }}
            />
          </div>
        </section>

        {/* 오른쪽 사이드바 */}
        <aside className="flex flex-col gap-2">
          <div className="rounded-2xl bg-white p-5 shadow mb-2">
            <div className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-800">
              <MessageSquareHeart className="h-5 w-5" />
              상담 정보
            </div>
            <div className="flex items-center justify-between py-1 text-slate-600">
              <span>예약 시간</span>
              <b className="text-slate-800">50분</b>
            </div>
            <div className="flex items-center justify-between py-1 text-slate-600">
              <span>진행 시간</span>
              <b className="tabular-nums text-slate-800">{elapsed}</b>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 p-5 shadow">
            <div className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-800">
              <ShieldCheck className="h-5 w-5" />
              안전한 상담 환경
            </div>
            <ul className="list-disc space-y-1 pl-5 text-slate-600">
              <li>모든 상담 내용은 철저히 보호됩니다</li>
              <li>전문 상담사가 함께합니다</li>
            </ul>
          </div>
          {/* ✅ 내 미리보기: 작은 화면에선 고정(fixed) 오버레이, 큰 화면에선 일반 카드 */}
          <div
            className="
        fixed bottom-24 right-6 z-20 w-44 rounded-xl bg-white/90 p-2 shadow
        lg:static lg:w-full lg:rounded-2xl lg:bg-white lg:p-2 lg:z-auto
      "
          >
            <VideoTitle stream={localStream} muted label="내 화면" mirrored />
          </div>
        </aside>
      </main>
    </div>
  );
}
