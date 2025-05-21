import { Attack, attacks } from "@/data/attacks";
import { Character } from "@/data/character";

export async function generateAttacks(character: Character): Promise<Attack[]> {
  // Filter attacks based on character's class and race
  const classAttacks = attacks.filter(
    (attack) => attack.classRaceCreature === character.class?.name
  );
  const raceAttacks = attacks.filter(
    (attack) => attack.classRaceCreature === character.race?.name
  );

  // Combine and deduplicate attacks
  const allAttacks = [...classAttacks, ...raceAttacks];
  const uniqueAttacks = Array.from(
    new Map(allAttacks.map((attack) => [attack.name, attack])).values()
  );

  // Select 3-5 attacks based on character's class
  const numAttacks = Math.min(Math.max(3, uniqueAttacks.length), 5);
  const selectedAttacks = uniqueAttacks
    .sort(() => Math.random() - 0.5)
    .slice(0, numAttacks);

  return selectedAttacks;
} 