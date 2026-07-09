import { ReadMore } from '../cmps/ReadMore'
import { useState, useEffect } from 'react'
import { Rating } from '@mui/material'
import { ReviewModal } from "../cmps/ReviewModal"
import { NavLink, useLocation, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadReviews } from '../store/actions/review.actions.js'

export function StayReview({ stay }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const reviews = useSelector(storeState => storeState.reviewModule.reviews)
  console.log(reviews)
  useEffect(() => {
    if (!stay?._id) return
    loadReviews({ targetId: stay._id, targetType: 'stay' })
  }, [stay?._id])

  if (!stay) return null
  const totalRating = stay.rating || 4.8

  return (
    <div className="reviews-container">
      <div className="reviews-grid">
        {reviews.map((review, idx) => {
          const reviewer = review.byUser || {}
          const targetUserId = reviewer._id

          return (
            <article key={review._id || idx} className="review-card">
              <header className="review-header">
                <Link to={`/profile/${targetUserId}`}>
                  <img
                    src={reviewer.imgUrl || '/img/default-user.png'}
                    alt={reviewer.fullname || 'Guest'}
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
                  name={`rate-${review._id || idx}`}
                  value={review.rating || totalRating}
                  precision={0.1}
                  readOnly
                  sx={{
                    '& .MuiRating-icon': {
                      height: '0.75rem',
                      width: '0.75rem',
                      marginRight: '1px',
                    },
                    '& .MuiRating-icon svg': {
                      height: '100%',
                      width: '100%',
                    },
                    '& .MuiRating-iconFilled': {
                      color: '#222222',
                    },
                    '& .MuiRating-iconEmpty': {
                      color: '#e3e3e3',
                    }
                  }}
                />
                <span className="separator">•</span>
                <time className="review-date">
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  }) : ''}
                </time>
              </div>

              <div className="review-content">
                <p className="review-text">{review.txt}</p>
                {review.txt && review.txt.length > 150 && (
                  <button className="btn-show-more" onClick={() => setIsModalOpen(true)}>
                    Show more &gt;
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
      {isModalOpen && (
        <ReviewModal
          isOpen={isModalOpen} 
          stay={stay}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}