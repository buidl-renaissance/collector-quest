/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('quests', function(table) {
      table.string('id').primary();
      table.string('title').notNullable();
      table.text('description').notNullable();
      table.text('story').notNullable();
      table.enum('type', ['exploration', 'puzzle', 'collection', 'mystery', 'artifact']).notNullable();
      table.enum('difficulty', ['easy', 'medium', 'hard', 'epic']).notNullable();
      table.enum('status', ['available', 'active', 'completed', 'locked']).notNullable().defaultTo('available');
      table.integer('required_level');
      table.json('required_artifacts'); // array of artifact IDs
      table.json('required_relics'); // array of relic IDs
      table.json('required_previous_quests'); // array of quest IDs
      table.integer('reward_experience').notNullable();
      table.json('reward_artifacts'); // array of artifact IDs
      table.json('reward_relics'); // array of relic IDs
      table.integer('reward_currency');
      table.string('location');
      table.integer('estimated_duration').notNullable(); // in minutes
      table.string('image_url');
      table.timestamps(true, true);
    })
    .createTable('quest_objectives', function(table) {
      table.string('id').primary();
      table.string('quest_id').notNullable().references('id').inTable('quests').onDelete('CASCADE');
      table.text('description').notNullable();
      table.enum('type', ['collect', 'interact', 'solve', 'discover', 'use']).notNullable();
      table.string('target');
      table.integer('quantity');
      table.boolean('completed').notNullable().defaultTo(false);
      table.text('hint');
      table.timestamps(true, true);
    })
    .createTable('quest_progress', function(table) {
      table.increments('id').primary();
      table.string('quest_id').notNullable().references('id').inTable('quests').onDelete('CASCADE');
      table.string('character_id').notNullable();
      table.enum('status', ['active', 'completed', 'failed']).notNullable();
      table.timestamp('started_at').notNullable();
      table.timestamp('completed_at');
      table.timestamps(true, true);
      table.unique(['quest_id', 'character_id']);
    })
    .createTable('quest_objective_progress', function(table) {
      table.increments('id').primary();
      table.integer('quest_progress_id').notNullable().references('id').inTable('quest_progress').onDelete('CASCADE');
      table.string('objective_id').notNullable().references('id').inTable('quest_objectives').onDelete('CASCADE');
      table.boolean('completed').notNullable().defaultTo(false);
      table.integer('progress');
      table.timestamps(true, true);
      table.unique(['quest_progress_id', 'objective_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('quest_objective_progress')
    .dropTableIfExists('quest_progress')
    .dropTableIfExists('quest_objectives')
    .dropTableIfExists('quests');
};
