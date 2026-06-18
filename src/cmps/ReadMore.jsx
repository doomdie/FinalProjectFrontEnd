import { useState } from 'react'

export function ReadMore({ text }) {
    const [isExpanded, setIsExpanded] = useState(false)

    const summaryText = text || ''
    const shouldTrim = summaryText.length > 150
    const displayedText = isExpanded || !shouldTrim ? summaryText : summaryText.slice(0, 150) + '...'

    return (
        <p>
            {displayedText}
            {shouldTrim && (
                <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className="read-more-btn"
                >
                    {isExpanded ? 'Show less' : 'Read more'}
                </button>
            )}
        </p>
    )
}