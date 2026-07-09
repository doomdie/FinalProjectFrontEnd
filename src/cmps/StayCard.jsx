import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Rating } from '@mui/material'

import { SvgIcon } from '../services/svg.service.jsx'
import { HeartButton } from './HeartButton.jsx'
import { getFakeRating, getFakeDates } from '../services/util.service.js'


export function StayCard({ stay }) {
    // --- YAIR'S VERSION ---
    // console.log(stay)
    const fallbackImage = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
    const displayImg = stay.imgUrls && stay.imgUrls.length ? stay.imgUrls[0] : fallbackImage

    // --- BORIS' LOCAL IMAGES ---
    // const myImgs = ['/img/stay1.jpeg', '/img/stay2.jpeg', '/img/stay3.jpeg', '/img/stay4.jpeg', '/img/stay5.jpeg', '/img/stay6.jpeg', '/img/stay7.jpeg', '/img/stay8.jpeg']
    // const displayImg = myImgs[Math.floor(Math.random() * myImgs.length)]



    // ===== FAKE ADDED INFO TO LOOK LIKE AIRBNB =====
    // No availability/rating data — derived deterministically from _id, shared via util.service
    const fakeDates = getFakeDates(stay)
    const opts = { month: 'short', day: 'numeric' }
    const sameMonth = fakeDates.checkIn.getMonth() === fakeDates.checkOut.getMonth()
    const fakeDateRange = `${fakeDates.checkIn.toLocaleDateString('en-US', opts)} – ${fakeDates.checkOut.toLocaleDateString('en-US', sameMonth ? { day: 'numeric' } : opts)}`
    const nights = Math.max(1, Math.round((fakeDates.checkOut - fakeDates.checkIn) / (1000 * 60 * 60 * 24)))
    const fakeRating = getFakeRating(stay)
    const totalPrice = stay.price * nights
    // ===============================================



    return (
        <Link to={`/homes/${stay._id}`} className="stay-card">
            <div className="stay-card-img-wrapper">
                <img
                    src={displayImg}
                    alt={stay.name}
                    className="stay-card-img"
                    loading="lazy"
                />

                <HeartButton stayId={stay._id} className="stay-card-heart" />
            </div>

            <div className="stay-card-content">
                {/* title: "<roomType> in <city>" — Airbnb style */}
                <h2 className="stay-card-title">{stay.type || 'Stay'} in {stay.loc.city}</h2>

                {/* FAKE date range */}
                <p className="stay-card-dates">{fakeDateRange}</p>

                {/* price (real nightly × fake nights) + FAKE rating */}
                <p className="stay-card-price">
                    ₪{totalPrice.toLocaleString()} total
                    <span className="card-separator"> · </span>
                    ★{fakeRating}
                </p>
            </div>
        </Link>
    )
}