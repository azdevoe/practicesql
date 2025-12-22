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
    await queryInterface.addColumn('users','createdAt',{
      type:Sequelize.DATE,
      allowNull:false
    })

      await queryInterface.addColumn('users','updatedAt',{
      type:Sequelize.DATE,
      allowNull:false
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users','createdAt')
    await queryInterface.removeColumn('users','updatedAt')
  }
};
