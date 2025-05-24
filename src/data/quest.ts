export interface Quest {
  id: string;
  title: string;
  description: string;
  story: string;
  type: 'exploration' | 'puzzle' | 'collection' | 'mystery' | 'artifact';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  status: 'available' | 'active' | 'completed' | 'locked';
  requirements: {
    level?: number;
    artifacts?: string[]; // artifact IDs required
    relics?: string[]; // relic IDs required
    previousQuests?: string[]; // quest IDs that must be completed first
  };
  rewards: {
    experience: number;
    artifacts?: string[]; // artifact IDs awarded
    relics?: string[]; // relic IDs awarded
    currency?: number;
  };
  objectives: QuestObjective[];
  location?: string;
  estimatedDuration: number; // in minutes
  imageUrl?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'collect' | 'interact' | 'solve' | 'discover' | 'use';
  target?: string; // what needs to be collected/interacted with
  quantity?: number; // how many (for collect objectives)
  completed: boolean;
  hint?: string;
}

export interface QuestProgress {
  questId: string;
  characterId: string;
  status: 'active' | 'completed' | 'failed';
  objectives: {
    objectiveId: string;
    completed: boolean;
    progress?: number; // for objectives with quantity
  }[];
  startedAt: string;
  completedAt?: string;
  created_at: string;
  updated_at: string;
}
