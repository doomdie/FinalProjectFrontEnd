export const SET_HOST_ORDERS = 'SET_HOST_ORDERS'
export const SET_GUEST_ORDERS = 'SET_GUEST_ORDERS'
export const ADD_ORDER = 'ADD_ORDER'
export const REMOVE_ORDER = 'REMOVE_ORDER'
export const UPDATE_ORDER = 'UPDATE_ORDER'

const initialState = {
    hostOrders: [],
    guestOrders: []
}

export function orderReducer(state = initialState, action) {
    switch (action.type) {
        case SET_HOST_ORDERS:
            return { ...state, hostOrders: action.orders }

        case SET_GUEST_ORDERS:
            return { ...state, guestOrders: action.orders }

        case ADD_ORDER:
            return {
                ...state,
                guestOrders: [...state.guestOrders, action.order],
                hostOrders: [...state.hostOrders, action.order]
            }

        case UPDATE_ORDER:
            return {
                ...state,
                hostOrders: state.hostOrders.map(order => order._id === action.order._id ? action.order : order),
                guestOrders: state.guestOrders.map(order => order._id === action.order._id ? action.order : order)
            }

        case REMOVE_ORDER:
            return {
                ...state,
                hostOrders: state.hostOrders.filter(order => order._id !== action.orderId),
                guestOrders: state.guestOrders.filter(order => order._id !== action.orderId)
            }

        default:
            return state
    }
}