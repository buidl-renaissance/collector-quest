/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("stories", function (table) {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.string("slug").notNullable();
      table.text("description").notNullable();
      table.string("videoUrl").notNullable();
      table.text("script").notNullable();
      table.string("realmId").notNullable();
      table.string("artwork").notNullable();
      table.timestamp("createdAt").defaultTo(knex.fn.now());
    })
    .createTable("story_responses", function (table) {
      table.increments("id").primary();
      table.string("storyId").notNullable();
      table.text("response").notNullable();
      table.timestamp("createdAt").defaultTo(knex.fn.now());

      table.foreign("storyId").references("stories.id").onDelete("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("story_responses")
    .dropTableIfExists("stories");
};
