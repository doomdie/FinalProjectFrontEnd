import { stayService } from '../../services/stays'
import { store } from '../store'
export async function loadStays(filterBy) {
    try {
        const stays = await stayService.query(filterBy)
        store.dispatch(getCmdSetStays(stays))
    } catch (err) {
        console.log('Cannot load stays', err)
        throw err
    }
}
