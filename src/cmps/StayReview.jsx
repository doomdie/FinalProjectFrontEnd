import { ReadMore } from '../cmps/ReadMore'
import { Rating } from '@mui/material'
export function StayReview({ stay }) {
  if (!stay || !stay.reviews) return <div>Loading reviews...</div>
  const totalRating = stay.rating || 4.8
  console.log(stay)
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
                <p className="reviewer-location">User Location</p>
              </div>
            </header>

            <div className="review-metadata">
              <Rating
                name="read-only-rating"
                value={review.rate || totalRating}
                precision={0.1}
                size="small"
                readOnly
              />
              <span className="separator">•</span>
              <time className="review-date">
                {new Date(review.at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
              <span className="separator">•</span>
              <span className="trip-type">Stayed with kids</span>
            </div>

            <div className="review-content">
              <p className="review-text">{review.txt}</p>
              {review.txt.length > 150 && (
                <button className="btn-show-more">Show more</button>
              )}
            </div>
          </article>
        ))}
      </div>


    </div>
    //Get the damn read more function to work here
  )
}
