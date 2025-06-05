import React, { createContext, useContext, useState } from 'react';

interface Character {
  id?: string;
  name?: string;
  race?: string;
  class?: string;
  traits?: string[];
  backstory?: string;
  motivation?: string;
  image?: string;
}

interface CharacterContextType {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [character, setCharacter] = useState<Character>({});

  const updateCharacter = (updates: Partial<Character>) => {
    setCharacter(prev => ({ ...prev, ...updates }));
  };

  return (
    <CharacterContext.Provider value={{ character, updateCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCurrentCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCurrentCharacter must be used within a CharacterProvider');
  }
  return context;
} 