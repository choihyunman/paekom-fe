import MissionCard from "./components/MissionCard";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect, useState, useMemo } from "react";
import { useHeader } from "@/components/shared/AppHeader";
import { useNavigate } from "react-router-dom";
import { getMissions, getMissionDetail, deleteMission } from "@/api/mission";
import type { ApiMission } from "@/types/misson";
import { CATEGORY_LABEL, type MissionDetail } from "@/types/misson";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { type BadgeProps } from "@/components/ui/Badge";
import MissionDetailPage from "./MissionDetailPage";
import MissionWritePage from "./MissionWritePage";

// Tailwind 클래스 맵 (카테고리별 색상)
const categoryColors: Record<string, string> = {
  자기관리: "bg-blue-100 text-blue-800",
  학업: "bg-green-100 text-green-800",
  취미: "bg-orange-100 text-orange-800",
  운동: "bg-red-100 text-red-800",
  외부활동: "bg-purple-100 text-purple-800",
  사회활동: "bg-pink-100 text-pink-800",
  취업준비: "bg-yellow-100 text-yellow-800",
  기타: "bg-gray-100 text-gray-800",
};

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

const CATEGORY_VARIANT: Record<string, BadgeVariant> = {
  SELF_CARE: "secondary",
  STUDY: "default",
  HOBBY: "outline",
  SPORTS: "secondary",
  OUTDOOR: "secondary",
  SOCIAL: "outline",
  CAREER: "default",
  ETC: "outline",
};

// MissionCard에 맞는 형식으로 변환
type MissionCardData = {
  id: number;
  title: string;
  category: string;
  date: string;
  content: string;
  status: string;
};

function mapApiToCardData(mission: ApiMission): MissionCardData {
  // createdAt에서 날짜 추출 (YYYY-MM-DD 형식)
  const date = mission.createdAt.split("T")[0];
  // category를 라벨로 변환
  const categoryLabel = CATEGORY_LABEL[mission.category] || mission.category;

  return {
    id: mission.id,
    title: mission.title,
    category: categoryLabel,
    date: date,
    content: mission.content,
    status: "완료", // API에 status가 없으므로 기본값
  };
}

export default function MissionsPage() {
  const { setHeader, reset } = useHeader();
  const navigate = useNavigate();
  const [missions, setMissions] = useState<MissionCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState<number | null>(
    null
  );
  const [missionDetail, setMissionDetail] = useState<MissionDetail | null>(
    null
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 미션 생성 모달 상태
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  useEffect(() => {
    setHeader({
      title: "미션 인증 목록",
      showBack: true,
      backTo: "/",
    });
    return reset;
  }, [setHeader, reset]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMissions();
        const cardData = data.map(mapApiToCardData);
        setMissions(cardData);
      } catch (e: any) {
        console.error("미션 목록 조회 실패:", e);
        setError(e?.message || "미션 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  // 모달이 열릴 때 미션 상세 정보 가져오기
  useEffect(() => {
    const fetchMissionDetail = async () => {
      if (!selectedMissionId || !isModalOpen) {
        return;
      }

      try {
        setDetailLoading(true);
        setDetailError(null);
        const data = await getMissionDetail(selectedMissionId);
        setMissionDetail(data);
      } catch (e: any) {
        console.error("미션 상세 조회 실패:", e);
        setDetailError(e?.message || "미션 상세 정보를 불러오지 못했습니다.");
      } finally {
        setDetailLoading(false);
      }
    };

    fetchMissionDetail();
  }, [selectedMissionId, isModalOpen]);

  // 모달이 닫힐 때 상태 초기화
  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedMissionId(null);
      setMissionDetail(null);
      setDetailError(null);
    }
  };

  // 미션 카드 클릭 핸들러
  const handleMissionCardClick = (missionId: number) => {
    setSelectedMissionId(missionId);
    setIsModalOpen(true);
  };

  // 미션 생성 모달 핸들러
  const handleWriteModalClose = () => {
    setIsWriteModalOpen(false);
  };

  // 미션 생성 성공 시 목록 새로고침
  const handleWriteSuccess = async () => {
    const data = await getMissions();
    const cardData = data.map(mapApiToCardData);
    setMissions(cardData);
  };

  // 미션 삭제 핸들러
  const handleDelete = async () => {
    if (!selectedMissionId || !missionDetail) return;

    const confirmed = window.confirm(
      "정말 이 미션을 삭제하시겠습니까? 삭제된 미션은 복구할 수 없습니다."
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteMission(selectedMissionId);
      // 삭제 성공 시 모달 닫고 목록 새로고침
      setIsModalOpen(false);
      setSelectedMissionId(null);
      setMissionDetail(null);
      // 목록 다시 불러오기
      const data = await getMissions();
      const cardData = data.map(mapApiToCardData);
      setMissions(cardData);
    } catch (e: any) {
      console.error("미션 삭제 실패:", e);
      alert(e?.message || "미션 삭제 중 오류가 발생했습니다.");
      setIsDeleting(false);
    }
  };

  const categoryLabel = useMemo(
    () =>
      missionDetail
        ? CATEGORY_LABEL[missionDetail.category] ?? missionDetail.category
        : "",
    [missionDetail]
  );

  const categoryVariant = useMemo(
    () =>
      missionDetail
        ? CATEGORY_VARIANT[missionDetail.category] ?? "secondary"
        : "secondary",
    [missionDetail]
  );

  const hasPosts = missions.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-row justify-between">
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              나의 미션 기록
            </h2>
            <p className="text-gray-600">
              작은 성취들을 기록하고 공유해보세요.
            </p>
          </section>

          <div className="ml-auto">
            <Button
              className="bg-[#6EC6FF] hover:bg-[#5BB8F3] text-white cursor-pointer"
              onClick={() => setIsWriteModalOpen(true)}
            >
              미션 기록하기
            </Button>
          </div>
        </div>

        {/* 미션 목록 */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">미션 목록을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              className="bg-[#6EC6FF] hover:bg-[#5BB8F3] text-white cursor-pointer"
              onClick={() => window.location.reload()}
            >
              다시 시도
            </Button>
          </div>
        ) : hasPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((post) => (
              <MissionCard
                key={post.id}
                post={post}
                categoryColors={categoryColors}
                onClick={() => handleMissionCardClick(post.id)}
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
              onClick={() => setIsWriteModalOpen(true)}
            >
              첫 미션 기록하기
            </Button>
          </div>
        )}
      </main>

      {/* 미션 상세 모달 */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-[60rem] h-[90vh] max-h-[90vh] p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              미션 상세
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {selectedMissionId ? (
              <MissionDetailPage
                missionId={selectedMissionId}
                onClose={() => handleModalClose(false)}
                hideBackButton
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* 미션 생성 모달 - MissionWritePage를 모달로 사용 */}
      <MissionWritePage
        modalMode={true}
        isOpen={isWriteModalOpen}
        onClose={handleWriteModalClose}
        onSuccess={handleWriteSuccess}
      />
    </div>
  );
}
