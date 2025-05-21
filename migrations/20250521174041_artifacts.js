/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('artifacts', (table) => {
    table.string('id').primary();
    table.string('title').notNullable();
    table.string('artist').notNullable();
    table.string('owner').nullable();
    table.string('year').notNullable();
    table.string('medium').notNullable();
    table.text('description').notNullable();
    table.string('imageUrl').notNullable();
    table.string('relicImageUrl').nullable();
    table.jsonb('properties').nullable();
    table.text('story').nullable();
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('artifacts');
};

// MySQL equivalent create table query stored as a string
const mysqlCreateTableQuery = `
CREATE TABLE artifacts (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  owner VARCHAR(255),
  year VARCHAR(255) NOT NULL,
  medium VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  imageUrl VARCHAR(255) NOT NULL,
  relicImageUrl VARCHAR(255),
  properties JSON,
  story TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;


