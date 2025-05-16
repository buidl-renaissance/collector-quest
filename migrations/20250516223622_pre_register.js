/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("characters", (table) => {
    // Add equipment column if it doesn't exist
    table.string("real_name").nullable();
    table.text("email").nullable();
    table.text("phone").nullable();
    table.boolean("verified").defaultTo(false);
    table.text("verification_code").nullable();
    table.text("verification_code_expiration").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("characters", (table) => {
    // Remove the equipment column
    table.dropColumn("real_name");
    table.dropColumn("email");
    table.dropColumn("phone");
    table.dropColumn("verified");
    table.dropColumn("verification_code");
    table.dropColumn("verification_code_expiration");
  });
};
