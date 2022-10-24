'use strict';

const seedProducts = require('../products_seed.json');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('product', seedProducts.slice(0, 20000));
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('product', null, {});
  }
};
