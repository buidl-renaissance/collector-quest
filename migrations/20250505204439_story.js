/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('stories', function(table) {
      table.string('id').primary();
      table.string('title').notNullable();
      table.text('description').notNullable();
      table.string('videoUrl').notNullable();
      table.text('script').notNullable();
      table.string('realmId').notNullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    })
    .createTable('story_responses', function(table) {
      table.string('id').primary();
      table.string('storyId').notNullable();
      table.text('response').notNullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      
      table.foreign('storyId').references('stories.id').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('story_responses')
    .dropTableIfExists('stories');
};
