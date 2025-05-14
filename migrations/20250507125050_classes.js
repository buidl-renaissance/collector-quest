/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('classes', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.json('abilities').notNullable();
    table.string('image').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('classes');
};

/**
 * MySQL equivalent create table query for classes
 * This can be run directly in a MySQL client
 */
const mysqlCreateTableQuery = `
CREATE TABLE classes (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  abilities JSON NOT NULL,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;
