import { create } from 'zustand';

interface VoiceState {
  isRecording: boolean;
  isSpeaking: boolean;
  transcript: string;
  speakingMessageId: string | null;
  
  setIsRecording: (recording: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
  setTranscript: (transcript: string) => void;
  appendTranscript: (text: string) => void;
  setSpeakingMessageId: (id: string | null) => void;
  reset: () => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isRecording: false,
  isSpeaking: false,
  transcript: '',
  speakingMessageId: null,

  setIsRecording: (recording) => set({ isRecording: recording }),
  setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),
  setTranscript: (transcript) => set({ transcript }),
  appendTranscript: (text) => set((state) => ({ transcript: state.transcript + text })),
  setSpeakingMessageId: (id) => set({ speakingMessageId: id }),
  reset: () => set({ isRecording: false, isSpeaking: false, transcript: '', speakingMessageId: null }),
}));
