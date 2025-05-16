import { getClassById } from "@/db/classes";

export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  abilities: CharacterClassAbility[];
  image: string;
  isActive?: boolean;
}

export const getCharacterClassById = async (id: string): Promise<CharacterClass | undefined> => {
  const characterClass = await getClassById(id);
  if (characterClass) {
    return characterClass;
  }
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
    id: "werewolf",
    name: "Werewolf",
    description: "Werewolves are a type of werebeast that can transform into a wolf or a humanoid form.",
    abilities: [
      { name: "Lycanthropy", description: "You can use your action to transform into a wolf-like creature. While transformed, you gain enhanced strength, speed, and senses. The transformation lasts until you choose to revert to your normal form.", level: 1 },
      { name: "Regeneration", description: "At the start of each of your turns, you regain hit points equal to your Constitution modifier (minimum of 1) if you have at least 1 hit point remaining.", level: 1 },
      { name: "Heightened Senses", description: "You have advantage on Wisdom (Perception) checks that rely on hearing or smell, and you can track creatures by scent alone.", level: 1 }
    ],
    image: "/images/classes/paladin.jpg"
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



/**
 * MySQL insert query for character classes
 * This can be run in a MySQL client to populate the classes table
 */
export const characterClassesInsertQuery = `
INSERT INTO classes (id, name, description, abilities, image, created_at, updated_at)
VALUES
  ('barbarian', 'Barbarian', 'Rage-fueled warriors of primal power.', 
   JSON_ARRAY(
     JSON_OBJECT('name', 'Rage', 'description', 'When you rage, you gain +1 to your Strength modifier and can''t be charmed or frightened.', 'level', 1),
     JSON_OBJECT('name', 'Unarmored Defense', 'description', 'While you are not wearing any armor, your AC is 10 + your Constitution modifier.', 'level', 1),
     JSON_OBJECT('name', 'Reckless Attack', 'description', 'When you make an attack with a melee weapon or a natural weapon, you can choose to attack recklessly. If you do, you gain advantage on the attack roll and do not add your Strength modifier to the damage roll.', 'level', 1)
   ), 
   '/images/classes/barbarian.jpg', NOW(), NOW()),
  
  ('bard', 'Bard', 'Magic-wielding performers and jack-of-all-trades.', 
   JSON_ARRAY(
     JSON_OBJECT('name', 'Bardic Inspiration', 'description', 'You can use your action to give a one-time bonus to the next ability check you make. The bonus is 1d4 + your Charisma modifier, and it lasts until the start of your next turn.', 'level', 1),
     JSON_OBJECT('name', 'Spellcasting', 'description', 'You can cast spells. You have a spellcasting ability, which is Charisma for you. Your spellcasting ability is Charisma. You can use your action to cast a spell from your spellbook. You can cast a spell at a higher level if you have the spell prepared.', 'level', 1),
     JSON_OBJECT('name', 'Jack of All Trades', 'description', 'You can add half your proficiency bonus, rounded down, to the ability checks of any skills in which you have proficiency.', 'level', 1)
   ), 
   '/images/classes/bard.jpg', NOW(), NOW()),
  
  ('cleric', 'Cleric', 'Divine spellcasters who serve a deity.', 
   JSON_ARRAY(
     JSON_OBJECT('name', 'Divine Domain', 'description', 'You choose a domain that grants you special abilities and spells.', 'level', 1),
     JSON_OBJECT('name', 'Spellcasting', 'description', 'You can cast spells. You have a spellcasting ability, which is Wisdom for you.', 'level', 1),
     JSON_OBJECT('name', 'Channel Divinity', 'description', 'You can channel divine energy to fuel magical effects.', 'level', 1)
   ), 
   '/images/classes/cleric.jpg', NOW(), NOW()),
  
  ('druid', 'Druid', 'Guardians of nature with shape-shifting powers.', 
   JSON_ARRAY(
     JSON_OBJECT('name', 'Wild Shape', 'description', 'You can use your action to magically assume the shape of a beast that you have seen before.', 'level', 1),
     JSON_OBJECT('name', 'Spellcasting', 'description', 'You can cast spells. You have a spellcasting ability, which is Wisdom for you.', 'level', 1),
     JSON_OBJECT('name', 'Druidic', 'description', 'You know Druidic, the secret language of druids.', 'level', 1)
   ), 
   '/images/classes/druid.jpg', NOW(), NOW()),
  
  ('fighter', 'Fighter', 'Master of weapons, tactics, and martial prowess.', 
   JSON_ARRAY(
     JSON_OBJECT('name', 'Fighting Style', 'description', 'You adopt a particular style of fighting as your specialty.', 'level', 1),
     JSON_OBJECT('name', 'Second Wind', 'description', 'You have a limited well of stamina that you can draw on to protect yourself from harm.', 'level', 1),
     JSON_OBJECT('name', 'Action Surge', 'description', 'You can push yourself beyond your normal limits for a moment.', 'level', 1)
   ), 
   '/images/classes/fighter.jpg', NOW(), NOW()),
  
  ('werewolf', 'Werewolf', 'Werewolves are a type of werebeast that can transform into a wolf or a humanoid form.', 
   JSON_ARRAY(
     JSON_OBJECT('name', 'Lycanthropy', 'description', 'You can use your action to transform into a wolf-like creature. While transformed, you gain enhanced strength, speed, and senses. The transformation lasts until you choose to revert to your normal form.', 'level', 1),
     JSON_OBJECT('name', 'Regeneration', 'description', 'At the start of each of your turns, you regain hit points equal to your Constitution modifier (minimum of 1) if you have at least 1 hit point remaining.', 'level', 1),
     JSON_OBJECT('name', 'Heightened Senses', 'description', 'You have advantage on Wisdom (Perception) checks that rely on hearing or smell, and you can track creatures by scent alone.', 'level', 1)
   ), 
   '/images/classes/paladin.jpg', NOW(), NOW()),
  
  ('monk', 'Monk', 'Martial artists channeling ki for powerful strikes.', 
   JSON_ARRAY(
     JSON_OBJECT('name', 'Martial Arts', 'description', 'You can use your action to make a melee attack with your unarmed strike as a bonus action.', 'level', 1),
     JSON_OBJECT('name', 'Ki', 'description', 'You can harness the mystic energy of ki to power special abilities.', 'level', 1),
     JSON_OBJECT('name', 'Unarmored Movement', 'description', 'Your speed increases by 10 feet while you are not wearing armor or wielding a shield.', 'level', 1)
   ), 
   '/images/classes/monk.jpg', NOW(), NOW()),
  
  ('paladin', 'Paladin', 'Holy warriors bound by an oath.', 
   JSON_ARRAY(
     JSON_OBJECT('name', 'Divine Sense', 'description', 'You can detect the presence of celestial, fiend, or undead creatures.', 'level', 1),
     JSON_OBJECT('name', 'Lay on Hands', 'description', 'You can restore a total number of hit points equal to your paladin level × 5.', 'level', 1),
     JSON_OBJECT('name', 'Divine Smite', 'description', 'When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage.', 'level', 1)
   ), 
   '/images/classes/paladin.jpg', NOW(), NOW()),
  
  ('ranger', 'Ranger', 'Hunters and trackers skilled in the wild.', 
   JSON_ARRAY(
     JSON_OBJECT('name', 'Favored Enemy', 'description', 'You have advantage on Wisdom (Survival) checks to track your favored enemies.', 'level', 1),
     JSON_OBJECT('name', 'Natural Explorer', 'description', 'You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions.', 'level', 1),
     JSON_OBJECT('name', 'Hunter''s Mark', 'description', 'You can use your action to gain a +5 bonus to the Survival skill check you make to track a creature or find a path through natural terrain.', 'level', 1)
   ), 
   '/images/classes/ranger.jpg', NOW(), NOW()),
  
  ('rogue', 'Rogue', 'Stealthy and cunning specialists in precision.', 
   JSON_ARRAY(
     JSON_OBJECT('name', 'Sneak Attack', 'description', 'You can use your action to make a melee attack with your unarmed strike as a bonus action.', 'level', 1),
     JSON_OBJECT('name', 'Thieves'' Tools', 'description', 'You can use your action to make a melee attack with your unarmed strike as a bonus action.', 'level', 1),
     JSON_OBJECT('name', 'Evasion', 'description', 'You can use your action to dodge out of the way of an attack. When you do, you gain a +5 bonus to your AC and you can''t be tripped.', 'level', 1)
   ), 
   '/images/classes/rogue.jpg', NOW(), NOW()),
  
  ('sorcerer', 'Sorcerer', 'Natural spellcasters with innate magic.', 
   JSON_ARRAY(
     JSON_OBJECT('name', 'Innate Spellcasting', 'description', 'You can cast spells. You have a spellcasting ability, which is Charisma for you. Your spellcasting ability is Charisma. You can use your action to cast a spell from your spellbook. You can cast a spell at a higher level if you have the spell prepared.', 'level', 1),
     JSON_OBJECT('name', 'Sorcery Points', 'description', 'You can use your action to unleash a burst of energy. When you do, each creature within 10 feet of you must make a Dexterity saving throw. A creature takes 3d10 force damage on a failed save, or half as much damage on a successful one.', 'level', 1),
     JSON_OBJECT('name', 'Metamagic', 'description', 'You can use your action to gain a +5 bonus to the Survival skill check you make to track a creature or find a path through natural terrain.', 'level', 1)
   ), 
   '/images/classes/sorcerer.jpg', NOW(), NOW()),
  
  ('warlock', 'Warlock', 'Magic users empowered by a pact with a powerful entity.', 
   JSON_ARRAY(
     JSON_OBJECT('name', 'Eldritch Invocations', 'description', 'You can use your action to unleash a burst of energy. When you do, each creature within 10 feet of you must make a Dexterity saving throw. A creature takes 3d10 force damage on a failed save, or half as much damage on a successful one.', 'level', 1),
     JSON_OBJECT('name', 'Pact Magic', 'description', 'You can cast spells. You have a spellcasting ability, which is Charisma for you. Your spellcasting ability is Charisma. You can use your action to cast a spell from your spellbook. You can cast a spell at a higher level if you have the spell prepared.', 'level', 1),
     JSON_OBJECT('name', 'Otherworldly Patron', 'description', 'You can use your action to gain a +5 bonus to the Survival skill check you make to track a creature or find a path through natural terrain.', 'level', 1)
   ), 
   '/images/classes/warlock.jpg', NOW(), NOW()),
  
  ('wizard', 'Wizard', 'Scholars of arcane knowledge and spells.', 
   JSON_ARRAY(
     JSON_OBJECT('name', 'Spellcasting', 'description', 'You can cast spells. You have a spellcasting ability, which is Charisma for you. Your spellcasting ability is Charisma. You can use your action to cast a spell from your spellbook. You can cast a spell at a higher level if you have the spell prepared.', 'level', 1),
     JSON_OBJECT('name', 'Arcane Recovery', 'description', 'You can use your action to regain hit points equal to your level.', 'level', 1),
     JSON_OBJECT('name', 'Spellbook', 'description', 'You can use your action to gain a +5 bonus to the Survival skill check you make to track a creature or find a path through natural terrain.', 'level', 1)
   ), 
   '/images/classes/wizard.jpg', NOW(), NOW());
`;
