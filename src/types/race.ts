export interface Race {
  id: string;
  name: string;
  description: string;
  traits: string[];
  abilityScoreBonus: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
  };
  size: 'small' | 'medium' | 'large';
  speed: number;
  languages: string[];
  subraces?: {
    id: string;
    name: string;
    description: string;
    abilityScoreBonus: {
      strength?: number;
      dexterity?: number;
      constitution?: number;
      intelligence?: number;
      wisdom?: number;
      charisma?: number;
    };
  }[];
} 