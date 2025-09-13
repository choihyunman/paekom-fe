import { MessageCircle, FileText, Target, Bell } from "lucide-react";
import BannerCarousel from "./components/Banner";
import CategoryGrid from "./components/CategoryGrid";

type Banner = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
};

type Category = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

// --- 배너 ---
const BANNERS: Banner[] = [
  {
    id: 1,
    title: "함께하는 첫걸음",
    subtitle: "혼자가 아닙니다. 언제든 도움을 요청하세요.",
    image: "/peaceful-counseling-room-with-soft-lighting.png",
  },
  {
    id: 2,
    title: "나만의 속도로",
    subtitle: "천천히, 하나씩 변화해나가는 여정을 응원합니다.",
    image: "/gentle-path-through-nature-representing-personal-g.png",
  },
  {
    id: 3,
    title: "새로운 시작",
    subtitle: "작은 변화가 큰 희망이 됩니다.",
    image: "/sunrise-over-calm-landscape-symbolizing-new-beginn.png",
  },
];

// --- 카테고리 ---
const CATEGORIES: Category[] = [
  {
    id: "counseling",
    title: "상담",
    description: "전문 상담사와 1:1 상담을 받아보세요",
    icon: MessageCircle,
    href: "/video-counseling",
  },
  {
    id: "report",
    title: "보고서",
    description: "상담 기록을 확인할 수 있어요",
    icon: FileText,
    href: "/reports",
  },
  {
    id: "mission",
    title: "미션",
    description: "작은 목표부터 차근차근 달성해보세요",
    icon: Target,
    href: "/missions",
  },
  {
    id: "notice",
    title: "공지사항",
    description: "새로운 소식과 정보를 확인할 수 있어요",
    icon: Bell,
    href: "/notices",
  },
];
// -------------------------------------------

export default function HomePage() {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header+Banner 영역 배경 톤 */}
      <div style={{ backgroundColor: "#CAE8FA" }}>
        {/* 상단 헤더/내비게이션은 AppLayout에서 공통 처리한다고 가정 */}
        <BannerCarousel items={BANNERS} overlayColor="rgba(202,232,250,0.7)" />
      </div>

      {/* Main */}
      <main>
        <CategoryGrid categories={CATEGORIES} />
      </main>
    </div>
  );
}
