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


//  MySQL equivalent CREATE TABLE statements:

//  CREATE TABLE quests (
//    id VARCHAR(255) PRIMARY KEY,
//    title VARCHAR(255) NOT NULL,
//    description TEXT NOT NULL,
//    story TEXT NOT NULL,
//    type ENUM('exploration', 'puzzle', 'collection', 'mystery', 'artifact') NOT NULL,
//    difficulty ENUM('easy', 'medium', 'hard', 'epic') NOT NULL,
//    status ENUM('available', 'active', 'completed', 'locked') NOT NULL DEFAULT 'available',
//    required_level INT,
//    required_artifacts JSON,
//    required_relics JSON,
//    required_previous_quests JSON,
//    reward_experience INT NOT NULL,
//    reward_artifacts JSON,
//    reward_relics JSON,
//    reward_currency INT,
//    location VARCHAR(255),
//    estimated_duration INT NOT NULL,
//    image_url VARCHAR(255),
//    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//  );

//  CREATE TABLE quest_objectives (
//    id VARCHAR(255) PRIMARY KEY,
//    quest_id VARCHAR(255) NOT NULL,
//    description TEXT NOT NULL,
//    type ENUM('collect', 'interact', 'solve', 'discover', 'use') NOT NULL,
//    target VARCHAR(255),
//    quantity INT,
//    completed BOOLEAN NOT NULL DEFAULT FALSE,
//    hint TEXT,
//    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
//  );

//  CREATE TABLE quest_progress (
//    id INT AUTO_INCREMENT PRIMARY KEY,
//    quest_id VARCHAR(255) NOT NULL,
//    character_id VARCHAR(255) NOT NULL,
//    status ENUM('active', 'completed', 'failed') NOT NULL,
//    started_at TIMESTAMP NOT NULL,
//    completed_at TIMESTAMP NULL,
//    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//    UNIQUE KEY unique_quest_character (quest_id, character_id),
//    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
//  );

//  CREATE TABLE quest_objective_progress (
//    id INT AUTO_INCREMENT PRIMARY KEY,
//    quest_progress_id INT NOT NULL,
//    objective_id VARCHAR(255) NOT NULL,
//    completed BOOLEAN NOT NULL DEFAULT FALSE,
//    progress INT,
//    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//    UNIQUE KEY unique_progress_objective (quest_progress_id, objective_id),
//    FOREIGN KEY (quest_progress_id) REFERENCES quest_progress(id) ON DELETE CASCADE,
//    FOREIGN KEY (objective_id) REFERENCES quest_objectives(id) ON DELETE CASCADE
//  );

