import { Link } from 'react-router-dom'
import { Rating } from '@mui/material'

export function ReviewList({ reviews, totalRating, variant = 'grid', ratingSx }) {
  
  function getReviewer(review) {
    return review.byUser || review.by || {}
  }

  function getReviewDate(review) {
    const raw = review.createdAt || review.at
    if (!raw) return ''
    return new Date(raw).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const containerClass = variant === 'grid' ? 'reviews-grid' : 'reviews-modal-list'
console.log('Review data on user page:', reviews)
  return (
    <div className={containerClass}>
      {reviews.map((review, idx) => {
        const reviewer = getReviewer(review)
        const targetUserId = reviewer._id

        return (
          <article key={review._id || idx} className="review-card">
            <header className="review-header">
              <Link to={`/user/public/${targetUserId}`}>
                <img
                  src={reviewer.imgUrl || '/img/default-user.png'}
                  alt={reviewer.fullname || 'User'}
                  className="reviewer-avatar"
                />
              </Link>

              <div className="reviewer-details">
                <h3 className="reviewer-name">{reviewer.fullname || 'Anonymous'}</h3>
                <p className="reviewer-location">{reviewer.location || 'Guest'}</p>
              </div>
            </header>

            <div className="review-metadata">
              <Rating
                name={`${variant}-rate-${review._id || idx}`}
                value={review.rating || totalRating}
                precision={0.1}
                readOnly
                sx={ratingSx}
              />
              <span className="separator">{variant === 'grid' ? '•' : '·'}</span>
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