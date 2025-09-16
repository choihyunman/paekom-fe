import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  dates: { value: string; display: string }[];
  selectedDate: string;
  onSelect: (value: string) => void;
  className?: string;
};

export default function DateGrid({
  dates,
  selectedDate,
  onSelect,
  className,
}: Props) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          <Calendar className="h-5 w-5 mr-2 text-[#6EC6FF]" />
          날짜 선택
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {dates.map((d) => (
            <Button
              key={d.value}
              variant={selectedDate === d.value ? "default" : "outline"}
              className={cn(
                "h-auto p-3 flex flex-col items-center justify-center cursor-pointer",
                selectedDate === d.value
                  ? "bg-[#6EC6FF] hover:bg-[#5BB8F3] text-white"
                  : "hover:bg-[#EAF6FF] hover:border-[#6EC6FF]"
              )}
              onClick={() => onSelect(d.value)}
            >
              <span className="text-sm font-medium">{d.display}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
