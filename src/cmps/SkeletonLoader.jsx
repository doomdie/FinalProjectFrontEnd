import React from 'react'

// one skeleton loader for all pages — variant picks the layout
// 'card-grid'  → grid of stay cards (search page)
// 'home'       → carousel rows of cards, full-page shield (home page)
// 'details'    → gallery + text + sticky card, full-page shield (details page)
// 'past-trips' → timeline badges + matching stack of square cards (past trips timeline view)
export function SkeletonLoader({ variant = 'card-grid', count = 8, isLoading = true }) {
    if (!isLoading) return null

    const CardSkeleton = () => (
        <div className="skeleton-card">
            <div className="skeleton skeleton-img" />
            <div className="skeleton skeleton-line title-line" />
            <div className="skeleton skeleton-line date-line" />
            <div className="skeleton skeleton-line price-line" />
        </div>
    )

    if (variant === 'card-grid') return (
        <>
            {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
        </>
    )

    if (variant === 'home') return (
        <div className="airbnb-home-shield">
            {[1, 2].map(rowIdx => (
                <div key={rowIdx} className="skeleton-row">
                    <div className="skeleton skeleton-row-title" />
                    <div className="skeleton-row-cards">
                        {Array.from({ length: 7 }).map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                </div>
            ))}
        </div>
    )

    if (variant === 'details') return (
        <div className="airbnb-flash-shield">
            <div className="skeleton skeleton-details-title" />
            <div className="skeleton-details-gallery">
                <div className="skeleton gallery-main" />
                <div className="skeleton" />
                <div className="skeleton" />
                <div className="skeleton" />
                <div className="skeleton" />
            </div>
            <div className="skeleton-details-split">
                <div className="skeleton-details-left">
                    <div className="skeleton skeleton-line line-1" />
                    <div className="skeleton skeleton-line line-2" />
                    <div className="skeleton skeleton-line line-3" />
                </div>
                <div className="skeleton skeleton-details-card" />
            </div>
        </div>
    )

    if (variant === 'past-trips') return (
        <div className="past-trips-section skeleton-past-trips">
            <div className="skeleton skeleton-title" style={{ width: '160px', height: '32px', marginBottom: '24px', borderRadius: '4px' }} />
            
            <div className="timeline-container">
                {[2026, 2025].map((mockYear) => (
                    <React.Fragment key={mockYear}>
                       
                        <div className="timeline-year-badge" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                            <div className="skeleton" style={{ width: '56px', height: '22px', borderRadius: '12px' }} />
                        </div>

                       
                        <div className="trips-timeline-stack" style={{ marginBottom: '32px' }}>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="timeline-trip-card">
                                   
                                    <div className="timeline-card-img-wrapper">
                                        <div className="skeleton" style={{ width: '100%', height: '100%' }} />
                                    </div>
                                   
                                    <div className="timeline-card-info" style={{ width: '100%' }}>
                                        <div className="skeleton" style={{ width: '45%', height: '18px', marginBottom: '8px', borderRadius: '4px' }} />
                                        <div className="skeleton" style={{ width: '70%', height: '14px', borderRadius: '4px' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    )

    return null
}