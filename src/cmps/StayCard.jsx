import { Link } from 'react-router-dom'
import { Rating } from '@mui/material'

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
    const fakeDateRange = 'Jul 3 – 8'                                  // FAKE: no real availability dates in data
    const fakeRating = (4.7 + (stay._id.charCodeAt(0) % 30) / 100)     // FAKE: derive a stable 4.70–4.99 from id
        .toFixed(2)
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