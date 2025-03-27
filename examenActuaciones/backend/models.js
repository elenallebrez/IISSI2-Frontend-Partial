import Sequelize from 'sequelize'
import getEnvironmentConfig from '../config/config.js'
import loadRestaurantModel from './Restaurant.js'
import loadOrderModel from './Order.js'
import loadProductModel from './Product.js'
import loadProductCategoryModel from './ProductCategory.js'
import loadRestaurantCategoryModel from './RestaurantCategory.js'
import loadUserModel from './User.js'

//AÑADIDO
import loadPerformanceModel from './PerformanceModel.js'

const sequelizeSession = new Sequelize(getEnvironmentConfig().database, getEnvironmentConfig().username, getEnvironmentConfig().password, getEnvironmentConfig())
const Restaurant = loadRestaurantModel(sequelizeSession, Sequelize.DataTypes)
const Order = loadOrderModel(sequelizeSession, Sequelize.DataTypes)
const Product = loadProductModel(sequelizeSession, Sequelize.DataTypes)
const ProductCategory = loadProductCategoryModel(sequelizeSession, Sequelize.DataTypes)
const RestaurantCategory = loadRestaurantCategoryModel(sequelizeSession, Sequelize.DataTypes)
const User = loadUserModel(sequelizeSession, Sequelize.DataTypes)
//AÑADIDO
const Performance = loadPerformanceModel(sequelizeSession,Sequelize.DataTypes)

//AÑADIDO AL FINAL DE ESTA LINEA
const db = { Restaurant, Order, Product, ProductCategory, RestaurantCategory, User, Performance}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

//AÑADIDO 
export { Restaurant, Order, Product, ProductCategory, RestaurantCategory, User, Performance, sequelizeSession }
