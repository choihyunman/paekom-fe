// src/layouts/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import AppHeader, { HeaderProvider } from "@/components/shared/AppHeader";

export default function AppLayout() {
  return (
    <div className="min-h-[100svh] flex flex-col bg-white">
      {/* 최상단 브랜드 헤더: 항상 고정 */}
      <Header />

      {/* 고정 헤더만큼 상단 여백 확보 (헤더에 가리지 않게) */}
      <div className="flex-1 flex flex-col">
        <HeaderProvider>
          {/* ⬇️ 내부에 overflow 주지 말고(=문서가 스크롤) AppHeader만 sticky */}
          <AppHeader />
          <main className="flex-1" style={{ marginTop: "0px" }}>
            <Outlet />
          </main>
        </HeaderProvider>

        <Footer />
      </div>
    </div>
  );
}
