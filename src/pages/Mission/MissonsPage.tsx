import MissionCard from "./components/MissionCard";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import { useHeader } from "@/components/shared/AppHeader";
import { useNavigate } from "react-router-dom";

// ✅ 임시데이터: 나중에 삭제하기 쉽게 이 파일에만 보관
const missionPosts = [
  {
    id: 1,
    title: "오늘 처음으로 산책을 했어요!",
    category: "운동",
    date: "2024-01-15",
    content: "30분 동안 근처 공원을 걸었습니다. 생각보다 기분이 좋아졌어요.",
    status: "완료",
  },
  {
    id: 2,
    title: "요리 도전기 - 간단한 파스타 만들기",
    category: "생활",
    date: "2024-01-14",
    content: "유튜브를 보면서 파스타를 만들어봤습니다. 맛있게 잘 됐어요!",
    status: "완료",
  },
  {
    id: 3,
    title: "독서 시간 - 오늘 20페이지 읽었어요",
    category: "자기계발",
    date: "2024-01-13",
    content: "집중해서 책을 읽는 시간을 가졌습니다. 조금씩 늘려가고 있어요.",
    status: "완료",
  },
  {
    id: 4,
    title: "새로운 취미 찾기 - 그림 그리기 시작",
    category: "취미",
    date: "2024-01-12",
    content: "색연필로 간단한 그림을 그려봤습니다. 서툴지만 재미있어요.",
    status: "진행중",
  },
];

// Tailwind 클래스 맵 (카테고리별 색상)
const categoryColors: Record<string, string> = {
  운동: "bg-blue-100 text-blue-800",
  생활: "bg-green-100 text-green-800",
  자기계발: "bg-purple-100 text-purple-800",
  취미: "bg-orange-100 text-orange-800",
};

export default function MissionsPage() {
  const hasPosts = missionPosts.length > 0;
  const { setHeader, reset } = useHeader();
  const navigate = useNavigate();

  useEffect(() => {
    setHeader({
      title: "미션 인증 목록",
      showBack: true,
      backTo: "/", // ← 이 경로로 이동
    });
    return reset;
  }, [setHeader, reset]);

  return (
    <div className="min-h-screen bg-white">
      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            나의 미션 기록
          </h2>
          <p className="text-gray-600">작은 성취들을 기록하고 공유해보세요.</p>
        </section>

        {/* 미션 목록 */}
        {hasPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missionPosts.map((post) => (
              <MissionCard
                key={post.id}
                post={post}
                categoryColors={categoryColors}
                onClick={() => navigate(`/missions/${post.id}`)} // 상세 페이지로 이동(라우팅)
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 미션 기록이 없어요
            </h3>
            <p className="text-gray-600 mb-6">첫 번째 미션을 기록해보세요!</p>
            <Button
              className="bg-sky-400 hover:bg-sky-500 text-white"
              onClick={() => navigate(`/missions/write`)}
            >
              첫 미션 기록하기
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
