
const loadModel = (sequelize, DataTypes) => {
    class Performance extends Model {

        static associate (models) {
        // SOLUCION
        Performance.belongsTo(models.Restaurant, { foreignKey: 'restaurantId', as: 'restaurant', onDelete: 'cascade' })
        }
    }

    // SOLUCION "id", "group", "appointment" y "restaurantId"
    Performance.init({
        group: DataTypes.STRING,
        appointment: DataTypes.DATE,
        restaurantId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Performance'
    })
    return Performance
}

export default loadModel