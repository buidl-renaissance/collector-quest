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