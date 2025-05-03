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

/**
 * Raw SQL equivalent of the Knex schema for reference:
 * 
 * CREATE TABLE `time_slots` (
 *   `id` int(11) NOT NULL AUTO_INCREMENT,
 *   `date` varchar(255) NOT NULL,
 *   `datetime` varchar(255) NOT NULL,
 *   `start_time` varchar(255) NOT NULL,
 *   `end_time` varchar(255) NOT NULL,
 *   `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   PRIMARY KEY (`id`)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 * 
 * CREATE TABLE `rsvps` (
 *   `id` int(11) NOT NULL AUTO_INCREMENT,
 *   `name` varchar(255) NOT NULL,
 *   `email` varchar(255) NOT NULL,
 *   `guests` int(11) NOT NULL DEFAULT '1',
 *   `time_slot_id` int(11) UNSIGNED,
 *   `time_slot_datetime` varchar(255) NOT NULL,
 *   `message` text,
 *   `confirmed` tinyint(1) DEFAULT '0',
 *   `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   PRIMARY KEY (`id`),
 *   FOREIGN KEY (`time_slot_id`) REFERENCES `time_slots` (`id`)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 */



