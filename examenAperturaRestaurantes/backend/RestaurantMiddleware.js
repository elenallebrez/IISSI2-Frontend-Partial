import { Restaurant, Order } from '../models/models.js'

//Verifica que el restaurante pertenezca al usuario actual.
const checkRestaurantOwnership = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    if (req.user.id === restaurant.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}

//Comprueba que no haya órdenes asociadas con el restaurante.
const restaurantHasNoOrders = async (req, res, next) => {
  try {
    const numberOfRestaurantOrders = await Order.count({
      where: { restaurantId: req.params.restaurantId }
    })
    if (numberOfRestaurantOrders === 0) {
      return next()
    }
    return res.status(409).send('Some orders belong to this restaurant.')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const restaurantHasInvalidStatus = async (req, res, next) => {
  try {
    // Buscamos el restaurante que vamos a actualizar con la petición
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    // Si el estado de ese Restaurante es closed, retornamos un error
    if (restaurant.status === 'closed') {
      return res.status(409).send('This Restaurant is closed')
    }
    // Si el estado de ese Restaurante es temporarily closed, retornamos un error
    if (restaurant.status === 'temporarily closed') {
      return res.status(409).send('This Restaurant is temporarily closed')
    }
    return next()
  } catch (err) {
    return res.status(500).send(err)
  }
}

const restaurantHasNoPendingOrders = async (req, res, next) => {
  try {
    // Buscamos todos los orders del restaurante que vamos a actualizar con la petición
    const orders = await Order.findAll({where: { restaurantId: req.params.restaurantId }})
    // Para cada order, verificamos que no tiene un deliveredAt nulo
    for (const order of orders) {
      if (order.deliveredAt === null) {
        return res.status(409).send('There are pending orders')
      }
    }
    return next()
  } catch (err) {
    return res.status(500).send(err)
  }
}

export { checkRestaurantOwnership, restaurantHasNoOrders, restaurantHasInvalidStatus, restaurantHasNoPendingOrders }
