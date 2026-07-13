import { useState, useEffect, useRef } from 'react'
import { SvgIcon } from '../services/svg.service.jsx'
const SECTIONS = [
    { id: 'photos', label: 'Photos' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'location', label: 'Location' },
]

export function StayDetailsNav({ stay, totalPrice = 0, rating, reviewCount }) {
    const [isVisible, setIsVisible] = useState(false)
    const [isSummaryVisible, setIsSummaryVisible] = useState(false)
    const navRef = useRef()

    // publish the nav's real rendered height as a CSS var,
    // so scroll-margin-top always matches it exactly
    useEffect(() => {
        if (!navRef.current) return
        const navHeight = navRef.current.offsetHeight
        document.documentElement.style.setProperty('--details-nav-height', navHeight + 'px')
    }, [])

    useEffect(() => {
        function onScroll() {
            const gallery = document.querySelector('.details-gallery')
            if (!gallery) return
            // bottom of the gallery relative to the viewport top
            const galleryBottom = gallery.getBoundingClientRect().bottom
            // show the nav once the gallery has scrolled fully out of view (bottom above 0)
            setIsVisible(galleryBottom < 0)

            // summary: only after the sticky card's LAST pixel left the screen
            const sticky = document.querySelector('.sticky-card-container')
            if (sticky) setIsSummaryVisible(sticky.getBoundingClientRect().bottom < 0)
        }

        onScroll()
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    function scrollToSection(id) {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    function handleCheckAvailability() {
        if (totalPrice > 0) {
            // dates set → this IS the reserve button
            const reserveBtn = document.querySelector('.reserve-btn')
            if (reserveBtn) reserveBtn.click()
            return
        }

        // no dates → scroll to the card and open the calendar
        const sticky = document.querySelector('.sticky-card-container')
        if (!sticky) return
        sticky.scrollIntoView({ behavior: 'smooth', block: 'center' })

        setTimeout(() => {
            const trigger = document.querySelector('.date-pickers-trigger')
            if (trigger) trigger.click()
        }, 600)
    }

    return (
        <nav ref={navRef} className={`details-nav ${isVisible ? 'visible' : ''}`}>
            <div className="details-nav-inner">
                <div className="details-nav-links">
                    {SECTIONS.map(section => (
                        <button
                            key={section.id}
                            className="details-nav-link"
                            onClick={() => scrollToSection(section.id)}
                        >
                            {section.label}
                        </button>
                    ))}
                </div>

                <div className={`details-nav-summary ${isSummaryVisible ? 'visible' : ''}`}>

                    <div className="nav-summary-text">
                        <span className={`nav-summary-price ${totalPrice > 0 ? 'has-price' : ''}`}>
                            {totalPrice > 0 ? `₪${totalPrice} total` : 'Add dates for prices'}
                        </span>
                        <span className="nav-summary-rating">
                            <span className="nav-summary-star"><SvgIcon iconName="star" /></span>
                            <span className="nav-summary-score">{rating}</span>
                            {reviewCount != null && <span className="nav-summary-reviews">{reviewCount} reviews</span>}
                        </span>
                    </div>
                    <button className="nav-summary-cta" onClick={handleCheckAvailability}>
                        {totalPrice > 0 ? 'Reserve' : 'Check availability'}
                    </button>
                </div>
            </div>
        </nav>
    )
}