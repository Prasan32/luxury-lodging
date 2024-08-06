'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('listing', 'roomType', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('listing', 'bathroomType', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('listing', 'bedroomsNumber', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('listing', 'bedsNumber', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('listing', 'bathroomsNumber', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('listing', 'roomType');
    await queryInterface.removeColumn('listing', 'bathroomType');
    await queryInterface.removeColumn('listing', 'bedroomsNumber');
    await queryInterface.removeColumn('listing', 'bedsNumber');
    await queryInterface.removeColumn('listing', 'bathroomsNumber');
  }
};
