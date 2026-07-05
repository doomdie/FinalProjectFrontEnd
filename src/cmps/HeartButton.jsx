import { useState } from 'react'
import { SvgIcon } from '../services/svg.service.jsx'
import { wishlistService } from '../services/stays/wishlist.service.js'

// one heart to rule them all — persisted via wishlistService, works on any card
export function HeartButton({ stayId, className = '' }) {
    const [isLiked, setIsLiked] = useState(() => wishlistService.isLiked(stayId))

    function onToggle(ev) {
        ev.preventDefault()     
        ev.stopPropagation()
        wishlistService.toggleLike(stayId)
        setIsLiked(prev => !prev)
    }

    return (
        <span className={`${className} ${isLiked ? 'liked' : ''}`} onClick={onToggle}>
            <SvgIcon iconName="heart" />
        </span>
    )
}