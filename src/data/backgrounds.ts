export interface Background {
  name: string;
  description: string;
  source?: string;
}

export const standardBackgrounds: Background[] = [
  {
    name: "Acolyte",
    description: "You've spent your life in service to a temple or deity.",
    source: "Player's Handbook"
  },
  {
    name: "Charlatan",
    description: "A con artist or trickster who lives by deception.",
    source: "Player's Handbook"
  },
  {
    name: "Criminal",
    description: "You have a history in the underworld, with connections and secrets.",
    source: "Player's Handbook"
  },
  {
    name: "Entertainer",
    description: "A performer who's traveled, loved, and lived through the arts.",
    source: "Player's Handbook"
  },
  {
    name: "Folk Hero",
    description: "A local champion who rose from humble beginnings.",
    source: "Player's Handbook"
  },
  {
    name: "Guild Artisan",
    description: "A skilled craftsperson belonging to a respected guild.",
    source: "Player's Handbook"
  },
  {
    name: "Hermit",
    description: "You lived in seclusion, perhaps discovering something important.",
    source: "Player's Handbook"
  },
  {
    name: "Noble",
    description: "Born into wealth and political power, often with rivals and responsibilities.",
    source: "Player's Handbook"
  },
  {
    name: "Outlander",
    description: "A wilderness survivor from distant lands.",
    source: "Player's Handbook"
  },
  {
    name: "Sage",
    description: "A scholar with knowledge of ancient tomes and forgotten lore.",
    source: "Player's Handbook"
  },
  {
    name: "Sailor",
    description: "A seasoned mariner familiar with ships, ports, and piracy.",
    source: "Player's Handbook"
  },
  {
    name: "Soldier",
    description: "A veteran of organized combat, trained and battle-tested.",
    source: "Player's Handbook"
  },
  {
    name: "Urchin",
    description: "A street survivor who knows how to navigate cities and stay alive.",
    source: "Player's Handbook"
  }
];

export const variantBackgrounds: Background[] = [
  {
    name: "Cloistered Scholar",
    description: "A bookworm from an academic institution.",
    source: "Sword Coast Adventurer's Guide"
  },
  {
    name: "City Watch",
    description: "A guard or constable familiar with urban law and order.",
    source: "Sword Coast Adventurer's Guide"
  },
  {
    name: "Far Traveler",
    description: "From a distant, exotic land, unfamiliar with the local culture.",
    source: "Sword Coast Adventurer's Guide"
  },
  {
    name: "Haunted One",
    description: "Marked by a horrific experience—great for horror-themed campaigns.",
    source: "Curse of Strahd"
  },
  {
    name: "Faction Agent",
    description: "Aligned with a powerful organization (like Harpers or Zhentarim).",
    source: "Sword Coast Adventurer's Guide"
  }
];

export const backgrounds = [...standardBackgrounds, ...variantBackgrounds];