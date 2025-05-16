/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('characters', (table) => {
    // Add equipment column if it doesn't exist
    if (!knex.schema.hasColumn('characters', 'equipment')) {
      table.jsonb('equipment').nullable();
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('characters', (table) => {
    // Remove the equipment column
    table.dropColumn('equipment');
  });
};
