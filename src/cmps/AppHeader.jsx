import { useRef, useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'

export function AppHeader() {
	const tabsContainerRef = useRef()
	const location = useLocation()
	const [underlinePos, setUnderlinePos] = useState({ left: 0, width: 0 })

	useEffect(() => {
		moveUnderlineToActiveTab()
	}, [location.pathname])

	function moveUnderlineToActiveTab() {
		const activeTabEl = tabsContainerRef.current.querySelector('a.active')
		if (!activeTabEl) return

		setUnderlinePos({
			left: activeTabEl.offsetLeft,
			width: activeTabEl.offsetWidth,
		})
	}

	return (
		<header className="app-header full">
			<div className="header-top">
				<NavLink to="/" className="logo">
					OurBNB
				</NavLink>

				<div className="header-center">
					<div className="header-tabs" ref={tabsContainerRef}>
						<NavLink to="/" end>Homes</NavLink>
						<NavLink to="/experiences">Experiences</NavLink>
						<NavLink to="/services">Services</NavLink>

						<span
							className="tab-indicator"
							style={{
								left: underlinePos.left + 'px',
								width: underlinePos.width + 'px',
							}}
						/>
					</div>

					<div className="search-bar">
						<div className="search-section">
							<span className="search-label">Where</span>
							<span className="search-value">Search destinations</span>
						</div>

						<div className="search-section">
							<span className="search-label">When</span>
							<span className="search-value">Add dates</span>
						</div>

						<div className="search-who">
							<div className="search-section">
								<span className="search-label">Who</span>
								<span className="search-value">Add guests</span>
							</div>

							<button className="search-btn"><FiSearch /></button>
						</div>
					</div>
				</div>

				<div className="header-actions">
					<a className="host-link">Switch to hosting</a>
					<div className="user-avatar"></div>
					<button className="menu-btn">☰</button>
				</div>
			</div>
		</header>
	)
}