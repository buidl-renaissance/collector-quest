/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('campaign_quests', table => {
    table.uuid('id').primary();
    table.uuid('campaign_id').references('id').inTable('campaigns').onDelete('CASCADE').notNullable();
    table.uuid('quest_id').references('id').inTable('quests').onDelete('CASCADE').notNullable();
    table.enu('status', ['not_started', 'in_progress', 'completed', 'failed']).defaultTo('not_started');
    table.timestamp('start_date');
    table.timestamp('end_date');
    table.timestamps(true, true);
    table.index('campaign_id');
    table.index('quest_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('campaign_quests');
}; 

/**
 * MySQL equivalent:
  
  CREATE TABLE campaign_quests (
    id CHAR(36) PRIMARY KEY,
    campaign_id CHAR(36) NOT NULL,
    quest_id CHAR(36) NOT NULL,
    status ENUM('not_started', 'in_progress', 'completed', 'failed') DEFAULT 'not_started',
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE,
    INDEX (campaign_id),
    INDEX (quest_id)
  );
 */
