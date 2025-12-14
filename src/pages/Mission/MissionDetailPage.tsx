import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { Sparkles, StickyNote, Trash2, Calendar, Pencil } from "lucide-react";
import { getMissionDetail, deleteMission } from "@/api/mission";
import { CATEGORY_LABEL, type MissionDetail } from "@/types/misson";

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

type Props = {
  missionId?: number; // ✅ 모달에서 전달
  onClose?: () => void; // ✅ 모달 닫기
  hideBackButton?: boolean; // (선택) 페이지/모달 UI 차이 주고 싶으면
};

export default function MissionDetailPage({
  missionId,
  onClose,
  hideBackButton,
}: Props) {
  const params = useParams();
  const navigate = useNavigate();

  const resolvedId = useMemo(() => {
    if (params.id) return Number(params.id);
    if (typeof missionId === "number") return missionId;
    return NaN;
  }, [params.id, missionId]);

  const [mission, setMission] = useState<MissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!Number.isFinite(resolvedId)) {
        setError("유효하지 않은 미션 ID입니다.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await getMissionDetail(resolvedId);
        setMission(data);
      } catch (e: any) {
        setError(e?.message || "미션 상세 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [resolvedId]);

  const categoryLabel = useMemo(
    () => (mission ? CATEGORY_LABEL[mission.category] ?? mission.category : ""),
    [mission]
  );

  const categoryVariant = useMemo(
    () =>
      mission ? CATEGORY_VARIANT[mission.category] ?? "secondary" : "secondary",
    [mission]
  );

  const handleDelete = async () => {
    if (!Number.isFinite(resolvedId)) return;
    const confirmed = window.confirm(
      "정말 이 미션을 삭제하시겠습니까? 삭제된 미션은 복구할 수 없습니다."
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteMission(resolvedId);
      if (onClose) onClose();
      else navigate("/missions", { replace: true });
    } catch (e: any) {
      alert(e?.message || "미션 삭제 중 오류가 발생했습니다.");
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">오류</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link to="/missions">목록으로</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">불러오는 중…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">
              {error || "미션을 찾을 수 없습니다."}
            </p>
            <div className="mt-6 text-center">
              <Button asChild variant="outline">
                <Link to="/missions">목록으로</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function formatKoreanDateTime(iso?: string) {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";

    const yyyy = String(d.getFullYear());
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-2">
        {/* ✅ 제목 · 내용 · 메모: 하나의 카드로 합침 */}
        <Card className="overflow-hidden">
          {/* 상단: 타이틀 + 카테고리 + 작성일시 */}
          <CardHeader className="pb-4 border-b-1 border-gray-200 bg-gray-50/60">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="text-2xl font-bold text-gray-900 break-words">
                  {mission.title}
                </CardTitle>

                {/* 메타 정보 라인 */}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>작성</span>
                    <span className="font-medium text-gray-800">
                      {formatKoreanDateTime(mission.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <Badge className="shrink-0" variant={categoryVariant}>
                {categoryLabel}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="px-2 py-2 space-y-4">
              {/* ✅ 기록 내용 섹션 */}
              <section>
                <div className="mb-2 flex items-center gap-2 text-gray-900">
                  <Pencil className="h-4 w-4 text-gray-700" />
                  <div className="text-sm font-semibold text-gray-900">
                    기록 내용
                  </div>
                </div>

                <div className="rounded-2xl  bg-white p-4">
                  <p className="whitespace-pre-line leading-7 text-gray-800">
                    {mission.content}
                  </p>
                </div>
              </section>

              {/* ✅ 메모 섹션 (없어도 항상 표시) */}
              <section>
                <div className="mb-2 flex items-center gap-2 text-gray-900">
                  <StickyNote className="h-4 w-4 text-gray-700" />
                  <span className="text-sm font-semibold">메모</span>
                  <span className="text-xs text-gray-500">(선택)</span>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="whitespace-pre-line leading-7 text-gray-800">
                    {mission.memo}
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>

        <div className="pt-4">
          {/* AI 피드백 (옵션) — 별도 카드 유지 */}
          {mission.feedback && (
            <Card className="border-sky-200 bg-sky-50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sky-800">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-semibold">AI 피드백</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <blockquote className="rounded-xl bg-white/60 p-4 text-[15px] leading-7 text-gray-800">
                  {mission.feedback}
                </blockquote>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 하단 액션 바 */}
        <div className="py-4 flex items-center justify-end">
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            size="sm"
            className="bg-rose-400 hover:bg-rose-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {isDeleting ? "삭제 중..." : "삭제"}
          </Button>
        </div>
      </div>
    </div>
  );
}
