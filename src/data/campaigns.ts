import { Character } from "./character";
import { Quest } from "./quest";

export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  status: 'active' | 'inactive' | 'completed';
  targetAudience: string[] | null;
  quests?: CampaignQuest[] | null;
  characters?: CampaignCharacter[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignCharacter {
  id: string;
  campaign_id: string;
  character_id: string;
  role: 'player' | 'npc' | 'boss' | 'ally' | 'owner';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignQuest {
  id: string;
  campaign_id: string;
  quest_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}