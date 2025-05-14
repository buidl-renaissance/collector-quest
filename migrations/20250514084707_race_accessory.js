/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('races', (table) => {
    // Add accessory column if it doesn't exist
    if (!knex.schema.hasColumn('races', 'accessory')) {
      table.json('accessory').nullable();
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('races', (table) => {
    // Remove the accessory column
    table.dropColumn('accessory');
  });
};
