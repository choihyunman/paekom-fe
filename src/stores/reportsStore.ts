import { create } from "zustand";
import type { ReportListItem } from "@/types/reports";
import { getReports } from "@/api/reports";

type ReportsState = {
  reports: ReportListItem[];
  loading: boolean;
  error: string | null;
  lastFetchedAt?: number;

  fetchReports: (opts?: {
    force?: boolean;
    sort?: "asc" | "desc";
  }) => Promise<void>;
  clear: () => void;
};

export const useReportsStore = create<ReportsState>((set, get) => ({
  reports: [],
  loading: false,
  error: null,
  lastFetchedAt: undefined,

  fetchReports: async (opts) => {
    const { force = false, sort = "desc" } = opts ?? {};

    if (!force && get().reports.length > 0) return;

    set({ loading: true, error: null });
    try {
      const list = await getReports();

      const sorted = [...list].sort((a, b) =>
        sort === "asc"
          ? a.createdAt.localeCompare(b.createdAt)
          : b.createdAt.localeCompare(a.createdAt)
      );

      set({
        reports: sorted,
        loading: false,
        error: null,
        lastFetchedAt: Date.now(),
      });
    } catch (e: any) {
      set({
        loading: false,
        error: e?.message ?? "보고서 목록을 가져오지 못했습니다.",
      });
    }
  },

  clear: () => set({ reports: [], error: null, lastFetchedAt: undefined }),
}));
