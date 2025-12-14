import { create } from "zustand";
import { getBookings } from "@/api/booking";
import type { BookingListItem } from "@/types/booking";

type BookingListState = {
  bookings: BookingListItem[];
  loading: boolean;
  error: string | null;
  lastFetchedAt?: number;

  fetchBookings: (opts?: { force?: boolean }) => Promise<void>;
  clear: () => void;
};

export const useBookingListStore = create<BookingListState>((set, get) => ({
  bookings: [],
  loading: false,
  error: null,
  lastFetchedAt: undefined,

  fetchBookings: async (opts) => {
    const { force = false } = opts ?? {};
    const { bookings } = get();
    if (!force && bookings.length > 0) return;
    set({ loading: true, error: null });
    try {
      const list = await getBookings();
      set({ bookings: list, loading: false });
    } catch (e: any) {
      set({
        loading: false,
        error: e?.message ?? "예약 목록을 가져오지 못했습니다.",
      });
    }
  },
  clear: () => set({ bookings: [], error: null, lastFetchedAt: undefined }),
}));
