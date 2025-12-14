import { create } from "zustand";
import { createBooking } from "@/api/booking";
import type { ApiBooking } from "@/types/booking";

type BookingState = {
  booking: ApiBooking | null;
  loading: boolean;
  error: string | null;
  createBooking: (date: string, time: string) => Promise<void>;
  setBooking: (booking: ApiBooking) => void;
  clear: () => void;
};

export const useBookingStore = create<BookingState>((set, get) => ({
  booking: null,
  loading: false,
  error: null,

  createBooking: async (date: string, time: string) => {
    set({ loading: true, error: null });
    try {
      const newBooking = await createBooking(date, time);
      set({ booking: newBooking, loading: false });
    } catch (e: any) {
      set({
        loading: false,
        error: e?.message ?? "예약을 생성하지 못했습니다.",
      });
      throw e; // 에러를 다시 throw하여 호출자가 처리할 수 있도록
    }
  },
  setBooking: (booking: ApiBooking) => {
    set({ booking });
  },
  clear: () => set({ booking: null, error: null }),
}));
