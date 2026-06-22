export const SET_STAYS = 'SET_STAYS'
export const SET_STAY = 'SET_STAY'
export const ADD_STAY = 'ADD_STAY'


const initialState = {
    stays: [],
    stay: null
}

export function stayReducer(state = initialState, action) {
    var newState = state
    var stays
    switch (action.type) {
        case SET_STAYS:
            newState = { ...state, stays: action.stays }
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