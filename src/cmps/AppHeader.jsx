import { useRef, useState, useEffect, useMemo } from 'react'
import { NavLink, useLocation, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { logout } from '../store/actions/user.actions.js'
import { LoginSignupModal } from '../pages/LoginSignup.jsx'

import { SvgIcon } from '../services/svg.service.jsx'
import { SearchBarBig } from './SearchBarBig.jsx'
import { SearchBarSmall } from './SearchBarSmall.jsx'

export function AppHeader() {
	const user = useSelector(storeState => storeState.userModule.user)
	const stays = useSelector(storeState => storeState.stayModule.stays)

	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)   // hamburger dropdown
	const [searchParams, setSearchParams] = useSearchParams()
	const navigate = useNavigate()

	// small-bar click → re-expand the big bar with that section open + dark page overlay
	const [forcedSection, setForcedSection] = useState(null)
	const [isSearchOpen, setIsSearchOpen] = useState(false)


	// which amenities are currently active (from the URL ?amenities=Wifi,Kitchen)
	const activeAmenities = (searchParams.get('amenities') || '').split(',').filter(a => a)

	const location = useLocation()
	const [underlinePos, setUnderlinePos] = useState({ left: 0, width: 0 })
	const [isScrolled, setIsScrolled] = useState(false)
	const isDetailsPage = location.pathname.startsWith('/homes/') && location.pathname !== '/homes' && location.pathname !== '/homes/'
	const isSearchPage = location.pathname.startsWith('/search')
	const isHosting = location.pathname.startsWith('/hosting')
	const tabsContainerRef = useRef()



	// build the amenity pills ONCE from the first loaded set, then freeze them
	// (so filtering doesn't reshuffle the row)
	const frozenPillsRef = useRef(null)
	const amenityPills = useMemo(() => {
		if (frozenPillsRef.current) return frozenPillsRef.current   // already frozen
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
		frozenPillsRef.current = pills   // freeze for the rest of the session
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
	}, [location.pathname])

	useEffect(() => {
		if (forcedSection) return   // big bar is forced open from the small bar — don't re-collapse

		if (isDetailsPage || isSearchPage) {
			setIsScrolled(true)
			return
		}

		function onScroll() {
			setIsScrolled(prev => {
				if (!prev && window.scrollY > 200) return true
				if (prev && window.scrollY < 10) {
					window.scrollTo({ top: 0, behavior: 'smooth' })
					return false
				}
				return prev
			})
		}

		onScroll()

		window.addEventListener('scroll', onScroll)
		return () => window.removeEventListener('scroll', onScroll)
	}, [isDetailsPage, isSearchPage, location.pathname, forcedSection])



	function moveUnderlineToActiveTab() {
		if (!tabsContainerRef.current) return
		const activeTabEl = tabsContainerRef.current.querySelector('a.active')
		if (!activeTabEl) return

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

		setSearchParams(params)
	}

	function onOpenSectionFromSmall(section) {
		setForcedSection(section)
		setIsScrolled(false)
	}

	function onSearchOpenChange(isOpen) {
		setIsSearchOpen(isOpen)
		if (!isOpen) {
			setForcedSection(null)
			// collapse back if we're on a page that keeps the small bar
			if (isDetailsPage || isSearchPage || window.scrollY > 200) setIsScrolled(true)
		}
	}

	return (
		<header className={`app-header full ${isScrolled ? 'scrolled' : ''}`}>
			<div className="header-top">
				<NavLink to="/" className="logo">
					<img src="/img/symbols/logo.svg" alt="OurBNB" className="logo-img" />
				</NavLink>

				<div className="header-center">
					{isHosting ? (
						<div className="header-tabs host-tabs" ref={tabsContainerRef}>
							<NavLink to="/hosting" end>Today</NavLink>
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
					) : (
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

							<SearchBarBig forcedSection={forcedSection} onOpenChange={onSearchOpenChange} />						</>
					)}
				</div>

				{!isHosting && <SearchBarSmall onOpenSection={onOpenSectionFromSmall} />}

				{/* dark overlay on the page below the header while the big search is open */}
				{isSearchOpen && <div className="page-overlay" />}


				<div className="header-actions">
					<NavLink to={isHosting ? "/" : "/hosting"} className="host-switch-link">
						{isHosting ? "Switch to traveling" : "Switch to hosting"}
					</NavLink>
					{user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

					{user && (
						<Link to={`/user/${user._id}`}>
							<img
								src={user.imgUrl}
								alt={user.fullname || "User profile"}
								className="user-avatar"
							/>
						</Link>
					)}

					{/* hamburger menu with dropdown */}
					<div className="menu-wrapper">
						<button className={`menu-btn ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(prev => !prev)}>
							<SvgIcon iconName="hamburger" />
						</button>

						{isMenuOpen && (
							<>
								{/* click-away layer to close the menu */}
								<div className="menu-backdrop" onClick={() => setIsMenuOpen(false)} />

								<div className="menu-dropdown">
									{!user && (
										<button
											className="menu-item"
											onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false) }}
										>
											Log in or sign up
										</button>
									)}
									{user && (
										<button
											className="menu-item"
											onClick={() => { onLogout(); setIsMenuOpen(false) }}
										>
											Log out
										</button>
									)}
								</div>
							</>
						)}
					</div>
				</div>

				<LoginSignupModal
					isOpen={isAuthModalOpen}
					onClose={() => setIsAuthModalOpen(false)}
				/>
			</div>

			{/* search-page amenity filter bar — pure cosmetics, no functionality */}
			{isSearchPage && amenityPills.length > 0 && !isSearchOpen && (
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