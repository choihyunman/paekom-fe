import { useEffect, useMemo } from "react";
import { Outlet, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Calendar, User } from "lucide-react";
import ReportSidebar from "./components/ReportSidebar";
import { useHeader } from "@/components/shared/AppHeader";
import { useReportDetailStore } from "@/stores/reportDetailStore";
import { useReportsStore } from "@/stores/reportsStore";

const DEFAULT_COUNSELOR = "김상담 전문가";

export default function ReportDetailPage() {
  // ---- hooks (항상 최상단) ----
  const { id } = useParams();
  const reportId = Number(id);

  const { setHeader, reset } = useHeader();
  const { detail, loading, error, fetchReportDetail } = useReportDetailStore();
  const { reports, fetchReports } = useReportsStore();

  // 헤더
  useEffect(() => {
    setHeader({
      title: "상담 보고서 상세",
      showBack: true,
      backTo: "/reports",
      backLabel: "목록 보기",
    });
    return reset;
  }, [setHeader, reset]);

  // 데이터 로드
  useEffect(() => {
    if (Number.isFinite(reportId)) {
      fetchReportDetail(reportId, { force: true });
    }
    // 목록(인덱스 계산용)도 확보
    fetchReports?.();
  }, [reportId, fetchReportDetail, fetchReports]);

  // 작성일 오름차순 정렬 후 현재 id의 인덱스로 제목 생성
  const displayTitle = useMemo(() => {
    if (!detail || !reports?.length) return "상담";
    const asc = [...reports].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );
    const idx = asc.findIndex((r) => r.id === reportId);
    return idx >= 0 ? `${idx + 1}번째 상담` : "상담";
  }, [detail, reports, reportId]);

  // 탭들이 사용할 뷰모델 (tabs에서는 summary/issues/emotion/evidence/overallAssessment 사용)
  const reportVM = useMemo(() => {
    if (!detail || !Number.isFinite(reportId)) return null;
    return {
      id: reportId,
      title: displayTitle,
      date: detail.dateLabel, // 카드 헤더 표기용
      counselor: DEFAULT_COUNSELOR,
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

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-8 py-8">
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
                        <span>{detail?.dateLabel ?? "-"}</span>
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

            {/* 상태 메시지 */}
            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

            {/* ✅ 탭 자리: reportVM 준비되었을 때만 context 전달 */}
            {reportVM ? (
              <Outlet context={{ report: reportVM }} />
            ) : (
              <div className="text-sm text-gray-500">
                {loading ? "불러오는 중…" : "보고서를 찾을 수 없습니다."}
              </div>
            )}
          </div>

          {/* RIGHT: 사이드바 (텍스트 메뉴) */}
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
