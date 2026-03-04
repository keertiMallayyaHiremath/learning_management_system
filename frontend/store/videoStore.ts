import create from 'zustand';

interface VideoState {
  currentVideoId: string | null;
  setCurrentVideo: (id: string) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  currentVideoId: null,
  setCurrentVideo: (id) => set({ currentVideoId: id }),
}));