/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('characters', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('status').notNullable();
    table.string('race').nullable();
    table.string('class').nullable();
    table.integer('level').defaultTo(1);
    table.jsonb('traits').nullable();
    table.text('motivation').nullable();
    table.text('bio').nullable();
    table.text('backstory').nullable();
    table.string('sex').nullable();
    table.string('creature').nullable();
    table.string('image_url').nullable();
    table.string('sheet').nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('characters');
};
