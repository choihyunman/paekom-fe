import ReportList from "./components/ReportList";
import { useEffect, useCallback, useState } from "react";
import { useHeader } from "@/components/shared/AppHeader";
import { useReportsStore } from "@/stores/reportsStore";
import ReportDetailPage from "./ReportDetailPage";

export default function ReportsPage() {
  const { setHeader, reset } = useHeader();
  const { reports, loading, error, fetchReports } = useReportsStore();
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchReports({ force: true });
  }, [fetchReports]);

  useEffect(() => {
    setHeader({ title: "상담 보고서 목록", showBack: true, backTo: "/" });
    return reset;
  }, [setHeader, reset]);

  const handleOpenReport = useCallback((id: number) => {
    setSelectedReportId(id);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    // 다이얼로그가 닫힐 때 선택된 리포트 ID는 유지 (다시 열 때 빠르게 로드하기 위해)
  }, []);

  let content: React.ReactNode;
  if (loading) content = <div className="p-6 text-gray-600">불러오는 중…</div>;
  else if (error) content = <div className="p-6 text-red-600">{error}</div>;
  else content = <ReportList reports={reports} onOpen={handleOpenReport} />;

  return (
    <>
      <div className="min-h-screen bg-white">
        <main className="max-w-6xl mx-auto px-4 py-5">
          <div className="mb-5">
            <p className="text-gray-600">* 완료된 상담 기록만 표시됩니다.</p>
          </div>
          {content}
        </main>
      </div>

      {/* 팝업 다이얼로그 - ReportDetailPage를 모달로 사용 */}
      {selectedReportId && (
        <ReportDetailPage
          modalMode={true}
          reportId={selectedReportId}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
}
