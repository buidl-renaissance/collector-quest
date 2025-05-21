/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('artifacts', (table) => {
    table.string('id').primary();
    table.string('title').notNullable();
    table.string('artist').notNullable();
    table.string('year').notNullable();
    table.string('medium').notNullable();
    table.text('description').notNullable();
    table.string('class').notNullable().checkIn(['Tool', 'Weapon', 'Symbol', 'Wearable', 'Key']);
    table.string('effect').notNullable().checkIn(['Reveal', 'Heal', 'Unlock', 'Boost', 'Summon']);
    table.string('element').notNullable().checkIn(['Fire', 'Water', 'Nature', 'Shadow', 'Light', 'Electric']);
    table.string('rarity').notNullable().checkIn(['Common', 'Uncommon', 'Rare', 'Epic']);
    table.string('imageUrl').notNullable();
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
