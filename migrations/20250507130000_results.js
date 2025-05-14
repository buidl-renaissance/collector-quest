/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('results', (table) => {
    table.string('id').primary();
    table.enum('status', ['pending', 'completed', 'error']).notNullable();
    table.text('result');
    table.text('error');
    table.timestamp('createdAt').notNullable();
    table.timestamp('updatedAt').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('results');
}; 

/**
 * MySQL CREATE TABLE equivalent:
 
 CREATE TABLE `results` (
   `id` VARCHAR(255) PRIMARY KEY,
   `status` ENUM('pending', 'completed', 'error') NOT NULL,
   `result` TEXT,
   `error` TEXT,
   `createdAt` TIMESTAMP NOT NULL,
   `updatedAt` TIMESTAMP NOT NULL
 );
 */
