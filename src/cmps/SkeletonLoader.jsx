// one skeleton loader for all pages — variant picks the layout
// 'card-grid'  → grid of stay cards (search page)
// 'home'       → carousel rows of cards, full-page shield (home page)
// 'details'    → gallery + text + sticky card, full-page shield (details page)
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
        // keep this wrapper class — SkeletonLoader.css / Loading.css use body:has() on it to control the header
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
        // keep this wrapper class — SkeletonLoader.css / Loading.css use body:has() on it to control the header
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

    return null
}