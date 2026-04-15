const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@zarlo.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Luxury Seller',
    email: 'seller@zarlo.com',
    password: 'password123',
    role: 'seller',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
  },
];

module.exports = users;
