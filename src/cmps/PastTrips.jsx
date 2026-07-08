import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { loadOrders } from '../store/actions/order.actions'

export function PastTrips() {
    const user = useSelector(storeState => storeState.userModule.user)
    const trips = useSelector(storeState => storeState.orderModule.guestOrders) || []

    useEffect(() => {
        if (!user?._id) return
        loadOrders({ buyerId: user._id })
    }, [user?._id])

    const completedTrips = useMemo(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return trips
            .filter(trip => {
                if (!trip.endDate) return false
                const tripEnd = new Date(trip.endDate)
                tripEnd.setHours(0, 0, 0, 0)
                return tripEnd < today
            })
            .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
    }, [trips])

    const tripsByYear = useMemo(() => {
        const groups = {}
        completedTrips.forEach(trip => {
            const year = new Date(trip.endDate).getFullYear()
            if (!groups[year]) groups[year] = []
            groups[year].push(trip)
        })
        return groups
    }, [completedTrips])

    const sortedYears = useMemo(() => {
        return Object.keys(tripsByYear).sort((a, b) => b - a)
    }, [tripsByYear])

    if (!completedTrips.length) {
        return (
            <div className="no-trips-container">
                <p className="no-trips-text">No past trips found.</p>
            </div>
        )
    }

    return (
        <section className="past-trips-section">
            <h2 className="trips-section-title">Past trips</h2>

            <div className="timeline-container">
                {sortedYears.map((year, yearIdx) => (
                    <React.Fragment key={year}>

                        <div className="timeline-year-badge">
                            <span className="timeline-year-text">{year}</span>
                        </div>

                        <div className="trips-timeline-stack">
                            {tripsByYear[year].map((trip) => {
                                const stay = trip.stay || {}
                                const startDisplay = trip.startDate
                                    ? new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                                    : ''
                                const endDisplay = trip.endDate
                                    ? new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                    : ''

                                const displayCity = stay.loc?.city || "Budapest"
                                const displayImg = stay.imgUrls?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'

                                return (
                                    <div key={trip._id || trip.id || Math.random()} className="timeline-trip-card">
                                        <div className="timeline-card-img-wrapper">
                                            <img src={displayImg} alt={displayCity} className="timeline-card-img" />
                                        </div>

                                        <div className="timeline-card-info">
                                            <h3 className="timeline-card-title">{displayCity}</h3>
                                            <p className="timeline-card-dates">{startDisplay} – {endDisplay.split(',')[0]}, {year}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </React.Fragment>
                ))}
            </div>
        </section>
    )
}