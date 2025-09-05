import { create } from 'zustand';


type RoomState = {
  roomId: string | null;
  setRoomId: (id: string) => void;
  clearRoomId: () => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  roomId: null,
  setRoomId: (id) => set({ roomId: id }),
  clearRoomId: () => set({ roomId: null }),
}));

