import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Rating } from '@mui/material'

const ratingSx = {
    '& .MuiRating-icon': { height: '0.75rem', width: '0.75rem', marginRight: '1px' },
    '& .MuiRating-icon svg': { height: '100%', width: '100%' },
    '& .MuiRating-iconFilled': { color: '#222222' },
    '& .MuiRating-iconEmpty': { color: '#e3e3e3' },
}

function getReviewer(review) {
    const byUser = review.byUser
    if (!byUser) return { fullname: 'Anonymous', imgUrl: '/img/default-user.png', location: 'Guest' }
    return {
        _id: byUser._id,
        fullname: byUser.fullname || 'Guest',
        imgUrl: byUser.imgUrl || '/img/default-user.png',
        location: byUser.location || 'Guest',
    }
}

function getReviewDate(review) {
    const raw = review.createdAt || review.at
    if (!raw) return ''
    return new Date(raw).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// function ProfileReviewCard({ review }) {
//     const [isExpanded, setIsExpanded] = useState(false)
//     const reviewer = getReviewer(review)
//     const isLong = (review.txt || '').length > 180

//     return (
//         <article className="profile-review-card">
//             <header className="review-header">
//                 <img src={reviewer.imgUrl} alt={reviewer.fullname} className="reviewer-avatar" />
//                 <div className="reviewer-details">
//                     <h3 className="reviewer-name">{reviewer.fullname}</h3>
//                     <p className="reviewer-location">{reviewer.location}</p>
//                 </div>
//             </header>
//             <time className="review-date">{getReviewDate(review)}</time>
//             <p className={`review-text ${isExpanded ? 'expanded' : ''}`}>{review.txt}</p>
//             {isLong && !isExpanded && (
//                 <button className="review-show-more" onClick={() => setIsExpanded(true)}>Show more</button>
//             )}
//         </article>
//     )
// }
function ProfileReviewCard({ review }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const reviewer = getReviewer(review)
    const isLong = (review.txt || '').length > 180
    const stay = review.targetStay
    const stayImg = stay?.imgUrls?.[0]

    const avatar = (
        <img src={reviewer.imgUrl} alt={reviewer.fullname} className="reviewer-avatar" />
    )

    return (
        <article className="profile-review-card">
            {stay && stayImg && (
                <Link to={`/homes/${stay._id}`} className="review-stay-link">
                    <img src={stayImg} alt={stay.name} className="review-stay-img" />
                    <span className="review-stay-name">{stay.name}</span>
                </Link>
            )}
            <header className="review-header">
                {reviewer._id
                    ? <Link to={`/user/public/${reviewer._id}`}>{avatar}</Link>
                    : avatar}
                <div className="reviewer-details">
                    <h3 className="reviewer-name">{reviewer.fullname}</h3>
                    <p className="reviewer-location">{reviewer.location}</p>
                </div>
            </header>
            <time className="review-date">{getReviewDate(review)}</time>
            <p className={`review-text ${isExpanded ? 'expanded' : ''}`}>{review.txt}</p>
            {isLong && !isExpanded && (
                <button className="review-show-more" onClick={() => setIsExpanded(true)}>Show more</button>
            )}
        </article>
    )
}

export function ReviewList({ reviews, variant = 'stay', fallbackRating = 0, withProfileLinks = true }) {
    if (!reviews?.length) return <p className={`review-list review-list-${variant} review-list-empty`}>No reviews yet</p>

    if (variant === 'profile') {
        return (
            <div className="review-list review-list-profile">
                <div className="profile-reviews-track">
                    {reviews.slice(0, 3).map((review, idx) => (
                        <ProfileReviewCard key={review._id || idx} review={review} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className={`review-list review-list-${variant}`}>
            {reviews.map((review, idx) => {
                const reviewer = getReviewer(review)
                const avatar = (
                    <img src={reviewer.imgUrl} alt={reviewer.fullname} className="reviewer-avatar" />
                )
                return (
                    <article key={review._id || idx} className="review-card">
                        <header className="review-header">
                            {withProfileLinks && reviewer._id
                                ? <Link to={`/user/public/${reviewer._id}`}>{avatar}</Link>
                                : avatar}
                            <div className="reviewer-details">
                                <h3 className="reviewer-name">{reviewer.fullname}</h3>
                                <p className="reviewer-location">{reviewer.location}</p>
                            </div>
                        </header>
                        <div className="review-metadata">
                            <Rating
                                name={`rate-${variant}-${review._id || idx}`}
                                value={review.rating || review.rate || fallbackRating}
                                precision={0.1}
                                readOnly
                                sx={ratingSx}
                            />
                            <span className="separator">·</span>
                            <time className="review-date">{getReviewDate(review)}</time>
                        </div>
                        <div className="review-content">
                            <p className="review-text">{review.txt}</p>
                        </div>
                    </article>
                )
            })}
        </div>
    )
}