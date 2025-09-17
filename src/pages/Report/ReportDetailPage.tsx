import { useEffect, useMemo } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, User } from "lucide-react";
import ReportSidebar from "./components/ReportSidebar";
import { useHeader } from "@/components/shared/AppHeader";

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
    date: "2025-09-11",
    title: "1번째 상담",
    counselor: "김상담 전문가",
    duration: "50분",
    status: "완료",
    type: "개별상담",
    summary:
      "내담자는 취업의 어려움을 겪고 있으나 여전히 도전하려는 의지를 보이고 있습니다. 외부 활동과 생활 리듬 회복을 통해 점차 자신감을 되찾고 있으며, 취업에 대한 긍정적인 기대를 유지하려 노력하고 있습니다.",
    issues: [
      "취업 준비 과정에서의 마음 관리 필요",
      "사회적 활동 참여에 대한 점진적 노력",
      "자신감과 자기 효능감 향상을 위한 과정",
      "미래 방향성에 대한 고민과 탐색",
    ],
    emotion: "POSITIVE",
    evidence: { POSITIVE: 50, NEUTRAL: 30, NEGATIVE: 20 },
    overallAssessment:
      "현재 상담자께서는 취업 준비 과정에서의 어려움 속에서도 포기하지 않고 도전하려는 강한 의지를 보여주고 계십니다. 이는 매우 긍정적인 신호입니다. 다만, 현재의 변화가 더 견고해지기 위해서는 불안과 긴장 속에서도 자신의 감정을 다정하게 마주하고 돌보는 태도가 필요합니다.",
    createdAt: "2025-09-11T14:20:00",
  },
  "2": {
    id: 2,
    date: "2025-09-10",
    title: "2번째 상담",
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
    createdAt: "2025-09-10T15:30:00",
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
      " 안녕하십니까 요즘에 취업이 참 어렵습니다. 가끔씩은 집에 혼자 들어가서 계속 나오고 싶지 않습니다. 집 밖에는 일주일에 한 번 정도 나갑니다. 하지만 사람들을 만나는데 자신감이 부족합니다. 제가 이렇게 된 데는 취업이 한몫한 것 같습니다. 취업을 하기가 너무 어렵습니다. 회사에서 저를 뽑아줄지 모르겠어요. 취업하고 싶습니다.",
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

  const { setHeader, reset } = useHeader();

  useEffect(() => {
    setHeader({
      title: "상담 보고서 상세",
      showBack: true,
      backTo: "/reports", // ← 이 경로로 이동
      backLabel: "목록 보기",
    });
    return reset;
  }, [setHeader, reset]);

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
      {/* Main */}
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* ✅ 3등분 그리드 → 1fr + 240px 고정폭 사이드바 */}
        <div className="grid grid-cols-1 lg:[grid-template-columns:minmax(0,1fr)_180px] gap-6">
          {/* LEFT: 본문(메인) — col-span 제거 */}
          <div>
            <Card className="mb-8" bgClassName="bg-gray-50">
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
