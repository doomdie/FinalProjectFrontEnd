import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { SvgIcon } from '../../services/svg.service.jsx'

export function MobileNavBar() {
    const user = useSelector(storeState => storeState.userModule.user)
    const location = useLocation()
    const EXPLORE_PATHS = ['/', '/homes', '/experiences', '/services', '/search']
    const isExploreWorld = EXPLORE_PATHS.some(path =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
    )

    return (
        <nav className="mobile-nav-bar">
            <NavLink to="/" className={`mobile-nav-item ${isExploreWorld ? 'active' : ''}`}>
                <SvgIcon iconName="search" />
                <span>Explore</span>
            </NavLink>

            <NavLink to="/wishlist" className="mobile-nav-item">
                <SvgIcon iconName="heartOutline" />
                <span>Wishlists</span>
            </NavLink>

            {user ? (
                <NavLink to={`/user/${user._id}`} className="mobile-nav-item">
                    <img
                        src={user.imgUrl || '/img/default-user.png'}
                        alt={user.fullname}
                        className="mobile-nav-avatar"
                    />
                    <span>Profile</span>
                </NavLink>
            ) : (
                <NavLink to="/user/login" className="mobile-nav-item">
                    <SvgIcon iconName="user" />
                    <span>Log in</span>
                </NavLink>
            )}
        </nav>
    )
}