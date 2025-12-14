import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeader } from "@/components/shared/AppHeader";
import { createMission } from "@/api/mission";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

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
  { value: "SPORTS", label: "운동" },
  { value: "OUTDOOR", label: "외부활동" },
  { value: "SOCIAL", label: "사회활동" },
  { value: "CAREER", label: "취업준비" },
  { value: "ETC", label: "기타" },
] as const;

type Props = {
  // 모달 모드: 모달로 표시
  modalMode?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void; // 성공 시 콜백 (목록 새로고침용)
};

export default function MissionWritePage({
  modalMode = false,
  isOpen,
  onClose,
  onSuccess,
}: Props = {}) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 페이지 헤더 (모달 모드가 아닐 때만)
  useEffect(() => {
    if (!modalMode) {
      setHeader({
        title: "미션 인증 등록",
        showBack: true,
        backTo: "/missions",
        backLabel: "목록으로",
      });
      return reset;
    }
  }, [modalMode, setHeader, reset]);

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (modalMode && isOpen) {
      setIsSubmitting(false);
      setSubmitError(null);
    }
  }, [modalMode, isOpen]);

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

  // ✅ 제출할 때만 createMission API 호출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createMission(
        form.title.trim(),
        form.content.trim(),
        form.category, // API에는 영어 카테고리 코드 전달
        form.memo.trim() || ""
      );

      // 성공 시 폼 초기화
      setForm({
        title: "",
        category: "",
        date: today,
        content: "",
        memo: "",
      });
      setErrors({});
      setSubmitError(null);
      setIsSubmitting(false);

      // 모달 모드면 모달 닫고 콜백 호출, 일반 모드면 목록 페이지로 이동
      if (modalMode) {
        onClose?.();
        onSuccess?.();
      } else {
        navigate("/missions", { replace: true });
      }
    } catch (e: any) {
      console.error("미션 등록 실패:", e);
      setSubmitError(e?.message || "미션 등록 중 오류가 발생했습니다.");
      setIsSubmitting(false);
    }
  };

  // 공통 폼 콘텐츠
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 제목 */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-gray-800">
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
          <label className="text-sm font-medium text-gray-800">카테고리</label>
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
          <label htmlFor="date" className="text-sm font-medium text-gray-800">
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
          <span className="text-xs text-gray-500">{form.content.length}자</span>
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
          <label htmlFor="memo" className="text-sm font-medium text-gray-800">
            개인 메모 (선택)
          </label>
          <span className="text-xs text-gray-500">{form.memo.length}자</span>
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

      {/* 에러 메시지 */}
      {submitError && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      {/* 액션 */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => {
            if (modalMode) {
              onClose?.();
            } else {
              navigate("/missions");
            }
          }}
          disabled={isSubmitting}
          className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800
                           hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-md bg-[#6EC6FF] px-4 py-2 text-sm font-medium text-white
                           hover:bg-[#5BB8F3] focus:outline-none focus:ring-2 focus:ring-sky-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "등록 중..." : "등록하기"}
        </button>
      </div>
    </form>
  );

  // 모달 모드
  if (modalMode) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[60rem] h-[90vh] max-h-[90vh] p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              미션 정보 입력
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-6">{formContent}</div>
        </DialogContent>
      </Dialog>
    );
  }

  // 일반 페이지 모드
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
        <div className="p-6">{formContent}</div>
      </div>
    </div>
  );
}
