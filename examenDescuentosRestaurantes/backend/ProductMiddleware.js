import { Order, Product, Restaurant } from '../models/models.js'

//Verifica que el producto pertenezca al usuario actual.
const checkProductOwnership = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productId, { include: { model: Restaurant, as: 'restaurant' } })
    if (req.user.id === product.restaurant.userId) {
      return next()
    } else {
      return res.status(403).send('Not enough privileges. This entity does not belong to you')
    }
  } catch (err) {
    return res.status(500).send(err)
  }
}

//Verifica que el restaurante pertenezca al usuario actual.
const checkProductRestaurantOwnership = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.body.restaurantId)
    if (req.user.id === restaurant.userId) {
      return next()
    } else {
      return res.status(403).send('Not enough privileges. This entity does not belong to you')
    }
  } catch (err) {
    return res.status(500).send(err)
  }
}

//Comprueba que el producto no haya sido ordenado.
const checkProductHasNotBeenOrdered = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productId, { include: { model: Order, as: 'orders' } })
    if (product.orders.length === 0) {
      return next()
    } else {
      return res.status(409).send('This product has already been ordered')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

//AÑADIDO
const checkProductCanBePromoted = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productId)
    const restaurant = await Restaurant.findByPk(product.restaurantId)
    if (restaurant.percentage > 0) {
      return next()
    } else {
      return res.status(409).send('This product cannnot be promoted')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export { checkProductOwnership, checkProductRestaurantOwnership, checkProductHasNotBeenOrdered , checkProductCanBePromoted}
