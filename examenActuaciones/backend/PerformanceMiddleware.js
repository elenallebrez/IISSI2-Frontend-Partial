import { Restaurant } from '../models/models.js'
const checkPerformanceRestaurantOwnership = async (req, res, next) => {
 // TO-DO: middleware for performance
    try {
        const restaurant = await Restaurant.findByPk(req.body.restaurantId)
        if (req.user.id === restaurant.userId) {
            return next()
        }
        return res.status(403).send('Not enough privileges. This entity does not belong to you')
    } catch (err) {
        return res.status(500).send(err)
    }
}

export { checkPerformanceRestaurantOwnership }