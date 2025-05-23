export type ArtifactClass = "Tool" | "Weapon" | "Symbol" | "Wearable" | "Key";
export type Effect = "Reveal" | "Heal" | "Unlock" | "Boost" | "Summon";
export type Element =
  | "Fire"
  | "Water"
  | "Nature"
  | "Shadow"
  | "Light"
  | "Electric";
export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic";

export interface RelicProperties {
  activeUse?: string;
  visualAsset?: string;
  passiveBonus?: string;
  unlockCondition?: string;
  reflectionTrigger?: string;
}

export interface Relic {
  id: string;
  objectId?: string | null;
  name: string;
  imageUrl?: string | null;
  class: ArtifactClass;
  effect: Effect;
  element: Element;
  story?: string | null;
  rarity: Rarity;
  registration_id?: string;
  properties: RelicProperties;
}

export interface Artifact {
  id: string;
  registration_id?: string;
  title: string;
  artist: string;
  owner?: string;
  year: string;
  medium: string;
  description: string;
  relic?: Relic | null;
  imageUrl: string;
  created_at: string;
  updated_at: string;
}
