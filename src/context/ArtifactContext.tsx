'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface Artifact {
  language: string;
  code: string;
  title: string;
}

interface ArtifactContextValue {
  activeArtifact: Artifact | null;
  setActiveArtifact: (artifact: Artifact | null) => void;
}

const ArtifactContext = createContext<ArtifactContextValue>({
  activeArtifact: null,
  setActiveArtifact: () => {},
});

export function ArtifactProvider({ children }: { children: ReactNode }) {
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);

  return (
    <ArtifactContext.Provider value={{ activeArtifact, setActiveArtifact }}>
      {children}
    </ArtifactContext.Provider>
  );
}

export function useArtifact() {
  return useContext(ArtifactContext);
}
