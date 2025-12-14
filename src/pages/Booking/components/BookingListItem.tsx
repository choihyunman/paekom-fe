import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, Video, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { BookingListItem } from "@/types/booking";

type Props = {
  booking: {
    id: number;
    date: string;
    time: string;
    method: "화상" | "대면";
    status: BookingListItem["status"];
  };
  statusBadge: React.ReactNode;
  onOpen: () => void;
  onReschedule: () => void;
  onCancel: () => void;
};

export default function BookingListItem({
  booking,
  statusBadge,
  onCancel,
}: Props) {
  const isDisabled = booking.status === "CANCELLED";
  const isCompleted = booking.status === "COMPLETED";
  const MethodIcon = booking.method === "화상" ? Video : Building2;
  const navigate = useNavigate();

  // 예약 날짜 확인
  const bookingDate = new Date(booking.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  bookingDate.setHours(0, 0, 0, 0);
  const isToday = bookingDate.getTime() === today.getTime();
  const isPastDate = bookingDate < today;

  // 클릭 가능 여부: 취소되지 않았고, 오늘 날짜이며, 완료되지 않은 경우
  const isClickable = !isDisabled && isToday && !isCompleted;

  // hover 효과 없음: 취소됨 OR 완료됨 OR 날짜가 지남
  const hasHoverEffect = !isDisabled && !isCompleted && !isPastDate;

  const handleCardClick = () => {
    if (isClickable) {
      navigate(`/video-counseling/${booking.id}`);
    }
  };

  return (
    <Card
      className={
        hasHoverEffect
          ? "hover:shadow-md hover:bg-[#EAF6FF] motion-safe:hover:-translate-y-0.5 cursor-pointer"
          : isClickable
          ? "cursor-pointer opacity-60"
          : "opacity-60"
      }
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <MethodIcon className="h-4 w-4 text-[#6EC6FF]" />
              {statusBadge}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-lg font-semibold text-gray-900">
                {new Date(booking.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-lg font-semibold text-gray-900">
                {booking.time}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center">
            <Button
              variant="outline"
              className="bg-white !text-black border border-gray-300 hover:!bg-[#FF8A65] hover:!text-white cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // 카드 클릭 이벤트 방지
                onCancel();
              }}
              disabled={isDisabled || isCompleted}
            >
              취소
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
