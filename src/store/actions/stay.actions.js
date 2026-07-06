// import { stayService } from '../../services/stays/stays.service.local'
import { stayService } from '../../services/stays'
import { store } from '../store'
import { SET_STAYS, SET_STAY, ADD_STAY, SET_HOST_STAYS } from '../reducers/stay.reducer'

export async function loadStays(filterBy) {
    try {
        store.dispatch({ type: 'SET_IS_LOADING', isLoading: true })
        const stays = await stayService.query(filterBy)
        store.dispatch(getCmdSetStays(stays))
    } catch (err) {
        console.log('Cannot load stays', err)
        store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
        throw err
    }
}
//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// export async function loadHostStays(hostId) {
//     try {
//         const stays = await stayService.query({ byUserId: hostId, hostId: hostId, userId: hostId })
//         store.dispatch(getCmdSetHostStays(stays))
//     } catch (err) {
//         console.error('Cannot load host stays', err)
//         throw err
//     }
// }
export async function loadHostStays(hostId) {
    try {
        store.dispatch({ type: 'SET_IS_LOADING', isLoading: true })
        const stays = await stayService.query({ byUserId: hostId, hostId: hostId, userId: hostId })
        store.dispatch(getCmdSetHostStays(stays))
        store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    } catch (err) {
        console.error('Cannot load host stays', err)
        store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
        throw err
    }
}
export async function removeStay() {
    console.log("ugh")
}
export async function loadStay(stayId) {
    try {
        store.dispatch({ type: 'SET_IS_LOADING', isLoading: true })

        const stay = await stayService.getById(stayId)
        store.dispatch(getCmdSetStay(stay))

        store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
    } catch (err) {
        console.log('Cannot load stay', err) 
        store.dispatch({ type: 'SET_IS_LOADING', isLoading: false })
        throw err
    }
}
export async function addStay(stay) {
    try {
        const savedStay = await stayService.save(stay)
        store.dispatch(getCmdAddStay(savedStay))
        return savedStay
    } catch (err) {
        console.log('Cannot add car', err)
        throw err
    }
}


function getCmdSetStays(stays) {
    return {
        type: SET_STAYS,
        stays
    }
}
function getCmdSetStay(stay) {
    return {
        type: SET_STAY,
        stay
    }
}
function getCmdAddStay(stay) {
    return {
        type: ADD_STAY,
        stay
    }
}
function getCmdSetHostStays(hostStays) {
    return {
        type: SET_HOST_STAYS,
        hostStays
    }
}