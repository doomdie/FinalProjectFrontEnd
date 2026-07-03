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
	const [searchParams, setSearchParams] = useSearchParams()

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
	}, [isDetailsPage, isSearchPage, location.pathname])

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

	return (
		<header className={`app-header full ${isScrolled ? 'scrolled' : ''}`}>
			<div className="header-top">
				<NavLink to="/" className="logo">
					OurBNB
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

							<SearchBarBig />
						</>
					)}
				</div>

				{!isHosting && <SearchBarSmall />}

				<div className="header-actions">
					{/* <a className="host-link">Switch to hosting</a> */}
					<NavLink to={isHosting ? "/" : "/hosting"}>
						{isHosting ? "Switch to User Mode" : "Switch to hosting"}
					</NavLink>
					{user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

					{!user && (
						<button
							className="login-link"
							onClick={() => setIsAuthModalOpen(true)}
						>
							Login
						</button>
					)}
					{user && (
						<div className="user-info">


							<button onClick={onLogout}>Logout</button>
						</div>
					)}

					{user ? (
						<Link to={`/user/${user._id}`}>
							<img
								src={user.imgUrl}
								alt={user.fullname || "User profile"}
								className="user-avatar"

							/>
						</Link>
					) : (
						<div className="user-avatar avatar-fallback"></div>
					)}
					
					<button className="menu-btn">☰</button>
				</div>

				<LoginSignupModal
					isOpen={isAuthModalOpen}
					onClose={() => setIsAuthModalOpen(false)}
				/>
			</div>

			{/* search-page amenity filter bar — pure cosmetics, no functionality */}
			{isSearchPage && amenityPills.length > 0 && (
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