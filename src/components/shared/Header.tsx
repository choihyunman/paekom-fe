import { NavLink, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo_paekom.svg";
import { User } from "lucide-react";
export const BRAND_H = 64; // 헤더 높이(px)

export default function Header() {
  return (
    <header className="shadow-sm sticky top-0 z-50 bg-white" role="banner">
      {/* AppLayout에서 배경(#CAE8FA)을 감싸주므로 여기선 투명 */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 rounded-lg"
            >
              <img src={logo} alt="paekom" width={100} />
            </Link>
          </div>

          {/* md 이상에서 텍스트 네비 */}
          <nav
            aria-label="상단 링크"
            className="hidden md:flex items-center gap-6"
          >
            <NavLink
              to="/mypage"
              className={({ isActive }) =>
                cn(
                  "text-gray-700 transition-colors hover:text-[#6EC6FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 rounded-lg px-1 py-0.5",
                  isActive && "text-[#6EC6FF]"
                )
              }
              end
            >
              마이페이지
            </NavLink>
          </nav>

          {/* md 미만에서 아이콘 버튼 */}
          <Link
            to="/mypage"
            className="md:hidden inline-flex items-center gap-2 text-gray-700 px-3 py-2 rounded-lg
               hover:bg-white/20 hover:text-[#6EC6FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            aria-label="마이페이지"
          >
            <User className="h-5 w-5" />
            {/* 필요하면 텍스트도 함께: <span className="text-sm font-medium">마이페이지</span> */}
          </Link>
        </div>
      </div>
    </header>
  );
}
