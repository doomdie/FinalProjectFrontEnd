import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { stayService } from '../services/stays'
import { StayCard } from '../cmps/StayCard.jsx'
import { SkeletonLoader } from '../cmps/SkeletonLoader.jsx'
export function HostListings() {
    const [stays, setStays] = useState(null)

    const user = useSelector(storeState => storeState.userModule.user)

    useEffect(() => {
        if (user?._id) {
            loadHostStays()
        }
    }, [user?._id])

    async function loadHostStays() {
        try {
            const hostStays = await stayService.query({ hostId: user._id })
            setStays(hostStays || [])
        } catch (err) {
            console.error('Cannot load host listings:', err)
            setStays([])
        }
    }

    if (!user) {
        return (
            <section className="host-listings-page">
                <p>Please log in to view your listings.</p>
            </section>
        )
    }

    if (!stays) {
        return (
            <section className="host-listings-page">
                <div className="host-dashboard-grid">
                    <SkeletonLoader variant="card-grid" count={8} isLoading={true} />
                </div>
            </section>
        )
    }
    return (
        <section className="host-listings-page">
            {!stays.length ? (
                <p className="listings-empty">You haven't created any listings yet.</p>
            ) : (
                <div className="host-dashboard-grid">
                    {stays.map(stay => (
                        <StayCard
                            key={stay._id || stay.id}
                            stay={stay}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}