import { useLayoutEffect } from 'react'

export function LoadingScreenForDetails({ isLoading }) {
  useLayoutEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="airbnb-flash-shield">
      <div className="skeleton-details-grid">
        <div className="shimmer-title"></div>
        <div className="shimmer-gallery">
          <div className="shimmer-box box-1"></div>
          <div className="shimmer-box"></div>
          <div className="shimmer-box"></div>
          <div className="shimmer-box"></div>
          <div className="shimmer-box"></div>
        </div>
        <div className="shimmer-split-wrapper">
          <div className="shimmer-left">
            <div className="shimmer-line line-1"></div>
            <div className="shimmer-line line-2"></div>
            <div className="shimmer-line line-3"></div>
          </div>
          <div className="shimmer-card"></div>
        </div>
      </div>
    </div>
  )
}