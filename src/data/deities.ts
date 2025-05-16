export interface Deity {
  name: string;
  domains: string[];
  alignment: string;
  symbol: string;
  description: string;
}

export const deities: Deity[] = [
  {
    name: "Bahamut",
    domains: ["Justice", "Good", "Protection"],
    alignment: "Lawful Good",
    symbol: "Dragon's head",
    description:
      "The Platinum Dragon, god of justice and good dragons. Bahamut is revered by those who seek to protect the innocent and uphold honor.",
  },
  {
    name: "Tiamat",
    domains: ["Tyranny", "Greed", "Vengeance"],
    alignment: "Lawful Evil",
    symbol: "Five-headed dragon",
    description:
      "The Dragon Queen, goddess of evil dragons and conquest. Tiamat is worshipped by those who seek power through domination and wealth.",
  },
  {
    name: "Pelor",
    domains: ["Sun", "Healing", "Time"],
    alignment: "Neutral Good",
    symbol: "Sun",
    description:
      "The Sun Father, god of the sun and healing. Pelor is worshipped by those who seek to bring light to darkness and heal the wounded.",
  },
  {
    name: "Moradin",
    domains: ["Creation", "Earth", "Protection"],
    alignment: "Lawful Good",
    symbol: "Hammer and anvil",
    description:
      "The All-Father, god of dwarves and creation. Moradin is revered by craftsmen and those who value tradition and hard work.",
  },
  {
    name: "Corellon Larethian",
    domains: ["Art", "Magic", "War"],
    alignment: "Chaotic Good",
    symbol: "Crescent moon",
    description:
      "The First of the Seldarine, god of elves and magic. Corellon is worshipped by those who value beauty, art, and arcane knowledge.",
  },
  {
    name: "Lolth",
    domains: ["Darkness", "Chaos", "Spiders"],
    alignment: "Chaotic Evil",
    symbol: "Spider",
    description:
      "The Spider Queen, goddess of the drow. Lolth is worshipped by those who embrace treachery, darkness, and ambition.",
  },
  {
    name: "Tymora",
    domains: ["Luck", "Good Fortune", "Adventure"],
    alignment: "Chaotic Good",
    symbol: "Coin",
    description:
      "Lady Luck, goddess of good fortune. Tymora is revered by gamblers, adventurers, and anyone who takes risks.",
  },
  {
    name: "Bane",
    domains: ["Tyranny", "Hatred", "Fear"],
    alignment: "Lawful Evil",
    symbol: "Clenched fist",
    description:
      "The Black Lord, god of tyranny and hatred. Bane is worshipped by those who seek to rule through fear and oppression.",
  },
  {
    name: "Mystra",
    domains: ["Magic", "Spells", "Weave"],
    alignment: "Neutral Good",
    symbol: "Circle of stars",
    description:
      "The Lady of Mysteries, goddess of magic. Mystra is worshipped by spellcasters who seek to understand and protect the Weave.",
  },
];
