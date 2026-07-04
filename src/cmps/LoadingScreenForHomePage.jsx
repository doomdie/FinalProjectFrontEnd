import { useLayoutEffect } from 'react'

export function LoadingScreenForHomePage({ isLoading }) {
  useLayoutEffect(() => {
    if (isLoading) {
      window.scrollTo(0, 0)
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="airbnb-home-shield">
      <div className="skeleton-home-grid">
        {[1, 2].map((rowIdx) => (
          <div key={rowIdx} className="shimmer-home-row">
            <div className="shimmer-home-title"></div>
            <div className="shimmer-home-cards-container">
              {[1, 2, 3, 4, 5, 6, 7].map((cardIdx) => (
                <div key={cardIdx} className="shimmer-home-card">
                  <div className="shimmer-home-img-wrapper"></div>
                  <div className="shimmer-home-content">
                    <div className="shimmer-home-line title-line"></div>
                    <div className="shimmer-home-line date-line"></div>
                    <div className="shimmer-home-line price-line"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}