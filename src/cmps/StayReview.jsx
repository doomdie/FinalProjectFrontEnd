
export function StayReview({ stay, onUpdateRating }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isHowOpen, setIsHowOpen] = useState(false)
    const storeReviews = useSelector(storeState => storeState.reviewModule.reviews)

    const reviews = storeReviews || stay?.reviews || []
    const reviewCount = reviews.length
    const totalRating = reviewCount
        ? Number((reviews.reduce((sum, r) => sum + (r.rate || r.rating || 0), 0) / reviewCount).toFixed(1))
        : 0

    useEffect(() => {
        if (!stay?._id) return
        loadReviews({ targetId: stay._id, targetType: 'stay' })
    }, [stay?._id])

    useEffect(() => {
        if (onUpdateRating) onUpdateRating(totalRating)
    }, [totalRating, onUpdateRating])

    if (!stay || !reviewCount) return null

    return (
        <div className="reviews-container">
            <h2 className="reviews-title">
                ★ {totalRating} · {reviewCount} review{reviewCount === 1 ? '' : 's'}
            </h2>

            <ReviewList reviews={reviews} variant="stay" fallbackRating={totalRating} />

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
                    <ReviewList reviews={reviews} variant="modal" fallbackRating={totalRating} withProfileLinks={false} />
                </SeeMoreModal>
            )}

            {isHowOpen && (
                <SeeMoreModal title="How reviews work" onClose={() => setIsHowOpen(false)} size="small">
                    <p>Reviews from past guests help our community learn more about each home.</p>
                </SeeMoreModal>
            )}
        </div>
    )
}
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SeeMoreModal } from './SeeMoreModal.jsx'
import { SvgIcon } from '../services/svg.service.jsx'
import { ReviewList } from './ReviewList.jsx'
import { loadReviews } from '../store/actions/review.actions.js'
