import request from 'supertest'
import { shutdownApp, getApp } from './utils/testApp'
import { getLoggedInCustomer, getLoggedInOwner, getNewLoggedInOwner, getNewLoggedInCustomer } from './utils/auth'
import { createRestaurant, getFirstRestaurantOfOwner, getRandomRestaurant } from './utils/restaurant'
import { createProduct } from './utils/product'
import { createOrder, getNewOrderData, getNewOrderDataWithUnavailableProduct, checkOrderEqualsOrderData, computeOrderPrice } from './utils/order'
import moment from 'moment'

describe('Get customer orders', () => {
  let customer, owner, customerOrders, app
  beforeAll(async () => {
    customer = await getLoggedInCustomer()
    owner = await getLoggedInOwner()
    app = await getApp()
  })
  it('Should return 401 if not logged in', async () => {
    const response = await request(app).get('/orders').send()
    expect(response.status).toBe(401)
  })
  it('Should return 403 when logged in as an owner', async () => {
    const response = await request(app).get('/orders').set('Authorization', `Bearer ${owner.token}`).send({})
    expect(response.status).toBe(403)
  })
  it('Should return 200 when logged in as a customer', async () => {
    const response = await request(app).get('/orders').set('Authorization', `Bearer ${customer.token}`).send()
    customerOrders = response.body
    expect(response.status).toBe(200)
  })
  it('All orders must have an id', async () => {
    expect(customerOrders.every(order => order.id !== undefined)).toBe(true)
  })
  it('All orders must have products', async () => {
    expect(customerOrders.every(order => order.products !== undefined)).toBe(true)
  })
  it('All orders must belong to the customer', async () => {
    expect(customerOrders.every(order => order.userId === customer.id)).toBe(true)
  })
  afterAll(async () => {
    await shutdownApp()
  })
})

