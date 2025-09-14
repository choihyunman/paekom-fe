import { NavLink, useParams } from "react-router-dom";

export default function ReportSidebar() {
  const { id } = useParams();

  const base =
    "block text-md leading-6 text-gray-600 hover:text-[#6EC6FF] transition-colors focus-visible:underline";
  const active = "text-[#6EC6FF] font-bold";

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
