export type Booking = {
  id: number;
  date: string; // YYYY-MM-DD
  time: string; // "14:00"
  counselor?: string; // 선택
  method: "화상" | "대면";
  status: "확정" | "완료" | "취소" | "대기";
  note?: string;
  createdAt: string;
};

const KEY = "app.bookings";

export function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveBookings(list: Booking[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addBooking(b: Omit<Booking, "id" | "createdAt">): Booking {
  const list = loadBookings();
  const now = Date.now();
  const item: Booking = {
    id: now,
    createdAt: new Date(now).toISOString(),
    ...b,
  };
  // 최신이 위로
  list.unshift(item);
  saveBookings(list);
  return item;
}

export function updateBooking(
  id: number,
  patch: Partial<Booking>
): Booking | undefined {
  const list = loadBookings();
  const idx = list.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...patch };
  saveBookings(list);
  return list[idx];
}

export function getBookingById(id: number): Booking | undefined {
  return loadBookings().find((b) => b.id === id);
}

export function removeBooking(id: number) {
  const next = loadBookings().filter((b) => b.id !== id);
  saveBookings(next);
}
