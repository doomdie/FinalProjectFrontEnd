export const SET_STAYS = 'SET_STAYS'
export const SET_STAY = 'SET_STAY'
export const ADD_STAY = 'ADD_STAY'
export const SET_HOST_STAYS = 'SET_HOST_STAYS'


const initialState = {
    stays: null,
    stay: null,
    hostStays: [],
    isLoading: true
}

export function stayReducer(state = initialState, action) {
    var newState = state
    var stays
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
        default:

    }
    return newState
}