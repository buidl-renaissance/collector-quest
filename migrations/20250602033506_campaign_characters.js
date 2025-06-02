/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('campaign_characters', table => {
    table.uuid('id').primary();
    table.uuid('campaign_id').references('id').inTable('campaigns').onDelete('CASCADE').notNullable();
    table.uuid('character_id').references('id').inTable('characters').onDelete('CASCADE').notNullable();
    table.enu('role', ['player', 'npc', 'boss', 'ally']).notNullable();
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