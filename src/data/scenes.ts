import { CharacterBasics } from "./character";
import { Locale } from "./locales";
import { Item } from "./items";

export interface Scene {
  id: string;
  campaignId: string;
  name: string;
  description: string;
  imageUrl: string;
  locale: Locale;
  atmosphere: string;
  npcsPresent: CharacterBasics[];
  interactables: Item[];
  secrets: string[];
  challenges: string[];
  lighting: string;
  ambiance: {
    sounds: string[];
    smells: string[];
  };
  lore: string;
  encounterType: "combat" | "social" | "exploration" | "puzzle" | "mixed";
  objectives: string[];
  createdAt: string;
  updatedAt: string;
}
