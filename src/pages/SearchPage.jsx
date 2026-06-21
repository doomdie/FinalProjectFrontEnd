import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { useSyncStayFilter } from '../customHooks/useSyncStayFilter.js'

const STAYS_PER_PAGE = 18  // 6 rows × 3 columns


export function SearchPage() {
    // loads stays based on the URL ?search= param
    useSyncStayFilter()

    const stays = useSelector(storeState => storeState.stayModule.stays)
    const [currentPage, setCurrentPage] = useState(0)

    if (!stays || !stays.length) return <section><h1>No stays found</h1></section>

    // how many pages total
    const pageCount = Math.ceil(stays.length / STAYS_PER_PAGE)
    // the slice of stays for the current page
    const startIdx = currentPage * STAYS_PER_PAGE
    const staysToShow = stays.slice(startIdx, startIdx + STAYS_PER_PAGE)

    // decide which page numbers to show; gaps become '...'
    function getPageList() {
        const pages = []
        const last = pageCount - 1

        for (let pageIdx = 0; pageIdx < pageCount; pageIdx++) {
            const isFirstPage = pageIdx === 0
            const isLastPage = pageIdx === last

            // near the START: if current is in first 3, show pages 0-3
            const nearStart = currentPage <= 2 && pageIdx <= 3
            // near the END: if current is in last 3, show last 4 pages
            const nearEnd = currentPage >= last - 2 && pageIdx >= last - 3
            // otherwise: show current ± 1
            const nearCurrent = Math.abs(pageIdx - currentPage) <= 1

            const shouldShow = isFirstPage || isLastPage || nearStart || nearEnd || nearCurrent

            if (shouldShow) {
                pages.push(pageIdx)
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...')
            }
        }

        return pages
    }

    return (
        <section className="search-page">
            {/* LEFT: results list */}
            <div className="search-results-panel">
                <h1 className="search-results-count">
                    {stays.length > 1000
                        ? 'Over 1,000 homes within map area'
                        : `${stays.length} homes within map area`}
                </h1>

                <div className="search-results-grid">
                    {staysToShow.map(stay => (
                        <Link to={`/homes/${stay._id}`} className="result-card" key={stay._id}>
                            <div className="result-card-img">
                                <img src={stay.imgUrls?.[0]} alt={stay.name} />
                            </div>

                            <div className="result-card-info">
                                <div className="result-card-top">
                                    <span className="result-card-title">{stay.loc.city}, {stay.loc.country}</span>
                                    <span className="result-card-rating">★ {isNaN(stay.avgRating) ? 'New' : stay.avgRating}</span>
                                </div>
                                <p className="result-card-name">{stay.name}</p>
                                <p className="result-card-type">{stay.type}</p>
                                <p className="result-card-price"><strong>${stay.price}</strong> night</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* pagination buttons */}
                <div className="pagination">
                    <button
                        className="page-arrow"
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >‹</button>

                    {getPageList().map((page, idx) =>
                        page === '...' ? (
                            <span key={`dots-${idx}`} className="page-dots">…</span>
                        ) : (
                            <button
                                key={page}
                                className={`page-num ${page === currentPage ? 'active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >{page + 1}</button>
                        )
                    )}


                    <button
                        className="page-arrow"
                        disabled={currentPage === pageCount - 1}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >›</button>
                </div>
            </div>


            {/* RIGHT: map placeholder */}
            <div className="search-map-placeholder">
                <span>Map goes here</span>
            </div>
        </section >
    )
}