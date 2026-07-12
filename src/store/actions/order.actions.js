import { orderService } from '../../services/orders/'
import { store } from '../store'
import { SET_HOST_ORDERS, SET_GUEST_ORDERS } from '../reducers/order.reducer'
export async function loadOrders(filterBy = {}) {
    try {
        const orders = await orderService.query(filterBy)
        
        if (filterBy?.hostId) {
            store.dispatch({ type: SET_HOST_ORDERS, orders })
        } else if (filterBy?.buyerId) {
            store.dispatch({ type: SET_GUEST_ORDERS, orders })
        }
    } catch (err) {
        console.error('Cannot load orders', err)
        throw err
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