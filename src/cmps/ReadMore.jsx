import { useState } from 'react'
import { SeeMoreModal } from './SeeMoreModal.jsx'

export function ReadMore({ text }) {
    const [isOpen, setIsOpen] = useState(false)
    const summaryText = text || ''
    const shouldTrim = summaryText.length > 150
    const displayedText = shouldTrim ? summaryText.slice(0, 150) + '...' : summaryText

    return (
        <>
            <p className="summary-text">{displayedText}</p>
            {shouldTrim && (
                <button className="read-more-btn" onClick={() => setIsOpen(true)}>
                    <span className="read-more-text">Show more</span>
                </button>
            )}
            {isOpen && (
                <SeeMoreModal title="About this space" onClose={() => setIsOpen(false)}>
                    <p style={{ margin: 0 }}>{summaryText}</p>
                </SeeMoreModal>
            )}
        </>
    )
}