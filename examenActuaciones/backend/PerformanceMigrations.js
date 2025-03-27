module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Performances', {
            // TO-DO: You must insert the following fields in Performance table:
            // id (PK integer)
            // group (string)
            // appointment (date)
            // restaurantId (FK integer referencing 'id' in Restaurants table)
        // SOLUCION
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        group: {
            allowNull: false,
            type: Sequelize.STRING
        },
        appointment: {
            allowNull: false,
            type: Sequelize.DATE
        },
        restaurantId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: 'Restaurants'
                },
                key: 'id'
            },
            onDelete: 'cascade'
        },
        // SOLUCION
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: new Date()
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: new Date()
        }
    })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Performances')
    }
}