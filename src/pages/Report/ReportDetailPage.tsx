import { useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, User } from "lucide-react";
import ReportSidebar from "./components/ReportSidebar";
import { useHeader } from "@/components/shared/AppHeader";
import { useReportDetailStore } from "@/stores/reportDetailStore";
import { useReportsStore } from "@/stores/reportsStore";

const DEFAULT_COUNSELOR = "김상담 전문가";

export default function ReportDetailPage() {
  // ---- hooks (항상 최상단에서 호출) ----
  const navigate = useNavigate();
  const { id } = useParams();
  const reportId = Number(id);

  const { setHeader, reset } = useHeader();
  const { detail, loading, error, fetchReportDetail } = useReportDetailStore();
  const { reports, fetchReports } = useReportsStore();

  // 헤더 세팅
  useEffect(() => {
    setHeader({
      title: "상담 보고서 상세",
      showBack: true,
      backTo: "/reports",
      backLabel: "목록 보기",
    });
    return reset;
  }, [setHeader, reset]);

  // 상세 + 목록 로드
  useEffect(() => {
    if (Number.isFinite(reportId)) {
      fetchReportDetail(reportId, { force: true });
    }
    // 인덱스 산출을 위해 리스트도 로드
    fetchReports?.();
  }, [reportId, fetchReportDetail, fetchReports]);

  // 생성 순서(작성일 오름차순)로 몇 번째 상담인지 계산
  const displayTitle = useMemo(() => {
    if (!detail || !reports?.length) return "상담";
    const asc = [...reports].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );
    const idx = asc.findIndex((r) => r.id === reportId);
    return idx >= 0 ? `${idx + 1}번째 상담` : "상담";
  }, [detail, reports, reportId]);

  // 탭(Outlet)이 기존에 report 형태를 기대한다면, detail을 뷰모델로 변환
  const reportVM = useMemo(() => {
    if (!detail) return null;
    return {
      id: reportId,
      date: detail.dateLabel, // 기존 컴포넌트 호환용
      title: displayTitle,
      counselor: DEFAULT_COUNSELOR,
      // duration 데이터가 아직 없으므로 표시는 생략하거나 원하면 "-" 로
      duration: undefined,
      status: "완료" as const,
      type: "개별상담" as const,
      summary: detail.summary,
      issues: detail.issues,
      emotion: detail.emotion, // "POSITIVE" | "NEUTRAL" | "NEGATIVE"
      evidence: {
        POSITIVE: detail.evidence.positive,
        NEUTRAL: detail.evidence.neutral,
        NEGATIVE: detail.evidence.negative,
      },
      overallAssessment: detail.overallAssessment,
      createdAt: detail.createdAt,
    };
  }, [detail, displayTitle, reportId]);

  const handleBack = useCallback(() => navigate("/reports"), [navigate]);

  // ---- 상태별 렌더 ----
  if (loading) return <div>불러오는 중…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!detail || !reportVM) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            보고서를 찾을 수 없습니다
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* 1fr + 180px 고정 사이드바 */}
        <div className="grid grid-cols-1 lg:[grid-template-columns:minmax(0,1fr)_180px] gap-6">
          {/* LEFT: 본문 */}
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
                        <span>{detail.dateLabel}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{DEFAULT_COUNSELOR}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Outlet context={{ report: reportVM }} />
          </div>

          {/* RIGHT: 사이드바(텍스트 메뉴만) */}
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
