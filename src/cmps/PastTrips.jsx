import React from 'react'

export function PastTrips({ trips }) {
    console.log(trips)
    if (!trips) {
        return <p>Loading trips...</p>
    }

    return (
        <section className="past-trips-section">
            <h2>Past Trips</h2>
            
            {trips.length === 0 ? (
                <p className="no-trips-text">No past trips found.</p>
            ) : (
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
                                    <p className="trip-price">Total Paid: ${trip.totalPrice || trip.price || '0'}</p>
                                    <span className="trip-status-badge">
                                        Completed
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}