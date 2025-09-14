import { create } from "zustand";
import { persist } from "zustand/middleware";

type CallState = {
  roomId: string | null;
  micOn: boolean;
  camOn: boolean;
  setRoomId: (id: string | null) => void;
  toggleMic: () => void;
  toggleCam: () => void;
};

export const useCallStore = create<CallState>()(
  persist(
    (set) => ({
      roomId: null,
      micOn: true,
      camOn: true,
      setRoomId: (id) => set({ roomId: id }),
      toggleMic: () => set((s) => ({ micOn: !s.micOn })),
      toggleCam: () => set((s) => ({ camOn: !s.camOn })),
    }),
    { name: "call-ui" }
  )
);
