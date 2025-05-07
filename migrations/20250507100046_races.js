/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('races', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('source').notNullable();
    table.text('image');
    table.text('description');
    table.text('accessory');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('races');
};

