import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { useSyncStayFilter } from '../customHooks/useSyncStayFilter.js'
import { SvgIcon } from '../services/svg.service.jsx'

const STAYS_PER_PAGE = 18  // 9 rows × 2 columns

export function SearchPage() {
    // loads stays based on the URL ?search= param
    useSyncStayFilter()

    const stays = useSelector(storeState => storeState.stayModule.stays)
    const [currentPage, setCurrentPage] = useState(0)
    const [likedIds, setLikedIds] = useState([])  // which cards are hearted (visual only)
    const [imgIdxByStay, setImgIdxByStay] = useState({})  // current image index per card carousel

    function toggleLike(stayId) {
        setLikedIds(prev => prev.includes(stayId)
            ? prev.filter(id => id !== stayId)
            : [...prev, stayId])
    }

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
                    {staysToShow.map((stay, idx) => {
                        // ===== FAKE ADDED INFO TO LOOK LIKE AIRBNB =====
                        const fakeRating = (4.7 + (stay._id.charCodeAt(0) % 30) / 100).toFixed(2)  // FAKE: no rating in data
                        const reviewCount = stay.reviewCount || 0                       // real: review count from service
                        const nights = 5                                               // FAKE: matches fakeDateRange
                        const fakeDateRange = 'Jul 3 – 8'                              // FAKE: no dates in data
                        const totalPrice = stay.price * nights                         // real nightly × fake nights
                        // FAKE: ~1 in 4 stays show free cancellation (stable per id)
                        const hasFreeCancellation = idx % 4 === 0   // every 4th card on the page
                        // ===============================================



                        const imgs = stay.imgUrls || []
                        const imgIdx = imgIdxByStay[stay._id] || 0
                        const showImg = (newIdx, ev) => {
                            ev.preventDefault()
                            ev.stopPropagation()
                            setImgIdxByStay(prev => ({ ...prev, [stay._id]: (newIdx + imgs.length) % imgs.length }))
                        }

                        return (
                            <Link to={`/homes/${stay._id}`} className="result-card" key={stay._id}>
                                <div className="result-card-img">
                                    {/* sliding track — all images in a row, shifted by imgIdx */}
                                    <div
                                        className="card-track"
                                        style={{ transform: `translateX(-${imgIdx * 100}%)` }}
                                    >
                                        {imgs.map((url, i) => (
                                            <img key={i} src={url} alt={stay.name} className="card-track-img" />
                                        ))}
                                    </div>

                                    <span
                                        className={`result-card-heart ${likedIds.includes(stay._id) ? 'liked' : ''}`}
                                        onClick={(ev) => {
                                            ev.preventDefault()
                                            toggleLike(stay._id)
                                        }}
                                    ><SvgIcon iconName="heart" /></span>

                                    {/* prev arrow — hidden on first image */}
                                    {imgIdx > 0 && (
                                        <button className="card-arrow card-arrow-left" onClick={(ev) => showImg(imgIdx - 1, ev)}>
                                            <SvgIcon iconName="chevronLeft" />
                                        </button>
                                    )}
                                    {/* next arrow — hidden on last image */}
                                    {imgIdx < imgs.length - 1 && (
                                        <button className="card-arrow card-arrow-right" onClick={(ev) => showImg(imgIdx + 1, ev)}>
                                            <SvgIcon iconName="chevronRight" />
                                        </button>
                                    )}

                                    {/* dots — Airbnb shrink effect: near the active dot = big, far = small */}
                                    <div className="card-dots">
                                        {imgs.map((_, dotIdx) => {
                                            // Airbnb-style: big group of 3 near the active image, small at the far edges
                                            let sizeClass = 'dot-lg'
                                            if (imgIdx <= 1) {
                                                // near start: first 3 big, rest small
                                                sizeClass = dotIdx <= 2 ? 'dot-lg' : 'dot-sm'
                                            } else if (imgIdx >= imgs.length - 2) {
                                                // near end: last 3 big, rest small
                                                sizeClass = dotIdx >= imgs.length - 3 ? 'dot-lg' : 'dot-sm'
                                            } else {
                                                // middle: active + neighbors big, others small
                                                sizeClass = Math.abs(dotIdx - imgIdx) <= 1 ? 'dot-lg' : 'dot-sm'
                                            }
                                            return <span key={dotIdx} className={`card-dot ${sizeClass} ${dotIdx === imgIdx ? 'active' : ''}`} />
                                        })}
                                    </div>
                                </div>

                                <div className="result-card-info">
                                    {/* title: "<type> in <city>" — Airbnb style */}
                                    <span className="result-card-title">{stay.type} in {stay.loc.city}</span>

                                    {/* listing name */}
                                    <p className="result-card-name">{stay.name}</p>

                                    {/* FAKE rating + real review count + real beds/baths */}
                                    <p className="result-card-meta">
                                        ★ {fakeRating} ({reviewCount}) · {stay.bedrooms ?? stay.capacity} bed{(stay.bedrooms ?? stay.capacity) !== 1 ? 's' : ''} · {stay.bathrooms ?? 1} bath{(stay.bathrooms ?? 1) !== 1 ? 's' : ''}
                                    </p>

                                    {/* FAKE dates */}
                                    <p className="result-card-dates">{fakeDateRange}</p>

                                    {/* real nightly × fake nights */}
                                    <p className="result-card-price"><strong>₪{totalPrice.toLocaleString()}</strong> total</p>

                                    {hasFreeCancellation && <span className="result-card-cancel">Free cancellation</span>}
                                </div>
                            </Link>
                        )
                    })}
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