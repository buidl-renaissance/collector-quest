/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('generation_results', (table) => {
    table.string('id').primary();
    table.string('event_name').notNullable();
    table.string('event_id');
    table.enum('status', ['pending', 'complete', 'error']).notNullable();
    table.string('step');
    table.text('message');
    table.text('result');
    table.text('error');
    table.string('object_type').notNullable();
    table.string('object_id').notNullable();
    table.string('object_key').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('generation_results');
};
