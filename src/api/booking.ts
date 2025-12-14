import { http } from "@/lib/http";
import { unwrapApi } from "@/types/api";
import type { ApiResponse } from "@/types/api";
import type {
  ApiBooking,
  BookingListItem,
  BookingsPayload,
} from "@/types/booking";

// 목록 조회
export async function getBookings(): Promise<BookingListItem[]> {
  const { data } = await http.get<ApiResponse<BookingsPayload>>(
    "/appointment/list"
  );
  const list = unwrapApi(data);
  return list.map(mapApiToListItem);
}

// 상담 예약 생성
export async function createBooking(
  date: string,
  time: string
): Promise<ApiBooking> {
  const { data } = await http.post<ApiResponse<ApiBooking>>("/appointment", {
    scheduledDate: date,
    scheduledTime: time,
  });
  return unwrapApi(data);
}

// 상담 예약 취소
export async function cancelBooking(id: number): Promise<void> {
  await http.put<ApiResponse<void>>(`/appointment/${id}/cancel`);
}

// 상담 시작
export async function startBooking(id: number): Promise<void> {
  await http.put<ApiResponse<void>>(`/appointment/${id}/start`);
}

// 상담 종료
export async function completeBooking(id: number): Promise<void> {
  await http.put<ApiResponse<void>>(`/appointment/${id}/complete`);
}

// ---- helpers ----
// scheduledTime을 HH:mm 형식으로 변환
function formatTimeToHHmm(time: string): string {
  // 이미 HH:mm 형식인 경우
  if (/^\d{2}:\d{2}$/.test(time)) {
    return time;
  }

  // HH:mm:ss 형식인 경우
  if (/^\d{2}:\d{2}:\d{2}/.test(time)) {
    return time.substring(0, 5);
  }

  // ISO 형식이나 다른 형식인 경우 Date 객체로 파싱
  try {
    const date = new Date(`2000-01-01T${time}`);
    if (!isNaN(date.getTime())) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    }
  } catch (e) {
    // 파싱 실패 시 원본 반환
  }

  return time;
}

// ---- mappers ----
function mapApiToListItem(booking: ApiBooking): BookingListItem {
  return {
    id: booking.id,
    date: booking.scheduledDate,
    time: formatTimeToHHmm(booking.scheduledTime),
    status: booking.status,
  };
}
