// TODO: Include validation rules for create that should:
// 1. Check that restaurantId is present in the body and corresponds to an existing restaurant
// 2. Check that products is a non-empty array composed of objects with productId and quantity greater than 0
// 3. Check that products are available
// 4. Check that all the products belong to the same restaurant

import { check } from 'express-validator'
import { Order, Product, Restaurant } from '../../models/models.js'

const checkRestaurantIdInbody = async (value, { req }) => {
  try {
    const restaurantId = req.body.restaurantId
    if (!restaurantId) {
      throw new Error('The restaurantId is not present in the request body.')
    }
    const restaurant = await Restaurant.findByPk(restaurantId)
    if (!restaurant) {
      throw new Error('The restaurantId does not correspond to an existing restaurant.')
    }
  } catch (err) {
    throw new Error(err.message)
  }
}
const checkProductsId = async (value, { req }) => {
  try {
    for (const product of value) {
      const prod = await Product.findByPk(product.productId)
      if (prod.productId < 1) {
        throw new Error('The id of each product has to be greater than 0 ')
      }
    }
  } catch (err) {
    throw new Error(err.message)
  }
}
const checkProductNotEmpty = async (value, { req }) => {
  try {
    if (req.body.products.length < 1) {
      throw new Error('The array of products is empty.')
    }
  } catch (err) {
    throw new Error(err.message)
  }
}
const checkAvailability = async (value, { req }) => {
  try {
    for (const product of value) {
      const prod = await Product.findByPk(product.productId)
      if (prod.availability < 1) {
        throw new Error('The availability of each product has to be greater than 0 ')
      }
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

const allBelongToSame = async (value, { req }) => {
  try {
    const orderRestaurantId = req.body.restaurantId
    for (const product of value) {
      const prod = await Product.findByPk(product.productId)
      if (prod.restaurantId !== orderRestaurantId) {
        throw new Error('The products does not belong to same restaurant ')
      }
    }
  } catch (err) {
    throw new Error(err.message)
  }
}
const allBelongToSameRestaurantAgain = async (value, { req }) => {
  try {
    const order = await Order.findByPk(req.params.orderId)
    const orderRestaurantId = order.restaurantId
    for (const product of value) {
      const prod = await Product.findByPk(product.productId)
      if (prod.restaurantId !== orderRestaurantId) {
        throw new Error('The product does not belong to same restaurant ')
      }
    }
  } catch (err) {
    throw new Error(err.message)
  }
}
const checkNoRestaurantIdState = async (value, { req }) => {
  try {
    const orderRestaurantId = req.body.restaurantId
    if (orderRestaurantId) {
      throw new Error('The Id cannot be changed')
    }
    const s = await Order.findByPk(req.params.orderId)
    if (s.status !== 'pending') {
      throw new Error('The state is not pending')
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

const create = [
  check('address').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('restaurantId').exists().isInt({ min: 1 }).toInt(),
  check('products.*.quantity').isInt({ min: 1 }).toInt(),
  check('restaurantId').custom(checkRestaurantIdInbody),
  check('products').custom(checkProductNotEmpty),
  check('products').custom(checkProductsId),
  check('products').custom(checkAvailability),
  check('products').custom(allBelongToSame)
]
// TODO: Include validation rules for update that should:
// 1. Check that restaurantId is NOT present in the body.
// 2. Check that products is a non-empty array composed of objects with productId and quantity greater than 0
// 3. Check that products are available
// 4. Check that all the products belong to the same restaurant of the originally saved order that is being edited.
// 5. Check that the order is in the 'pending' state.
const update = [
  check('address').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('restaurantId').custom(checkNoRestaurantIdState),
  check('products').custom(checkProductNotEmpty),
  check('products').custom(checkAvailability),
  check('products').custom(allBelongToSameRestaurantAgain),
  check('products').custom(checkProductsId),
  check('products.*.quantity').isInt({ min: 1 }).toInt()

]

export { create, update }
