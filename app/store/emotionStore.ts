import { create } from 'zustand';

interface ResultData {
  emotion: string;
  best_method: string;
  probabilities: Record<string, number>;
  xai_scores: Record<string, number>;
  xai: Record<string, string>;
}

interface EmotionStore {
  emotionResult: ResultData | null;
  emotionImage: string | null;
  setEmotionResult: (result: ResultData, image: string) => void;
  clearEmotionResult: () => void;
}

export const useEmotionStore = create<EmotionStore>((set) => ({
  emotionResult: null,
  emotionImage: null,
  setEmotionResult: (result, image) => set({ emotionResult: result, emotionImage: image }),
  clearEmotionResult: () => set({ emotionResult: null, emotionImage: null }),
}));
