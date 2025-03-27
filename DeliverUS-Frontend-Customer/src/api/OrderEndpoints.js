import { get, post, put, destroy } from './helpers/ApiRequestsHelper'

function getAllOrders () {
  return get('orders')
}
function getOrderDetail (id) {
  return get(`orders/${id}`)
}
function getOrderCategories () {
  return get('orderCategories')
}
function create (data) {
  return post('orders', data)
}
function remove (id) {
  return destroy(`orders/${id}`)
}
function update (id, data) {
  return put(`orders/${id}`, data)
}
export { getOrderDetail, getOrderCategories, getAllOrders, create, remove, update }
