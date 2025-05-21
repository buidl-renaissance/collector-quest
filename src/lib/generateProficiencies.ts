import { Character } from "@/data/character";

const racialProficiencies: Record<string, string[]> = {
  "Dwarf": ["Battleaxe", "Handaxe", "Light Hammer", "Warhammer", "Smith's Tools", "Mason's Tools", "Brewer's Supplies"],
  "Elf": ["Longsword", "Shortsword", "Shortbow", "Longbow", "Perception"],
  "Halfling": ["Lightfoot", "Naturally Stealthy"],
  "Human": ["One Extra Language"],
  "Dragonborn": ["Draconic Ancestry"],
  "Gnome": ["Tinker's Tools"],
  "Half-Elf": ["Two Extra Skills"],
  "Half-Orc": ["Intimidation"],
  "Tiefling": ["Infernal Legacy"],
};

const classProficiencies: Record<string, string[]> = {
  "Fighter": ["All Armor", "Shields", "Simple Weapons", "Martial Weapons", "Athletics", "Intimidation"],
  "Wizard": ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light Crossbows", "Arcana", "History"],
  "Cleric": ["Light Armor", "Medium Armor", "Shields", "Simple Weapons", "Religion", "Insight"],
  "Rogue": ["Light Armor", "Simple Weapons", "Hand Crossbows", "Longswords", "Rapiers", "Shortswords", "Thieves' Tools", "Stealth", "Sleight of Hand"],
  "Ranger": ["Light Armor", "Medium Armor", "Shields", "Simple Weapons", "Martial Weapons", "Nature", "Survival"],
  "Paladin": ["All Armor", "Shields", "Simple Weapons", "Martial Weapons", "Religion", "Athletics"],
  "Bard": ["Light Armor", "Simple Weapons", "Hand Crossbows", "Longswords", "Rapiers", "Shortswords", "Three Musical Instruments", "Persuasion", "Performance"],
  "Druid": ["Light Armor", "Medium Armor", "Shields", "Clubs", "Daggers", "Darts", "Javelins", "Maces", "Quarterstaffs", "Scimitars", "Sickles", "Slings", "Spears", "Herbalism Kit"],
  "Warlock": ["Light Armor", "Simple Weapons", "Arcana", "Deception"],
  "Sorcerer": ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light Crossbows", "Arcana", "Religion"],
  "Monk": ["Simple Weapons", "Shortswords", "Acrobatics", "Athletics"],
  "Barbarian": ["Light Armor", "Medium Armor", "Shields", "Simple Weapons", "Martial Weapons", "Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"],
};

const backgroundProficiencies: Record<string, string[]> = {
  "Acolyte": ["Insight", "Religion", "Two Languages"],
  "Criminal": ["Deception", "Stealth", "Thieves' Tools", "Gaming Set"],
  "Folk Hero": ["Animal Handling", "Survival", "One Type of Artisan's Tools", "Vehicles (Land)"],
  "Noble": ["History", "Persuasion", "One Gaming Set", "One Language"],
  "Sage": ["Arcana", "History", "Two Languages"],
  "Soldier": ["Athletics", "Intimidation", "One Gaming Set", "Vehicles (Land)"],
};

export async function generateProficiencies(character: Character): Promise<string[]> {
  const proficiencies = new Set<string>();

  // Add racial proficiencies
  if (character.race?.name && racialProficiencies[character.race.name]) {
    racialProficiencies[character.race.name].forEach(prof => proficiencies.add(prof));
  }

  // Add class proficiencies
  if (character.class?.name && classProficiencies[character.class.name]) {
    classProficiencies[character.class.name].forEach(prof => proficiencies.add(prof));
  }

  // Add background proficiencies
  if (character.traits?.background && backgroundProficiencies[character.traits.background]) {
    backgroundProficiencies[character.traits.background].forEach(prof => proficiencies.add(prof));
  }

  return Array.from(proficiencies);
} 