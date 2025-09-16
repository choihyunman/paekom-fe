import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeader } from "@/components/shared/AppHeader";
import { addMission } from "./missionStorage";

type FormState = {
  title: string;
  category: string;
  date: string;
  content: string;
  memo: string;
};

const CATEGORY = [
  { value: "SELF_CARE", label: "자기관리" },
  { value: "STUDY", label: "학업" },
  { value: "HOBBY", label: "취미" },
  { value: "OUTDOOR", label: "외부활동" },
  { value: "SOCIAL", label: "사회활동" },
  { value: "JOB_PREP", label: "취업준비" },
  { value: "OTHER", label: "기타" },
] as const;

const CATEGORY_LABEL_MAP = Object.fromEntries(
  CATEGORY.map((c) => [c.value, c.label])
);

export default function MissionWritePage() {
  const navigate = useNavigate();
  const { setHeader, reset } = useHeader();

  // 기본값: 오늘 날짜
  const today = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  const [form, setForm] = useState<FormState>({
    title: "",
    category: "",
    date: today,
    content: "",
    memo: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  // 페이지 헤더
  useEffect(() => {
    setHeader({
      title: "미션 인증 등록",
      showBack: true,
      backTo: "/missions",
      backLabel: "목록으로",
    });
    return reset;
  }, [setHeader, reset]);

  const onChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) next.title = "제목을 입력해주세요.";
    else if (form.title.trim().length < 2)
      next.title = "제목은 2자 이상이어야 합니다.";
    if (!form.category) next.category = "카테고리를 선택해주세요.";
    if (!form.date) next.date = "날짜를 선택해주세요.";
    if (!form.content.trim()) next.content = "내용을 입력해주세요.";
    else if (form.content.trim().length < 10)
      next.content = "내용은 10자 이상 입력해주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ✅ 제출할 때만 addMission 호출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const displayCategory = CATEGORY_LABEL_MAP[form.category] ?? "기타";

    addMission({
      title: form.title.trim(),
      category: displayCategory, // 목록에서 바로 보일 한글 라벨
      date: form.date,
      content: form.content.trim(),
      status: "완료", // 등록 글은 완료로 표시
      memo: form.memo.trim() || undefined,
    });

    navigate("/missions", { replace: true });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Card 대체 */}
      <div className="rounded-xl border bg-white shadow-sm">
        {/* CardHeader 대체 */}
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            미션 정보 입력
          </h2>
        </div>

        {/* CardContent 대체 */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium text-gray-800"
              >
                제목
              </label>
              <input
                id="title"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
                           placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="예) 하루 30분 운동하기"
                value={form.title}
                onChange={(e) => onChange("title", e.target.value)}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="text-sm text-rose-600">{errors.title}</p>
              )}
            </div>

            {/* 카테고리 + 날짜 */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">
                  카테고리
                </label>
                <select
                  className="cursor-pointer w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
                             focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={form.category}
                  onChange={(e) => onChange("category", e.target.value)}
                  aria-invalid={!!errors.category}
                >
                  <option value="" disabled>
                    카테고리를 선택하세요
                  </option>
                  {CATEGORY.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-rose-600">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="text-sm font-medium text-gray-800"
                >
                  날짜
                </label>
                <input
                  id="date"
                  type="date"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
                             focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={form.date}
                  onChange={(e) => onChange("date", e.target.value)}
                  aria-invalid={!!errors.date}
                />
                {errors.date && (
                  <p className="text-sm text-rose-600">{errors.date}</p>
                )}
              </div>
            </div>

            {/* 내용 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="content"
                  className="text-sm font-medium text-gray-800"
                >
                  내용
                </label>
                <span className="text-xs text-gray-500">
                  {form.content.length}자
                </span>
              </div>
              <textarea
                id="content"
                rows={8}
                className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
                           placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder={`오늘 수행한 미션을 자세히 적어주세요.
예) 매일 저녁 9시에 스트레칭과 러닝 30분을 했고, 기분이 상쾌했습니다.`}
                value={form.content}
                onChange={(e) => onChange("content", e.target.value)}
                aria-invalid={!!errors.content}
              />
              {errors.content && (
                <p className="text-sm text-rose-600">{errors.content}</p>
              )}
            </div>

            {/* 메모 (선택) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="memo"
                  className="text-sm font-medium text-gray-800"
                >
                  개인 메모 (선택)
                </label>
                <span className="text-xs text-gray-500">
                  {form.memo.length}자
                </span>
              </div>
              <textarea
                id="memo"
                rows={4}
                className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
                           placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="내가 나에게 남기고 싶은 한마디를 적어보세요."
                value={form.memo}
                onChange={(e) => onChange("memo", e.target.value)}
              />
            </div>

            {/* 액션 */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate("/missions")}
                className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800
                           hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="cursor-pointer rounded-md bg-[#6EC6FF] px-4 py-2 text-sm font-medium text-white
                           hover:bg-[#5BB8F3] focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                등록하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
