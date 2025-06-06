/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('items', table => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('objectId');
    table.string('owner');
    table.text('description');
    table.string('imageUrl');
    table.boolean('isActive').defaultTo(true);
    table.jsonb('attributes');
    table.jsonb('properties');
    table.integer('quantity').defaultTo(1);
    table.text('lore');
    table.string('type');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('items');
};
