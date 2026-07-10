import { wishlistService } from '../../services/stays/wishlist.service.js'

export const SET_STAYS = 'SET_STAYS'
export const SET_STAY = 'SET_STAY'
export const ADD_STAY = 'ADD_STAY'
export const SET_HOST_STAYS = 'SET_HOST_STAYS'
export const TOGGLE_WISHLIST = 'TOGGLE_WISHLIST'
export const SET_WISHLIST = 'SET_WISHLIST'


const initialState = {
    stays: null,
    stay: null,
    hostStays: [],
    isLoading: true,
    wishlist: wishlistService.getLikedIds()
}

export function stayReducer(state = initialState, action) {
    var newState = state
    switch (action.type) {
        case SET_HOST_STAYS:
            newState = { ...state, hostStays: action.hostStays }
            break
        case SET_STAYS:
            newState = { ...state, stays: action.stays, isLoading: false }
            break
        case ADD_STAY:
            newState = { ...state, stays: [...state.stays, action.stay] }
            break
        case SET_STAY:
            newState = { ...state, stay: action.stay }
            break
        case TOGGLE_WISHLIST:
            newState = { ...state, wishlist: wishlistService.setLiked(action.stayId, action.isLiked) }
            break
        case SET_WISHLIST:
            newState = { ...state, wishlist: wishlistService.setAll(action.wishlist) }
            break
        default:

    }
    return newState
}