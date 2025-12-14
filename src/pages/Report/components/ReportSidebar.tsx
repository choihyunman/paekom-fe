import { NavLink, useParams } from "react-router-dom";

type Props = {
  // 모달 모드: 탭 전환을 위한 콜백과 현재 탭
  modalMode?: boolean;
  currentTab?: "overview" | "replay";
  onTabChange?: (tab: "overview" | "replay") => void;
};

export default function ReportSidebar({
  modalMode = false,
  currentTab = "overview",
  onTabChange,
}: Props = {}) {
  const { id } = useParams();

  const base =
    "block text-md leading-6 text-gray-600 hover:text-[#6EC6FF] transition-colors focus-visible:underline";
  const active = "text-[#6EC6FF] font-bold";

  // 모달 모드: 버튼으로 동작
  if (modalMode) {
    return (
      <nav className="m-0 p-0">
        <button
          onClick={() => onTabChange?.("overview")}
          className={`${base} ${
            currentTab === "overview" ? active : ""
          } cursor-pointer`}
        >
          보고서
        </button>

        <button
          onClick={() => onTabChange?.("replay")}
          className={`${base} ${
            currentTab === "replay" ? active : ""
          } cursor-pointer`}
        >
          상담 다시보기
        </button>
      </nav>
    );
  }

  // 일반 모드: NavLink 사용
  return (
    <nav className="m-0 p-0">
      <NavLink
        end
        to={`/reports/${id}`}
        className={({ isActive }) => `${base} ${isActive ? active : ""}`}
      >
        보고서
      </NavLink>

      <NavLink
        to={`/reports/${id}/replay`}
        className={({ isActive }) => `${base} ${isActive ? active : ""}`}
      >
        상담 다시보기
      </NavLink>
    </nav>
  );
}
