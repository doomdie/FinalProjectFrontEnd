import { useSelector } from 'react-redux'
import { SvgIcon } from '../services/svg.service.jsx'
import { httpService } from '../services/http.service.js'
import { store } from '../store/store.js'
import { TOGGLE_WISHLIST } from '../store/reducers/stay.reducer.js'
import { showErrorMsg } from '../services/event-bus.service'

export function HeartButton({ stay, className = '', onToggleHeart }) {
    const user = useSelector(storeState => storeState.userModule.user)
    const wishlist = useSelector(storeState => storeState.stayModule.wishlist)

    const stayId = stay?._id
    const isLiked = stayId ? wishlist.includes(stayId) : false

    async function onToggle(ev) {
        ev.preventDefault()
        ev.stopPropagation()

        if (!stayId) return
        if (!user) {
            showErrorMsg('Please log in to save wishlists')
            return
        }

        const nextIsLiked = !isLiked
        store.dispatch({ type: TOGGLE_WISHLIST, stayId, isLiked: nextIsLiked })

        try {
            if (nextIsLiked) await httpService.post(`stay/${stayId}/like`)
            else await httpService.delete(`stay/${stayId}/like`)

            if (onToggleHeart) onToggleHeart(stayId)
        } catch (err) {
            showErrorMsg('Could not update wishlist')
            store.dispatch({ type: TOGGLE_WISHLIST, stayId, isLiked: isLiked })
        }
    }

    return (
        <span className={`${className} ${isLiked ? 'liked' : ''}`} onClick={onToggle}>
            <SvgIcon iconName="heart" />
        </span>
    )
}