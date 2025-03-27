module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RestaurantCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      status: {
        type: DataTypes.ENUM,
        values: [
        'online',
        'offline',
        'closed',
        'temporarily closed'
        ]
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RestaurantCategories')
  }
}