describe('Get order details', () => {
  let customer, createdOrderId, app, owner
  beforeAll(async () => {
    customer = await getLoggedInCustomer()
    owner = await getLoggedInOwner()
    app = await getApp()
    const restaurant = await getFirstRestaurantOfOwner(owner)
    const orderData = await getNewOrderData(restaurant)
    const response = await request(app).post('/orders').set('Authorization', `Bearer ${customer.token}`).send(orderData)
    createdOrderId = response.body.id
  })
  it('Should return 401 if not logged in', async () => {
    const response = await request(app).get(`/orders/${createdOrderId}`).send()
    expect(response.status).toBe(401)
  })
  it('Should return 403 when logged in as other user', async () => {
    const response = await request(app).get(`/orders/${createdOrderId}`).set('Authorization', `Bearer ${(await getNewLoggedInOwner()).token}`).send()
    expect(response.status).toBe(403)
  })
  it('Should return 404 when trying to get a nonexistent order', async () => {
    const response = await request(app).get('/orders/invalidOrderId').set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(404)
  })
  it('Should return 200 when logged in as the customer', async () => {
    const response = await request(app).get(`/orders/${createdOrderId}`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(200)
    expect(response.body.id).toBe(createdOrderId)
    expect(response.body.userId).toBe(customer.id)
  })
  it('Should return 200 when logged in as the owner of the restaurant', async () => {
    const response = await request(app).get(`/orders/${createdOrderId}`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(200)
    expect(response.body.id).toBe(createdOrderId)
  })
  afterAll(async () => {
    await shutdownApp()
  })
})

describe('Create order', () => {
  let customer, restaurant, anotherRestaurant, orderData, newOrderData, createdOrderId, app, owner
  beforeAll(async () => {
    app = await getApp()
    customer = await getLoggedInCustomer()
    owner = await getLoggedInOwner()
    restaurant = await getFirstRestaurantOfOwner(owner)
    anotherRestaurant = await createRestaurant(owner)
    orderData = await getNewOrderData(restaurant)
  })
  it('Should return 401 if not logged in', async () => {
    const response = await request(app).post('/orders').send(orderData)
    expect(response.status).toBe(401)
  })
  it('Should return 403 when logged in as an owner', async () => {
    const response = await request(app).post('/orders').set('Authorization', `Bearer ${owner.token}`).send(orderData)
    expect(response.status).toBe(403)
  })
  it('Should return 409 when trying to order from nonexistent restaurant', async () => {
    const invalidOrder = { ...orderData }
    invalidOrder.restaurantId = 'invalidId'
    const response = await request(app).post('/orders').set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    expect(response.status).toBe(409)
  })
  it('Should return 422 when trying to order without products', async () => {
    const invalidOrder = { ...orderData }
    delete invalidOrder.products
    const response = await request(app).post('/orders').set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    const errorFields = response.body.errors.map(error => error.param)
    expect(['products'].every(field => errorFields.includes(field))).toBe(true)
    expect(response.status).toBe(422)
  })
  it('Should return 422 when trying to order with a non-array of products', async () => {
    const invalidOrder = { ...orderData }
    invalidOrder.products = 2
    const response = await request(app).post('/orders').set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    const errorFields = response.body.errors.map(error => error.param)
    expect(['products'].every(field => errorFields.includes(field))).toBe(true)
    expect(response.status).toBe(422)
  })
  it('Should return 422 when trying to order products with quantity 0', async () => {
    const invalidOrder = { ...orderData }
    invalidOrder.products = invalidOrder.products.map(product => ({ ...product, quantity: 0 }))
    const response = await request(app).post('/orders').set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    const errorFields = response.body.errors.map(error => error.param)
    // Comprobar que errorFields contiene una cadena con formato 'products[*].quantity, donde * puede ser cualquier caracter'
    expect(errorFields.some(field => field.match(/^products\[\d+\]\.quantity$/))).toBe(true)
    expect(response.status).toBe(422)
  })
  it('Should return 422 when trying to order products with negative quantity', async () => {
    const invalidOrder = { ...orderData }
    invalidOrder.products = invalidOrder.products.map(product => ({ ...product, quantity: -1 }))
    const response = await request(app).post('/orders').set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    const errorFields = response.body.errors.map(error => error.param)
    // Comprobar que errorFields contiene una cadena con formato 'products[*].quantity, donde * puede ser cualquier caracter'
    expect(errorFields.some(field => field.match(/^products\[\d+\]\.quantity$/))).toBe(true)
    expect(response.status).toBe(422)
  })
  it('Should return 422 when trying to order unavailable products', async () => {
    const unavailableOrderData = await getNewOrderDataWithUnavailableProduct(restaurant)
    const invalidOrder = { ...unavailableOrderData }
    const response = await request(app).post('/orders').set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    const errorFields = response.body.errors.map(error => error.param)
    // Comprobar que errorFields contiene una cadena con formato 'products[*].quantity, donde * puede ser cualquier caracter'
    expect(['products'].every(field => errorFields.includes(field))).toBe(true)
    expect(response.status).toBe(422)
  })
  it('Should return 422 when trying to order from different restaurants', async () => {
    const invalidOrder = await getNewOrderData(restaurant)
    const productFromAnotherRestaurant = await createProduct(owner, anotherRestaurant)
    invalidOrder.products.push({ productId: productFromAnotherRestaurant.id, quantity: 1 })
    const response = await request(app).post('/orders').set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    const errorFields = response.body.errors.map(error => error.param)
    // Comprobar que errorFields contiene una cadena con formato 'products[*].quantity, donde * puede ser cualquier caracter'
    expect(['products'].every(field => errorFields.includes(field))).toBe(true)
    expect(response.status).toBe(422)
  })
  it('Should return 422 when invalid order data', async () => {
    const invalidOrder = await getNewOrderData(restaurant)
    delete invalidOrder.address
    invalidOrder.products[0].productId = 'invalidId'
    const response = await request(app).post('/orders').set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    expect(response.status).toBe(422)
    const errorFields = response.body.errors.map(error => error.param)
    expect(['products', 'address'].every(field => errorFields.includes(field))).toBe(true)
  })
  it('Should return 200 and the correct created order when valid order', async () => {
    newOrderData = await getNewOrderData(restaurant, 15)
    const response = await request(app).post('/orders').set('Authorization', `Bearer ${customer.token}`).send(newOrderData)
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.price).toBe(await computeOrderPrice(response.body))
    await checkOrderEqualsOrderData(response.body, newOrderData)
    createdOrderId = response.body.id
  })
  it('Should return 200 and the correct created order when requesting order details', async () => {
    const response = await request(app).get(`/orders/${createdOrderId}`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.price).toBe(await computeOrderPrice(response.body))
    await checkOrderEqualsOrderData(response.body, newOrderData)
  })

  it('Create order <10€ that should add shipping costs. Should return 200 and the correct created order adding shipping costs', async () => {
    newOrderData = await getNewOrderData(restaurant, 3)
    const response = await request(app).post('/orders').set('Authorization', `Bearer ${customer.token}`).send(newOrderData)
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.price).toBe(await computeOrderPrice(response.body))
    await checkOrderEqualsOrderData(response.body, newOrderData)
    createdOrderId = response.body.id
  })
  it('Should return 200 and the correct created order with added shipping costs when requesting order details', async () => {
    const response = await request(app).get(`/orders/${createdOrderId}`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.price).toBe(await computeOrderPrice(response.body))
    await checkOrderEqualsOrderData(response.body, newOrderData)
  })

  afterAll(async () => {
    await shutdownApp()
  })
})

