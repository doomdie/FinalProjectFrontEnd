import React from 'react'

export function StayCard({ stay }) {
    return (
        <div className="stay-card">
            <h2>{stay.name}</h2>
            <p>Type: {stay.type}</p>
            <p>Price: ${stay.price} / night</p>
            <p>Location: {stay.loc.city}, {stay.loc.country}</p>
        </div>
    )
}