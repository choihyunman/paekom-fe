import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Clock,
  User,
  Heart,
  Star,
  AlertCircle,
} from "lucide-react";
import IssuesList from "./components/IssuesList";
import EmotionBars from "./components/EmotionBars";

// 더미 데이터 타입
type DetailedReport = {
  id: number;
  date: string;
  title?: string;
  counselor: string;
  duration: string;
  status: "완료" | "예정";
  type: "개별상담" | "그룹상담" | "평가상담";
  summary: string;
  issues: string[];
  emotion: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  evidence: { POSITIVE: number; NEUTRAL: number; NEGATIVE: number };
  overallAssessment: string;
  createdAt: string;
};

// 더미 데이터 (그대로 유지 가능)
const detailedReportData: Record<string, DetailedReport> = {
  "1": {
    id: 1,
    date: "2024-01-15",
    title: "첫 상담 세션",
    counselor: "김상담 전문가",
    duration: "50분",
    status: "완료",
    type: "개별상담",
    summary:
      "현재 취업 스트레스로 인해 사회적 위축과 자신감 저하를 경험하고 있습니다. 주 1회 미만으로 외출하며, 대인관계 회피 및 무기력 증상이 나타나고 있습니다. 취업 실패에 대한 두려움과 미래에 대한 불확실성이 심리적 부담으로 작용하고 있습니다.",
    issues: [
      "취업 스트레스 및 구직 실패에 대한 불안",
      "사회적 위축 및 대인관계 회피",
      "자신감 부족 및 무기력증",
      "외출 빈도 감소(주 1회 미만)",
      "미래에 대한 불확실성",
    ],
    emotion: "NEUTRAL",
    evidence: { POSITIVE: 0, NEUTRAL: 100, NEGATIVE: 0 },
    overallAssessment: "밖에 자주 나가는 게 어떨까요?",
    createdAt: "2025-09-11T14:20:00",
  },
  "2": {
    id: 2,
    date: "2024-01-22",
    title: "진행상황 점검",
    counselor: "김상담 전문가",
    duration: "45분",
    status: "완료",
    type: "개별상담",
    summary:
      "지난 주 설정한 소규모 사회적 활동을 성공적으로 수행했습니다. 작은 성취에 대해 긍정적인 반응을 보였으며, 자신감이 조금씩 회복되고 있는 모습을 보였습니다.",
    issues: [
      "지속적인 동기 유지 필요",
      "더 큰 도전에 대한 준비",
      "사회적 기술 향상",
    ],
    emotion: "POSITIVE",
    evidence: { POSITIVE: 75, NEUTRAL: 20, NEGATIVE: 5 },
    overallAssessment:
      "온라인 커뮤니티 참여를 통한 점진적 사회적 참여를 권장합니다.",
    createdAt: "2025-09-18T15:30:00",
  },
};

function getEmotionKorean(e: DetailedReport["emotion"]) {
  if (e === "POSITIVE") return "긍정";
  if (e === "NEGATIVE") return "부정";
  return "중립";
}

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const report = useMemo(() => (id ? detailedReportData[id] : undefined), [id]);

  if (!report) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            보고서를 찾을 수 없습니다
          </h1>
          <Button onClick={() => navigate(-1)}>돌아가기</Button>
        </div>
      </div>
    );
  }

  const displayTitle =
    report.title && report.title.trim().length > 0
      ? report.title
      : `${report.id}번째 상담`;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div style={{ backgroundColor: "#CAE8FA" }}>
        <header className="shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="text-gray-600 hover:text-[#6EC6FF] cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  목록으로
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">
                  상담 보고서 상세
                </h1>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Report Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-800 mb-2">
                  {displayTitle}
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{report.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{report.counselor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{report.duration}</span>
                  </div>
                </div>
              </div>

              {/* 상태/유형 배지는 삭제 (항상 개별·완료 가정) */}
            </div>
          </CardHeader>
        </Card>

        {/* 상담 내용 요약 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <FileText className="h-5 w-5 text-[#6EC6FF]" />
              <span>상담 내용 요약</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-6">
              {report.summary}
            </p>
          </CardContent>
        </Card>

        {/* 현재 겪고 있는 이슈 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <AlertCircle className="h-5 w-5 text-[#FF8C69]" />
              <span>현재 겪고 있는 이슈</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IssuesList issues={report.issues} dense />
          </CardContent>
        </Card>

        {/* 감정 섹션 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Heart className="h-5 w-5 text-[#FF8C69]" />
              <span>상담자 주된 감정</span>
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
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Star className="h-5 w-5 text-[#FFD700]" />
              <span>종합 평가</span>
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
      </main>
    </div>
  );
}
