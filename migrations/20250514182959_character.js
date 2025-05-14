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

/**
 * MySQL equivalent create table query
 * This is for reference only and not executed by the migration
 */
const mysqlCreateTableQuery = `
CREATE TABLE characters (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  race VARCHAR(255) NULL,
  class VARCHAR(255) NULL,
  level INT DEFAULT 1,
  traits JSON NULL,
  motivation TEXT NULL,
  bio TEXT NULL,
  backstory TEXT NULL,
  sex VARCHAR(255) NULL,
  creature VARCHAR(255) NULL,
  image_url VARCHAR(255) NULL,
  sheet VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;
