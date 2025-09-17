import { useNavigate } from "react-router-dom";
import ReportList from "./components/ReportList";
import { useEffect, useCallback } from "react";
import { useHeader } from "@/components/shared/AppHeader";
import { useReportsStore } from "@/stores/reportsStore";

export default function ReportsPage() {
  const navigate = useNavigate();
  const { setHeader, reset } = useHeader();
  const { reports, loading, error, fetchReports } = useReportsStore();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    setHeader({ title: "상담 보고서 목록", showBack: true, backTo: "/" });
    return reset;
  }, [setHeader, reset]);

  const handleOpenReport = useCallback(
    (id: number) => navigate(`/reports/${id}`),
    [navigate]
  );

  let content: React.ReactNode;
  if (loading) content = <div className="p-6 text-gray-600">불러오는 중…</div>;
  else if (error) content = <div className="p-6 text-red-600">{error}</div>;
  else content = <ReportList reports={reports} onOpen={handleOpenReport} />;

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 py-5">
        <div className="mb-5">
          <p className="text-gray-600">* 완료된 상담 기록만 표시됩니다.</p>
        </div>
        {content}
      </main>
    </div>
  );
}
