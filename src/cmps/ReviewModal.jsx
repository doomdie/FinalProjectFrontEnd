import { Rating } from '@mui/material'

export function ReviewModal({ isOpen, onClose, stay, totalRating }) {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>

                <button className="btn-close-modal" onClick={onClose}>

                </button>

                <h1 className="modal-title">{stay.reviews.length} guest reviews</h1>
                <div className="modal-reviews-list">
                    {stay.reviews.map((review, idx) => (
                        <article key={`modal-${review.by._id || idx}`} className="modal-review-row">
                            <header className="review-header">
                                <img src={review.by.imgUrl} alt={review.by.fullname} className="reviewer-avatar" />
                                <div className="reviewer-details">
                                    <h3 className="reviewer-name">{review.by.fullname}</h3>
                                    <p className="reviewer-location">User Location</p>
                                </div>
                            </header>

                            <div className="review-metadata">
                                <Rating
                                    name="modal-rate"
                                    value={review.rate || totalRating}
                                    precision={0.1}
                                    size="small"
                                    readOnly
                                />

                                <time className="review-date">
                                    {new Date(review.at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </time>
                            </div>

                            <p className="review-text-full">{review.txt}</p>
                        </article>
                    ))}
                </div>

            </div>
        </div>
    )
}