import { create } from "zustand";
import { getReportTranscript } from "@/api/stt";

type TranscriptState = {
  byId: Record<number, string>;
  loading: Record<number, boolean>;
  error: Record<number, string | null>;
  fetch: (id: number, opts?: { force?: boolean }) => Promise<void>;
  clear: (id?: number) => void;
};

export const useSttStore = create<TranscriptState>((set, get) => ({
  byId: {},
  loading: {},
  error: {},

  async fetch(id, opts) {
    const { force = false } = opts ?? {};
    const { byId, loading } = get();
    if (!force && byId[id]) return;
    if (loading[id]) return;

    set((s) => ({
      loading: { ...s.loading, [id]: true },
      error: { ...s.error, [id]: null },
    }));
    try {
      const text = await getReportTranscript(id);
      set((s) => ({
        byId: { ...s.byId, [id]: text },
        loading: { ...s.loading, [id]: false },
      }));
    } catch (e: any) {
      set((s) => ({
        loading: { ...s.loading, [id]: false },
        error: {
          ...s.error,
          [id]: e?.message ?? "Transcript를 불러오지 못했습니다.",
        },
      }));
    }
  },

  clear(id) {
    if (id == null) {
      set({ byId: {}, loading: {}, error: {} });
    } else {
      set((s) => {
        const byId = { ...s.byId };
        delete byId[id];
        const loading = { ...s.loading };
        delete loading[id];
        const error = { ...s.error };
        delete error[id];
        return { byId, loading, error };
      });
    }
  },
}));
