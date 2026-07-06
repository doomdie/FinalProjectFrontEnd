import { httpService } from '../http.service'

export const orderService = {
    query,
    getById,
    save,
    remove,
    getEmptyOrder
}

async function query(filterBy = {}) {
    return httpService.get('order', filterBy)
}

function getById(orderId) {
    return httpService.get(`order/${orderId}`)
}

async function remove(orderId) {
    return httpService.delete(`order/${orderId}`)
}

async function save(order) {
    let savedOrder
    if (order._id) {
        savedOrder = await httpService.put(`order/${order._id}`, order)
    } else {
        savedOrder = await httpService.post('order', order)
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