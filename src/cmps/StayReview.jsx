import { ReadMore } from '../cmps/ReadMore'
import { useState } from 'react'
import { Rating } from '@mui/material'
import { ReviewModal } from "../cmps/ReviewModal"
export function StayReview({ stay }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  if (!stay || !stay.reviews) return <div>Loading reviews...</div>
  const totalRating = stay.rating || 4.8
  console.log(stay.reviews)
  return (
    <div className="reviews-container">
      <div className="reviews-grid">
        {stay.reviews.map((review, idx) => (
          <article key={review.by._id || idx} className="review-card">
            <header className="review-header">
              <img
                src={review.by.imgUrl}
                alt={review.by.fullname}
                className="reviewer-avatar"
              />
              <div className="reviewer-details">
                <h3 className="reviewer-name">{review.by.fullname}</h3>
                <p className="reviewer-location">{review.by.location}</p>
              </div>
            </header>

            <div className="review-metadata">
              <Rating
                name="modal-rate"
                value={review.rate || totalRating}
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
                {new Date(review.at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </time>

            </div>

            <div className="review-content">
              <p className="review-text">{review.txt}</p>
              {review.txt.length > 150 && (
                <button className="btn-show-more" onClick={() => setIsModalOpen(true)}>
                  Show more &gt;
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      {stay.reviews.length > 6 && (
        <button className="btn-show-all-reviews" onClick={() => setIsModalOpen(true)}>
          Show all {stay.reviews.length} reviews
        </button>
      )}

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stay={stay}
        totalRating={totalRating}
      />

    </div>
    //Get the damn read more function to work here
  )
}
