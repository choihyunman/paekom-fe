import { useNavigate } from "react-router-dom";
import ReportList from "./components/ReportList";
import { useEffect } from "react";
import { useHeader } from "@/components/shared/AppHeader";

// ---- 더미 데이터: 그대로 유지 ----
const reportData = [
  {
    id: 1,
    date: "2024-01-15",
    title: "첫 상담 세션",
    counselor: "김상담 전문가",
    duration: "50분",
    status: "완료",
    summary: "초기 상담을 통해 현재 상황과 목표를 설정했습니다.",
    type: "개별상담",
  },
  {
    id: 2,
    date: "2024-01-22",
    title: "진행상황 점검",
    counselor: "김상담 전문가",
    duration: "45분",
    status: "완료",
    summary: "지난 주 목표 달성도를 확인하고 새로운 과제를 설정했습니다.",
    type: "개별상담",
  },
  {
    id: 3,
    date: "2024-01-29",
    title: "그룹 활동 참여",
    counselor: "이그룹 전문가",
    duration: "90분",
    status: "완료",
    summary: "다른 참여자들과 함께 소통 기술을 연습했습니다.",
    type: "그룹상담",
  },
  {
    id: 4,
    date: "2024-02-05",
    title: "월간 종합 평가",
    counselor: "김상담 전문가",
    duration: "60분",
    status: "예정",
    summary: "한 달간의 진행상황을 종합적으로 평가할 예정입니다.",
    type: "평가상담",
  },
];

// 타입은 필요하면 export 해서 공용으로 써도 됩니다
export type Report = (typeof reportData)[number];

export default function ReportsPage() {
  const navigate = useNavigate();

  // 완료된 상담만 노출 (필요하면 날짜 정렬 추가 가능)
  const completedReports = reportData.filter((r) => r.status === "완료");
  // .sort((a, b) => a.date.localeCompare(b.date)) // 날짜 오름차순 정렬 예시

  const handleOpenReport = (id: number) => {
    navigate(`/reports/${id}`);
  };

  const { setHeader, reset } = useHeader();

  useEffect(() => {
    setHeader({
      title: "상담 보고서 목록",
      showBack: true,
      backTo: "/", // ← 이 경로로 이동
    });
    return reset;
  }, [setHeader, reset]);

  return (
    <div className="min-h-screen bg-white">
      {/* Main: 목록만 표시 */}
      <main className="max-w-6xl mx-auto px-4 py-5">
        <div className="mb-5">
          <p className="text-gray-600">* 완료된 상담 기록만 표시됩니다.</p>
        </div>

        <ReportList reports={completedReports} onOpen={handleOpenReport} />
      </main>
    </div>
  );
}
