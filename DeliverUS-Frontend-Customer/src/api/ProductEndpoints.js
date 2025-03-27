import { get } from './helpers/ApiRequestsHelper'

function getProductCategories () {
  return get('productCategories')
}

function get3MorePopularProducts () {
  return get('/products/popular')
}
function getDetailP (id) {
  return get(`products/${id}`)
}
export { getProductCategories, get3MorePopularProducts, getDetailP }
