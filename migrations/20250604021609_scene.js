/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('scenes', table => {
    table.string('id').primary();
    table.string('campaignId').notNullable();
    table.string('name').notNullable();
    table.text('description');
    table.string('imageUrl');
    table.jsonb('locale');
    table.string('atmosphere');
    table.jsonb('npcsPresent');
    table.jsonb('interactables');
    table.jsonb('secrets');
    table.jsonb('challenges');
    table.string('lighting');
    table.jsonb('ambiance');
    table.text('lore');
    table.string('encounterType');
    table.jsonb('objectives');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('scenes');
};
