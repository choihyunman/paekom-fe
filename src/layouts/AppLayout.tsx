// src/layouts/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import AppHeader, { HeaderProvider } from "@/components/AppHeader";

export default function AppLayout() {
  return (
    // 100svh = 모바일 안전 뷰포트
    <div className="min-h-[100svh] grid grid-rows-[auto,1fr,auto] bg-white">
      <Header />

      <HeaderProvider>
        {/* ⬇️ 여기에 Outlet이 있어야 자식 라우트(HomePage)가 렌더됨 */}
        <main className="overflow-y-auto">
          <AppHeader />
          <Outlet />
        </main>
      </HeaderProvider>

      <Footer />
    </div>
  );
}
