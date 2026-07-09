import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'

import { useSyncStayFilter } from '../customHooks/useSyncStayFilter.js'
import { SvgIcon } from '../services/svg.service.jsx'
import { SkeletonLoader } from '../cmps/SkeletonLoader.jsx'
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { wishlistService } from '../services/stays/wishlist.service.js'
import { HeartButton } from '../cmps/HeartButton.jsx'
import { getFakeRating, getFakeDates, getTotalPrice } from '../services/util.service.js'

const STAYS_PER_PAGE = 18  // 9 rows × 2 columns

export function SearchPage() {
    // loads stays based on the URL ?search= param
    useSyncStayFilter()

    const stays = useSelector(storeState => storeState.stayModule.stays)
    const [searchParams] = useSearchParams()
    const [currentPage, setCurrentPage] = useState(0)
    const [imgIdxByStay, setImgIdxByStay] = useState({})  // current image index per card carousel
    const [hoveredStayId, setHoveredStayId] = useState(null)  // which card is hovered — highlights its map pin

    const activeAmenities = (searchParams.get('amenities') || '').split(',').filter(a => a)
    const activeType = searchParams.get('type') || ''
    const txt = searchParams.get('search') || ''

    const filteredStays = stays ? stays.filter(stay => {
        if (stay.isLinkCard) return true
        if (!stay.loc) return false   // skip stays with no location data

        if (txt) {
            const regex = new RegExp(txt, 'i')
            const matchText = regex.test(stay.loc.country) || regex.test(stay.loc.city)
            if (!matchText) return false
        }

        if (activeType) {
            const stayType = stay.type?.toLowerCase() || ''
            const filterType = activeType.toLowerCase()
            const matchType = stayType === filterType ||
                stayType.startsWith(filterType.replace(/s$/, '')) ||
                filterType.startsWith(stayType.replace(/s$/, ''))
            if (!matchType) return false
        }

        if (activeAmenities.length > 0) {
            const stayAmenities = (stay.amenities || []).map(a => a.toLowerCase())
            const hasAllActive = activeAmenities.every(amenity => stayAmenities.includes(amenity.toLowerCase()))
            if (!hasAllActive) return false
        }

        return true
    }) : []

    useEffect(() => {
        setCurrentPage(0)
    }, [searchParams])



    const isLoading = !stays || !stays.length   // still fetching — show skeletons
    const noResults = !isLoading && !filteredStays.length   // loaded, but filters match nothing

    // how many pages total (based on the filtered list)
    const pageCount = Math.ceil(filteredStays.length / STAYS_PER_PAGE)
    // the slice of stays for the current page
    const startIdx = currentPage * STAYS_PER_PAGE
    const staysToShow = filteredStays.slice(startIdx, startIdx + STAYS_PER_PAGE)

    // center the map on the first visible stay (falls back to a default)
    const firstStay = staysToShow[0]
    const mapCenter = firstStay
        ? { lat: firstStay.loc.lan, lng: firstStay.loc.lat }
        : { lat: 20, lng: 0 }

    // is the loaded data actually for the current search? if not, the map would
    // flash the OLD location — so we hold it grey until they match
    const searchTerm = txt.split(',')[0].trim().toLowerCase()
    const mapReady = !searchTerm || (firstStay && (
        firstStay.loc.city.toLowerCase().includes(searchTerm) ||
        firstStay.loc.country.toLowerCase().includes(searchTerm)
    ))

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
                {(isLoading || !mapReady)
                    ? <div className="skeleton skeleton-count-line" />
                    : (
                        <h1 className="search-results-count">
                            {noResults
                                ? 'No stays found'
                                : filteredStays.length > 1000
                                    ? 'Over 1,000 homes within map area'
                                    : `${filteredStays.length} homes within map area`}
                        </h1>
                    )}

                <div className="search-results-grid">
                    {(isLoading || !mapReady) && <SkeletonLoader variant="card-grid" count={8} />}
                    {!isLoading && mapReady && staysToShow.map((stay, idx) => {

                        // ===== FAKE ADDED INFO TO LOOK LIKE AIRBNB =====
                        // dates: searched (from URL) OR deterministic fakes from _id — shared via util.service
                        const urlFrom = searchParams.get('from') ? new Date(searchParams.get('from')) : null
                        const urlTo = searchParams.get('to') ? new Date(searchParams.get('to')) : null
                        const cardDates = (urlFrom && urlTo) ? { checkIn: urlFrom, checkOut: urlTo } : getFakeDates(stay)

                        const opts = { month: 'short', day: 'numeric' }
                        const sameMonth = cardDates.checkIn.getMonth() === cardDates.checkOut.getMonth()
                        const fakeDateRange = `${cardDates.checkIn.toLocaleDateString('en-US', opts)} – ${cardDates.checkOut.toLocaleDateString('en-US', sameMonth ? { day: 'numeric' } : opts)}`
                        const nights = Math.max(1, Math.round((cardDates.checkOut - cardDates.checkIn) / (1000 * 60 * 60 * 24)))
                        const fakeRating = getFakeRating(stay)  // FAKE — shared via util.service, one source of truth
                        const reviewCount = stay.reviewCount || 0                       // real
                        const totalPrice = getTotalPrice(stay, cardDates.checkIn, cardDates.checkOut)
                        const hasFreeCancellation = idx % 4 === 0                       // FAKE: every 4th card
                        // ===============================================

                        const imgs = stay.imgUrls || []
                        const imgIdx = imgIdxByStay[stay._id] || 0
                        const showImg = (newIdx, ev) => {
                            ev.preventDefault()
                            ev.stopPropagation()
                            setImgIdxByStay(prev => ({ ...prev, [stay._id]: (newIdx + imgs.length) % imgs.length }))
                        }

                        return (
                            <Link
                                to={`/homes/${stay._id}?${searchParams.toString()}`}
                                className="result-card"
                                key={stay._id}
                                onMouseEnter={() => setHoveredStayId(stay._id)}
                                onMouseLeave={() => setHoveredStayId(null)}
                            >
                                <div className="result-card-img">
                                    {/* real superhost flag from the data */}
                                    {stay.host?.isSuperhost && <span className="card-badge">Superhost</span>}

                                    {/* sliding track — all images in a row, shifted by imgIdx */}
                                    <div
                                        className="card-track"
                                        style={{ transform: `translateX(-${imgIdx * 100}%)` }}
                                    >
                                        {imgs.map((url, i) => (
                                            <img key={i} src={url} alt={stay.name} className="card-track-img" />
                                        ))}
                                    </div>

                                    <HeartButton stay={stay} className="result-card-heart" />

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

                                    {/* FAKE rating + real review count (bold) + real beds/baths (grey) */}
                                    <p className="result-card-meta">
                                        <span className="card-rating">★ {fakeRating} ({reviewCount})</span> · {stay.bedrooms ?? stay.capacity} bed{(stay.bedrooms ?? stay.capacity) !== 1 ? 's' : ''} · {stay.bathrooms ?? 1} bath{(stay.bathrooms ?? 1) !== 1 ? 's' : ''}
                                    </p>

                                    {/* dates line — hidden when the user searched specific dates (they're in the header) */}
                                    {!urlFrom && <p className="result-card-dates">{fakeDateRange}</p>}

                                    {/* real nightly × fake nights */}
                                    <p className="result-card-price">
                                        <span className="price-amount">₪{totalPrice.toLocaleString()}</span> total
                                    </p>


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

            {/* RIGHT: real Google map with a price pin per stay */}
            <div className="search-map">
                {!mapReady && <div className="search-map-loading" />}
                {mapReady && (
                    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
                        <Map
                            key={`${mapCenter.lat}-${mapCenter.lng}`}
                            mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
                            defaultZoom={11}
                            defaultCenter={mapCenter}
                            gestureHandling="greedy"
                            disableDefaultUI={true}
                            zoomControl={true}
                            zoomControlOptions={{ position: 3 }}
                            style={{ width: '100%', height: '100%', borderRadius: '16px' }}
                        >
                            {staysToShow.map(stay => (
                                <AdvancedMarker
                                    key={stay._id}
                                    position={{ lat: stay.loc.lan, lng: stay.loc.lat }}   // data has lat/lng swapped + 'lan' typo
                                    zIndex={hoveredStayId === stay._id ? 999 : 1}
                                >
                                    <div className={`map-price-pin ${hoveredStayId === stay._id ? 'active' : ''}`}>₪{stay.price}</div>
                                </AdvancedMarker>
                            ))}
                        </Map>
                    </APIProvider>
                )}
            </div>
        </section >
    )
}