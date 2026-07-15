import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'

import { useSyncStayFilter } from '../../customHooks/useSyncStayFilter.js'
import { SvgIcon } from '../../services/svg.service.jsx'
import { HeartButton } from '../../cmps/HeartButton.jsx'
import { SkeletonLoader } from '../../cmps/SkeletonLoader.jsx'
import { MobileSearchOverlay } from '../cmps/MobileSearchOverlay.jsx'
import { getFakeRating, getFakeDates, getTotalPrice } from '../../services/util.service.js'

const QUICK_FILTERS = ['Hot tub', 'Pool', 'Allows pets', 'Free parking', 'Air conditioning', 'Wifi', 'Kitchen', 'Washer']

export function MobileSearchPage() {
    useSyncStayFilter()

    const navigate = useNavigate()
    const stays = useSelector(storeState => storeState.stayModule.stays)
    const [searchParams, setSearchParams] = useSearchParams()
    const [isOverlayOpen, setIsOverlayOpen] = useState(false)

    const activeAmenities = (searchParams.get('amenities') || '').split(',').filter(a => a)
    const activeType = searchParams.get('type') || ''
    const txt = searchParams.get('search') || ''

    // same filter logic as desktop SearchPage
    const filteredStays = stays ? stays.filter(stay => {
        if (stay.isLinkCard) return true
        if (!stay.loc) return false

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

    const isLoading = !stays || !stays.length
    const staysToShow = filteredStays.slice(0, 30)

    const firstStay = staysToShow[0]
    const mapCenter = firstStay?.loc?.coordinates
        ? { lat: firstStay.loc.coordinates[1], lng: firstStay.loc.coordinates[0] }
        : { lat: 20, lng: 0 }

    // search summary for the top pill
    const urlFrom = searchParams.get('from') ? new Date(searchParams.get('from')) : null
    const urlTo = searchParams.get('to') ? new Date(searchParams.get('to')) : null
    const opts = { month: 'short', day: 'numeric' }
    const pillTitle = txt ? `Homes in ${txt}` : 'Homes'
    const pillDates = (urlFrom && urlTo)
        ? `${urlFrom.toLocaleDateString('en-US', opts)} – ${urlTo.toLocaleDateString('en-US', urlFrom.getMonth() === urlTo.getMonth() ? { day: 'numeric' } : opts)}`
        : 'Any dates'
    const guestsParam = Number(searchParams.get('guests')) || 0
    const pillGuests = guestsParam ? `${guestsParam} guest${guestsParam > 1 ? 's' : ''}` : 'Add guests'

    function toggleAmenity(amenity) {
        const key = amenity.toLowerCase()
        const next = activeAmenities.includes(key)
            ? activeAmenities.filter(a => a !== key)
            : [...activeAmenities, key]

        const params = Object.fromEntries(searchParams.entries())
        if (next.length) params.amenities = next.join(',')
        else delete params.amenities
        setSearchParams(params)
    }

    return (
        <section className="mobile-search-page">

            {/* top bar: back + summary pill + filters */}
            <div className="msp-topbar">
                <button className="msp-back" onClick={() => navigate('/')}>
                    <SvgIcon iconName="chevronLeft" />
                </button>
                <button className="msp-pill" onClick={() => setIsOverlayOpen(true)}>
                    <span className="msp-pill-title">{pillTitle}</span>
                    <span className="msp-pill-sub">{pillDates} · {pillGuests}</span>
                </button>
                <button className="msp-filter-btn">
                    <SvgIcon iconName="filter" />
                </button>
            </div>

            {/* quick amenity chips */}
            <div className="msp-chips">
                {QUICK_FILTERS.map(amenity => (
                    <button
                        key={amenity}
                        className={`msp-chip ${activeAmenities.includes(amenity.toLowerCase()) ? 'active' : ''}`}
                        onClick={() => toggleAmenity(amenity)}
                    >{amenity}</button>
                ))}
            </div>

            {/* map */}
            <div className="msp-map">
                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
                    <Map
                        key={`${mapCenter.lat}-${mapCenter.lng}`}
                        mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
                        defaultZoom={10}
                        defaultCenter={mapCenter}
                        gestureHandling="greedy"
                        disableDefaultUI={true}
                    >
                        {staysToShow.map(stay => (
                            stay.loc?.coordinates && (
                                <AdvancedMarker
                                    key={stay._id}
                                    position={{ lat: stay.loc.coordinates[1], lng: stay.loc.coordinates[0] }}
                                >
                                    <div className="map-price-pin">₪{stay.price}</div>
                                </AdvancedMarker>
                            )
                        ))}
                    </Map>
                </APIProvider>
            </div>

            {/* results sheet */}
            <div className="msp-sheet">
                <div className="msp-sheet-handle" />
                <h2 className="msp-sheet-title">
                    {isLoading ? 'Loading…'
                        : !filteredStays.length ? 'No stays found'
                            : filteredStays.length > 1000 ? 'Over 1,000 homes'
                                : `${filteredStays.length} homes`}
                </h2>

                <div className="msp-list">
                    {isLoading && <SkeletonLoader variant="card-grid" count={4} />}
                    {!isLoading && staysToShow.map(stay => {
                        const cardDates = (urlFrom && urlTo) ? { checkIn: urlFrom, checkOut: urlTo } : getFakeDates(stay)
                        const fakeRating = getFakeRating(stay)
                        const reviewCount = stay.reviewCount || 0
                        const totalPrice = getTotalPrice(stay, cardDates.checkIn, cardDates.checkOut)
                        const imgs = (stay.imgUrls || []).slice(0, 5)

                        return (
                            <Link to={`/homes/${stay._id}?${searchParams.toString()}`} className="msp-card" key={stay._id}>
                                <div className="msp-card-img">
                                    {stay.host?.isSuperhost && <span className="card-badge">Superhost</span>}
                                    <HeartButton stay={stay} className="msp-card-heart" />
                                    <div className="msp-card-track">
                                        {imgs.map((url, i) => (
                                            <img key={i} src={url} alt={stay.name} loading="lazy" />
                                        ))}
                                    </div>
                                </div>
                                <div className="msp-card-info">
                                    <div className="msp-card-toprow">
                                        <span className="msp-card-title">{stay.type} in {stay.loc.city}</span>
                                        <span className="msp-card-rating">★ {fakeRating} ({reviewCount})</span>
                                    </div>
                                    <p className="msp-card-name">{stay.name}</p>
                                    <p className="msp-card-price"><span>₪{totalPrice.toLocaleString()}</span> total</p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {isOverlayOpen && <MobileSearchOverlay onClose={() => setIsOverlayOpen(false)} />}
        </section>
    )
}