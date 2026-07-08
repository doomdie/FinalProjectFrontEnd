import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { stayService } from '../services/stays'
import { StayCard } from '../cmps/StayCard.jsx'
import { socketService } from '../services/socket.service.js'

export function WishlistPage() {
    const [likedStays, setLikedStays] = useState(null)
    const user = useSelector(storeState => storeState.userModule.user)
    
    const userIdRef = useRef(null)

    useEffect(() => {
        if (user) {
            userIdRef.current = user._id || user.id
        }
    }, [user])

    useEffect(() => {
        if (user) {
            loadLikedStays()
            socketService.on('stay-like-toggled', handleRemoteLikeToggle)
        }

        return () => {
            socketService.off('stay-like-toggled', handleRemoteLikeToggle)
        }
    }, [user])

    async function loadLikedStays() {
        try {
            const currentUserId = user?._id?.toString() || user?.id?.toString()            
            const stays = await stayService.query({ likedByUserId: currentUserId })
            setLikedStays(stays ? [...stays] : []) // Force clean array reference clone on load
        } catch (err) {
            console.error('Cannot load liked stays:', err)
            setLikedStays([])
        }
    }

    function handleRemoteLikeToggle({ stayId, likedByUsers }) {
        const currentUserId = userIdRef.current
        if (!currentUserId) return

        const myIdStr = currentUserId.toString()
        const stringifiedLikedByUsers = (likedByUsers || []).map(id => id?.toString())
        const isStillLikedByMe = stringifiedLikedByUsers.includes(myIdStr)

        if (!isStillLikedByMe) {
            setLikedStays(prevStays => {
                if (!prevStays) return null
                
                const updatedList = prevStays.filter(stay => {
                    const sId = stay._id || stay.id
                    return String(sId) !== String(stayId)
                })
                
                return [...updatedList] 
            })
        } else {
            setLikedStays(prevStays => {
                if (!prevStays) return null
                const exists = prevStays.some(stay => {
                    const sId = stay._id || stay.id
                    return String(sId) === String(stayId)
                })
                if (!exists) {
                    setTimeout(() => loadLikedStays(), 0)
                }
                return prevStays
            })
        }
    }

    function onRemoveFromWishlist(stayId) {
        setLikedStays(prevStays => {
            if (!prevStays) return null
            const updatedList = prevStays.filter(stay => {
                const sId = stay._id || stay.id
                return String(sId) !== String(stayId)
            })
            return [...updatedList]
        })
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
                        {likedStays.map(stay => (
                            <StayCard 
                                key={stay._id || stay.id} 
                                stay={stay} 
                                onToggleHeart={onRemoveFromWishlist} 
                            />
                        ))}
                    </div>
                )}
        </section>
    )
}