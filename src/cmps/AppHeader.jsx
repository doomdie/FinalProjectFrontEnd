import { useRef, useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { SearchBarBig } from './SearchBarBig'
import { SearchBarSmall } from './SearchBarSmall'


export function AppHeader() {
	const tabsContainerRef = useRef()
	const location = useLocation()
	const [underlinePos, setUnderlinePos] = useState({ left: 0, width: 0 })
	const [isScrolled, setIsScrolled] = useState(false)
	const isDetailsPage = location.pathname.startsWith('/homes/') && location.pathname !== '/homes' && location.pathname !== '/homes/'

	useEffect(() => {
		moveUnderlineToActiveTab()
	}, [location.pathname])
	
	useEffect(() => {
        if (isDetailsPage) {
            setIsScrolled(true)
            return
        }

        function onScroll() {
            setIsScrolled(window.scrollY > 50)
        }

        onScroll()

        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [isDetailsPage, location.pathname])

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
					{!isScrolled && (
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
					)}

					{!isScrolled && <SearchBarBig />}

				</div>

				{isScrolled && <SearchBarSmall />}

				<div className="header-actions">
					<a className="host-link">Switch to hosting</a>
					<div className="user-avatar"></div>
					<button className="menu-btn">☰</button>
				</div>
			</div>
		</header>
	)
}