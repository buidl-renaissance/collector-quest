/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('characters', (table) => {
      // Add equipment column if it doesn't exist
      table.string('registration_id').nullable();
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.alterTable('characters', (table) => {
      // Remove the equipment column
      table.dropColumn('registration_id');
    });
  };
  