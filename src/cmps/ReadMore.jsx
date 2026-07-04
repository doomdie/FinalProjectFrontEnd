import { useState } from 'react'

export function ReadMore({ text }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const summaryText = text || ''
    const shouldTrim = summaryText.length > 150
    const displayedText = shouldTrim ? summaryText.slice(0, 150) + '...' : summaryText

    return (
        <>
            <p className="summary-text">
                {displayedText}
            </p>

            {shouldTrim && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="read-more-btn"
                >
                   <span className = "read-more-text">Show more</span> 
                </button>
            )}

            {isModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                        </button>
                        <div className="modal-body">
                            <p>{summaryText}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}