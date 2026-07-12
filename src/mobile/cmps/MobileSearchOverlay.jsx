import { useState } from 'react'
import { SvgIcon } from '../../services/svg.service.jsx'

export function MobileSearchOverlay({ onClose }) {
    const [activeSection, setActiveSection] = useState('where')

    return (
        <div className="mobile-search-overlay">

            {/* top: tab + close */}
            <header className="mso-header">
                <div className="mso-tabs">
                    <button className="mso-tab active">
                        <img src="/img/symbols/house.svg" alt="" />
                        <span>Homes</span>
                    </button>
                </div>
                <button className="mso-close" onClick={onClose}>×</button>
            </header>

            {/* Where card */}
            {activeSection === 'where' ? (
                <section className="mso-card mso-card-open">
                    <h2 className="mso-card-title">Where?</h2>
                    <div className="mso-search-input">
                        <SvgIcon iconName="search" />
                        <input type="text" placeholder="Search destinations" />
                    </div>

                    <h4 className="mso-list-title">Recent searches</h4>
                    <div className="mso-row">
                        <span className="mso-row-icon"><SvgIcon iconName="clock" /></span>
                        <span className="mso-row-text">
                            <span className="mso-row-main">Barcelona</span>
                            <span className="mso-row-sub">Recent search</span>
                        </span>
                    </div>

                    <h4 className="mso-list-title">Suggested destinations</h4>
                    <div className="mso-row">
                        <span className="mso-row-icon pin-blue"><SvgIcon iconName="beach" /></span>
                        <span className="mso-row-text">
                            <span className="mso-row-main">Barcelona, Spain</span>
                            <span className="mso-row-sub">Popular beach destination</span>
                        </span>
                    </div>
                    <div className="mso-row">
                        <span className="mso-row-icon pin-green"><SvgIcon iconName="park" /></span>
                        <span className="mso-row-text">
                            <span className="mso-row-main">Montreal, Canada</span>
                            <span className="mso-row-sub">Family friendly</span>
                        </span>
                    </div>
                    <div className="mso-row">
                        <span className="mso-row-icon pin-purple"><SvgIcon iconName="castle" /></span>
                        <span className="mso-row-text">
                            <span className="mso-row-main">Istanbul, Turkey</span>
                            <span className="mso-row-sub">For its stunning architecture</span>
                        </span>
                    </div>
                </section>
            ) : (
                <section className="mso-card mso-card-collapsed" onClick={() => setActiveSection('where')}>
                    <span className="mso-collapsed-label">Where</span>
                    <span className="mso-collapsed-value">I'm flexible</span>
                </section>
            )}

            {activeSection === 'when' ? (
                <section className="mso-card mso-card-open">
                    <h2 className="mso-card-title">When?</h2>
                    {/* DatePicker goes here in the next phase */}
                </section>
            ) : (
                <section className="mso-card mso-card-collapsed" onClick={() => setActiveSection('when')}>
                    <span className="mso-collapsed-label">When</span>
                    <span className="mso-collapsed-value">Add dates</span>
                </section>
            )}

            {activeSection === 'who' ? (
                <section className="mso-card mso-card-open">
                    <h2 className="mso-card-title">Who?</h2>
                    {/* guest counters go here in the next phase */}
                </section>
            ) : (
                <section className="mso-card mso-card-collapsed" onClick={() => setActiveSection('who')}>
                    <span className="mso-collapsed-label">Who</span>
                    <span className="mso-collapsed-value">Add guests</span>
                </section>
            )}

            {/* footer */}
            <footer className="mso-footer">
                <button className="mso-clear">Clear all</button>
                <button className="mso-search-btn">
                    <SvgIcon iconName="search" />
                    <span>Search</span>
                </button>
            </footer>
        </div>
    )
}