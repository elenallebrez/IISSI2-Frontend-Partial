import { get } from './helpers/ApiRequestsHelper'
function getAll () {
  return get('users/myrestaurants')
}
function getAllRestaurants () {
  return get('restaurants')
}
function getDetail (id) {
  return get(`restaurants/${id}`)
}

function getRestaurantCategories () {
  return get('restaurantCategories')
}

export { getAll, getDetail, getRestaurantCategories, getAllRestaurants }
