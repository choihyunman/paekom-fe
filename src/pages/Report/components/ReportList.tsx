import { Card, CardContent } from "@/components/ui/Card";
import { Calendar, Clock, User, ChevronRight } from "lucide-react";

type Report = {
  id: number;
  date: string;
  counselor: string;
  duration: string;
  summary: string;
};

type Props = {
  reports: Report[];
  onOpen: (id: number) => void;
};

export default function ReportList({ reports, onOpen }: Props) {
  return (
    <div className="space-y-4">
      {reports.map((report, idx) => {
        const displayTitle = `${idx + 1}번째 상담`; // 목록 순서 기반 제목
        return (
          <Card
            key={report.id}
            role="button"
            tabIndex={0}
            onClick={() => onOpen(report.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onOpen(report.id);
            }}
            className="group border-gray-400 cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-[#EAF6FF] motion-safe:hover:-translate-y-0.5"
            aria-label={`${report.date} ${displayTitle} 상세보기`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{report.date}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-[#FF8A65]">
                    {displayTitle}
                  </h3>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{report.counselor}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{report.duration}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm line-clamp-2">
                    {report.summary}
                  </p>
                </div>

                <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
