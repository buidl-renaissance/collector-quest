/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('campaigns', table => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.timestamp('startDate').nullable();
    table.timestamp('endDate').nullable();
    table.enu('status', ['active', 'inactive', 'completed']).notNullable();
    table.jsonb('targetAudience').nullable();
    table.jsonb('quests').nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('campaigns');
};
