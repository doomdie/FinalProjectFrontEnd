export const ADD_ORDER = 'ADD_ORDER'
export const REMOVE_ORDER = 'REMOVE_ORDER'
export const UPDATE_ORDER = 'UPDATE_ORDER'
export const SET_ORDERS = 'SET_ORDERS'

const initialState = {
    orders: []
}

export function orderReducer(state = initialState, action) {
    var newState = state
    switch (action.type) {
        case SET_ORDERS:
            newState = { ...state, orders: action.orders }
            break
        case ADD_ORDER:
            newState = { ...state, orders: [...state.orders, action.order] }
            break
        case UPDATE_ORDER:
            newState = {
                ...state,
                orders: state.orders.map(order => order._id === action.order._id ? action.order : order)
            }
            break
        case REMOVE_ORDER:
            newState = {
                ...state,
                orders: state.orders.filter(order => order._id !== action.orderId)
            }
            break
        default:
    }
    return newState
}