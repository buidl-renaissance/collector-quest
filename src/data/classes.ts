export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  abilities: CharacterClassAbility[];
  image: string;
  isActive?: boolean;
}

export const getCharacterClassById = (id: string): CharacterClass | undefined => {
  return characterClasses.find(c => c.id === id);
}

export interface CharacterClassAbility {
  name: string;
  description: string;
  level: number;
}

export const characterClasses: CharacterClass[] = [
  {
    id: "barbarian",
    name: "Barbarian",
    description: "Rage-fueled warriors of primal power.",
    abilities: [
      { name: "Rage", description: "When you rage, you gain +1 to your Strength modifier and can't be charmed or frightened.", level: 1 },
      { name: "Unarmored Defense", description: "While you are not wearing any armor, your AC is 10 + your Constitution modifier.", level: 1 },
      { name: "Reckless Attack", description: "When you make an attack with a melee weapon or a natural weapon, you can choose to attack recklessly. If you do, you gain advantage on the attack roll and do not add your Strength modifier to the damage roll.", level: 1 }
    ],
    image: "/images/classes/barbarian.jpg"
  },
  {
    id: "bard",
    name: "Bard",
    description: "Magic-wielding performers and jack-of-all-trades.",
    abilities: [
      { name: "Bardic Inspiration", description: "You can use your action to give a one-time bonus to the next ability check you make. The bonus is 1d4 + your Charisma modifier, and it lasts until the start of your next turn.", level: 1 },
      { name: "Spellcasting", description: "You can cast spells. You have a spellcasting ability, which is Charisma for you. Your spellcasting ability is Charisma. You can use your action to cast a spell from your spellbook. You can cast a spell at a higher level if you have the spell prepared.", level: 1 },
      { name: "Jack of All Trades", description: "You can add half your proficiency bonus, rounded down, to the ability checks of any skills in which you have proficiency.", level: 1 }
    ],
    image: "/images/classes/bard.jpg"
  },
  {
    id: "cleric",
    name: "Cleric",
    description: "Divine spellcasters who serve a deity.",
    abilities: [
      { name: "Divine Magic", description: "You can cast spells. You have a spellcasting ability, which is Charisma for you. Your spellcasting ability is Charisma. You can use your action to cast a spell from your spellbook. You can cast a spell at a higher level if you have the spell prepared.", level: 1 },
      { name: "Channel Divinity", description: "You can use your action to channel divine energy to unleash a spell-like ability, which is a supernatural power that you can use to cast spells. The list of Channel Divinity spells is found in the Channel Divinity section of the class description.", level: 1 },
      { name: "Healing Touch", description: "You can use your action to touch a creature and provide them with a temporary boost to their health. The creature gains temporary hit points equal to your level.", level: 1 }
    ],
    image: "/images/classes/cleric.jpg"
  },
  {
    id: "druid",
    name: "Druid",
    description: "Guardians of nature with shape-shifting powers.",
    abilities: [
      { name: "Wild Shape", description: "You can use your action to magically assume the shape of a beast that you have seen before. You can use this feature a number of times equal to your Constitution modifier (minimum once). You regain all expended uses when you finish a long rest.", level: 1 },
      { name: "Nature Magic", description: "You can cast spells. You have a spellcasting ability, which is Charisma for you. Your spellcasting ability is Charisma. You can use your action to cast a spell from your spellbook. You can cast a spell at a higher level if you have the spell prepared.", level: 1 },
      { name: "Natural Recovery", description: "You can use your action to regain hit points equal to your level.", level: 1 }
    ],
    image: "/images/classes/druid.jpg"
  },
  {
    id: "fighter",
    name: "Fighter",
    description: "Master of weapons, tactics, and martial prowess.",
    abilities: [
      { name: "Fighting Style", description: "You can use your action to adopt a style of fighting as you gain levels. You can choose a style from the following options: Archery, Defense, Dueling, Great Weapon Fighting, Protection, and Two-Weapon Fighting.", level: 1 },
      { name: "Second Wind", description: "You can use your action to regain hit points equal to your level.", level: 1 },
      { name: "Action Surge", description: "You can use your action to take an extra turn. You can use this feature a number of times equal to your Constitution modifier (minimum once). You regain all expended uses when you finish a long rest.", level: 1 }
    ],
    image: "/images/classes/fighter.jpg"
  },
  {
    id: "monk",
    name: "Monk",
    description: "Martial artists channeling ki for powerful strikes.",
    abilities: [
      { name: "Ki", description: "You can use your action to unleash a burst of energy. When you do, each creature within 10 feet of you must make a Dexterity saving throw. A creature takes 3d10 force damage on a failed save, or half as much damage on a successful one.", level: 1 },
      { name: "Unarmored Movement", description: "You can move through the space of any creature that you hit with an unarmed strike (but not a natural weapon).", level: 1 },
      { name: "Flurry of Blows", description: "You can use your action to make a melee attack with your unarmed strike as a bonus action.", level: 1 }
    ],
    image: "/images/classes/monk.jpg"
  },
  {
    id: "paladin",
    name: "Paladin",
    description: "Holy warriors bound by an oath.",
    abilities: [
      { name: "Divine Smite", description: "You can use your action to unleash a burst of energy. When you do, each creature within 10 feet of you must make a Dexterity saving throw. A creature takes 3d10 force damage on a failed save, or half as much damage on a successful one.", level: 1 },
      { name: "Lay on Hands", description: "You can use your action to touch a creature and provide them with a temporary boost to their health. The creature gains temporary hit points equal to your level.", level: 1 },
      { name: "Divine Sense", description: "You can use your action to gain a supernatural ability to detect evil. You can use this feature a number of times equal to your Constitution modifier (minimum once). You regain all expended uses when you finish a long rest.", level: 1 }
    ],
    image: "/images/classes/paladin.jpg"
  },
  {
    id: "ranger",
    name: "Ranger",
    description: "Hunters and trackers skilled in the wild.",
    abilities: [
      { name: "Natural Explorer", description: "You can use your action to gain a +5 bonus to the Survival skill check you make to track a creature or find a path through natural terrain.", level: 1 },
      { name: "Favored Enemy", description: "You have advantage on Wisdom (Perception) checks to detect and track a creature that you have marked.", level: 1 },
      { name: "Hunter's Mark", description: "You can use your action to mark a creature. A creature that you mark gains disadvantage on Stealth checks made to hide from you.", level: 1 }
    ],
    image: "/images/classes/ranger.jpg"
  },
  {
    id: "rogue",
    name: "Rogue",
    description: "Stealthy and cunning specialists in precision.",
    abilities: [
      { name: "Sneak Attack", description: "You can use your action to make a melee attack with your unarmed strike as a bonus action.", level: 1 },
      { name: "Thieves' Tools", description: "You can use your action to make a melee attack with your unarmed strike as a bonus action.", level: 1 },
      { name: "Evasion", description: "You can use your action to dodge out of the way of an attack. When you do, you gain a +5 bonus to your AC and you can't be tripped.", level: 1 }
    ],
    image: "/images/classes/rogue.jpg"
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    description: "Natural spellcasters with innate magic.",
    abilities: [
      { name: "Innate Spellcasting", description: "You can cast spells. You have a spellcasting ability, which is Charisma for you. Your spellcasting ability is Charisma. You can use your action to cast a spell from your spellbook. You can cast a spell at a higher level if you have the spell prepared.", level: 1 },
      { name: "Sorcery Points", description: "You can use your action to unleash a burst of energy. When you do, each creature within 10 feet of you must make a Dexterity saving throw. A creature takes 3d10 force damage on a failed save, or half as much damage on a successful one.", level: 1 },
      { name: "Metamagic", description: "You can use your action to gain a +5 bonus to the Survival skill check you make to track a creature or find a path through natural terrain.", level: 1 }
    ],
    image: "/images/classes/sorcerer.jpg"
  },
  {
    id: "warlock",
    name: "Warlock",
    description: "Magic users empowered by a pact with a powerful entity.",
    abilities: [
      { name: "Eldritch Invocations", description: "You can use your action to unleash a burst of energy. When you do, each creature within 10 feet of you must make a Dexterity saving throw. A creature takes 3d10 force damage on a failed save, or half as much damage on a successful one.", level: 1 },
      { name: "Pact Magic", description: "You can cast spells. You have a spellcasting ability, which is Charisma for you. Your spellcasting ability is Charisma. You can use your action to cast a spell from your spellbook. You can cast a spell at a higher level if you have the spell prepared.", level: 1 },
      { name: "Otherworldly Patron", description: "You can use your action to gain a +5 bonus to the Survival skill check you make to track a creature or find a path through natural terrain.", level: 1 }
    ],
    image: "/images/classes/warlock.jpg"
  },
  {
    id: "wizard",
    name: "Wizard",
    description: "Scholars of arcane knowledge and spells.",
    abilities: [
      { name: "Spellcasting", description: "You can cast spells. You have a spellcasting ability, which is Charisma for you. Your spellcasting ability is Charisma. You can use your action to cast a spell from your spellbook. You can cast a spell at a higher level if you have the spell prepared.", level: 1 },
      { name: "Arcane Recovery", description: "You can use your action to regain hit points equal to your level.", level: 1 },
      { name: "Spellbook", description: "You can use your action to gain a +5 bonus to the Survival skill check you make to track a creature or find a path through natural terrain.", level: 1 }
    ],
    image: "/images/classes/wizard.jpg"
  }
];
