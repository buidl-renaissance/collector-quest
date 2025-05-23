/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('relics', function(table) {
    table.string('id').notNullable().primary();
    table.string('objectId').nullable();
    table.string('name').notNullable();
    table.string('class').notNullable(); // Tool, Weapon, Symbol, Wearable, Key
    table.string('effect').notNullable(); // Reveal, Heal, Unlock, Boost, Summon
    table.string('element').notNullable(); // Fire, Water, Nature, Shadow, Light, Electric
    table.string('rarity').notNullable(); // Common, Uncommon, Rare, Epic
    table.text('story').nullable();
    table.string('imageUrl').nullable();
    table.jsonb('properties').nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('relics');
};


/*
CREATE TABLE relics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  objectId VARCHAR(255) NULL,
  name VARCHAR(255) NOT NULL,
  class VARCHAR(255) NOT NULL COMMENT 'Tool, Weapon, Symbol, Wearable, Key',
  effect VARCHAR(255) NOT NULL COMMENT 'Reveal, Heal, Unlock, Boost, Summon',
  element VARCHAR(255) NOT NULL COMMENT 'Fire, Water, Nature, Shadow, Light, Electric',
  rarity VARCHAR(255) NOT NULL COMMENT 'Common, Uncommon, Rare, Epic',
  story TEXT NULL,
  imageUrl VARCHAR(255) NULL,
  properties JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
*/

