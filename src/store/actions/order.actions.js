import { orderService } from '../../services/orders/orders.service.local'
import { store } from '../store'

export async function loadOrders(filterBy) {
    try {
        console.log("HI")
        const orders = await orderService.query(filterBy)
        store.dispatch({ type: 'SET_ORDERS', orders })
    } catch  {
        console.('Cannot load orders')
    }
}

export async function saveOrder(order) {
    try {
        const savedOrder = await orderService.save(order)
        const type = order._id ? 'UPDATE_ORDER' : 'ADD_ORDER'
        store.dispatch({ type, order: savedOrder })
        return savedOrder
    } catch (err) {
        console.error('Cannot save order', err)
        throw err
    }
}