describe('Edit order', () => {
  let customer, owner, restaurant, anotherRestaurant, orderData, order, editedOrderData, app
  beforeAll(async () => {
    app = await getApp()
    customer = await getLoggedInCustomer()
    owner = await getLoggedInOwner()
    restaurant = await getFirstRestaurantOfOwner(owner)
    anotherRestaurant = await createRestaurant(owner)
    order = await createOrder(customer, restaurant, await getNewOrderData(restaurant))
    orderData = await getNewOrderData(restaurant)
    delete orderData.restaurantId
  })
  it('Should return 401 if not logged in', async () => {
    const response = await request(app).put(`/orders/${order.id}`).send(orderData)
    expect(response.status).toBe(401)
  })
  it('Should return 403 when logged in as an owner', async () => {
    const response = await request(app).put(`/orders/${order.id}`).set('Authorization', `Bearer ${owner.token}`).send(orderData)
    expect(response.status).toBe(403)
  })
  it('Should return 403 when logged in as another customer', async () => {
    const response = await request(app).put(`/orders/${order.id}`).set('Authorization', `Bearer ${(await getNewLoggedInCustomer()).token}`).send(orderData)
    expect(response.status).toBe(403)
  })
  it('Should return 404 when trying to modify a nonexistent order', async () => {
    const response = await request(app).put('/orders/invalidOrderId').set('Authorization', `Bearer ${customer.token}`).send(orderData)
    expect(response.status).toBe(404)
  })
  it('Should return 409 when order is confirmed', async () => {
    let confirmedOrder = await getNewOrderData(restaurant)
    confirmedOrder.startedAt = new Date()
    confirmedOrder = await createOrder(customer, restaurant, confirmedOrder)
    const response = await request(app).put(`/orders/${confirmedOrder.id}`).set('Authorization', `Bearer ${customer.token}`).send(orderData)
    expect(response.status).toBe(409)
  })
  it('Should return 409 when order is sent', async () => {
    let sentOrder = await getNewOrderData(restaurant)
    sentOrder.startedAt = new Date()
    sentOrder.sentAt = new Date()
    sentOrder = await createOrder(customer, restaurant, sentOrder)
    const response = await request(app).put(`/orders/${sentOrder.id}`).set('Authorization', `Bearer ${customer.token}`).send(orderData)
    expect(response.status).toBe(409)
  })
  it('Should return 409 when order is delivered', async () => {
    let deliveredOrder = await getNewOrderData(restaurant)
    deliveredOrder.startedAt = new Date()
    deliveredOrder.sentAt = new Date()
    deliveredOrder.deliveredAt = moment().add(5, 'minutes').toDate()
    deliveredOrder = await createOrder(customer, restaurant, deliveredOrder)
    const response = await request(app).put(`/orders/${deliveredOrder.id}`).set('Authorization', `Bearer ${customer.token}`).send(orderData)
    expect(response.status).toBe(409)
  })
  it('Should return 422 when trying to modify the restaurant', async () => {
    const invalidOrder = { ...orderData }
    invalidOrder.restaurantId = (await getRandomRestaurant(restaurant)).id
    const response = await request(app).put(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    expect(response.status).toBe(422)
  })
  it('Should return 422 when trying to modify an order without products', async () => {
    const invalidOrder = { ...orderData }
    delete invalidOrder.products
    const response = await request(app).put(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    const errorFields = response.body.errors.map(error => error.param)
    expect(['products'].every(field => errorFields.includes(field))).toBe(true)
    expect(response.status).toBe(422)
  })
  it('Should return 422 when trying to order with a non-array of products', async () => {
    const invalidOrder = { ...orderData }
    invalidOrder.products = 2
    const response = await request(app).put(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    const errorFields = response.body.errors.map(error => error.param)
    expect(['products'].every(field => errorFields.includes(field))).toBe(true)
    expect(response.status).toBe(422)
  })
  it('Should return 422 when trying to order products with quantity 0', async () => {
    const invalidOrder = { ...orderData }
    invalidOrder.products = invalidOrder.products.map(product => ({ ...product, quantity: 0 }))
    const response = await request(app).put(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    const errorFields = response.body.errors.map(error => error.param)
    // Comprobar que errorFields contiene una cadena con formato 'products[*].quantity, donde * puede ser cualquier caracter'
    expect(errorFields.some(field => field.match(/^products\[\d+\]\.quantity$/))).toBe(true)
    expect(response.status).toBe(422)
  })
  it('Should return 422 when trying to order products with negative quantity', async () => {
    const invalidOrder = { ...orderData }
    invalidOrder.products = invalidOrder.products.map(product => ({ ...product, quantity: -1 }))
    const response = await request(app).put(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    const errorFields = response.body.errors.map(error => error.param)
    // Comprobar que errorFields contiene una cadena con formato 'products[*].quantity, donde * puede ser cualquier caracter'
    expect(errorFields.some(field => field.match(/^products\[\d+\]\.quantity$/))).toBe(true)
    expect(response.status).toBe(422)
  })
  it('Should return 422 when trying to order unavailable products', async () => {
    const unavailableOrderData = await getNewOrderDataWithUnavailableProduct(restaurant)
    delete unavailableOrderData.restaurantId
    const invalidOrder = { ...unavailableOrderData }
    const response = await request(app).put(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    const errorFields = response.body.errors.map(error => error.param)
    // Comprobar que errorFields contiene una cadena con formato 'products[*].quantity, donde * puede ser cualquier caracter'
    expect(['products'].every(field => errorFields.includes(field))).toBe(true)
    expect(response.status).toBe(422)
  })
  it('Should return 422 when trying to order from different restaurants', async () => {
    const invalidOrder = await getNewOrderData(restaurant)
    delete invalidOrder.restaurantId
    const productFromAnotherRestaurant = await createProduct(owner, anotherRestaurant)
    invalidOrder.products.push({ productId: productFromAnotherRestaurant.id, quantity: 1 })
    const response = await request(app).put(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    const errorFields = response.body.errors.map(error => error.param)
    // Comprobar que errorFields contiene una cadena con formato 'products[*].quantity, donde * puede ser cualquier caracter'
    expect(['products'].every(field => errorFields.includes(field))).toBe(true)
    expect(response.status).toBe(422)
  })
  it('Should return 422 when invalid order data', async () => {
    const invalidOrder = await getNewOrderData(restaurant)
    delete invalidOrder.restaurantId
    delete invalidOrder.address
    invalidOrder.products[0].productId = 'invalidId'
    const response = await request(app).put(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send(invalidOrder)
    expect(response.status).toBe(422)
    const errorFields = response.body.errors.map(error => error.param)
    expect(['products', 'address'].every(field => errorFields.includes(field))).toBe(true)
  })
  it('Should return 200 and the edited order when valid order', async () => {
    editedOrderData = await getNewOrderData(restaurant, 15)
    const editedOrderDataWithoutRestaurantId = { ...editedOrderData }
    delete editedOrderDataWithoutRestaurantId.restaurantId
    const response = await request(app).put(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send(editedOrderDataWithoutRestaurantId)
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.price).toBe(await computeOrderPrice(response.body))
    await checkOrderEqualsOrderData(response.body, editedOrderData)
  })
  it('Should return 200 and the correct created order when requesting order details', async () => {
    const response = await request(app).get(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.price).toBe(await computeOrderPrice(response.body))
    await checkOrderEqualsOrderData(response.body, editedOrderData)
  })

  it('Create order <10€ that should add shipping costs. Should return 200 and the correct edited order adding shipping costs', async () => {
    editedOrderData = await getNewOrderData(restaurant, 3)
    const editedOrderDataWithoutRestaurantId = { ...editedOrderData }
    delete editedOrderDataWithoutRestaurantId.restaurantId
    const response = await request(app).put(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send(editedOrderDataWithoutRestaurantId)
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.price).toBe(await computeOrderPrice(response.body))
    await checkOrderEqualsOrderData(response.body, editedOrderData)
  })
  it('Should return 200 and the correct edited order with added shipping costs when requesting order details', async () => {
    const response = await request(app).get(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.price).toBe(await computeOrderPrice(response.body))
    await checkOrderEqualsOrderData(response.body, editedOrderData)
  })

  afterAll(async () => {
    await shutdownApp()
  })
})

describe('Delete order', () => {
  let customer, restaurant, order, app, owner
  beforeAll(async () => {
    app = await getApp()
    customer = await getLoggedInCustomer()
    owner = await getLoggedInOwner()
    restaurant = await getFirstRestaurantOfOwner(owner)
    order = await createOrder(customer, restaurant, await getNewOrderData(restaurant))
  })
  it('Should return 401 if not logged in', async () => {
    const response = await request(app).delete(`/orders/${order.id}`).send()
    expect(response.status).toBe(401)
  })
  it('Should return 403 when logged in as an owner', async () => {
    const response = await request(app).delete(`/orders/${order.id}`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(403)
  })
  it('Should return 403 when logged in as another customer', async () => {
    const response = await request(app).delete(`/orders/${order.id}`).set('Authorization', `Bearer ${(await getNewLoggedInCustomer()).token}`).send()
    expect(response.status).toBe(403)
  })
  it('Should return 404 when trying to delete a nonexistent order', async () => {
    const response = await request(app).delete('/orders/invalidOrderId').set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(404)
  })
  it('Should return 409 when order is confirmed', async () => {
    let confirmedOrder = await getNewOrderData(restaurant)
    confirmedOrder.startedAt = new Date()
    confirmedOrder = await createOrder(customer, restaurant, confirmedOrder)
    const response = await request(app).delete(`/orders/${confirmedOrder.id}`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(409)
  })
  it('Should return 409 when order is sent', async () => {
    let sentOrder = await getNewOrderData(restaurant)
    sentOrder.startedAt = new Date()
    sentOrder.sentAt = new Date()
    sentOrder = await createOrder(customer, restaurant, sentOrder)
    const response = await request(app).delete(`/orders/${sentOrder.id}`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(409)
  })
  it('Should return 409 when order is delivered', async () => {
    let deliveredOrder = await getNewOrderData(restaurant)
    deliveredOrder.startedAt = new Date()
    deliveredOrder.sentAt = new Date()
    deliveredOrder.deliveredAt = moment().add(5, 'minutes').toDate()
    deliveredOrder = await createOrder(customer, restaurant, deliveredOrder)
    const response = await request(app).delete(`/orders/${deliveredOrder.id}`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(409)
  })
  it('Should return 200 when removing valid order', async () => {
    const response = await request(app).delete(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(200)
  })
  it('Should return 404 when the order has been removed', async () => {
    const response = await request(app).delete(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(404)
  })
  afterAll(async () => {
    await shutdownApp()
  })
})

describe('Confirm order', () => {
  let order, app, customer, owner
  beforeAll(async () => {
    customer = await getLoggedInCustomer()
    owner = await getLoggedInOwner()
    app = await getApp()
    order = await createOrder(customer, await getFirstRestaurantOfOwner(owner))
  })
  it('Should return 401 if not logged in', async () => {
    const response = await request(app).patch(`/orders/${order.id}/confirm`).send()
    expect(response.status).toBe(401)
  })
  it('Should return 403 when logged in as a customer', async () => {
    const response = await request(app).patch(`/orders/${order.id}/confirm`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(403)
  })
  it('Should return 404 when trying to confirm a nonexistent order', async () => {
    const response = await request(app).patch('/orders/invalidOrderId/confirm').set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(404)
  })
  it('Should return 403 when trying to confirm an order that does not belong to the owner', async () => {
    const response = await request(app).patch(`/orders/${order.id}/confirm`).set('Authorization', `Bearer ${(await getNewLoggedInOwner()).token}`).send()
    expect(response.status).toBe(403)
  })
  it('Should return 409 when trying to confirm a not pending order', async () => {
    let notPendingOrder = { ...(await getNewOrderData(await getFirstRestaurantOfOwner(owner))) }
    notPendingOrder.startedAt = new Date()
    notPendingOrder = await createOrder(customer, await getFirstRestaurantOfOwner(owner), notPendingOrder)
    const response = await request(app).patch(`/orders/${notPendingOrder.id}/confirm`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(409)
  })
  it('Should return 200 and the correct confirmed order when valid order', async () => {
    const response = await request(app).patch(`/orders/${order.id}/confirm`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(200)
  })
  it('Should return 200 and the correct created order when requesting order details', async () => {
    const response = await request(app).get(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.startedAt).toBeDefined()
  })
  afterAll(async () => {
    await shutdownApp()
  })
})

describe('Send order', () => {
  let order, app, customer, owner
  beforeAll(async () => {
    customer = await getLoggedInCustomer()
    owner = await getLoggedInOwner()
    app = await getApp()
    order = await createOrder(customer, await getFirstRestaurantOfOwner(owner))
  })
  it('Should return 401 if not logged in', async () => {
    const response = await request(app).patch(`/orders/${order.id}/send`).send()
    expect(response.status).toBe(401)
  })
  it('Should return 403 when logged in as a customer', async () => {
    const response = await request(app).patch(`/orders/${order.id}/send`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(403)
  })
  it('Should return 404 when trying to send a nonexistent order', async () => {
    const response = await request(app).patch('/orders/invalidOrderId/send').set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(404)
  })
  it('Should return 403 when trying to send an order that does not belong to the owner', async () => {
    const response = await request(app).patch(`/orders/${order.id}/send`).set('Authorization', `Bearer ${(await getNewLoggedInOwner()).token}`).send()
    expect(response.status).toBe(403)
  })
  it('Should return 409 when trying to send a pending order', async () => {
    const response = await request(app).patch(`/orders/${order.id}/send`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(409)
  })
  it('Should return 409 when trying to send a sent order', async () => {
    let sentOrder = { ...(await getNewOrderData(await getFirstRestaurantOfOwner(owner))) }
    sentOrder.startedAt = new Date()
    sentOrder.sentAt = new Date()
    sentOrder = await createOrder(customer, await getFirstRestaurantOfOwner(owner), sentOrder)
    const response = await request(app).patch(`/orders/${sentOrder.id}/send`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(409)
  })
  it('Should return 200 when valid order', async () => {
    const newOrder = { ...(await getNewOrderData(await getFirstRestaurantOfOwner(owner))) }
    newOrder.startedAt = new Date()
    order = await createOrder(customer, await getFirstRestaurantOfOwner(owner), newOrder)
    const response = await request(app).patch(`/orders/${order.id}/send`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(200)
  })
  it('Should return 200 when requesting order details', async () => {
    const response = await request(app).get(`/orders/${order.id}`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.startedAt).toBeDefined()
    expect(response.body.sentAt).toBeDefined()
  })
  afterAll(async () => {
    await shutdownApp()
  })
})

describe('Deliver order', () => {
  let order, app, customer, owner
  beforeAll(async () => {
    customer = await getLoggedInCustomer()
    owner = await getLoggedInOwner()
    app = await getApp()
    order = await createOrder(customer, await getFirstRestaurantOfOwner(owner))
  })
  it('Should return 401 if not logged in', async () => {
    const response = await request(app).patch(`/orders/${order.id}/deliver`).send()
    expect(response.status).toBe(401)
  })
  it('Should return 403 when logged in as a customer', async () => {
    const response = await request(app).patch(`/orders/${order.id}/deliver`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(403)
  })
  it('Should return 404 when trying to deliver a nonexistent order', async () => {
    const response = await request(app).patch('/orders/invalidOrderId/deliver').set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(404)
  })
  it('Should return 403 when trying to deliver an order that does not belong to the owner', async () => {
    const response = await request(app).patch(`/orders/${order.id}/deliver`).set('Authorization', `Bearer ${(await getNewLoggedInOwner()).token}`).send()
    expect(response.status).toBe(403)
  })
  it('Should return 409 when trying to deliver a pending order', async () => {
    const response = await request(app).patch(`/orders/${order.id}/deliver`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(409)
  })
  it('Should return 409 when trying to deliver a confirmed order', async () => {
    let confirmedOrder = { ...(await getNewOrderData(await getFirstRestaurantOfOwner(owner))) }
    confirmedOrder.startedAt = new Date()
    confirmedOrder = await createOrder(customer, await getFirstRestaurantOfOwner(owner), confirmedOrder)
    const response = await request(app).patch(`/orders/${confirmedOrder.id}/deliver`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(409)
  })
  it('Should return 409 when trying to deliver a delivered order', async () => {
    let deliveredOrder = { ...(await getNewOrderData(await getFirstRestaurantOfOwner(owner))) }
    deliveredOrder.startedAt = new Date()
    deliveredOrder.sentAt = new Date()
    deliveredOrder.deliveredAt = moment().add(5, 'minutes').toDate()
    deliveredOrder = await createOrder(customer, await getFirstRestaurantOfOwner(owner), deliveredOrder)
    const response = await request(app).patch(`/orders/${deliveredOrder.id}/deliver`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(409)
  })
  it('Should return 200 when valid order', async () => {
    const newOrder = { ...(await getNewOrderData(await getFirstRestaurantOfOwner(owner))) }
    newOrder.startedAt = new Date()
    newOrder.sentAt = new Date()
    order = await createOrder(customer, await getFirstRestaurantOfOwner(owner), newOrder)
    const response = await request(app).patch(`/orders/${order.id}/deliver`).set('Authorization', `Bearer ${owner.token}`).send()
    expect(response.status).toBe(200)
  })
  it('Should return 200 when requesting order details', async () => {
    const response = await request(app).get(`/orders/${order.id}`).set('Authorization', `Bearer ${customer.token}`).send()
    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.startedAt).toBeDefined()
    expect(response.body.sentAt).toBeDefined()
    expect(response.body.deliveredAt).toBeDefined()
  })
  afterAll(async () => {
    await shutdownApp()
  })
})
