
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      const users = [
        {
          first_name: "John",
          last_name: "Smith",
          email: "jsmith@example.com"
        },
        {
          first_name: "Karen",
          last_name: "Smith",
          email: "ksmith@example.com"
        },
        {
          first_name: "Paula",
          last_name: "Smith",
          email: "psmith@example.com"
        }
      ]

      return knex('users').insert(users)
    });
};
