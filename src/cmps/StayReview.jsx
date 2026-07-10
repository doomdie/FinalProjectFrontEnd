import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Rating } from '@mui/material'

import { SeeMoreModal } from './SeeMoreModal.jsx'
import { SvgIcon } from '../services/svg.service.jsx'
import { getFakeRating } from '../services/util.service.js'
import { loadReviews } from '../store/actions/review.actions.js'

export function StayReview({ stay, onUpdateRating }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHowOpen, setIsHowOpen] = useState(false)

  const storeReviews = useSelector(storeState => storeState.reviewModule.reviews)

  useEffect(() => {

    if (!stay?._id) return
    loadReviews({ targetId: stay._id, targetType: 'stay' })
  }, [stay?._id])

  if (!stay) return null

  const reviews = (storeReviews?.length ? storeReviews : stay.reviews) || []
  console.log(reviews)
  const reviewCount = reviews.length
  const totalRating = reviews.length
    ? Number((reviews.reduce((sum, r) => sum + (r.rate || r.rating || 0), 0) / reviews.length).toFixed(1))
    : (stay.rating || 4.8) 
  useEffect(() => {
    if (onUpdateRating && totalRating) {
      onUpdateRating(totalRating)
    }
  }, [totalRating, onUpdateRating])
  function getReviewer(review) {
    return review.byUser || review.by || {}
  }

  function getReviewDate(review) {
    const raw = review.createdAt || review.at
    if (!raw) return ''
    return new Date(raw).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const ratingSx = {
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
    },
  }

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">
        {/* ★ {getFakeRating(stay)} · {reviewCount} review{reviewCount === 1 ? '' : 's'} */}

        ★ {totalRating} · {reviewCount} review{reviewCount === 1 ? '' : 's'}
      </h2>

      <div className="reviews-grid">
        {reviews.map((review, idx) => {
          const reviewer = getReviewer(review)
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
                  sx={ratingSx}
                />
                <span className="separator">•</span>
                <time className="review-date">{getReviewDate(review)}</time>
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
              {totalRating}
            </span>

            <button className="how-reviews-link" onClick={() => setIsHowOpen(true)}>How reviews work</button>
          </div>

          <h3 className="reviews-modal-count">{reviewCount} reviews</h3>

          <div className="reviews-modal-list">
            {reviews.map((review, idx) => {
              const reviewer = getReviewer(review)

              return (
                <article key={review._id || idx} className="review-card">
                  <header className="review-header">
                    <img
                      src={reviewer.imgUrl || '/img/default-user.png'}
                      alt={reviewer.fullname || 'Guest'}
                      className="reviewer-avatar"
                    />
                    <div className="reviewer-details">
                      <h3 className="reviewer-name">{reviewer.fullname || 'Anonymous'}</h3>
                      <p className="reviewer-location">{reviewer.location || 'Guest'}</p>
                    </div>
                  </header>

                  <div className="review-metadata">
                    <Rating
                      name={`modal-rate-${review._id || idx}`}
                      value={review.rating || totalRating}
                      precision={0.1}
                      readOnly
                      sx={ratingSx}
                    />
                    <span className="separator">·</span>
                    <span className="review-date">{getReviewDate(review)}</span>
                  </div>

                  <p className="review-text">{review.txt}</p>
                </article>
              )
            })}
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