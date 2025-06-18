/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('locales', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.string('imageUrl');
    table.boolean('isRealWorld').defaultTo(false);
    table.string('type').notNullable();
    table.jsonb('grid');
    table.jsonb('geoLocation');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('locales');
};
