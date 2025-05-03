/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('time_slots', function(table) {
      table.increments('id').primary();
      table.string('date').notNullable();
      table.string('datetime').notNullable();
      table.string('start_time').notNullable();
      table.string('end_time').notNullable();
      table.timestamps(true, true);
    })
    .createTable('rsvps', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.integer('guests').notNullable().defaultTo(1);
      table.integer('time_slot_id').unsigned().references('id').inTable('time_slots');
      table.string('time_slot_datetime').notNullable();
      table.text('message');
      table.boolean('confirmed').defaultTo(false);
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable('rsvps')
    .dropTable('time_slots');
};
