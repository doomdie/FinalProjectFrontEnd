import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Rating } from '@mui/material'

import { SvgIcon } from '../services/svg.service.jsx'
import { HeartButton } from './HeartButton.jsx'

export function StayCard({ stay }) {
    // --- YAIR'S VERSION ---
    // console.log(stay)
    const fallbackImage = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
    const displayImg = stay.imgUrls && stay.imgUrls.length ? stay.imgUrls[0] : fallbackImage

    // --- BORIS' LOCAL IMAGES ---
    // const myImgs = ['/img/stay1.jpeg', '/img/stay2.jpeg', '/img/stay3.jpeg', '/img/stay4.jpeg', '/img/stay5.jpeg', '/img/stay6.jpeg', '/img/stay7.jpeg', '/img/stay8.jpeg']
    // const displayImg = myImgs[Math.floor(Math.random() * myImgs.length)]




    // ===== FAKE ADDED INFO TO LOOK LIKE AIRBNB =====
    // Our stay data has no per-listing availability dates or numeric rating,
    // so these are faked for display only. Replace with real data if it ever exists.
    // FAKE dates — no availability data, so derive a stable, varied range from the id
    // FAKE dates + rating — derived from the END of the id (start chars are identical across stays)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const idLen = stay._id.length
    // scramble id chars so dates vary; keep them in Jul–Aug (near-future, like real Airbnb)
    const dateSeed = stay._id.charCodeAt(idLen - 1) * 13 + stay._id.charCodeAt(idLen - 2) * 29 + stay._id.charCodeAt(idLen - 3) * 5
    const startDay = 1 + (dateSeed % 27)                              // 1–27
    const span = 3 + ((dateSeed >> 2) % 6)                           // 3–8 nights
    const monthIdx = 6 + ((dateSeed >> 4) % 2)                        // 6=Jul or 7=Aug only
    const endDay = Math.min(startDay + span, 30)                     // cap end at 28 so no invalid days
    const fakeDateRange = `${months[monthIdx]} ${startDay} – ${endDay}`
    // scramble several id chars so ratings look random, not sequential; parseFloat drops trailing zeros (4.80 → 4.8)
    const ratingSeed = stay._id.charCodeAt(idLen - 1) * 31 + stay._id.charCodeAt(idLen - 2) * 17 + stay._id.charCodeAt(idLen - 3) * 7
    const fakeRating = parseFloat((4.6 + (ratingSeed % 40) / 100).toFixed(2))  // FAKE: 4.60–4.99, scrambled, no trailing zero
    const nights = 5                                                   // FAKE: matches fakeDateRange span
    const totalPrice = stay.price * nights                             // total = real nightly price × fake nights
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