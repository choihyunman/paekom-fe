import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FileText, Heart, Star } from "lucide-react";
import IssuesList from "./components/IssuesList";
import EmotionBars from "./components/EmotionBars";

function getEmotionKorean(e: string) {
  if (e === "POSITIVE") return "긍정";
  if (e === "NEGATIVE") return "부정";
  return "중립";
}

type ReportData = {
  summary: string;
  issues: string[];
  emotion: string;
  evidence: { POSITIVE: number; NEUTRAL: number; NEGATIVE: number };
  overallAssessment: string;
};

type Ctx = {
  report: ReportData;
};

type Props = {
  report?: ReportData;
};

export default function ReportOverviewTab(
  { report: reportProp }: Props = {} as Props
) {
  // ✅ prop이 있으면 prop 사용, 없으면 Outlet context 사용
  const ctx = useOutletContext<Ctx | undefined>();
  const report = reportProp || ctx?.report;

  if (!report) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">상담 내용 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">보고서 컨텍스트가 없습니다.</p>
        </CardContent>
      </Card>
    );
  }
  const evidence = report.evidence ?? { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0 };

  return (
    <>
      {/* 요약 */}
      <Card className="mb-4" bgClassName="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-[#6EC6FF]" />
            상담 내용 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-6">{report.summary}</p>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">주요 이슈</h4>
            <IssuesList issues={report.issues} />
          </div>
        </CardContent>
      </Card>

      {/* 감정 */}
      <Card className="mb-4" bgClassName="bg-gray-50">
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
          <EmotionBars evidence={evidence} />
        </CardContent>
      </Card>

      {/* 종합 평가 */}
      <Card className="mb-8" bgClassName="bg-gray-50">
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
