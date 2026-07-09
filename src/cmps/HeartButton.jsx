import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SvgIcon } from '../services/svg.service.jsx'
import { httpService } from '../services/http.service.js'
import { showErrorMsg } from '../services/event-bus.service'

export function HeartButton({ stay, className = '', onToggleHeart }) {
    const user = useSelector(storeState => storeState.userModule.user)
    const userId = user?._id || user?.id

    // Safety guard: If stay is missing, don't crash, just default to an empty object
    const currentStay = stay || {}
    
    const isCurrentlyLiked = currentStay.likedByUsers?.includes(userId) || false
    const [isLiked, setIsLiked] = useState(isCurrentlyLiked)

    useEffect(() => {
        setIsLiked(isCurrentlyLiked)
    }, [currentStay.likedByUsers, userId])

    async function onToggle(ev) {
        ev.preventDefault()     
        ev.stopPropagation()

        if (!currentStay._id) {
            console.error('Cannot toggle like: Missing stay data object.')
            return
        }

        if (!user) {
            showErrorMsg('Please log in to save wishlists')
            return
        }

        const nextLikedState = !isLiked
        setIsLiked(nextLikedState)

        try {
            if (nextLikedState) {
                await httpService.post(`stay/${currentStay._id}/like`)
            } else {
                await httpService.delete(`stay/${currentStay._id}/like`)
            }
            if (onToggleHeart) {
                    onToggleHeart(stay._id)
                }
        } catch (err) {
            console.error('Failed to update wishlist server side:', err)
            showErrorMsg('Could not update wishlist')
            setIsLiked(!nextLikedState)
        }
    }

    return (
        <span className={`${className} ${isLiked ? 'liked' : ''}`} onClick={onToggle}>
            <SvgIcon iconName="heart" />
        </span>
    )
}