import { create } from "zustand";
import type { ReportDetail } from "@/types/reports";
import { getReportDetail } from "@/api/reports";

type State = {
  detail: ReportDetail | null;
  loading: boolean;
  error: string | null;
  fetchReportDetail: (id: number, opts?: { force?: boolean }) => Promise<void>;
  clear: () => void;
};

export const useReportDetailStore = create<State>((set, get) => ({
  detail: null,
  loading: false,
  error: null,

  async fetchReportDetail(id, opts) {
    const { force = false } = opts ?? {};
    const cur = get().detail;
    if (!force && cur?.id === id) return;
    set({ loading: true, error: null });
    try {
      const detail = await getReportDetail(id);
      set({ detail, loading: false });
    } catch (e: any) {
      set({
        loading: false,
        error: e?.message ?? "상세를 불러오지 못했습니다.",
      });
    }
  },

  clear() {
    set({ detail: null, error: null });
  },
}));
