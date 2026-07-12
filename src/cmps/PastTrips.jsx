import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadOrders } from '../store/actions/order.actions'
import { SkeletonLoader } from '../cmps/SkeletonLoader.jsx'

export function PastTrips() {
    const user = useSelector(storeState => storeState.userModule.user)
    const trips = useSelector(storeState => storeState.orderModule.guestOrders) || []
    const [isLoading, setIsLoading] = useState(true)
    const [isShowingPast, setIsShowingPast] = useState(false)

    useEffect(() => {
        if (!user?._id) {
            setIsLoading(false)
            return
        }
        setIsLoading(true)
        loadOrders({ buyerId: user._id })
            .finally(() => setIsLoading(false))
    }, [user?._id])

    const { upcomingTrips, pastTrips } = useMemo(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const upcoming = []
        const past = []

        trips.forEach(trip => {
            if (!trip.endDate) return
            const tripEnd = new Date(trip.endDate)
            tripEnd.setHours(0, 0, 0, 0)
            if (tripEnd < today) past.push(trip)
            else upcoming.push(trip)
        })

        past.sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
        upcoming.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

        return { upcomingTrips: upcoming, pastTrips: past }
    }, [trips])

    const shownTrips = isShowingPast ? pastTrips : upcomingTrips

    const tripsByYear = useMemo(() => {
        const groups = {}
        shownTrips.forEach(trip => {
            const year = new Date(trip.endDate).getFullYear()
            if (!groups[year]) groups[year] = []
            groups[year].push(trip)
        })
        return groups
    }, [shownTrips])

    const sortedYears = useMemo(() => {
        const years = Object.keys(tripsByYear)
        return isShowingPast ? years.sort((a, b) => b - a) : years.sort((a, b) => a - b)
    }, [tripsByYear, isShowingPast])

    if (isLoading) {
        return <SkeletonLoader variant="past-trips" isLoading={isLoading} />
    }

    return (
        <section className="past-trips-section">
            <h2 className="trips-section-title">Trips</h2>

            <div className="orders-toggle">
                <button
                    className={!isShowingPast ? 'active' : ''}
                    onClick={() => setIsShowingPast(false)}
                >
                    Upcoming ({upcomingTrips.length})
                </button>
                <button
                    className={isShowingPast ? 'active' : ''}
                    onClick={() => setIsShowingPast(true)}
                >
                    Past ({pastTrips.length})
                </button>
            </div>

            {!shownTrips.length ? (
                <div className="no-trips-container">
                    <p className="no-trips-text">
                        {isShowingPast ? 'No past trips yet' : 'No upcoming trips'}
                    </p>
                    <p className="no-trips-subtext">
                        Time to dust off your bags and start planning your next adventure.
                    </p>
                </div>
            ) : (
                <div className="timeline-container">
                    {sortedYears.map(year => (
                        <React.Fragment key={year}>
                            <div className="timeline-year-badge">
                                <span className="timeline-year-text">{year}</span>
                            </div>

                            <div className="trips-timeline-stack">
                                {tripsByYear[year].map((trip, idx) => {
                                    const stay = trip.stay || {}
                                    const startDisplay = trip.startDate
                                        ? new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                                        : ''
                                    const endDisplay = trip.endDate
                                        ? new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                                        : ''

                                    const displayCity = stay.loc?.city || stay.name || 'Trip'
                                    const displayImg = trip.imgUrl || stay.imgUrls?.[0] || '/img/default-stay.png'

                                    return (
                                        <div key={trip._id || idx} className="timeline-trip-card">
                                            <div className="timeline-card-img-wrapper">
                                                <img src={displayImg} alt={displayCity} className="timeline-card-img" />
                                            </div>

                                            <div className="timeline-card-info">
                                                <h3 className="timeline-card-title">{displayCity}</h3>
                                                <p className="timeline-card-dates">{startDisplay} – {endDisplay}, {year}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </section>
    )
}