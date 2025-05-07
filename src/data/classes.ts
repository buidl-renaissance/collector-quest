export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  abilities: string[];
  image: string;
  isActive?: boolean;
}

export const characterClasses: CharacterClass[] = [
  {
    id: "barbarian",
    name: "Barbarian",
    description: "Rage-fueled warriors of primal power.",
    abilities: ["Rage", "Unarmored Defense", "Reckless Attack"],
    image: "/images/classes/barbarian.jpg"
  },
  {
    id: "bard",
    name: "Bard",
    description: "Magic-wielding performers and jack-of-all-trades.",
    abilities: ["Bardic Inspiration", "Spellcasting", "Jack of All Trades"],
    image: "/images/classes/bard.jpg"
  },
  {
    id: "cleric",
    name: "Cleric",
    description: "Divine spellcasters who serve a deity.",
    abilities: ["Divine Magic", "Channel Divinity", "Healing Touch"],
    image: "/images/classes/cleric.jpg"
  },
  {
    id: "druid",
    name: "Druid",
    description: "Guardians of nature with shape-shifting powers.",
    abilities: ["Wild Shape", "Nature Magic", "Natural Recovery"],
    image: "/images/classes/druid.jpg"
  },
  {
    id: "fighter",
    name: "Fighter",
    description: "Master of weapons, tactics, and martial prowess.",
    abilities: ["Fighting Style", "Second Wind", "Action Surge"],
    image: "/images/classes/fighter.jpg"
  },
  {
    id: "monk",
    name: "Monk",
    description: "Martial artists channeling ki for powerful strikes.",
    abilities: ["Ki", "Unarmored Movement", "Flurry of Blows"],
    image: "/images/classes/monk.jpg"
  },
  {
    id: "paladin",
    name: "Paladin",
    description: "Holy warriors bound by an oath.",
    abilities: ["Divine Smite", "Lay on Hands", "Divine Sense"],
    image: "/images/classes/paladin.jpg"
  },
  {
    id: "ranger",
    name: "Ranger",
    description: "Hunters and trackers skilled in the wild.",
    abilities: ["Natural Explorer", "Favored Enemy", "Hunter's Mark"],
    image: "/images/classes/ranger.jpg"
  },
  {
    id: "rogue",
    name: "Rogue",
    description: "Stealthy and cunning specialists in precision.",
    abilities: ["Sneak Attack", "Thieves' Tools", "Evasion"],
    image: "/images/classes/rogue.jpg"
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    description: "Natural spellcasters with innate magic.",
    abilities: ["Innate Spellcasting", "Sorcery Points", "Metamagic"],
    image: "/images/classes/sorcerer.jpg"
  },
  {
    id: "warlock",
    name: "Warlock",
    description: "Magic users empowered by a pact with a powerful entity.",
    abilities: ["Eldritch Invocations", "Pact Magic", "Otherworldly Patron"],
    image: "/images/classes/warlock.jpg"
  },
  {
    id: "wizard",
    name: "Wizard",
    description: "Scholars of arcane knowledge and spells.",
    abilities: ["Spellcasting", "Arcane Recovery", "Spellbook"],
    image: "/images/classes/wizard.jpg"
  }
];
