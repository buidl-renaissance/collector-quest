import { Character } from "./character";
import { Quest } from "./quest";

export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'completed';
  targetAudience: string[];
  quests: CampaignQuest[];
  characters: CampaignCharacter[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignCharacter {
  id: string;
  campaign: Campaign;
  character: Character;
  role: 'player' | 'npc' | 'boss' | 'ally';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignQuest {
  id: string;
  campaign: Campaign;
  quest: Quest;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}