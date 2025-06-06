/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('campaigns', table => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.timestamp('startDate').nullable();
    table.timestamp('endDate').nullable();
    table.enu('status', ['generating','active', 'inactive', 'completed']).notNullable();
    table.jsonb('targetAudience').nullable();
    table.jsonb('quests').nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('campaigns');
};

/**
 * MySQL equivalent:
  
  CREATE TABLE campaigns (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    startDate TIMESTAMP NULL,
    endDate TIMESTAMP NULL, 
    status ENUM('active', 'inactive', 'completed') NOT NULL,
    targetAudience JSON NULL,
    quests JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
 */
