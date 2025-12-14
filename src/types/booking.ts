// API 원본 아이템
export interface ApiBooking {
  id: number;
  scheduledDate: string;
  scheduledTime: string;
  status: "SCHEDULED" | "STARTED" | "CANCELLED" | "COMPLETED";
}

// payload를 배열로 정의
export type BookingsPayload = ApiBooking[];

export interface BookingListItem {
  id: number;
  date: string;
  time: string;
  status: "SCHEDULED" | "STARTED" | "CANCELLED" | "COMPLETED";
}
