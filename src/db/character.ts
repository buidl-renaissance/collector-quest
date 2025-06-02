import client from "./client";
import { v4 as uuidv4 } from "uuid";
import { Character, CharacterStatus, CharacterSheet } from "@/data/character";
import { getClassById } from "./classes";
import { getRaceById } from "./races";
import crypto from "crypto";

export interface CharacterListOptions {
  owner?: string;
  status?: CharacterStatus;
}

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

  async registerCharacter(
    name: string,
    email: string,
    phone: string
  ): Promise<Character | null> {
    const id = uuidv4();

    // Generate verification code
    const verificationCode = crypto.randomBytes(32).toString("hex");
    const verificationCodeExpiration = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ); // 24 hours from now

    // Insert new pre-registration
    await client("characters").insert({
      id,
      name: "",
      real_name: name ?? "",
      email,
      status: "pre_registered",
      phone: phone || null,
      verified: false,
      verification_code: verificationCode,
      verification_code_expiration: verificationCodeExpiration,
    });

    const character = await this.getCharacter(id);

    return character;
  }

  async getCharacter(id: string): Promise<Character | null> {
    const result = await client("characters").where({ id }).first();

    if (!result) return null;

    return mapCharacter(result);
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
    if (character.equipment)
      updateData.equipment = JSON.stringify(character.equipment);
    if (character.sheet) updateData.sheet = JSON.stringify(character.sheet);
    if (character.registration_id)
      updateData.registration_id = character.registration_id;

    const count = await client("characters").where({ id }).update(updateData);
    return count > 0;
  }

  async getCharacterSheet(id: string): Promise<CharacterSheet | null> {
    const result = await client("characters")
      .where({ id })
      .select("sheet")
      .first();
    if (!result) return null;
    return JSON.parse(result.sheet);
  }

  async updateCharacterSheet(
    id: string,
    sheet: CharacterSheet
  ): Promise<boolean> {
    let updateData: CharacterSheet | null = await this.getCharacterSheet(id);
    if (!updateData) {
      updateData = {};
    }

    if (sheet.abilities) updateData.abilities = sheet.abilities;
    if (sheet.abilitiesScores)
      updateData.abilitiesScores = sheet.abilitiesScores;
    if (sheet.skills) updateData.skills = sheet.skills;
    if (sheet.deathSaves) updateData.deathSaves = sheet.deathSaves;
    if (sheet.combat) updateData.combat = sheet.combat;
    if (sheet.featuresAndTraits)
      updateData.featuresAndTraits = sheet.featuresAndTraits;
    if (sheet.proficiencies) updateData.proficiencies = sheet.proficiencies;
    if (sheet.languages) updateData.languages = sheet.languages;

    const count = await client("characters")
      .where({ id })
      .update({
        sheet: JSON.stringify(updateData),
      });
    return count > 0;
  }

  async deleteCharacter(id: string): Promise<boolean> {
    const count = await client("characters").where({ id }).delete();
    return count > 0;
  }

  async listCharacters(options?: CharacterListOptions): Promise<Character[]> {
    const query = client("characters").select("*");
    if (options?.owner) {
      query.where("owner", options.owner);
    }
    if (options?.status) {
      query.where("status", options.status);
    }
    const results = await query;
    return Promise.all(
      results.map(async (result) => {
        return mapCharacter(result);
      })
    );
  }

  async listRegisteredCharacters(): Promise<Character[]> {
    const results = await client("characters")
      .select("*")
      .whereNotNull("registration_id");
      
    return Promise.all(
      results.map(async (result) => {
        return mapCharacter(result);
      })
    );
  }
}

const mapCharacter = async (result: any): Promise<Character> => {
  const race = await getRaceById(result.race);
  const characterClass = await getClassById(result.class);
  let traits = result.traits;
  if (typeof traits === "string") {
    traits = JSON.parse(traits);
  }

  let equipment = result.equipment;
  if (typeof equipment === "string") {
    equipment = JSON.parse(equipment);
  }

  let sheet = result.sheet;
  if (typeof sheet === "string") {
    sheet = JSON.parse(sheet);
  }
  return {
    id: result.id,
    name: result.name,
    race: race ?? null,
    class: characterClass ?? null,
    level: result.level,
    traits: traits ?? null,
    motivation: result.motivation,
    bio: result.bio,
    backstory: result.backstory,
    sex: result.sex,
    creature: result.creature,
    image_url: result.image_url,
    equipment: equipment ?? null,
    sheet: sheet ?? null,
    registration_id: result.registration_id,
  };
};
