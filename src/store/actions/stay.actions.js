import { stayService } from '../../services/stays'
import { store } from '../store'
import { SET_STAYS, SET_STAY } from '../reducers/stay.reducer'

export async function loadStays(filterBy) {
    try {
        const stays = await stayService.query(filterBy)
        // console.log(stays)
        store.dispatch(getCmdSetStays(stays))
    } catch (err) {
        console.log('Cannot load stays', err)
        throw err
    }
}
export async function loadStay(stayId) {
    try {
        const stay = await stayService.getById(stayId)
        store.dispatch(getCmdSetStay(stay))
    } catch (err) {
        console.log('Cannot load car', err)
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