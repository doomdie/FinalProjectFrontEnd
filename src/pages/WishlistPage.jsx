import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { stayService } from '../services/stays'
import { StayCard } from '../cmps/StayCard.jsx'

export function WishlistPage() {
    const [likedStays, setLikedStays] = useState(null)
    const user = useSelector(storeState => storeState.userModule.user)

    useEffect(() => {
        if (user) {
            loadLikedStays()
        }
    }, [user])

    async function loadLikedStays() {
        try {
            const currentUserId = user?._id?.toString() || user?.id?.toString()            
            const stays = await stayService.query({ likedByUserId: currentUserId })
            setLikedStays(stays || [])
        } catch (err) {
            console.error('Cannot load liked stays:', err)
            setLikedStays([])
        }
    }
    function onRemoveFromWishlist(stayId) {
        setLikedStays(prevStays => prevStays.filter(stay => stay._id !== stayId))
    }

    if (!user) {
        return (
            <section className="wishlist-page">
                <h1 className="wishlist-title">Wishlist</h1>
                <p className="wishlist-empty">Please log in to view your wishlist.</p>
            </section>
        )
    }

    if (!likedStays) return null

    return (
        <section className="wishlist-page">
            <h1 className="wishlist-title">Wishlist</h1>

            {!likedStays.length
                ? <p className="wishlist-empty">No saved stays yet — tap the heart on any stay to save it here.</p>
                : (
                    <div className="stay-list">
                        {likedStays.map(stay => <StayCard key={stay._id} stay={stay} onToggleHeart={onRemoveFromWishlist} />)}
                    </div>
                )}
        </section>
    )
}