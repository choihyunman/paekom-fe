import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Button } from "@/components/ui/Button";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { Sparkles, StickyNote } from "lucide-react";
import { useHeader } from "@/components/shared/AppHeader";

// ---- 타입
type MissionDetail = {
  title: string;
  content: string;
  category: string;
  memo?: string;
  feedback?: string;
};

type MissionResponse =
  | { status: "success"; data: MissionDetail }
  | { status: "error"; message: string };

// ---- 카테고리 라벨/색상 매핑 (서비스 공통 맵)
const CATEGORY_LABEL: Record<string, string> = {
  SELF_CARE: "자기관리",
  STUDY: "학업",
  HOBBY: "취미",
  OUTDOOR: "외부활동",
  SOCIAL: "사회활동",
  JOB_PREP: "취업준비",
  OTHER: "기타",
};

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

const CATEGORY_VARIANT: Record<string, BadgeVariant> = {
  SELF_CARE: "secondary",
  STUDY: "default",
  HOBBY: "outline",
  OUTDOOR: "secondary",
  SOCIAL: "outline",
  JOB_PREP: "default",
  OTHER: "outline",
};

// ---- 임시 데이터 (나중에 API 연동 시 제거하세요)
const SAMPLE_RESPONSE: MissionResponse = {
  status: "success",
  data: {
    title: "하루 30분 운동하기",
    content:
      "매일 저녁 9시에 스트레칭을 하고 있다. 러닝 30분씩 하는데 기분이 좋았다.",
    category: "SELF_CARE",
    memo: "지금처럼 쭉 가보자고",
    feedback:
      "매일 저녁 9시에 꾸준히 스트레칭을 하고 러닝까지 30분씩 하는 모습이 정말 대단해요! 몸과 마음이 함께 건강해지는 걸 느끼신다니 저도 함께 기분이 좋아지네요. 지금처럼 작은 성취를 소중히 여기며 쭉 나아가다 보면, 분명 몸과 마음에 더 큰 변화가 찾아올 거예요. 조금만 더 여유를 갖고 즐기듯이 해보세요. 응원할게요!",
  },
};

export default function MissionDetailPage() {
  const { id } = useParams();
  const { setHeader, reset } = useHeader();
  const [mission, setMission] = useState<MissionDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 헤더 설정
  useEffect(() => {
    setHeader({
      title: "미션 상세",
      showBack: true,
      backTo: "/missions",
      backLabel: "목록으로",
    });
    return reset;
  }, [setHeader, reset]);

  // TODO: 실제 API 연동으로 교체
  useEffect(() => {
    // 예시: id를 사용해서 API 호출할 자리
    const res = SAMPLE_RESPONSE;
    if (res.status === "success") {
      setMission(res.data);
    } else {
      setError(res.message ?? "미션을 불러오지 못했습니다.");
    }
  }, [id]);

  const categoryLabel = useMemo(
    () => (mission ? CATEGORY_LABEL[mission.category] ?? mission.category : ""),
    [mission]
  );

  const categoryVariant = useMemo(
    () =>
      mission ? CATEGORY_VARIANT[mission.category] ?? "secondary" : "secondary",
    [mission]
  );

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

  if (!mission) {
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

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl">
        {/* ✅ 제목 · 내용 · 메모: 하나의 카드로 합침 */}
        <Card className="my-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {mission.title}
              </CardTitle>
              <Badge variant={categoryVariant}>{categoryLabel}</Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* 기록 내용 */}
            <div className="my-4">
              <p className="whitespace-pre-line leading-7 text-gray-800">
                {mission.content}
              </p>
            </div>
            <div className="border-t border-gray-400"></div>

            {/* 메모 (옵션) — 같은 카드 내부 */}
            {mission.memo && (
              <>
                <Separator className="my-2" />
                <div>
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <StickyNote className="h-4 w-4" />
                    <span className="font-medium">추가 메모</span>
                  </div>
                  <p className="whitespace-pre-line text-gray-800">
                    {mission.memo}
                  </p>
                </div>
              </>
            )}

            {/* 액션 */}
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to={`/missions`}>목록으로</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-sky-400 hover:bg-sky-500 text-white"
              >
                <Link to={`/missions/${id}/edit`}>수정</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

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
    </div>
  );
}
