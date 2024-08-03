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
    await queryInterface.createTable('payment_info', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      guestName: {
        type: Sequelize.STRING
      },
      guestEmail: {
        type: Sequelize.STRING
      },
      guestPhone: {
        type: Sequelize.STRING
      },
      listingId: {
        type: Sequelize.INTEGER,
      },
      checkInDate: {
        type: Sequelize.STRING,
      },
      checkOutDate: {
        type: Sequelize.STRING,
      },
      guests: {
        type: Sequelize.INTEGER,
      },
      paymentIntentId: {
        type: Sequelize.STRING,
      },
      customerId: {
        type: Sequelize.STRING,
      },
      paymentMethod: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.FLOAT,
      },
      currency: {
        type: Sequelize.STRING,
      },
      paymentStatus: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('payment_info');
  }
};
