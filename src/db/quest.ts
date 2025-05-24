import client from './client';
import { Quest, QuestObjective, QuestProgress } from '@/data/quest';
import { v4 as uuidv4 } from 'uuid';

export const questDb = {
  // Quest CRUD operations
  async createQuest(quest: Omit<Quest, 'id' | 'created_at' | 'updated_at'>): Promise<Quest> {
    const id = uuidv4();
    const [result] = await client('quests')
      .insert({
        id,
        title: quest.title,
        description: quest.description,
        story: quest.story,
        type: quest.type,
        difficulty: quest.difficulty,
        status: quest.status,
        required_level: quest.requirements.level,
        required_artifacts: JSON.stringify(quest.requirements.artifacts || []),
        required_relics: JSON.stringify(quest.requirements.relics || []),
        required_previous_quests: JSON.stringify(quest.requirements.previousQuests || []),
        reward_experience: quest.rewards.experience,
        reward_artifacts: JSON.stringify(quest.rewards.artifacts || []),
        reward_relics: JSON.stringify(quest.rewards.relics || []),
        reward_currency: quest.rewards.currency,
        location: quest.location,
        estimated_duration: quest.estimatedDuration,
        image_url: quest.imageUrl,
      })
      .returning('*');

    return this.mapQuestFromDb(result);
  },

  async getQuestById(id: string): Promise<Quest | null> {
    const quest = await client('quests').where('id', id).first();
    if (!quest) return null;

    const objectives = await this.getQuestObjectives(id);
    return this.mapQuestFromDb(quest, objectives);
  },

  async getAllQuests(): Promise<Quest[]> {
    const quests = await client('quests').select('*');
    const questsWithObjectives = await Promise.all(
      quests.map(async (quest) => {
        const objectives = await this.getQuestObjectives(quest.id);
        return this.mapQuestFromDb(quest, objectives);
      })
    );
    return questsWithObjectives;
  },

  async getQuestsByType(type: Quest['type']): Promise<Quest[]> {
    const quests = await client('quests').where('type', type);
    const questsWithObjectives = await Promise.all(
      quests.map(async (quest) => {
        const objectives = await this.getQuestObjectives(quest.id);
        return this.mapQuestFromDb(quest, objectives);
      })
    );
    return questsWithObjectives;
  },

  async getQuestsByDifficulty(difficulty: Quest['difficulty']): Promise<Quest[]> {
    const quests = await client('quests').where('difficulty', difficulty);
    const questsWithObjectives = await Promise.all(
      quests.map(async (quest) => {
        const objectives = await this.getQuestObjectives(quest.id);
        return this.mapQuestFromDb(quest, objectives);
      })
    );
    return questsWithObjectives;
  },

  async updateQuest(id: string, updates: Partial<Quest>): Promise<Quest | null> {
    const updateData: any = {};
    
    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.story) updateData.story = updates.story;
    if (updates.type) updateData.type = updates.type;
    if (updates.difficulty) updateData.difficulty = updates.difficulty;
    if (updates.status) updateData.status = updates.status;
    if (updates.location) updateData.location = updates.location;
    if (updates.estimatedDuration) updateData.estimated_duration = updates.estimatedDuration;
    if (updates.imageUrl) updateData.image_url = updates.imageUrl;
    
    if (updates.requirements) {
      if (updates.requirements.level !== undefined) updateData.required_level = updates.requirements.level;
      if (updates.requirements.artifacts) updateData.required_artifacts = JSON.stringify(updates.requirements.artifacts);
      if (updates.requirements.relics) updateData.required_relics = JSON.stringify(updates.requirements.relics);
      if (updates.requirements.previousQuests) updateData.required_previous_quests = JSON.stringify(updates.requirements.previousQuests);
    }
    
    if (updates.rewards) {
      if (updates.rewards.experience) updateData.reward_experience = updates.rewards.experience;
      if (updates.rewards.artifacts) updateData.reward_artifacts = JSON.stringify(updates.rewards.artifacts);
      if (updates.rewards.relics) updateData.reward_relics = JSON.stringify(updates.rewards.relics);
      if (updates.rewards.currency !== undefined) updateData.reward_currency = updates.rewards.currency;
    }

    const [result] = await client('quests')
      .where('id', id)
      .update(updateData)
      .returning('*');

    if (!result) return null;

    const objectives = await this.getQuestObjectives(id);
    return this.mapQuestFromDb(result, objectives);
  },

  async deleteQuest(id: string): Promise<boolean> {
    const deleted = await client('quests').where('id', id).del();
    return deleted > 0;
  },

  // Quest Objective operations
  async createQuestObjective(objective: Omit<QuestObjective, 'completed'>): Promise<QuestObjective> {
    const [result] = await client('quest_objectives')
      .insert({
        id: objective.id,
        quest_id: objective.id, // This should be passed separately
        description: objective.description,
        type: objective.type,
        target: objective.target,
        quantity: objective.quantity,
        hint: objective.hint,
      })
      .returning('*');

    return this.mapObjectiveFromDb(result);
  },

  async getQuestObjectives(questId: string): Promise<QuestObjective[]> {
    const objectives = await client('quest_objectives').where('quest_id', questId);
    return objectives.map(this.mapObjectiveFromDb);
  },

  async updateQuestObjective(id: string, updates: Partial<QuestObjective>): Promise<QuestObjective | null> {
    const updateData: any = {};
    
    if (updates.description) updateData.description = updates.description;
    if (updates.type) updateData.type = updates.type;
    if (updates.target) updateData.target = updates.target;
    if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
    if (updates.completed !== undefined) updateData.completed = updates.completed;
    if (updates.hint) updateData.hint = updates.hint;

    const [result] = await client('quest_objectives')
      .where('id', id)
      .update(updateData)
      .returning('*');

    return result ? this.mapObjectiveFromDb(result) : null;
  },

  // Quest Progress operations
  async startQuest(questId: string, characterId: string): Promise<QuestProgress> {
    const quest = await this.getQuestById(questId);
    if (!quest) throw new Error('Quest not found');

    // Create quest progress record
    const [progressResult] = await client('quest_progress')
      .insert({
        quest_id: questId,
        character_id: characterId,
        status: 'active',
        started_at: new Date(),
      })
      .returning('*');

    // Create objective progress records
    const objectiveProgressData = quest.objectives.map(objective => ({
      quest_progress_id: progressResult.id,
      objective_id: objective.id,
      completed: false,
      progress: 0,
    }));

    await client('quest_objective_progress').insert(objectiveProgressData);

    return this.getQuestProgress(questId, characterId);
  },

  async getQuestProgress(questId: string, characterId: string): Promise<QuestProgress> {
    const progress = await client('quest_progress')
      .where('quest_id', questId)
      .where('character_id', characterId)
      .first();

    if (!progress) throw new Error('Quest progress not found');

    const objectiveProgress = await client('quest_objective_progress')
      .join('quest_objectives', 'quest_objective_progress.objective_id', 'quest_objectives.id')
      .where('quest_objective_progress.quest_progress_id', progress.id)
      .select(
        'quest_objective_progress.objective_id',
        'quest_objective_progress.completed',
        'quest_objective_progress.progress'
      );

    return {
      questId: progress.quest_id,
      characterId: progress.character_id,
      status: progress.status,
      objectives: objectiveProgress.map(obj => ({
        objectiveId: obj.objective_id,
        completed: obj.completed,
        progress: obj.progress,
      })),
      startedAt: progress.started_at.toISOString(),
      completedAt: progress.completed_at?.toISOString(),
      created_at: progress.created_at.toISOString(),
      updated_at: progress.updated_at.toISOString(),
    };
  },

  async getCharacterQuests(characterId: string): Promise<QuestProgress[]> {
    const progressRecords = await client('quest_progress')
      .where('character_id', characterId);

    return Promise.all(
      progressRecords.map(progress => 
        this.getQuestProgress(progress.quest_id, characterId)
      )
    );
  },

  async updateObjectiveProgress(
    questId: string, 
    characterId: string, 
    objectiveId: string, 
    progress: number, 
    completed: boolean = false
  ): Promise<void> {
    const questProgress = await client('quest_progress')
      .where('quest_id', questId)
      .where('character_id', characterId)
      .first();

    if (!questProgress) throw new Error('Quest progress not found');

    await client('quest_objective_progress')
      .where('quest_progress_id', questProgress.id)
      .where('objective_id', objectiveId)
      .update({
        progress,
        completed,
      });
  },

  async completeQuest(questId: string, characterId: string): Promise<void> {
    await client('quest_progress')
      .where('quest_id', questId)
      .where('character_id', characterId)
      .update({
        status: 'completed',
        completed_at: new Date(),
      });
  },

  // Helper methods
  mapQuestFromDb(dbQuest: any, objectives: QuestObjective[] = []): Quest {
    return {
      id: dbQuest.id,
      title: dbQuest.title,
      description: dbQuest.description,
      story: dbQuest.story,
      type: dbQuest.type,
      difficulty: dbQuest.difficulty,
      status: dbQuest.status,
      requirements: {
        level: dbQuest.required_level,
        artifacts: dbQuest.required_artifacts ? JSON.parse(dbQuest.required_artifacts) : [],
        relics: dbQuest.required_relics ? JSON.parse(dbQuest.required_relics) : [],
        previousQuests: dbQuest.required_previous_quests ? JSON.parse(dbQuest.required_previous_quests) : [],
      },
      rewards: {
        experience: dbQuest.reward_experience,
        artifacts: dbQuest.reward_artifacts ? JSON.parse(dbQuest.reward_artifacts) : [],
        relics: dbQuest.reward_relics ? JSON.parse(dbQuest.reward_relics) : [],
        currency: dbQuest.reward_currency,
      },
      objectives,
      location: dbQuest.location,
      estimatedDuration: dbQuest.estimated_duration,
      imageUrl: dbQuest.image_url,
      created_at: dbQuest.created_at,
      updated_at: dbQuest.updated_at,
    };
  },

  mapObjectiveFromDb(dbObjective: any): QuestObjective {
    return {
      id: dbObjective.id,
      description: dbObjective.description,
      type: dbObjective.type,
      target: dbObjective.target,
      quantity: dbObjective.quantity,
      completed: dbObjective.completed,
      hint: dbObjective.hint,
    };
  },
};
