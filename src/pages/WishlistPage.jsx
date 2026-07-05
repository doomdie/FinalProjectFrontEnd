import { useState, useEffect } from 'react'
import { stayService } from '../services/stays'
import { StayCard } from '../cmps/StayCard.jsx'
import { wishlistService } from '../services/stays/wishlist.service.js'

export function WishlistPage() {
    const [likedStays, setLikedStays] = useState(null)

    useEffect(() => {
        loadLikedStays()
    }, [])

    async function loadLikedStays() {
        const likedIds = wishlistService.getLikedIds()
        const stays = await stayService.query()
        setLikedStays((stays || []).filter(stay => likedIds.includes(stay._id)))
    }

    if (!likedStays) return null

    return (
        <section className="wishlist-page">
            <h1 className="wishlist-title">Wishlist</h1>

            {!likedStays.length
                ? <p className="wishlist-empty">No saved stays yet — tap the heart on any stay to save it here.</p>
                : (
                    <div className="stay-list">
                        {likedStays.map(stay => <StayCard key={stay._id} stay={stay} />)}
                    </div>
                )}
        </section>
    )
}