import { stayService } from '../../services/stays'
import { store } from '../store'
import {SET_STAYS } from '../reducers/stay.reducer'

export async function loadStays(filterBy) {
    try {
        const stays = await stayService.query(filterBy)
        console.log(stays)
         store.dispatch(getCmdSetStays(stays))
    } catch (err) {
        console.log('Cannot load stays', err)
        throw err
    }
}
function getCmdSetStays(stays) {
    return {
        type: SET_STAYS,
        stays
    }
}