import client from "./client";
import { v4 as uuidv4 } from "uuid";
import { Character, CharacterStatus } from "@/hooks/useCharacter";
import { getClassById } from "./classes";
import { getRaceById } from "./races";

export class CharacterDB {
  async createCharacter(character: Character): Promise<string> {
    const id = uuidv4();

    await client("characters").insert({
      id,
      name: character.name,
      status: CharacterStatus.NEW,
      race: character.race?.id,
      class: character.class?.id,
      level: character.level || 1,
      traits: character.traits ? JSON.stringify(character.traits) : null,
      motivation: character.motivation,
      bio: character.bio,
      backstory: character.backstory,
      sex: character.sex,
      creature: character.creature,
      image_url: character.image_url,
    });

    return id;
  }

  async getCharacter(id: string): Promise<Character | null> {
    const result = await client("characters").where({ id }).first();

    if (!result) return null;

    const race = await getRaceById(result.race);
    const characterClass = await getClassById(result.class);
    let traits = result.traits;
    if (typeof traits === 'string') {
      traits = JSON.parse(traits);
    }

    let equipment = result.equipment;
    if (typeof equipment === 'string') {
      equipment = JSON.parse(equipment);
    }

    return {
      name: result.name,
      race: race ?? undefined,
      class: characterClass ?? undefined,
      level: result.level,
      traits: traits ?? undefined,
      motivation: result.motivation,
      bio: result.bio,
      backstory: result.backstory,
      sex: result.sex,
      creature: result.creature,
      image_url: result.image_url,
      equipment: equipment ?? undefined,
    };
  }

  async updateCharacter(
    id: string,
    character: Partial<Character>
  ): Promise<boolean> {
    const updateData: Record<string, any> = {};

    if (character.name) updateData.name = character.name;
    if (character.race) updateData.race = character.race.id;
    if (character.class) updateData.class = character.class.id;
    if (character.level) updateData.level = character.level;
    if (character.traits) updateData.traits = JSON.stringify(character.traits);
    if (character.motivation) updateData.motivation = character.motivation;
    if (character.bio) updateData.bio = character.bio;
    if (character.image_url) updateData.image_url = character.image_url;
    if (character.status) updateData.status = character.status;
    if (character.backstory) updateData.backstory = character.backstory;
    if (character.sex) updateData.sex = character.sex;
    if (character.creature) updateData.creature = character.creature;
    if (character.equipment) updateData.equipment = JSON.stringify(character.equipment);

    const count = await client("characters").where({ id }).update(updateData);
    return count > 0;
  }

  async deleteCharacter(id: string): Promise<boolean> {
    const count = await client("characters").where({ id }).delete();
    return count > 0;
  }

  async listCharacters(): Promise<Character[]> {
    const results = await client("characters").select("*");
    return Promise.all(
      results.map(async (result) => {
        const race = result.race ? await getRaceById(result.race) : undefined;
        const characterClass = result.class
          ? await getClassById(result.class)
          : undefined;
        return {
          name: result.name ?? "",
          race: race ?? undefined,
          class: characterClass ?? undefined,
          level: result.level,
          traits: result.traits ? JSON.parse(result.traits) : undefined,
          motivation: result.motivation,
          bio: result.bio,
          backstory: result.backstory,
          sex: result.sex,
          creature: result.creature,
        };
      })
    );
  }
}
