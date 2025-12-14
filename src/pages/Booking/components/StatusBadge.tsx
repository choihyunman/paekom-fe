import type { BookingListItem } from "@/types/booking";

type BookingStatus = BookingListItem["status"];

// API status를 한글로 매핑
function getStatusLabel(status: BookingStatus): string {
  switch (status) {
    case "SCHEDULED":
      return "확정";
    case "STARTED":
      return "진행 중";
    case "COMPLETED":
      return "완료";
    case "CANCELLED":
      return "취소";
    default:
      return "확정";
  }
}

// status에 맞는 색상 클래스 반환
function getStatusColorClass(status: BookingStatus): string {
  switch (status) {
    case "SCHEDULED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "STARTED":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "COMPLETED":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "CANCELLED":
      return "bg-rose-100 text-rose-800 border-rose-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export default function StatusBadge({ status }: { status: BookingStatus }) {
  const label = getStatusLabel(status);
  const colorClass = getStatusColorClass(status);

  return (
    <span
      className={
        "ml-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium " +
        colorClass
      }
    >
      {label}
    </span>
  );
}
