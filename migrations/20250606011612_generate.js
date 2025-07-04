/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('generation_results', (table) => {
    table.string('id').primary();
    table.string('event_name').notNullable();
    table.string('event_id');
    table.enum('status', ['pending', 'complete', 'error']).notNullable();
    table.string('step');
    table.text('message');
    table.text('result');
    table.text('error');
    table.string('object_type').notNullable();
    table.string('object_id').notNullable();
    table.string('object_key').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('generation_results');
};

/*
MySQL equivalent:
CREATE TABLE generation_results (
  id VARCHAR(255) PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  event_id VARCHAR(255),
  status ENUM('pending', 'complete', 'error') NOT NULL,
  step VARCHAR(255),
  message TEXT,
  result TEXT,
  error TEXT,
  object_type VARCHAR(255) NOT NULL,
  object_id VARCHAR(255) NOT NULL,
  object_key VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
*/