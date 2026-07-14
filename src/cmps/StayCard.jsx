import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HeartButton } from './HeartButton.jsx'
import { reviewService } from '../services/review'
import { getFakeDates } from '../services/util.service.js'

export function StayCard({ stay, onToggleHeart, children }) {
    const [rating, setRating] = useState(null)

    const fallbackImage = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
    const displayImg = stay.imgUrls && stay.imgUrls.length ? stay.imgUrls[0] : fallbackImage

    let fakeDateRange = ''
    let totalPrice = 0
    if (!children) {
        const fakeDates = getFakeDates(stay)
        const opts = { month: 'short', day: 'numeric' }
        const sameMonth = fakeDates.checkIn.getMonth() === fakeDates.checkOut.getMonth()
        fakeDateRange = `${fakeDates.checkIn.toLocaleDateString('en-US', opts)} – ${fakeDates.checkOut.toLocaleDateString('en-US', sameMonth ? { day: 'numeric' } : opts)}`
        const nights = Math.max(1, Math.round((fakeDates.checkOut - fakeDates.checkIn) / (1000 * 60 * 60 * 24)))
        totalPrice = stay.price * nights
    }

    useEffect(() => {
        if (children) return
        let isMounted = true
        reviewService.query({ targetId: stay._id, targetType: 'stay' })
            .then(reviews => {
                if (!isMounted) return
                if (!reviews?.length) return setRating(null)
                const avg = reviews.reduce((sum, r) => sum + (r.rate || r.rating || 0), 0) / reviews.length
                setRating(Number(avg.toFixed(1)))
            })
            .catch(() => { if (isMounted) setRating(null) })
        return () => { isMounted = false }
    }, [stay._id])

    return (
        <Link to={`/homes/${stay._id}`} className="stay-card">
            <div className="stay-card-img-wrapper">
                <img
                    src={displayImg}
                    alt={stay.name}
                    className="stay-card-img"
                    loading="lazy"
                />
                {!children && <HeartButton stay={stay} className="stay-card-heart" onToggleHeart={onToggleHeart} />}
            </div>
            <div className="stay-card-content">
                {children ?? (
                    <>
                        <h2 className="stay-card-title">{stay.type.charAt(0).toUpperCase() + stay.type.slice(1)} in {stay.loc.city}</h2>
                        <p className="stay-card-dates">{fakeDateRange}</p>
                        <p className="stay-card-price">
                            ₪{totalPrice.toLocaleString()} total
                            <span className="card-separator"> · </span>
                            {rating ? <>★{rating}</> : <span className="card-new">New</span>}
                        </p>
                    </>
                )}
            </div>
        </Link>
    )
}