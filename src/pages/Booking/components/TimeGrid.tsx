import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  times: readonly string[];
  selectedTime: string;
  onSelect: (t: string) => void;
  className?: string;
};

export default function TimeGrid({
  times,
  selectedTime,
  onSelect,
  className,
}: Props) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          <Clock className="h-5 w-5 mr-2 text-[#6EC6FF]" />
          시간 선택
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {times.map((t) => (
            <Button
              key={t}
              variant={selectedTime === t ? "default" : "outline"}
              className={cn(
                "h-12 cursor-pointer",
                selectedTime === t
                  ? "bg-[#6EC6FF] hover:bg-[#5BB8F3] text-white"
                  : "hover:bg-[#EAF6FF] hover:border-[#6EC6FF]"
              )}
              onClick={() => onSelect(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
