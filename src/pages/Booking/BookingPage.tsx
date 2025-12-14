import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import { useHeader } from "@/components/shared/AppHeader";
import DateGrid from "./components/DateGrid";
import TimeGrid from "./components/TimeGrid";
import BookingSummaryCard from "./components/BookingSummaryCard";
import BookingSuccess from "./components/BookingSuccess";
import { addBooking } from "./BookingStorage";
import { useBookingStore } from "@/stores/bookingStore";

// 예약 가능한 시간 슬롯 (임시)
const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
] as const;

type DateItem = {
  value: string; // 2025-09-16
  display: string; // "9월 16일 (화)" 등
};

// ✅ 로컬 기준 YYYY-MM-DD로 만들기
function toYMDLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ✅ 로컬 기준으로 YYYY-MM-DD를 Date로 만들기
export function fromYMDLocal(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1); // ← 로컬 타임존
}

function generateDates(days = 14): DateItem[] {
  const list: DateItem[] = [];
  const today = new Date();
  for (let i = 1; i <= days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    list.push({
      // ❌ d.toISOString().split("T")[0]
      value: toYMDLocal(d), // ✅ 로컬 YMD
      display: d.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
        weekday: "short",
      }),
    });
  }
  return list;
}

export default function BookingPage() {
  const navigate = useNavigate();
  const { setHeader, reset } = useHeader();
  const { createBooking, loading, error } = useBookingStore();

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isBooked, setIsBooked] = useState(false);

  // 공통 헤더 세팅
  useEffect(() => {
    setHeader({
      title: "상담 예약",
      showBack: true,
      backTo: "/bookings",
      backLabel: "목록 보기",
    });
    return reset;
  }, [setHeader, reset]);

  // 날짜 리스트 메모
  const dates = useMemo(() => generateDates(14), []);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      // API 호출
      await createBooking(selectedDate, selectedTime);

      // ✅ API 성공 후 로컬 스토리지에도 저장 (필요한 경우)
      addBooking({
        date: selectedDate,
        time: selectedTime,
        method: "화상", // 기본값 (원하면 선택 UI 추가)
        status: "확정",
        counselor: "배정 대기",
        note: "예약 확정 후 안내를 드립니다.",
      });

      setIsBooked(true);
      // 또는 바로 목록으로 보내고 싶다면:
      // navigate("/bookings", { replace: true })
    } catch (err) {
      // 에러는 스토어에서 관리되므로 여기서는 로그만 남기거나
      // 필요시 사용자에게 알림을 표시할 수 있습니다
      console.error("예약 생성 실패:", err);
    }
  };

  if (isBooked) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <BookingSuccess
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onGoList={() => navigate("/bookings")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 날짜/시간 선택 */}
      <div className="grid md:grid-cols-2 gap-8">
        <DateGrid
          dates={dates}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />
        <TimeGrid
          times={timeSlots as readonly string[]}
          selectedTime={selectedTime}
          onSelect={setSelectedTime}
        />
      </div>

      {/* 요약 + 예약 버튼 */}
      <BookingSummaryCard
        className="mt-8"
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onBook={handleBooking}
      />

      {/* 안내 섹션 */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-800 mb-3">예약 안내사항</h4>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li>• 예약 확정 후 상담사가 예약된 시간에 연락드립니다.</li>
            <li>• 상담은 화상통화로 진행되며, 안전한 환경에서 이루어집니다.</li>
            <li>• 예약 변경/취소는 최소 2시간 전에 연락주세요.</li>
            <li>• 모든 상담 내용은 철저히 보안이 유지됩니다.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
