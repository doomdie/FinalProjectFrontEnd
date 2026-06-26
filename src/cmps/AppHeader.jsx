import { useRef, useState, useEffect } from 'react'
import { NavLink, useLocation, Link } from 'react-router-dom'
import { SearchBarBig } from './SearchBarBig.jsx'
import { SearchBarSmall } from './SearchBarSmall.jsx'
import { useSelector } from 'react-redux'
import { logout } from '../store/actions/user.actions.js'

export function AppHeader() {
	const user = useSelector(storeState => storeState.userModule.user)

	const tabsContainerRef = useRef()
	const location = useLocation()
	const [underlinePos, setUnderlinePos] = useState({ left: 0, width: 0 })
	const [isScrolled, setIsScrolled] = useState(false)
	const isDetailsPage = location.pathname.startsWith('/homes/') && location.pathname !== '/homes' && location.pathname !== '/homes/'
	const isSearchPage = location.pathname.startsWith('/search')
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

	return (
		<header className={`app-header full ${isScrolled ? 'scrolled' : ''}`}>
			<div className="header-top">
				<NavLink to="/" className="logo">
					OurBNB
				</NavLink>

				<div className="header-center">
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
				</div>

				<SearchBarSmall />

				<div className="header-actions">
					{/* <a className="host-link">Switch to hosting</a> */}
					<NavLink to="/hosting">
						Switch to hosting
					</NavLink>
					{user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

					{!user && <NavLink to="auth/login" className="login-link">Login</NavLink>}
					{user && (
						<div className="user-info">


							<button onClick={onLogout}>Logout</button>
						</div>
					)}
					{user ? (
						<Link to={`/user/${user._id}`}>
							<div className="user-avatar"></div>
						</Link>
					) : (
						<div className="user-avatar"></div>
					)}
					<button className="menu-btn">☰</button>
				</div>
			</div>
		</header>
	)
}