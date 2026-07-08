import { ReadMore } from '../cmps/ReadMore'
import { useState } from 'react'
import { getFakeRating } from '../services/util.service.js'
import { SeeMoreModal } from './SeeMoreModal.jsx'
import { SvgIcon } from '../services/svg.service.jsx'

import { Rating } from '@mui/material'
// import { ReviewModal } from "../cmps/ReviewModal"
import { NavLink, useLocation, Link, useSearchParams, useNavigate } from 'react-router-dom'

export function StayReview({ stay }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHowOpen, setIsHowOpen] = useState(false)


  if (!stay || !stay.reviews) return <div>Loading reviews...</div>
  const totalRating = stay.rating || 4.8
  // console.log(stay.reviews)

  const reviewCount = stay.reviews.length

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">
        ★ {getFakeRating(stay)} · {reviewCount} review{reviewCount === 1 ? '' : 's'}
      </h2>

      <div className="reviews-grid">
        {stay.reviews.map((review, idx) => {
          const targetUserId = review.by.id || review.by._id

          return (
            <article key={idx} className="review-card">
              <header className="review-header">
                <Link to={`/profile/${targetUserId}`}>
                  <img
                    src={review.by.imgUrl}
                    alt={review.by.fullname}
                    className="reviewer-avatar"
                  />
                </Link>

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
              </div>
            </article>
          )
        })}
      </div>

      <button className="reviews-show-all" onClick={() => setIsModalOpen(true)}>
        Show all {reviewCount} reviews
      </button>

      {isModalOpen && (
        <SeeMoreModal onClose={() => setIsModalOpen(false)} pushedBack={isHowOpen}>

          <div className="reviews-modal-score">

            <span className="reviews-modal-big">
              <SvgIcon iconName="star" />
              {getFakeRating(stay)}
            </span>

            <button className="how-reviews-link" onClick={() => setIsHowOpen(true)}>How reviews work</button>
          </div>
          <h3 className="reviews-modal-count">{reviewCount} reviews</h3>
          <div className="reviews-modal-list">
            {stay.reviews.map((review, idx) => (
              <article key={idx} className="review-card">
                <header className="review-header">
                  <img src={review.by.imgUrl} alt={review.by.fullname} className="reviewer-avatar" />
                  <div className="reviewer-details">
                    <h3 className="reviewer-name">{review.by.fullname}</h3>
                    <p className="reviewer-location">{review.by.location}</p>
                  </div>
                </header>
                <div className="review-metadata">
                  <Rating
                    name="modal-rate"
                    value={5}
                    readOnly
                    sx={{
                      '& .MuiRating-icon': { height: '0.75rem', width: '0.75rem', marginRight: '1px' },
                      '& .MuiRating-icon svg': { height: '100%', width: '100%' },
                      '& .MuiRating-iconFilled': { color: 'var(--color-text)' },
                    }}
                  />
                  <span className="listSeperator">·</span>
                  <span className="review-date">
                    {new Date(review.at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <p className="review-text">{review.txt}</p>
              </article>
            ))}
          </div>
        </SeeMoreModal>
      )}

      {isHowOpen && (
        <SeeMoreModal title="How reviews work" onClose={() => setIsHowOpen(false)} size="small">
          <p>Reviews from past guests help our community learn more about each home. By default, reviews are sorted by relevancy. Relevancy is based on recency, length, and information that you provide to us, such as your booking search, your country, and your language preferences.</p>
          <p>Only the guest who booked the reservation can leave a review, and OurBNB only moderates reviews flagged for not following our policies.</p>
          <p>To be eligible for a percentile ranking or guest favorite label, listings need at least 5 reviews in the last 4 years. Criteria is subject to change.</p>
        </SeeMoreModal>
      )}
    </div>

  )
}
