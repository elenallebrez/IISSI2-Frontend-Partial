import { Model } from 'sequelize'
const loadModel = (sequelize, DataTypes) => {
  class RestaurantCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      RestaurantCategory.hasMany(models.Restaurant, { foreignKey: 'restaurantCategoryId' })
    }
  }
  RestaurantCategory.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      len: [1, 50]
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }, {
    sequelize,
    modelName: 'RestaurantCategory'
  })
  return RestaurantCategory
}
export default loadModel
