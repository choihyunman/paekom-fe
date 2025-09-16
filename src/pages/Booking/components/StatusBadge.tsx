export default function StatusBadge({
  status,
}: {
  status: "확정" | "완료" | "취소" | "대기";
}) {
  const map: Record<string, string> = {
    확정: "bg-emerald-100 text-emerald-800 border-emerald-200",
    완료: "bg-gray-100 text-gray-800 border-gray-200",
    취소: "bg-rose-100 text-rose-800 border-rose-200",
    대기: "bg-amber-100 text-amber-800 border-amber-200",
  };
  const cls = map[status] ?? "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span
      className={
        "ml-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium " +
        cls
      }
    >
      {status}
    </span>
  );
}
