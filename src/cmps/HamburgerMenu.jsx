import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SvgIcon } from '../services/svg.service.jsx'

export function HamburgerMenu({ user, onLogout, onOpenLogin }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div className="menu-wrapper">
            <button className={`menu-btn ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(prev => !prev)}>
                <SvgIcon iconName="hamburger" />
            </button>

            {isMenuOpen && (
                <>
                    <div className="menu-backdrop" onClick={() => setIsMenuOpen(false)} />

                    <div className="menu-dropdown">
                        {!user && (
                            <button
                                className="menu-item"
                                onClick={() => { onOpenLogin(); setIsMenuOpen(false) }}
                            >
                                Log in or sign up
                            </button>
                        )}
                        {user && (
                            <>
                                <Link
                                    to="/hosting"
                                    className="menu-item menu-item-icon menu-item-hosting"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <SvgIcon iconName="hostingSwitch" />
                                    Switch to hosting
                                </Link>

                                <div className="menu-divider" />

                                <Link
                                    to={`/user/${user._id}?tab=wishlist`}
                                    className="menu-item menu-item-icon"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <SvgIcon iconName="heartOutline" />
                                    Wishlists
                                </Link>
                                <Link
                                    to={`/user/${user._id}?tab=past-trips`}
                                    className="menu-item menu-item-icon"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <SvgIcon iconName="airbnbSymbol" />
                                    Trips
                                </Link>

                                <Link
                                    to={`/user/${user._id}`}
                                    className="menu-item menu-item-icon"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <SvgIcon iconName="profileCircle" />
                                    Profile
                                </Link>

                                <div className="menu-divider" />

                                <button
                                    className="menu-item"
                                    onClick={() => { onLogout(); setIsMenuOpen(false) }}
                                >
                                    Log out
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}