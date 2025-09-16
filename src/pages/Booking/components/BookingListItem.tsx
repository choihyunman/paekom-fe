import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, UserRound, Video, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  booking: {
    id: number;
    date: string;
    time: string;
    counselor: string;
    method: "화상" | "대면";
    status: "확정" | "완료" | "취소" | "대기";
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
  const isDisabled = booking.status === "취소";
  const MethodIcon = booking.method === "화상" ? Video : Building2;
  const navigate = useNavigate();

  return (
    <Card
      className={
        isDisabled
          ? "opacity-60"
          : "hover:shadow-md hover:bg-[#EAF6FF] motion-safe:hover:-translate-y-0.5 cursor-pointer"
      }
      onClick={() => navigate("/video-counseling")}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <MethodIcon className="h-4 w-4 text-[#6EC6FF]" />
              <span className="text-sm text-gray-700">{booking.method}</span>
              {statusBadge}
            </div>
            <h3 className="mt-1 text-lg font-semibold text-gray-900 truncate">
              {new Date(booking.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}{" "}
              {booking.time}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <UserRound className="h-4 w-4" />
                <span>{booking.counselor}</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center">
            <Button
              variant="outline"
              className="bg-white !text-black border border-gray-300 hover:!bg-[#FF8A65] hover:!text-white cursor-pointer"
              onClick={onCancel}
              disabled={isDisabled || booking.status === "완료"}
            >
              취소
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
