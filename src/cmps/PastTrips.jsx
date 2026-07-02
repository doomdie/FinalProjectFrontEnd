import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadOrders } from '../store/actions/order.actions'

export function PastTrips() {
    const user = useSelector(storeState => storeState.userModule.user)
    const trips = useSelector(storeState => storeState.orderModule.guestOrders) || []

    useEffect(() => {
        if (!user?._id) return
        loadOrders({ buyerId: user._id })
    }, [user?._id])

    if (!trips.length) {
        return <p className="no-trips-text">No past trips found.</p>
    }

    return (
        <section className="past-trips-section">
            <h2>Past Trips</h2>

            <div className="trips-grid">
                {trips.map((trip) => {
                    const startDisplay = trip.startDate ? new Date(trip.startDate).toLocaleDateString() : ''
                    const endDisplay = trip.endDate ? new Date(trip.endDate).toLocaleDateString() : ''

                    return (
                        <div key={trip._id || trip.id || Math.random()} className="trip-card">
                            <img
                                src={trip.stay?.imgUrls?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500'}
                                alt={trip.stay?.name || 'Stay'}
                                className="trip-image"
                            />

                            <div className="trip-details">
                                <h3>{trip.stay?.name || 'Previous Stay'}</h3>
                                <p className="trip-host">Hosted by {trip.stay?.host?.fullname || 'Host'}</p>
                                <p className="trip-dates">
                                    {startDisplay} - {endDisplay}
                                </p>
                                <p className="trip-price">Total Paid: ₪{trip.totalPrice || trip.price || '0'}</p>
                                <span className="trip-status-badge">
                                    {trip.status || 'Completed'}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}