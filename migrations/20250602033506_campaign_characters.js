/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('campaign_characters', table => {
    table.uuid('id').primary();
    table.uuid('campaign_id').references('id').inTable('campaigns').onDelete('CASCADE').notNullable();
    table.uuid('character_id').references('id').inTable('characters').onDelete('CASCADE').notNullable();
    table.enu('role', ['player', 'npc', 'boss', 'ally', 'owner']).notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Ensure a character can only have one role per campaign
    table.unique(['campaign_id', 'character_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('campaign_characters');
}; 

/**
 * MySQL equivalent:
  
  CREATE TABLE campaign_characters (
    id CHAR(36) PRIMARY KEY,
    campaign_id CHAR(36) NOT NULL,
    character_id CHAR(36) NOT NULL,
    role ENUM('player', 'npc', 'boss', 'ally', 'owner') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    UNIQUE KEY unique_campaign_character (campaign_id, character_id)
  );
 */
