import { Attack } from "./attacks";
import { DetailedAbilityScores } from "@/lib/generateAbilities";

export interface AbilityModifier {
  name: string;
  level: number;
  type: "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma";
  description: string;
}

export interface Race {
  id: string;
  name: string;
  source: string;
  image?: string;
  description?: string;
  accessory?: string[];
  isGeneratingImage?: boolean;
  subraces?: Subrace[];
  abilities?: AbilityModifier[];
}

export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  abilities: AbilityModifier[];
  image: string;
  isActive?: boolean;
  subclasses?: CharacterSubclass[];
}

export interface CharacterSubclass {
  id: string;
  name: string;
  description: string;
  abilities: AbilityModifier[];
}


export interface CharacterClassAbility {
  name: string;
  description: string;
  level: number;
}

export interface Subrace {
  id: string;
  name: string;
  description: string;
  abilities?: {[key: string]: number};
}

export interface Skill {
  name: string;
  ability: string;
  modifier: number;
  proficient: boolean;
  expertise?: boolean;
}

export interface Armor {
  name: string;
  type: string;
  level: number;
  visualDescription: string;
  stats: {
    acBonus: number;
    mobilityModifier: number;
    durability: number;
    resistances: string[];
  };
  specialTrait: string;
  lore: string;
  rarity: string;
  obtainedBy: string;
}

export interface Speed {
  baseSpeed: number;
  modifiedSpeed: number;
  breakdown: {
    racialBase: number;
    classBonus: number;
    racialAbilityBonus: number;
    magicItemBonus: number;
    armorPenalty: number;
  };
  description?: string;
}

export interface Initiative {
  dexMod: number;
  class: string;
  relics: {
    name: string;
    initiativeBonus: number;
  }[];
  traits: {
    name: string;
    initiativeBonus: number;
  }[];
  statusEffects: {
    name: string;
    initiativeBonus: number;
  }[];
  initiativeBreakdown: {
    dexMod: number;
    classBonus: number;
    relicBonus: number;
    traitBonus: number;
    statusBonus: number;
    totalInitiative: number;
    tier: string;
  };
  flavorText: string;
}

export enum CharacterStatus {
  NEW = "new",
  ALIVE = "alive",
  DEAD = "dead",
  CREATING = "creating",
  COMPLETED = "completed",
  DELETED = "deleted",
}

export interface Traits {
  alignment?: string;
  deity?: string;
  personality?: string[];
  background?: string;
  ideals?: string[];
  bonds?: string[];
  flaws?: string[];
  memory?: string;
  possession?: string;
  fear?: string[];
  hauntingMemory?: string;
  treasuredPossession?: string;
  actions?: string[];
  forces?: string[];
  archetype?: string;
}

export interface EquipmentItem {
  name: string;
  quantity: number;
}

export interface Equipment {
  weapons: EquipmentItem[];
  armor: EquipmentItem[];
  adventuringGear: EquipmentItem[];
  tools: EquipmentItem[];
  currency: EquipmentItem[];
  magicItems: EquipmentItem[];
}

export interface FeaturesTraits {
  raceTraits: string[];
  classFeatures: string[];
  backgroundFeature: string;
  subclassFeatures: string[];
  customFeatures: string[];
  description?: string;
}

export interface Ability {
  name: string;
  description: string;
  level: number;
  abilityScore: keyof AbilityScores;
  abilityBonus: number;
}

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CharacterSheet {
  abilities?: Ability[];
  abilitiesScores?: DetailedAbilityScores;
  skills?: Skill[];
  deathSaves?: {
    successes: number;
    failures: number;
  };
  combat?: {
    attacks?: Attack[];
    armor?: Armor;
    initiative?: Initiative;
    speed?: Speed;
    currentHitPoints?: number;
    hitDice?: {
      type: string;
      bonus: number;
      count: number;
      current: number;
    };
  };
  featuresAndTraits?: FeaturesTraits;
  proficiencies?: string[];
  languages?: string[];
}

export interface Character {
  id?: string;
  name: string;
  status?: string;
  race?: Race;
  subrace?: Subrace;
  class?: CharacterClass;
  subclass?: CharacterSubclass;
  level?: number;
  traits?: Traits;
  motivation?: string;
  bio?: string;
  backstory?: string;
  equipment?: Equipment;
  sex?: string;
  creature?: string;
  image_url?: string;
  sheet?: CharacterSheet;
}
