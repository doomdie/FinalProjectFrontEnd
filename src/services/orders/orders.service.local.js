import { storageService } from '../async-storage.service.js'
import { userService } from '../user/user.service.local.js'
import gDefaultOrders from './orders.json'
const STORAGE_KEY = 'order'

export const orderService = {
    query,
    getById,
    save,
    remove,
    getEmptyOrder
}
_createOrders()
async function query(filterBy = {}) {
    var orders = await storageService.query(STORAGE_KEY)

    if (filterBy.hostId) {
        orders = orders.filter(order => order.hostId === filterBy.hostId)
    }
        if (filterBy.buyerId) {
            orders = orders.filter(order =>
                order.buyer?._id === filterBy.buyerId ||
                order.buyer?.id === filterBy.buyerId
            )
        }
        if (filterBy.status) {
            orders = orders.filter(order => order.status === filterBy.status)
        }

        return orders
    }

    function getById(orderId) {
        return storageService.get(STORAGE_KEY, orderId)
    }

    async function remove(orderId) {
        return storageService.remove(STORAGE_KEY, orderId)
    }

    async function save(order) {
        var savedOrder
        if (order._id) {
            savedOrder = await storageService.put(STORAGE_KEY, order)
        } else {
            savedOrder = await storageService.post(STORAGE_KEY, order)
        }
        return savedOrder
    }

    function getEmptyOrder() {
        return {
            hostId: '',
            buyer: {
                _id: '',
                fullname: ''
            },
            stay: {
                _id: '',
                name: '',
                price: 0
            },
            startDate: '',
            endDate: '',
            guests: {
                adults: 1,
                children: 0,
                infants: 0,
                pets: 0
            },
            totalPrice: 0,
            status: 'pending'
        }
    }
    function _createOrders() {
        let orders = JSON.parse(localStorage.getItem(STORAGE_KEY))
        if (!orders || !orders.length) {
            orders = gDefaultOrders
            localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
        }
    }