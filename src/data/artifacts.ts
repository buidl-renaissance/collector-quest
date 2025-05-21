export interface Artifact {
  id: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  description: string;
  class: "Tool" | "Weapon" | "Symbol" | "Wearable" | "Key";
  effect: "Reveal" | "Heal" | "Unlock" | "Boost" | "Summon";
  element: "Fire" | "Water" | "Nature" | "Shadow" | "Light" | "Electric";
  rarity: "Common" | "Uncommon" | "Rare" | "Epic";
  imageUrl: string;
  created_at: string;
  updated_at: string;
}

export const getArtifact = (id: string): Artifact | undefined => {
  return mockArtifacts.find((artifact) => artifact.id === id);
};

export const mockArtifacts: Artifact[] = [
  {
    id: "artifact-001",
    title: "The Golden Chalice",
    artist: "Elara Moonwhisper",
    year: "2023",
    medium: "Digital Art",
    description: "A mystical chalice that glows with an inner light, revealing hidden truths to those who drink from it. Ancient runes circle its rim, telling stories of forgotten realms.",
    class: "Symbol",
    effect: "Reveal",
    element: "Light",
    rarity: "Epic",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2023-01-15",
    updated_at: "2023-01-15"
  },
  {
    id: "artifact-002",
    title: "Ember Blade",
    artist: "Kael Fireheart",
    year: "2022",
    medium: "Oil on Canvas",
    description: "A sword forged in dragon's breath, its blade eternally wreathed in dancing flames. The hilt bears the mark of the ancient fire temple.",
    class: "Weapon",
    effect: "Boost",
    element: "Fire",
    rarity: "Rare",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2022-11-03",
    updated_at: "2022-11-03"
  },
  {
    id: "artifact-003",
    title: "Whispering Amulet",
    artist: "Thorne Shadowweaver",
    year: "2021",
    medium: "Mixed Media",
    description: "An obsidian amulet that absorbs ambient light. When worn, it allows the bearer to hear whispers from the shadow realm.",
    class: "Wearable",
    effect: "Reveal",
    element: "Shadow",
    rarity: "Uncommon",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2021-08-22",
    updated_at: "2021-08-22"
  },
  {
    id: "artifact-004",
    title: "Verdant Gauntlets",
    artist: "Willow Greenmantle",
    year: "2023",
    medium: "Sculpture",
    description: "Gauntlets woven from living vines and flowers. They heal both the wearer and the land around them, bringing life to barren soil.",
    class: "Wearable",
    effect: "Heal",
    element: "Nature",
    rarity: "Rare",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2023-02-14",
    updated_at: "2023-02-14"
  },
  {
    id: "artifact-005",
    title: "Tidal Key",
    artist: "Marina Wavecaller",
    year: "2022",
    medium: "Watercolor",
    description: "A key made of coral and pearl that can unlock any door, but only during high tide. It smells of salt and distant shores.",
    class: "Key",
    effect: "Unlock",
    element: "Water",
    rarity: "Epic",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2022-06-30",
    updated_at: "2022-06-30"
  },
  {
    id: "artifact-006",
    title: "Thunderstrike Hammer",
    artist: "Bjorn Stormforge",
    year: "2021",
    medium: "Digital Sculpture",
    description: "A massive hammer that channels lightning from storm clouds. Its wielder can summon thunder with each mighty swing.",
    class: "Weapon",
    effect: "Summon",
    element: "Electric",
    rarity: "Epic",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2021-12-01",
    updated_at: "2021-12-01"
  },
  {
    id: "artifact-007",
    title: "Healer's Mortar and Pestle",
    artist: "Sage Herblight",
    year: "2023",
    medium: "Ceramic",
    description: "A simple clay mortar and pestle that enhances the healing properties of any herbs ground within it. Glows with a soft green light when in use.",
    class: "Tool",
    effect: "Heal",
    element: "Nature",
    rarity: "Common",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2023-03-21",
    updated_at: "2023-03-21"
  },
  {
    id: "artifact-008",
    title: "Prismatic Lens",
    artist: "Iris Lightbender",
    year: "2022",
    medium: "Glass Art",
    description: "A crystal lens that reveals hidden messages and pathways when sunlight passes through it. Each angle shows a different hidden truth.",
    class: "Tool",
    effect: "Reveal",
    element: "Light",
    rarity: "Uncommon",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2022-09-15",
    updated_at: "2022-09-15"
  },
  {
    id: "artifact-009",
    title: "Shadowstep Boots",
    artist: "Raven Nightwalker",
    year: "2021",
    medium: "Leather Craft",
    description: "Boots made from shadow-tanned leather that allow the wearer to step between shadows, crossing great distances in an instant.",
    class: "Wearable",
    effect: "Unlock",
    element: "Shadow",
    rarity: "Rare",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2021-10-31",
    updated_at: "2021-10-31"
  },
  {
    id: "artifact-010",
    title: "Phoenix Feather Quill",
    artist: "Ember Ashwright",
    year: "2023",
    medium: "Mixed Media",
    description: "A writing quill crafted from the feather of a phoenix. Words written with it glow with inner fire and can summon small flames when read aloud.",
    class: "Tool",
    effect: "Summon",
    element: "Fire",
    rarity: "Uncommon",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2023-04-05",
    updated_at: "2023-04-05"
  }
];
