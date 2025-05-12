export interface Attack {
  name: string;
  classRaceCreature: string;
  element: string;
  attackType: string;
  effect: string;
  type: string;
}

export const getAttack = (attack: string) => {
  return attacks.find((a: Attack) => {
    return a.name.toLowerCase() === attack.toLowerCase();
  });
}

export const getAttackNames = () => {
  return attacks.map((a: Attack) => a.name);
}


export const attacks: Attack[] = [
  {
    name: "Troll Lightning Flame",
    classRaceCreature: "Troll",
    element: "Lightning",
    attackType: "Ranged",
    effect: "Applies a burning effect over time",
    type: "attack"
  },
  {
    name: "Cleric Earth Surge",
    classRaceCreature: "Cleric",
    element: "Earth",
    attackType: "Buff",
    effect: "Prevents enemies from casting spells",
    type: "spell"
  },
  {
    name: "Orc Lightning Shatter",
    classRaceCreature: "Orc",
    element: "Lightning",
    attackType: "Trap",
    effect: "Summons a creature to fight for you",
    type: "spell"
  },
  {
    name: "Sentinel Necrotic Surge",
    classRaceCreature: "Sentinel",
    element: "Necrotic",
    attackType: "Melee",
    effect: "Prevents enemies from casting spells",
    type: "attack"
  },
  {
    name: "Halfling Ash Touch",
    classRaceCreature: "Halfling",
    element: "Ash",
    attackType: "Summon",
    effect: "Heals allies in a moderate radius",
    type: "spell"
  },
  {
    name: "Oracle Wind Pulse",
    classRaceCreature: "Oracle",
    element: "Wind",
    attackType: "Heal",
    effect: "Prevents enemies from casting spells",
    type: "spell"
  },
  {
    name: "Gnome Blood Strike",
    classRaceCreature: "Gnome",
    element: "Blood",
    attackType: "Ranged",
    effect: "Deals area-of-effect elemental damage",
    type: "attack"
  },
  {
    name: "Dragonborn Holy Grasp",
    classRaceCreature: "Dragonborn",
    element: "Holy",
    attackType: "Buff",
    effect: "Grants temporary invisibility to the caster",
    type: "spell"
  },
  {
    name: "Specter Steel Strike",
    classRaceCreature: "Specter",
    element: "Steel",
    attackType: "Debuff",
    effect: "Causes enemies to flee in fear for 1 turn",
    type: "attack"
  },
  {
    name: "Champion Necrotic Slash",
    classRaceCreature: "Champion",
    element: "Necrotic",
    attackType: "Heal",
    effect: "Heals allies in a moderate radius",
    type: "spell"
  },
  {
    name: "Druid Psychic Blast",
    classRaceCreature: "Druid",
    element: "Psychic",
    attackType: "Buff",
    effect: "Prevents enemies from casting spells",
    type: "spell"
  },
  {
    name: "Sentinel Earth Fury",
    classRaceCreature: "Sentinel",
    element: "Earth",
    attackType: "Melee",
    effect: "Heals allies in a moderate radius",
    type: "attack"
  },
  {
    name: "Fighter Radiant Wail",
    classRaceCreature: "Fighter",
    element: "Radiant",
    attackType: "Curse",
    effect: "Causes enemies to flee in fear for 1 turn",
    type: "spell"
  },
  {
    name: "Giant Holy Wrath",
    classRaceCreature: "Giant",
    element: "Holy",
    attackType: "Summon",
    effect: "Summons a creature to fight for you",
    type: "spell"
  },
  {
    name: "Specter Plague Beam",
    classRaceCreature: "Specter",
    element: "Plague",
    attackType: "Debuff",
    effect: "Causes enemies to flee in fear for 1 turn",
    type: "spell"
  },
  {
    name: "Dwarf Poison Nova",
    classRaceCreature: "Dwarf",
    element: "Poison",
    attackType: "Buff",
    effect: "Stuns enemies in a small radius",
    type: "spell"
  },
  {
    name: "Tiefling Psychic Nova",
    classRaceCreature: "Tiefling",
    element: "Psychic",
    attackType: "Ranged",
    effect: "Creates a shield that blocks damage",
    type: "spell"
  },
  {
    name: "Tiefling Wind Surge",
    classRaceCreature: "Tiefling",
    element: "Wind",
    attackType: "Heal",
    effect: "Summons a creature to fight for you",
    type: "spell"
  },
  {
    name: "Monk Shadow Grasp",
    classRaceCreature: "Monk",
    element: "Shadow",
    attackType: "Spell",
    effect: "Causes enemies to flee in fear for 1 turn",
    type: "spell"
  },
  {
    name: "Hunter Light Scream",
    classRaceCreature: "Hunter",
    element: "Light",
    attackType: "Curse",
    effect: "Reflects a portion of incoming damage",
    type: "spell"
  },
  {
    name: "Orc Shadow Roar",
    classRaceCreature: "Orc",
    element: "Shadow",
    attackType: "Summon",
    effect: "Causes enemies to flee in fear for 1 turn",
    type: "spell"
  },
  {
    name: "Beast Fire Barrage",
    classRaceCreature: "Beast",
    element: "Fire",
    attackType: "Curse",
    effect: "Freezes the enemy, preventing movement for 1 turn",
    type: "spell"
  },
  {
    name: "Pyromancer Light Nova",
    classRaceCreature: "Pyromancer",
    element: "Light",
    attackType: "Summon",
    effect: "Grants temporary invisibility to the caster",
    type: "spell"
  },
  {
    name: "Specter Frost Wail",
    classRaceCreature: "Specter",
    element: "Frost",
    attackType: "Curse",
    effect: "Creates a shield that blocks damage",
    type: "spell"
  },
  {
    name: "Dwarf Blood Slash",
    classRaceCreature: "Dwarf",
    element: "Blood",
    attackType: "Debuff",
    effect: "Deals high single-target damage",
    type: "attack"
  },
  {
    name: "Halfling Psychic Surge",
    classRaceCreature: "Halfling",
    element: "Psychic",
    attackType: "Summon",
    effect: "Causes enemies to flee in fear for 1 turn",
    type: "spell"
  },
  {
    name: "Templar Psychic Wail",
    classRaceCreature: "Templar",
    element: "Psychic",
    attackType: "Melee",
    effect: "Reflects a portion of incoming damage",
    type: "attack"
  },
  {
    name: "Troll Holy Fury",
    classRaceCreature: "Troll",
    element: "Holy",
    attackType: "Debuff",
    effect: "Creates a shield that blocks damage",
    type: "spell"
  },
  {
    name: "Half-Orc Shadow Grasp",
    classRaceCreature: "Half-Orc",
    element: "Shadow",
    attackType: "Buff",
    effect: "Stuns enemies in a small radius",
    type: "spell"
  },
  {
    name: "Dwarf Light Surge",
    classRaceCreature: "Dwarf",
    element: "Light",
    attackType: "Debuff",
    effect: "Summons a creature to fight for you",
    type: "spell"
  },
  {
    name: "Goblin Solar Wrath",
    classRaceCreature: "Goblin",
    element: "Solar",
    attackType: "Buff",
    effect: "Summons a creature to fight for you",
    type: "spell"
  },
  {
    name: "Gnome Light Fury",
    classRaceCreature: "Gnome",
    element: "Light",
    attackType: "Summon",
    effect: "Creates a shield that blocks damage",
    type: "spell"
  },
  {
    name: "Bard Light Pulse",
    classRaceCreature: "Bard",
    element: "Light",
    attackType: "Aura",
    effect: "Heals allies in a moderate radius",
    type: "spell"
  },
  {
    name: "Pyromancer Blood Fury",
    classRaceCreature: "Pyromancer",
    element: "Blood",
    attackType: "Heal",
    effect: "Deals high single-target damage",
    type: "spell"
  },
  {
    name: "Sorcerer Necrotic Wrath",
    classRaceCreature: "Sorcerer",
    element: "Necrotic",
    attackType: "Buff",
    effect: "Deals area-of-effect elemental damage",
    type: "spell"
  },
  {
    name: "Witch Arcane Strike",
    classRaceCreature: "Witch",
    element: "Arcane",
    attackType: "Debuff",
    effect: "Applies a burning effect over time",
    type: "attack"
  },
  {
    name: "Rogue Crystal Touch",
    classRaceCreature: "Rogue",
    element: "Crystal",
    attackType: "Spell",
    effect: "Poisons the target, dealing damage over time",
    type: "spell"
  },
  {
    name: "Necromancer Frost Roar",
    classRaceCreature: "Necromancer",
    element: "Frost",
    attackType: "Spell",
    effect: "Slows enemy movement for 2 turns",
    type: "spell"
  },
  {
    name: "Hunter Fire Pierce",
    classRaceCreature: "Hunter",
    element: "Fire",
    attackType: "Melee",
    effect: "Poisons the target, dealing damage over time",
    type: "attack"
  },
  {
    name: "Elemental Steel Storm",
    classRaceCreature: "Elemental",
    element: "Steel",
    attackType: "Ranged",
    effect: "Freezes the enemy, preventing movement for 1 turn",
    type: "attack"
  },
  {
    name: "Knight Plague Pulse",
    classRaceCreature: "Knight",
    element: "Plague",
    attackType: "Debuff",
    effect: "Prevents enemies from casting spells",
    type: "spell"
  },
  {
    name: "Undead Plague Slash",
    classRaceCreature: "Undead",
    element: "Plague",
    attackType: "Heal",
    effect: "Deals area-of-effect elemental damage",
    type: "attack"
  },
  {
    name: "Seer Frost Scream",
    classRaceCreature: "Seer",
    element: "Frost",
    attackType: "Buff",
    effect: "Poisons the target, dealing damage over time",
    type: "spell"
  },
  {
    name: "Sorcerer Earth Storm",
    classRaceCreature: "Sorcerer",
    element: "Earth",
    attackType: "Ranged",
    effect: "Causes enemies to flee in fear for 1 turn",
    type: "attack"
  },
  {
    name: "Troll Ice Wail",
    classRaceCreature: "Troll",
    element: "Ice",
    attackType: "Curse",
    effect: "Causes enemies to flee in fear for 1 turn",
    type: "spell"
  },
  {
    name: "Paladin Earth Surge",
    classRaceCreature: "Paladin",
    element: "Earth",
    attackType: "Heal",
    effect: "Heals allies in a moderate radius",
    type: "spell"
  },
  {
    name: "Tiefling Fire Storm",
    classRaceCreature: "Tiefling",
    element: "Fire",
    attackType: "Trap",
    effect: "Summons a creature to fight for you",
    type: "spell"
  },
  {
    name: "Mystic Blood Touch",
    classRaceCreature: "Mystic",
    element: "Blood",
    attackType: "Debuff",
    effect: "Increases the target's physical defense for 3 turns",
    type: "spell"
  },
  {
    name: "Troll Wind Storm",
    classRaceCreature: "Troll",
    element: "Wind",
    attackType: "Ranged",
    effect: "Stuns enemies in a small radius",
    type: "attack"
  },
  {
    name: "Goblin Ice Shatter",
    classRaceCreature: "Goblin",
    element: "Ice",
    attackType: "Debuff",
    effect: "Prevents enemies from casting spells",
    type: "spell"
  },
  {
    name: "Witch Steel Beam",
    classRaceCreature: "Witch",
    element: "Steel",
    attackType: "Spell",
    effect: "Stuns enemies in a small radius",
    type: "spell"
  },
  {
    name: "Pyromancer Shadow Nova",
    classRaceCreature: "Pyromancer",
    element: "Shadow",
    attackType: "Debuff",
    effect: "Increases the target's physical defense for 3 turns",
    type: "spell"
  },
  {
    name: "Mystic Holy Strike",
    classRaceCreature: "Mystic",
    element: "Holy",
    attackType: "Melee",
    effect: "Summons a creature to fight for you",
    type: "attack"
  },
  {
    name: "Elemental Plague Blast",
    classRaceCreature: "Elemental",
    element: "Plague",
    attackType: "Buff",
    effect: "Slows enemy movement for 2 turns",
    type: "spell"
  },
  {
    name: "Knight Earth Shatter",
    classRaceCreature: "Knight",
    element: "Earth",
    attackType: "Buff",
    effect: "Deals area-of-effect elemental damage",
    type: "spell"
  },
  {
    name: "Human Wind Barrage",
    classRaceCreature: "Human",
    element: "Wind",
    attackType: "Aura",
    effect: "Grants temporary invisibility to the caster",
    type: "spell"
  },
  {
    name: "Demon Ice Blast",
    classRaceCreature: "Demon",
    element: "Ice",
    attackType: "Ranged",
    effect: "Poisons the target, dealing damage over time",
    type: "attack"
  },
  {
    name: "Sorcerer Frost Scream",
    classRaceCreature: "Sorcerer",
    element: "Frost",
    attackType: "Ranged",
    effect: "Stuns enemies in a small radius",
    type: "spell"
  },
  {
    name: "Fighter Solar Flame",
    classRaceCreature: "Fighter",
    element: "Solar",
    attackType: "Aura",
    effect: "Applies a burning effect over time",
    type: "spell"
  },
  {
    name: "Phantom Radiant Wrath",
    classRaceCreature: "Phantom",
    element: "Radiant",
    attackType: "Ranged",
    effect: "Reflects a portion of incoming damage",
    type: "attack"
  },
  {
    name: "Druid Lightning Fury",
    classRaceCreature: "Druid",
    element: "Lightning",
    attackType: "Curse",
    effect: "Deals high single-target damage",
    type: "spell"
  },
  {
    name: "Beast Blood Strike",
    classRaceCreature: "Beast",
    element: "Blood",
    attackType: "Spell",
    effect: "Creates a shield that blocks damage",
    type: "attack"
  },
  {
    name: "Necromancer Crystal Slash",
    classRaceCreature: "Necromancer",
    element: "Crystal",
    attackType: "Curse",
    effect: "Applies a burning effect over time",
    type: "attack"
  },
  {
    name: "Gnome Blood Flame",
    classRaceCreature: "Gnome",
    element: "Blood",
    attackType: "Summon",
    effect: "Creates a shield that blocks damage",
    type: "spell"
  },
  {
    name: "Knight Arcane Scream",
    classRaceCreature: "Knight",
    element: "Arcane",
    attackType: "Curse",
    effect: "Grants temporary invisibility to the caster",
    type: "spell"
  },
  {
    name: "Champion Solar Blast",
    classRaceCreature: "Champion",
    element: "Solar",
    attackType: "Ranged",
    effect: "Creates a shield that blocks damage",
    type: "attack"
  },
  {
    name: "Elf Wind Slash",
    classRaceCreature: "Elf",
    element: "Wind",
    attackType: "Spell",
    effect: "Heals allies in a moderate radius",
    type: "attack"
  },
  {
    name: "Cleric Plague Surge",
    classRaceCreature: "Cleric",
    element: "Plague",
    attackType: "Spell",
    effect: "Heals allies in a moderate radius",
    type: "spell"
  },
  {
    name: "Gnome Plague Nova",
    classRaceCreature: "Gnome",
    element: "Plague",
    attackType: "Aura",
    effect: "Summons a creature to fight for you",
    type: "spell"
  },
  {
    name: "Barbarian Fire Pierce",
    classRaceCreature: "Barbarian",
    element: "Fire",
    attackType: "Heal",
    effect: "Prevents enemies from casting spells",
    type: "attack"
  },
  {
    name: "Shaman Psychic Beam",
    classRaceCreature: "Shaman",
    element: "Psychic",
    attackType: "Trap",
    effect: "Causes enemies to flee in fear for 1 turn",
    type: "spell"
  },
  {
    name: "Undead Blood Wail",
    classRaceCreature: "Undead",
    element: "Blood",
    attackType: "Summon",
    effect: "Heals allies in a moderate radius",
    type: "spell"
  },
  {
    name: "Seer Steel Fury",
    classRaceCreature: "Seer",
    element: "Steel",
    attackType: "Melee",
    effect: "Poisons the target, dealing damage over time",
    type: "attack"
  },
  {
    name: "Fighter Blood Wrath",
    classRaceCreature: "Fighter",
    element: "Blood",
    attackType: "Curse",
    effect: "Causes enemies to flee in fear for 1 turn",
    type: "spell"
  },
  {
    name: "Phantom Crystal Barrage",
    classRaceCreature: "Phantom",
    element: "Crystal",
    attackType: "Buff",
    effect: "Reflects a portion of incoming damage",
    type: "spell"
  },
  {
    name: "Invoker Blood Slash",
    classRaceCreature: "Invoker",
    element: "Blood",
    attackType: "Spell",
    effect: "Heals allies in a moderate radius",
    type: "attack"
  },
  {
    name: "Sorcerer Ash Nova",
    classRaceCreature: "Sorcerer",
    element: "Ash",
    attackType: "Buff",
    effect: "Freezes the enemy, preventing movement for 1 turn",
    type: "spell"
  },
  {
    name: "Elf Shadow Pulse",
    classRaceCreature: "Elf",
    element: "Shadow",
    attackType: "Curse",
    effect: "Prevents enemies from casting spells",
    type: "spell"
  },
  {
    name: "Tiefling Steel Flame",
    classRaceCreature: "Tiefling",
    element: "Steel",
    attackType: "Curse",
    effect: "Prevents enemies from casting spells",
    type: "spell"
  },
  {
    name: "Giant Blood Wail",
    classRaceCreature: "Giant",
    element: "Blood",
    attackType: "Trap",
    effect: "Creates a shield that blocks damage",
    type: "spell"
  },
  {
    name: "Specter Light Shatter",
    classRaceCreature: "Specter",
    element: "Light",
    attackType: "Ranged",
    effect: "Freezes the enemy, preventing movement for 1 turn",
    type: "attack"
  },
  {
    name: "Undead Holy Wail",
    classRaceCreature: "Undead",
    element: "Holy",
    attackType: "Summon",
    effect: "Deals high single-target damage",
    type: "spell"
  },
  {
    name: "Dragonborn Plague Touch",
    classRaceCreature: "Dragonborn",
    element: "Plague",
    attackType: "Spell",
    effect: "Reflects a portion of incoming damage",
    type: "spell"
  },
  {
    name: "Witch Poison Surge",
    classRaceCreature: "Witch",
    element: "Poison",
    attackType: "Spell",
    effect: "Deals area-of-effect elemental damage",
    type: "spell"
  },
  {
    name: "Dragonborn Crystal Blast",
    classRaceCreature: "Dragonborn",
    element: "Crystal",
    attackType: "Ranged",
    effect: "Reflects a portion of incoming damage",
    type: "attack"
  },
  {
    name: "Undead Holy Wrath",
    classRaceCreature: "Undead",
    element: "Holy",
    attackType: "Buff",
    effect: "Slows enemy movement for 2 turns",
    type: "spell"
  },
  {
    name: "Giant Poison Blast",
    classRaceCreature: "Giant",
    element: "Poison",
    attackType: "Trap",
    effect: "Reflects a portion of incoming damage",
    type: "spell"
  },
  {
    name: "Warlock Psychic Scream",
    classRaceCreature: "Warlock",
    element: "Psychic",
    attackType: "Ranged",
    effect: "Reflects a portion of incoming damage",
    type: "spell"
  },
  {
    name: "Sentinel Ash Fury",
    classRaceCreature: "Sentinel",
    element: "Ash",
    attackType: "Heal",
    effect: "Summons a creature to fight for you",
    type: "spell"
  },
  {
    name: "Rogue Necrotic Wrath",
    classRaceCreature: "Rogue",
    element: "Necrotic",
    attackType: "Curse",
    effect: "Deals area-of-effect elemental damage",
    type: "spell"
  },
  {
    name: "Elf Solar Fury",
    classRaceCreature: "Elf",
    element: "Solar",
    attackType: "Trap",
    effect: "Heals allies in a moderate radius",
    type: "spell"
  },
  {
    name: "Dragon Solar Nova",
    classRaceCreature: "Dragon",
    element: "Solar",
    attackType: "Summon",
    effect: "Slows enemy movement for 2 turns",
    type: "spell"
  },
  {
    name: "Wizard Ice Shatter",
    classRaceCreature: "Wizard",
    element: "Ice",
    attackType: "Debuff",
    effect: "Summons a creature to fight for you",
    type: "spell"
  },
  {
    name: "Undead Arcane Wail",
    classRaceCreature: "Undead",
    element: "Arcane",
    attackType: "Aura",
    effect: "Creates a shield that blocks damage",
    type: "spell"
  },
  {
    name: "Sorcerer Psychic Blast",
    classRaceCreature: "Sorcerer",
    element: "Psychic",
    attackType: "Heal",
    effect: "Causes enemies to flee in fear for 1 turn",
    type: "spell"
  },
  {
    name: "Champion Light Nova",
    classRaceCreature: "Champion",
    element: "Light",
    attackType: "Buff",
    effect: "Deals area-of-effect elemental damage",
    type: "spell"
  },
  {
    name: "Shaman Wind Barrage",
    classRaceCreature: "Shaman",
    element: "Wind",
    attackType: "Ranged",
    effect: "Applies a burning effect over time",
    type: "attack"
  },
  {
    name: "Witch Steel Pulse",
    classRaceCreature: "Witch",
    element: "Steel",
    attackType: "Melee",
    effect: "Freezes the enemy, preventing movement for 1 turn",
    type: "attack"
  },
  {
    name: "Half-Orc Radiant Fury",
    classRaceCreature: "Half-Orc",
    element: "Radiant",
    attackType: "Heal",
    effect: "Freezes the enemy, preventing movement for 1 turn",
    type: "spell"
  },
  {
    name: "Dwarf Crystal Blast",
    classRaceCreature: "Dwarf",
    element: "Crystal",
    attackType: "Curse",
    effect: "Grants temporary invisibility to the caster",
    type: "spell"
  },
  {
    name: "Phantom Ice Strike",
    classRaceCreature: "Phantom",
    element: "Ice",
    attackType: "Summon",
    effect: "Heals allies in a moderate radius",
    type: "attack"
  },
  {
    name: "Paladin Fire Wrath",
    classRaceCreature: "Paladin",
    element: "Fire",
    attackType: "Melee",
    effect: "Heals allies in a moderate radius",
    type: "attack"
  },
  {
    name: "Tiefling Frost Wrath",
    classRaceCreature: "Tiefling",
    element: "Frost",
    attackType: "Debuff",
    effect: "Grants temporary invisibility to the caster",
    type: "spell"
  },
  {
    name: "Cleric Wind Beam",
    classRaceCreature: "Cleric",
    element: "Wind",
    attackType: "Aura",
    effect: "Deals high single-target damage",
    type: "spell"
  },
  {
    name: "Tiefling Holy Shatter",
    classRaceCreature: "Tiefling",
    element: "Holy",
    attackType: "Debuff",
    effect: "Applies a burning effect over time",
    type: "spell"
  },
  {
    name: "Paladin Ash Beam",
    classRaceCreature: "Paladin",
    element: "Ash",
    attackType: "Curse",
    effect: "Deals area-of-effect elemental damage",
    type: "spell"
  },
  {
    name: "Knight Wind Blast",
    classRaceCreature: "Knight",
    element: "Wind",
    attackType: "Aura",
    effect: "Creates a shield that blocks damage",
    type: "spell"
  },
  {
    name: "Wizard Lightning Flame",
    classRaceCreature: "Wizard",
    element: "Lightning",
    attackType: "Heal",
    effect: "Increases the target's physical defense for 3 turns",
    type: "spell"
  },
  {
    name: "Warlock Blood Shatter",
    classRaceCreature: "Warlock",
    element: "Blood",
    attackType: "Melee",
    effect: "Grants temporary invisibility to the caster",
    type: "attack"
  },
  {
    name: "Invoker Arcane Beam",
    classRaceCreature: "Invoker",
    element: "Arcane",
    attackType: "Curse",
    effect: "Increases the target's physical defense for 3 turns",
    type: "spell"
  },
  {
    name: "Warden Blood Wail",
    classRaceCreature: "Warden",
    element: "Blood",
    attackType: "Summon",
    effect: "Slows enemy movement for 2 turns",
    type: "spell"
  },
  {
    name: "Oracle Light Storm",
    classRaceCreature: "Oracle",
    element: "Light",
    attackType: "Debuff",
    effect: "Causes enemies to flee in fear for 1 turn",
    type: "spell"
  },
  {
    name: "Dragon Wind Scream",
    classRaceCreature: "Dragon",
    element: "Wind",
    attackType: "Curse",
    effect: "Increases the target's physical defense for 3 turns",
    type: "spell"
  },
  {
    name: "Elf Crystal Surge",
    classRaceCreature: "Elf",
    element: "Crystal",
    attackType: "Buff",
    effect: "Summons a creature to fight for you",
    type: "spell"
  },
  {
    name: "Sorcerer Fire Strike",
    classRaceCreature: "Sorcerer",
    element: "Fire",
    attackType: "Curse",
    effect: "Summons a creature to fight for you",
  },
  {
    name: "Dragon Holy Nova",
    classRaceCreature: "Dragon",
    element: "Holy",
    attackType: "Trap",
    effect: "Deals high single-target damage",
  },
  {
    name: "Champion Shadow Shatter",
    classRaceCreature: "Champion",
    element: "Shadow",
    attackType: "Buff",
    effect: "Creates a shield that blocks damage",
  },
  {
    name: "Warlock Ash Pulse",
    classRaceCreature: "Warlock",
    element: "Ash",
    attackType: "Ranged",
    effect: "Slows enemy movement for 2 turns",
  },
  {
    name: "Halfling Ice Blast",
    classRaceCreature: "Halfling",
    element: "Ice",
    attackType: "Buff",
    effect: "Poisons the target, dealing damage over time",
  },
  {
    name: "Mystic Poison Flame",
    classRaceCreature: "Mystic",
    element: "Poison",
    attackType: "Trap",
    effect: "Creates a shield that blocks damage",
  },
  {
    name: "Pyromancer Earth Touch",
    classRaceCreature: "Pyromancer",
    element: "Earth",
    attackType: "Debuff",
    effect: "Slows enemy movement for 2 turns",
  },
  {
    name: "Halfling Light Touch",
    classRaceCreature: "Halfling",
    element: "Light",
    attackType: "Buff",
    effect: "Deals area-of-effect elemental damage",
  },
  {
    name: "Seer Blood Surge",
    classRaceCreature: "Seer",
    element: "Blood",
    attackType: "Aura",
    effect: "Increases the target's physical defense for 3 turns",
  },
  {
    name: "Rogue Radiant Pulse",
    classRaceCreature: "Rogue",
    element: "Radiant",
    attackType: "Aura",
    effect: "Increases the target's physical defense for 3 turns",
  },
  {
    name: "Barbarian Holy Blast",
    classRaceCreature: "Barbarian",
    element: "Holy",
    attackType: "Heal",
    effect: "Increases the target's physical defense for 3 turns",
  },
  {
    name: "Elf Blood Flame",
    classRaceCreature: "Elf",
    element: "Blood",
    attackType: "Trap",
    effect: "Stuns enemies in a small radius",
  },
  {
    name: "Warlock Wind Blast",
    classRaceCreature: "Warlock",
    element: "Wind",
    attackType: "Summon",
    effect: "Stuns enemies in a small radius",
  },
  {
    name: "Dwarf Holy Strike",
    classRaceCreature: "Dwarf",
    element: "Holy",
    attackType: "Spell",
    effect: "Grants temporary invisibility to the caster",
  },
  {
    name: "Necromancer Holy Touch",
    classRaceCreature: "Necromancer",
    element: "Holy",
    attackType: "Ranged",
    effect: "Causes enemies to flee in fear for 1 turn",
  },
  {
    name: "Knight Ash Beam",
    classRaceCreature: "Knight",
    element: "Ash",
    attackType: "Heal",
    effect: "Reflects a portion of incoming damage",
  },
  {
    name: "Dragonborn Blood Surge",
    classRaceCreature: "Dragonborn",
    element: "Blood",
    attackType: "Debuff",
    effect: "Freezes the enemy, preventing movement for 1 turn",
  },
  {
    name: "Human Solar Wrath",
    classRaceCreature: "Human",
    element: "Solar",
    attackType: "Curse",
    effect: "Deals area-of-effect elemental damage",
  },
  {
    name: "Dragon Earth Blast",
    classRaceCreature: "Dragon",
    element: "Earth",
    attackType: "Ranged",
    effect: "Stuns enemies in a small radius",
  },
  {
    name: "Knight Plague Wail",
    classRaceCreature: "Knight",
    element: "Plague",
    attackType: "Buff",
    effect: "Freezes the enemy, preventing movement for 1 turn",
  },
  {
    name: "Warden Earth Flame",
    classRaceCreature: "Warden",
    element: "Earth",
    attackType: "Debuff",
    effect: "Deals area-of-effect elemental damage",
  },
  {
    name: "Human Solar Touch",
    classRaceCreature: "Human",
    element: "Solar",
    attackType: "Trap",
    effect: "Causes enemies to flee in fear for 1 turn",
  },
  {
    name: "Dragonborn Holy Nova",
    classRaceCreature: "Dragonborn",
    element: "Holy",
    attackType: "Curse",
    effect: "Summons a creature to fight for you",
  },
  {
    name: "Rogue Plague Pierce",
    classRaceCreature: "Rogue",
    element: "Plague",
    attackType: "Heal",
    effect: "Heals allies in a moderate radius",
  },
  {
    name: "Paladin Light Beam",
    classRaceCreature: "Paladin",
    element: "Light",
    attackType: "Heal",
    effect: "Applies a burning effect over time",
  },
  {
    name: "Fighter Holy Wail",
    classRaceCreature: "Fighter",
    element: "Holy",
    attackType: "Aura",
    effect: "Applies a burning effect over time",
  },
  {
    name: "Seer Wind Storm",
    classRaceCreature: "Seer",
    element: "Wind",
    attackType: "Spell",
    effect: "Applies a burning effect over time",
  },
  {
    name: "Seer Steel Surge",
    classRaceCreature: "Seer",
    element: "Steel",
    attackType: "Summon",
    effect: "Slows enemy movement for 2 turns",
  },
  {
    name: "Oracle Fire Flame",
    classRaceCreature: "Oracle",
    element: "Fire",
    attackType: "Debuff",
    effect: "Stuns enemies in a small radius",
  },
  {
    name: "Cleric Ice Surge",
    classRaceCreature: "Cleric",
    element: "Ice",
    attackType: "Heal",
    effect: "Deals high single-target damage",
  },
  {
    name: "Gnome Earth Flame",
    classRaceCreature: "Gnome",
    element: "Earth",
    attackType: "Ranged",
    effect: "Applies a burning effect over time",
  },
  {
    name: "Goblin Crystal Wrath",
    classRaceCreature: "Goblin",
    element: "Crystal",
    attackType: "Buff",
    effect: "Increases the target's physical defense for 3 turns",
  },
  {
    name: "Sorcerer Holy Barrage",
    classRaceCreature: "Sorcerer",
    element: "Holy",
    attackType: "Melee",
    effect: "Heals allies in a moderate radius",
  },
  {
    name: "Hunter Solar Pulse",
    classRaceCreature: "Hunter",
    element: "Solar",
    attackType: "Melee",
    effect: "Grants temporary invisibility to the caster",
  },
  {
    name: "Monk Poison Shatter",
    classRaceCreature: "Monk",
    element: "Poison",
    attackType: "Spell",
    effect: "Deals area-of-effect elemental damage",
  },
  {
    name: "Elf Solar Echo",
    classRaceCreature: "Elf",
    element: "Solar",
    attackType: "Buff",
    effect: "Deals high single-target damage",
  },
  {
    name: "Necromancer Frost Fury",
    classRaceCreature: "Necromancer",
    element: "Frost",
    attackType: "Curse",
    effect: "Creates a shield that blocks damage",
  },
  {
    name: "Giant Ash Fury",
    classRaceCreature: "Giant",
    element: "Ash",
    attackType: "Trap",
    effect: "Freezes the enemy, preventing movement for 1 turn",
  },
  {
    name: "Orc Fire Scream",
    classRaceCreature: "Orc",
    element: "Fire",
    attackType: "Summon",
    effect: "Increases the target's physical defense for 3 turns",
  },
  {
    name: "Witch Necrotic Echo",
    classRaceCreature: "Witch",
    element: "Necrotic",
    attackType: "Aura",
    effect: "Poisons the target, dealing damage over time",
  },
  {
    name: "Barbarian Psychic Flame",
    classRaceCreature: "Barbarian",
    element: "Psychic",
    attackType: "Ranged",
    effect: "Slows enemy movement for 2 turns",
  },
  {
    name: "Wizard Earth Wail",
    classRaceCreature: "Wizard",
    element: "Earth",
    attackType: "Summon",
    effect: "Poisons the target, dealing damage over time",
  },
  {
    name: "Troll Necrotic Grasp",
    classRaceCreature: "Troll",
    element: "Necrotic",
    attackType: "Ranged",
    effect: "Deals high single-target damage",
  },
  {
    name: "Dragon Holy Roar",
    classRaceCreature: "Dragon",
    element: "Holy",
    attackType: "Spell",
    effect: "Stuns enemies in a small radius",
  },
  {
    name: "Druid Fire Slash",
    classRaceCreature: "Druid",
    element: "Fire",
    attackType: "Aura",
    effect: "Creates a shield that blocks damage",
  },
  {
    name: "Dragonborn Frost Scream",
    classRaceCreature: "Dragonborn",
    element: "Frost",
    attackType: "Curse",
    effect: "Creates a shield that blocks damage",
  },
  {
    name: "Witch Holy Storm",
    classRaceCreature: "Witch",
    element: "Holy",
    attackType: "Summon",
    effect: "Deals high single-target damage",
  },
  {
    name: "Bard Arcane Wrath",
    classRaceCreature: "Bard",
    element: "Arcane",
    attackType: "Aura",
    effect: "Poisons the target, dealing damage over time",
  },
  {
    name: "Dwarf Ice Scream",
    classRaceCreature: "Dwarf",
    element: "Ice",
    attackType: "Melee",
    effect: "Slows enemy movement for 2 turns",
  },
  {
    name: "Shaman Solar Touch",
    classRaceCreature: "Shaman",
    element: "Solar",
    attackType: "Spell",
    effect: "Creates a shield that blocks damage",
  },
  {
    name: "Orc Holy Barrage",
    classRaceCreature: "Orc",
    element: "Holy",
    attackType: "Heal",
    effect: "Grants temporary invisibility to the caster",
  },
  {
    name: "Wizard Holy Flame",
    classRaceCreature: "Wizard",
    element: "Holy",
    attackType: "Spell",
    effect: "Stuns enemies in a small radius",
  },
  {
    name: "Orc Light Wrath",
    classRaceCreature: "Orc",
    element: "Light",
    attackType: "Buff",
    effect: "Applies a burning effect over time",
  },
  {
    name: "Knight Blood Blast",
    classRaceCreature: "Knight",
    element: "Blood",
    attackType: "Debuff",
    effect: "Summons a creature to fight for you",
  },
  {
    name: "Undead Light Wrath",
    classRaceCreature: "Undead",
    element: "Light",
    attackType: "Heal",
    effect: "Reflects a portion of incoming damage",
  },
  {
    name: "Rogue Arcane Slash",
    classRaceCreature: "Rogue",
    element: "Arcane",
    attackType: "Melee",
    effect: "Causes enemies to flee in fear for 1 turn",
  },
  {
    name: "Undead Plague Pulse",
    classRaceCreature: "Undead",
    element: "Plague",
    attackType: "Buff",
    effect: "Deals area-of-effect elemental damage",
  },
  {
    name: "Halfling Earth Pulse",
    classRaceCreature: "Halfling",
    element: "Earth",
    attackType: "Heal",
    effect: "Increases the target's physical defense for 3 turns",
  },
  {
    name: "Specter Lightning Roar",
    classRaceCreature: "Specter",
    element: "Lightning",
    attackType: "Ranged",
    effect: "Prevents enemies from casting spells",
  },
  {
    name: "Rogue Lightning Wrath",
    classRaceCreature: "Rogue",
    element: "Lightning",
    attackType: "Spell",
    effect: "Reflects a portion of incoming damage",
  },
  {
    name: "Phantom Fire Barrage",
    classRaceCreature: "Phantom",
    element: "Fire",
    attackType: "Curse",
    effect: "Poisons the target, dealing damage over time",
  },
  {
    name: "Demon Ash Flame",
    classRaceCreature: "Demon",
    element: "Ash",
    attackType: "Heal",
    effect: "Slows enemy movement for 2 turns",
  },
  {
    name: "Necromancer Steel Scream",
    classRaceCreature: "Necromancer",
    element: "Steel",
    attackType: "Melee",
    effect: "Deals high single-target damage",
  },
  {
    name: "Beast Frost Blast",
    classRaceCreature: "Beast",
    element: "Frost",
    attackType: "Heal",
    effect: "Freezes the enemy, preventing movement for 1 turn",
  },
  {
    name: "Goblin Arcane Beam",
    classRaceCreature: "Goblin",
    element: "Arcane",
    attackType: "Summon",
    effect: "Poisons the target, dealing damage over time",
  },
  {
    name: "Mystic Arcane Pierce",
    classRaceCreature: "Mystic",
    element: "Arcane",
    attackType: "Debuff",
    effect: "Deals area-of-effect elemental damage",
  },
  {
    name: "Elemental Frost Scream",
    classRaceCreature: "Elemental",
    element: "Frost",
    attackType: "Trap",
    effect: "Reflects a portion of incoming damage",
  },
  {
    name: "Giant Fire Fury",
    classRaceCreature: "Giant",
    element: "Fire",
    attackType: "Heal",
    effect: "Applies a burning effect over time",
  },
  {
    name: "Oracle Ash Blast",
    classRaceCreature: "Oracle",
    element: "Ash",
    attackType: "Spell",
    effect: "Heals allies in a moderate radius",
  },
  {
    name: "Elf Solar Shatter",
    classRaceCreature: "Elf",
    element: "Solar",
    attackType: "Heal",
    effect: "Deals high single-target damage",
  },
  {
    name: "Barbarian Earth Pulse",
    classRaceCreature: "Barbarian",
    element: "Earth",
    attackType: "Buff",
    effect: "Poisons the target, dealing damage over time",
  },
  {
    name: "Hunter Holy Beam",
    classRaceCreature: "Hunter",
    element: "Holy",
    attackType: "Debuff",
    effect: "Applies a burning effect over time",
  },
  {
    name: "Seer Holy Blast",
    classRaceCreature: "Seer",
    element: "Holy",
    attackType: "Buff",
    effect: "Grants temporary invisibility to the caster",
  },
  {
    name: "Orc Psychic Fury",
    classRaceCreature: "Orc",
    element: "Psychic",
    attackType: "Aura",
    effect: "Creates a shield that blocks damage",
  },
  {
    name: "Demon Poison Flame",
    classRaceCreature: "Demon",
    element: "Poison",
    attackType: "Heal",
    effect: "Freezes the enemy, preventing movement for 1 turn",
  },
  {
    name: "Barbarian Ice Storm",
    classRaceCreature: "Barbarian",
    element: "Ice",
    attackType: "Ranged",
    effect: "Applies a burning effect over time",
  },
  {
    name: "Invoker Earth Pierce",
    classRaceCreature: "Invoker",
    element: "Earth",
    attackType: "Melee",
    effect: "Applies a burning effect over time",
  },
  {
    name: "Orc Ice Barrage",
    classRaceCreature: "Orc",
    element: "Ice",
    attackType: "Buff",
    effect: "Causes enemies to flee in fear for 1 turn",
  },
  {
    name: "Phantom Light Beam",
    classRaceCreature: "Phantom",
    element: "Light",
    attackType: "Curse",
    effect: "Reflects a portion of incoming damage",
  },
  {
    name: "Elf Arcane Scream",
    classRaceCreature: "Elf",
    element: "Arcane",
    attackType: "Spell",
    effect: "Creates a shield that blocks damage",
  },
  {
    name: "Ranger Frost Fury",
    classRaceCreature: "Ranger",
    element: "Frost",
    attackType: "Curse",
    effect: "Summons a creature to fight for you",
  },
  {
    name: "Witch Plague Slash",
    classRaceCreature: "Witch",
    element: "Plague",
    attackType: "Heal",
    effect: "Creates a shield that blocks damage",
  },
  {
    name: "Orc Lightning Blast",
    classRaceCreature: "Orc",
    element: "Lightning",
    attackType: "Aura",
    effect: "Deals area-of-effect elemental damage",
  },
  {
    name: "Halfling Plague Wail",
    classRaceCreature: "Halfling",
    element: "Plague",
    attackType: "Curse",
    effect: "Deals high single-target damage",
  },
  {
    name: "Halfling Lightning Beam",
    classRaceCreature: "Halfling",
    element: "Lightning",
    attackType: "Melee",
    effect: "Freezes the enemy, preventing movement for 1 turn",
  },
  {
    name: "Orc Plague Slash",
    classRaceCreature: "Orc",
    element: "Plague",
    attackType: "Summon",
    effect: "Prevents enemies from casting spells",
  },
];
