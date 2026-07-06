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
                                    to="/wishlist"
                                    className="menu-item menu-item-primary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <SvgIcon iconName="heart" />
                                    Wishlists
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