import { Character } from "@/data/character";

const commonLanguages = ["Common"];
const racialLanguages: Record<string, string[]> = {
  "Dwarf": ["Dwarvish"],
  "Elf": ["Elvish"],
  "Halfling": ["Halfling"],
  "Human": [],
  "Dragonborn": ["Draconic"],
  "Gnome": ["Gnomish"],
  "Half-Elf": ["Elvish"],
  "Half-Orc": ["Orc"],
  "Tiefling": ["Infernal"],
};

const classLanguages: Record<string, string[]> = {
  "Wizard": ["Arcane"],
  "Cleric": ["Celestial"],
  "Druid": ["Druidic"],
  "Paladin": ["Celestial"],
  "Ranger": ["Sylvan"],
  "Bard": ["Thieves' Cant"],
};

export async function generateLanguages(character: Character): Promise<string[]> {
  const languages = new Set<string>(commonLanguages);

  // Add racial languages
  if (character.race?.name && racialLanguages[character.race.name]) {
    racialLanguages[character.race.name].forEach(lang => languages.add(lang));
  }

  // Add class languages
  if (character.class?.name && classLanguages[character.class.name]) {
    classLanguages[character.class.name].forEach(lang => languages.add(lang));
  }

  // Add bonus languages based on Intelligence modifier
  const intModifier = character.sheet?.abilitiesScores?.intelligence?.modifier || 0;
  const bonusLanguages = Math.max(0, intModifier);

  // Add some exotic languages as bonus languages
  const exoticLanguages = [
    "Abyssal", "Celestial", "Deep Speech", "Draconic", "Infernal",
    "Primordial", "Sylvan", "Undercommon"
  ];

  // Filter out languages the character already knows
  const availableExoticLanguages = exoticLanguages.filter(
    lang => !languages.has(lang)
  );

  // Randomly select bonus languages
  for (let i = 0; i < bonusLanguages && availableExoticLanguages.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableExoticLanguages.length);
    const selectedLang = availableExoticLanguages.splice(randomIndex, 1)[0];
    languages.add(selectedLang);
  }

  return Array.from(languages);
} 