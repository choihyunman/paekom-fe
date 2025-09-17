import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { fromYMDLocal } from "../BookingPage";

type Props = {
  selectedDate: string;
  selectedTime: string;
  onBook: () => void;
  className?: string;
};

export default function BookingSummaryCard({
  selectedDate,
  selectedTime,
  onBook,
  className,
}: Props) {
  const canBook = !!(selectedDate && selectedTime);

  return (
    <Card className={cn("shadow-lg", className)}>
      <CardContent className="p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            선택한 예약 정보
          </h3>

          {canBook ? (
            <div className="bg-[#EAF6FF] rounded-lg p-4 mb-6">
              <p className="text-gray-700 mb-2">
                <strong>날짜:</strong>{" "}
                {fromYMDLocal(selectedDate).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </p>
              <p className="text-gray-700">
                <strong>시간:</strong> {selectedTime}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-500">날짜와 시간을 선택해주세요</p>
            </div>
          )}

          <Button
            onClick={onBook}
            disabled={!canBook}
            className="cursor-pointer bg-[#6EC6FF] hover:bg-[#5BB8F3] disabled:bg-gray-300 text-white px-8 py-3 text-lg"
          >
            예약하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
