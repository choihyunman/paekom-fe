import { useMemo } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import ReportSidebar from "./components/ReportSidebar";

// ----- 임시 데이터 (API 연결 전) -----
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

export type DetailOutletContext = {
  report: DetailedReport;
  transcript: string;
};

// transcript 임시 응답
const mockTranscriptResponse = {
  status: "success",
  data: {
    id: 1,
    status: "DONE",
    transcript:
      " 안녕하십니까 제 이름은 최현만입니다. 요즘에 취업이 참 어렵습니다. 가끔씩은 집에 혼자 들어가서 계속 나오고 싶지 않습니다. 집 밖에는 일주일에 한 번 정도 나갑니다. 하지만 사람들을 만나는데 자신감이 부족합니다. 제가 이렇게 된 데는 취업이 한몫한 것 같습니다. 취업을 하기가 너무 어렵습니다. 회사에서 저를 뽑아줄지 모르겠어요. 취업하고 싶습니다.",
  },
};

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const report = useMemo(() => (id ? detailedReportData[id] : undefined), [id]);
  const transcript = useMemo(
    () => mockTranscriptResponse.data.transcript.trim(),
    []
  );

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
    report.title && report.title.trim()
      ? report.title
      : `${report.id}번째 상담`;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div style={{ backgroundColor: "#CAE8FA" }}>
        <header className="shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="text-gray-600 hover:text-[#6EC6FF]"
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

      {/* Main */}
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* ✅ 3등분 그리드 → 1fr + 240px 고정폭 사이드바 */}
        <div className="grid grid-cols-1 lg:[grid-template-columns:minmax(0,1fr)_180px] gap-6">
          {/* LEFT: 본문(메인) — col-span 제거 */}
          <div>
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
                </div>
              </CardHeader>
            </Card>

            {/* 탭 콘텐츠: 보고서 / 상담 다시보기 */}
            <Outlet context={{ report, transcript }} />
          </div>

          {/* RIGHT: 사이드바 — 카드 없이 텍스트 링크만 */}
          <aside>
            <div className="sticky top-8">
              <ReportSidebar />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
