import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

type Props = {
  selectedDate: string;
  selectedTime: string;
  onGoList: () => void;
};

export default function BookingSuccess({
  selectedDate,
  selectedTime,
  onGoList,
}: Props) {
  return (
    <Card className="text-center shadow-lg">
      <CardContent className="p-12">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            예약이 완료되었습니다
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            상담사가 예약된 시간에 연락드릴 예정입니다.
          </p>
        </div>

        <div className="bg-[#EAF6FF] rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">예약 정보</h3>
          <p className="text-gray-700">
            날짜:{" "}
            {new Date(selectedDate).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </p>
          <p className="text-gray-700">시간: {selectedTime}</p>
        </div>

        <Button
          onClick={onGoList}
          className="bg-[#6EC6FF] hover:bg-[#5BB8F3] cursor-pointer text-white px-8 py-3"
        >
          목록으로 돌아가기
        </Button>
      </CardContent>
    </Card>
  );
}
