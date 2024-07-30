'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('listing',{
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      propertyType: {
        type: Sequelize.STRING,
        defaultValue: "NOT SPECIFIED",
      },
      externalListingName: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.FLOAT,
      },
      guestsIncluded: {
        type: Sequelize.INTEGER,
      },
      priceForExtraPerson: {
        type: Sequelize.FLOAT,
      },
      currencyCode: {
        type: Sequelize.STRING,
      },
      internalListingName: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      countryCode: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      street: {
        type: Sequelize.STRING,
      },
      zipCode: {
        type: Sequelize.STRING,
      },
      lat: {
        type: Sequelize.FLOAT
      },
      lng: {
        type: Sequelize.FLOAT
      },
      checkInTimeStart: {
        type: Sequelize.INTEGER
      },
      checkInTimeEnd: {
        type: Sequelize.INTEGER
      },
      checkOutTime: {
        type: Sequelize.INTEGER
      },
      wifiUsername: {
        type: Sequelize.STRING
      },
      wifiPassword: {
        type: Sequelize.STRING
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('listing');
  }
};
