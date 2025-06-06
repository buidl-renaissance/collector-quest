import client from "./client";
import { Campaign, CampaignCharacter, CampaignQuest } from "../data/campaigns";
import { Character } from "../data/character";
import { Quest } from "../data/quest";
import { v4 as uuidv4 } from "uuid";
// import { getCharacter } from "@/utils/storage";
import { CharacterDB } from "./character";

const characterDB = new CharacterDB();

interface CampaignDb {
  id: string;
  name: string;
  description: string;
  status: Campaign["status"];
  targetAudience: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CampaignCharacterDb {
  id: string;
  campaign_id: string;
  character_id: string;
  character_name?: string;
  character_image?: string;
  role: CampaignCharacter["role"];
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CampaignQuestDb {
  id: string;
  campaign_id: string;
  quest_id: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  createdAt: string;
  updatedAt: string;
}

function mapCampaignFromDb(campaign: CampaignDb): Campaign {
  return {
    ...campaign,
    targetAudience: campaign.targetAudience ? JSON.parse(campaign.targetAudience) : null,
  };
}

async function mapCampaignCharacterFromDb(campaignChar: CampaignCharacterDb): Promise<CampaignCharacter> {
  const character = await characterDB.getCharacter(campaignChar.character_id);
  return {
    id: campaignChar.id,
    campaign_id: campaignChar.campaign_id,
    character_id: campaignChar.character_id,
    character_name: campaignChar.character_name,
    character_image: campaignChar.character_image,
    role: campaignChar.role,
    isActive: campaignChar.is_active,
    createdAt: campaignChar.createdAt,
    updatedAt: campaignChar.updatedAt,
  };
}

function mapCampaignQuestFromDb(campaignQuest: CampaignQuestDb): CampaignQuest {
  // const quest = await getQuest(campaignQuest.quest_id);
  return {
    id: campaignQuest.id,
    campaign_id: campaignQuest.campaign_id,
    quest_id: campaignQuest.quest_id,
    status: campaignQuest.status as CampaignQuest["status"],
    startDate: campaignQuest.start_date,
    endDate: campaignQuest.end_date,
    createdAt: campaignQuest.createdAt,
    updatedAt: campaignQuest.updatedAt,
  };
}

export async function createCampaign(
  campaign: Omit<
    Campaign,
    | "id"
    | "startDate"
    | "endDate"
    | "characters"
    | "quests"
    | "targetAudience"
    | "createdAt"
    | "updatedAt"
  >,
  ownerId: string,
  characters: { characterId: string; role: CampaignCharacter["role"] }[]
): Promise<Campaign> {
  const id = uuidv4();

  // Insert campaign
  await client("campaigns").insert({
    id,
    name: campaign.name,
    description: campaign.description,
    status: campaign.status,
  });

  // Insert character relationships
  if (characters?.length) {
    const characterResults = await Promise.all(
      characters.map((char) =>
        addCharacterToCampaign(
          id,
          char.characterId!,
          char.role!
        )
      )
    );
  }

  const newCampaign = await getCampaign(id);
  if (!newCampaign) {
    throw new Error("Failed to create campaign");
  }
  return newCampaign;
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const result = await client("campaigns")
    .select("campaigns.*")
    .where("campaigns.id", id)
    .first();

  const campaign = result ? mapCampaignFromDb(result) : null;
  if (!campaign) {
    return null;
  }
  const { characters, quests } = await getCampaignWithRelations(campaign);
  return { ...campaign, characters, quests };
}

export async function updateCampaign(
  id: string,
  campaign: Partial<Campaign>
): Promise<Campaign | null> {
  const [result] = await client("campaigns")
    .where({ id })
    .update(campaign)
    .returning("*");
  return result ? mapCampaignFromDb(result) : null;
}

export async function deleteCampaign(id: string): Promise<boolean> {
  const count = await client("campaigns").where({ id }).delete();
  return count > 0;
}

export async function listCampaigns(characterId: string): Promise<Campaign[]> {
  const results = await client("campaigns")
    .select("campaigns.*")
    .leftJoin(
      "campaign_characters",
      "campaigns.id",
      "campaign_characters.campaign_id"
    )
    .where("campaign_characters.character_id", characterId);
  return results.map(mapCampaignFromDb);
}

export async function getCampaignsByStatus(
  status: Campaign["status"]
): Promise<Campaign[]> {
  const results = await client("campaigns")
    .select("campaigns.*")
    .where("campaigns.status", status);
  return results.map(mapCampaignFromDb);
}

export async function getCampaignWithRelations(campaign: Campaign): Promise<{
  characters: CampaignCharacter[];
  quests: CampaignQuest[];
}> {
  if (!campaign) {
    return {
      characters: [],
      quests: [],
    };
  }

  const characters = await client("campaign_characters")
    .select([
      "campaign_characters.*",
      "characters.name as character_name",
      "characters.image_url as character_image"
    ])
    .join("characters", "campaign_characters.character_id", "characters.id") 
    .where("campaign_characters.campaign_id", campaign.id);

  const quests = await client("campaign_quests")
    .select("campaign_quests.*")
    .where("campaign_quests.campaign_id", campaign.id);

  return {
    characters: await Promise.all(characters.map(mapCampaignCharacterFromDb)),
    quests: quests.map(mapCampaignQuestFromDb),
  };
}

/**
 * Add a character to a campaign
 * @param campaignId - The ID of the campaign to add the character to
 * @param characterId - The ID of the character to add to the campaign
 * @param role - The role of the character in the campaign
 * @returns The campaign character that was added
 */
export async function addCharacterToCampaign(
  campaignId: string,
  characterId: string,
  role: CampaignCharacter["role"]
): Promise<CampaignCharacter | null> {
  const id = uuidv4();
  await client("campaign_characters").insert({
    id,
    campaign_id: campaignId,
    character_id: characterId,
    role,
    is_active: true,
  });

  const campaignCharacter = await client("campaign_characters")
    .select("campaign_characters.*")
    .where("campaign_characters.id", id)
    .first();

  return campaignCharacter
    ? mapCampaignCharacterFromDb(campaignCharacter)
    : null;
}

/**
 * Remove a character from a campaign
 * @param campaignId - The ID of the campaign to remove the character from
 * @param characterId - The ID of the character to remove from the campaign
 * @returns True if the character was removed, false otherwise
 */
export async function removeCharacterFromCampaign(
  campaignId: string,
  characterId: string
): Promise<boolean> {
  const count = await client("campaign_characters")
    .where({ campaign_id: campaignId, character_id: characterId })
    .delete();
  return count > 0;
}

// /**
//  * Get all characters in a campaign
//  * @param campaignId - The ID of the campaign to get the characters for
//  * @returns An array of characters in the campaign
//  */
// export async function getCharactersInCampaign(
//   campaignId: string
// ): Promise<Character[]> {
//   const characters = await client("campaign_characters")
//     .select("campaign_characters.*")
//     .where("campaign_characters.campaign_id", campaignId);
//   return (await Promise.all(characters.map(mapCampaignCharacterFromDb))).map((campaignCharacter) => campaignCharacter.character);
// }

// /**
//  * Get all quests in a campaign
//  * @param campaignId - The ID of the campaign to get the quests for
//  * @returns An array of quests in the campaign
//  */
// export async function getQuestsInCampaign(
//   campaignId: string
// ): Promise<Quest[]> {
//   const quests = await client("campaign_quests")
//     .select("campaign_quests.*")
//     .where("campaign_quests.campaign_id", campaignId);
//   return quests
//     .map(mapCampaignQuestFromDb)
//     .map((campaignQuest) => campaignQuest.quest_id);
// }

/**
 * Add a quest to a campaign
 * @param campaignId - The ID of the campaign to add the quest to
 * @param questId - The ID of the quest to add to the campaign
 * @returns The campaign quest that was added
 */
export async function addQuestToCampaign(
  campaignId: string,
  questId: string
): Promise<CampaignQuest | null> {
  const id = uuidv4();
  const result = await client("campaign_quests").insert({
    id,
    campaign_id: campaignId,
    quest_id: questId,
    status: "not_started",
    start_date: new Date(),
    end_date: null,
  });

  const campaignQuest = await client("campaign_quests")
    .select("campaign_quests.*")
    .where("campaign_quests.id", id)
    .first();

  return campaignQuest ? mapCampaignQuestFromDb(campaignQuest) : null;
}

/**
 * Remove a quest from a campaign
 * @param campaignId - The ID of the campaign to remove the quest from
 * @param questId - The ID of the quest to remove from the campaign
 * @returns True if the quest was removed, false otherwise
 */
export async function removeQuestFromCampaign(
  campaignId: string,
  questId: string
): Promise<boolean> {
  const count = await client("campaign_quests")
    .where({ campaign_id: campaignId, quest_id: questId })
    .delete();
  return count > 0;
}

/**
 * Get a quest from a campaign
 * @param campaignId - The ID of the campaign to get the quest from
 * @param questId - The ID of the quest to get from the campaign
 * @returns The campaign quest that was found
 */
export async function getQuestFromCampaign(
  campaignId: string,
  questId: string
): Promise<CampaignQuest | null> {
  const quest = await client("campaign_quests")
    .select("campaign_quests.*")
    .where("campaign_quests.campaign_id", campaignId)
    .where("campaign_quests.quest_id", questId)
    .first();

  return quest ? mapCampaignQuestFromDb(quest) : null;
}
