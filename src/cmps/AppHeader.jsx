import { useRef, useState, useEffect, useMemo } from 'react'
import { NavLink, useLocation, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { logout } from '../store/actions/user.actions.js'
import { LoginSignupModal } from '../pages/LoginSignup.jsx'

import { SvgIcon } from '../services/svg.service.jsx'
import { SearchBarBig } from './SearchBarBig.jsx'
import { SearchBarSmall } from './SearchBarSmall.jsx'
import { HamburgerMenu } from './HamburgerMenu.jsx'

export function AppHeader() {
    const user = useSelector(storeState => storeState.userModule.user)
    const stays = useSelector(storeState => storeState.stayModule.stays)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const [forcedSection, setForcedSection] = useState(null)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const activeAmenities = (searchParams.get('amenities') || '').split(',').filter(a => a)

    const location = useLocation()
    const [underlinePos, setUnderlinePos] = useState({ left: 0, width: 0 })
    const [isScrolled, setIsScrolled] = useState(false)

    const isHostingMode = location.pathname.startsWith('/hosting') || searchParams.get('mode') === 'hosting'
    const isDetailsPage = location.pathname.startsWith('/homes/') && location.pathname !== '/homes' && location.pathname !== '/homes/'
    const isSearchPage = location.pathname.startsWith('/search')
    const isUser = location.pathname.startsWith('/user')

    const tabsContainerRef = useRef()

    const frozenPillsRef = useRef(null)
    const amenityPills = useMemo(() => {
        if (frozenPillsRef.current) return frozenPillsRef.current
        if (!stays?.length) return []
        const amenityCounts = {}
        for (const stay of stays) {
            for (const amenity of stay.amenities || []) {
                amenityCounts[amenity] = (amenityCounts[amenity] || 0) + 1
            }
        }
        const pills = Object.keys(amenityCounts)
            .sort((a, b) => amenityCounts[b] - amenityCounts[a])
            .slice(0, 9)
        frozenPillsRef.current = pills
        return pills
    }, [stays])

    async function onLogout() {
        try {
            await logout()
            navigate('/')
            console.log("Yay!")
        } catch (err) {
            console.log("Famn!")
        }
    }

    useEffect(() => {
        moveUnderlineToActiveTab()
    }, [location.pathname, isHostingMode])

    useEffect(() => {
        if (isHostingMode) {
            setIsScrolled(false)
            setForcedSection(null)
            setIsSearchOpen(false)
            return
        }

        if (forcedSection) return
        if (isDetailsPage || isSearchPage || isUser) {
            setIsScrolled(true)
            return
        }

        function onScroll() {
            const currentScrollY = window.scrollY
            setIsScrolled(prev => {
                if (!prev && currentScrollY > 200) return true
                if (prev && currentScrollY <= 10) return false
                return prev
            })
        }

        onScroll()

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [isDetailsPage, isSearchPage, location.pathname, forcedSection, isUser, isHostingMode])

    function moveUnderlineToActiveTab() {
        if (!tabsContainerRef.current) return
        const activeTabEl = tabsContainerRef.current.querySelector('a.active')
        if (!activeTabEl) {
            setUnderlinePos({ left: 0, width: 0 })
            return
        }

        setUnderlinePos({
            left: activeTabEl.offsetLeft,
            width: activeTabEl.offsetWidth,
        })
    }

    function toggleAmenity(amenity) {
        const next = activeAmenities.includes(amenity)
            ? activeAmenities.filter(a => a !== amenity)
            : [...activeAmenities, amenity]

        const params = new URLSearchParams(searchParams)

        if (next.length) params.set('amenities', next.join(','))
        else params.delete('amenities')

        navigate(`/search?${params.toString()}`)
    }

    function onOpenSectionFromSmall(section) {
        if (isHostingMode) return
        setForcedSection(section)
        setIsScrolled(false)
    }

    function onSearchOpenChange(isOpen) {
        if (isHostingMode) return
        setIsSearchOpen(isOpen)
        if (!isOpen) {
            setForcedSection(null)
            if (isDetailsPage || isSearchPage || window.scrollY > 200) setIsScrolled(true)
        }
    }

    return (
        // <header className={`app-header full ${isScrolled ? 'scrolled' : ''}`}>
        <header className={`app-header full ${isScrolled ? 'scrolled' : ''} ${isHostingMode ? 'hosting' : ''} ${isUser ? 'white' : ''}`}>
            <div className="header-top">
                <NavLink to="/" className="logo">
                    <img src="/img/symbols/logo.svg" alt="OurBNB" className="logo-img" />
                </NavLink>

                <div className="header-center">
                    {isHostingMode ? (
                        <div className="header-tabs host-tabs" ref={tabsContainerRef}>
                            <NavLink to="/hosting" end>Reservations</NavLink>
                            <NavLink to="/hosting/calendar">Calendar</NavLink>
                            <NavLink to="/hosting/listings">Listings</NavLink>
                            <NavLink to="/hosting/messages">Messages</NavLink>

                            <span
                                className="tab-indicator"
                                style={{
                                    left: underlinePos.left + 'px',
                                    width: underlinePos.width + 'px',
                                }}
                            />
                        </div>
                    ) : isUser ? <div className="header-tabs host-tabs"></div>
                        : (
                            <>
                                <div className="header-tabs" ref={tabsContainerRef}>
                                    <NavLink to="/" end>
                                        <img src="/img/symbols/globe.svg" alt="All" className="tab-icon" />
                                        All
                                    </NavLink>
                                    <NavLink to="/homes">
                                        <img src="/img/symbols/house.svg" alt="Homes" className="tab-icon" />
                                        Homes
                                    </NavLink>
                                    <NavLink to="/experiences">
                                        <img src="/img/symbols/balloon.svg" alt="Experiences" className="tab-icon" />
                                        Experiences
                                    </NavLink>
                                    <NavLink to="/services">
                                        <img src="/img/symbols/bell.svg" alt="Services" className="tab-icon" />
                                        Services
                                    </NavLink>

                                    <span
                                        className="tab-indicator"
                                        style={{
                                            left: underlinePos.left + 'px',
                                            width: underlinePos.width + 'px',
                                        }}
                                    />
                                </div>

                                <SearchBarBig forcedSection={forcedSection} onOpenChange={onSearchOpenChange} />
                            </>)}
                </div>

                {(!isHostingMode && !isUser) && <SearchBarSmall onOpenSection={onOpenSectionFromSmall} />}

                {(isSearchOpen && !isHostingMode) && <div className="page-overlay" />}

                <div className="header-actions">
                    <NavLink to={isHostingMode ? "/" : "/hosting"} className="host-switch-link">
                        {isHostingMode ? "Switch to traveling" : "Switch to hosting"}
                    </NavLink>
                    {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

                    {user && (
                        <Link to={`/user/${user._id}${isHostingMode ? '?mode=hosting' : ''}`}>
                            <img
                                src={user.imgUrl}
                                alt={user.fullname || "User profile"}
                                className="user-avatar"
                            />
                        </Link>
                    )}

                    <HamburgerMenu
                        user={user}
                        onLogout={onLogout}
                        onOpenLogin={() => setIsAuthModalOpen(true)}
                    />
                </div>

                <LoginSignupModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                />
            </div>

            {(isSearchPage && amenityPills.length > 0 && !isSearchOpen && !isHostingMode) && (
                <div className="amenity-bar">
                    <button className="amenity-pill amenity-pill-filters">
                        <SvgIcon iconName="filter" />
                        Filters
                    </button>

                    <span className="amenity-divider" />

                    {amenityPills.map(amenity => (
                        <button
                            className={`amenity-pill ${activeAmenities.includes(amenity) ? 'active' : ''}`}
                            key={amenity}
                            onClick={() => toggleAmenity(amenity)}
                        >
                            {amenity}
                        </button>
                    ))}
                </div>
            )}
        </header>
    )
}