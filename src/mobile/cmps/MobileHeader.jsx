import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { SvgIcon } from '../../services/svg.service.jsx'
import { MobileSearchOverlay } from './MobileSearchOverlay.jsx'

export function MobileHeader() {
    const navigate = useNavigate()
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        function onScroll() {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header className={`mobile-header ${isScrolled ? 'scrolled' : ''}`}>
            <button className="mobile-search-pill" onClick={() => setIsSearchOpen(true)}>
                <SvgIcon iconName="search" />
                <span>Start your search</span>
            </button>

            <nav className="mobile-chips">
                <NavLink to="/" end className="mobile-chip">
                    <img src="/img/symbols/globe.svg" alt="" />
                    <span>All</span>
                </NavLink>
                <NavLink to="/homes" className="mobile-chip">
                    <img src="/img/symbols/house.svg" alt="" />
                    <span>Homes</span>
                </NavLink>
                <NavLink to="/experiences" className="mobile-chip">
                    <img src="/img/symbols/balloon.svg" alt="" />
                    <span>Experiences</span>
                </NavLink>
                <NavLink to="/services" className="mobile-chip">
                    <img src="/img/symbols/bell.svg" alt="" />
                    <span>Services</span>
                </NavLink>
            </nav>

            {isSearchOpen && <MobileSearchOverlay onClose={() => setIsSearchOpen(false)} />}
        </header>
    )
}