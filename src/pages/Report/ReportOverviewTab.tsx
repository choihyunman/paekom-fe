import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle, Heart, Star } from "lucide-react";
import IssuesList from "./components/IssuesList";
import EmotionBars from "./components/EmotionBars";
import type { DetailOutletContext } from "./ReportDetailPage";

function getEmotionKorean(e: "POSITIVE" | "NEUTRAL" | "NEGATIVE") {
  if (e === "POSITIVE") return "긍정";
  if (e === "NEGATIVE") return "부정";
  return "중립";
}

export default function ReportOverviewTab() {
  const { report } = useOutletContext<DetailOutletContext>();

  return (
    <>
      {/* 요약 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-[#6EC6FF]" />
            상담 내용 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-6">{report.summary}</p>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">주요 문제점</h4>
            <IssuesList issues={report.issues} />
          </div>
        </CardContent>
      </Card>

      {/* 감정 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Heart className="h-5 w-5 text-[#FF8C69]" />
            상담자 주된 감정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-gray-700">
            현재 감정:{" "}
            <span className="font-semibold">
              {getEmotionKorean(report.emotion)}
            </span>
          </div>
          <EmotionBars evidence={report.evidence} />
        </CardContent>
      </Card>

      {/* 종합 평가 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Star className="h-5 w-5 text-[#FFD700]" />
            종합 평가
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-[#EAF6FF] p-6 rounded-lg border-l-4 border-[#6EC6FF]">
            <p className="text-gray-800 text-lg font-medium text-center">
              "{report.overallAssessment}"
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
