// first_name
// last_name
// email

exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments()
    table.text('first_name').notNullable()
    table.text('last_name').notNullable()
    table.text('email').notNullable()
    table.timestamps()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
