import { useState, useEffect, useRef } from 'react'

const SECTIONS = [
    { id: 'photos', label: 'Photos' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'location', label: 'Location' },
]

export function StayDetailsNav() {
    const [isVisible, setIsVisible] = useState(false)
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
        }
        onScroll()
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    function scrollToSection(id) {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <nav ref={navRef} className={`details-nav ${isVisible ? 'visible' : ''}`}>
            <div className="details-nav-inner">
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
        </nav>
    )
}