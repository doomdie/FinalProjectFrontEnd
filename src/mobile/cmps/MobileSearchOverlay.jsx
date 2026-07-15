import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'

import { SvgIcon } from '../../services/svg.service.jsx'
import { iconForType, buildSuggestions, formatDateRange } from '../../services/util.service.js'
import { DatePicker } from '../../cmps/DatePicker.jsx'
import { ServiceAnimalModal } from '../../cmps/ServiceAnimalModal.jsx'


export function MobileSearchOverlay({ onClose }) {
    const [activeSection, setActiveSection] = useState('where')
    const [whereValue, setWhereValue] = useState('')
    const [dates, setDates] = useState({ from: null, to: null })
    const [monthCount, setMonthCount] = useState(4)
    const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0, pets: 0 })
    const [showServiceModal, setShowServiceModal] = useState(false)
    const [recentSearches] = useState(() => {
        const saved = localStorage.getItem('recentSearches')
        return saved ? JSON.parse(saved) : []
    })
    const stays = useSelector(storeState => storeState.stayModule.stays)

    const suggestions = buildSuggestions(stays)
    const navigate = useNavigate()

    // local YYYY-MM-DD (not toISOString — that shifts a day across timezones)
    function localYMD(date) {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
    }

    function onSearch() {
        const params = {}
        const where = whereValue.trim()
        if (where) params.search = where

        let { from, to } = dates
        // FROM only → TO = +1 day (same rule as SearchBarBig)
        if (from && (!to || from.getTime() === to.getTime())) {
            to = new Date(from)
            to.setDate(to.getDate() + 1)
        }
        if (from && to) {
            params.from = localYMD(from)
            params.to = localYMD(to)
        }

        const guestCount = guests.adults + guests.children
        if (guestCount > 0) params.guests = guestCount

        // save to shared recents (same key SearchBarBig uses)
        if (where) {
            const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]')
            const next = [where, ...saved.filter(p => p !== where)].slice(0, 5)
            localStorage.setItem('recentSearches', JSON.stringify(next))
        }

        navigate(`/search?${new URLSearchParams(params).toString()}`)
        onClose()
    }

    function onClearAll() {
        setWhereValue('')
        setDates({ from: null, to: null })
        setGuests({ adults: 1, children: 0, infants: 0, pets: 0 })
        setActiveSection('where')
    }


    // freeze the page behind the overlay; restore on close
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])


    function changeGuestCount(type, delta) {
        setGuests(prev => {
            const min = type === 'adults' ? 1 : 0
            const max = (type === 'infants' || type === 'pets') ? 5 : Infinity
            const next = Math.min(max, Math.max(min, prev[type] + delta))
            return { ...prev, [type]: next }
        })
    }

    function getGuestSummary() {
        const guestCount = guests.adults + guests.children
        const parts = []
        if (guestCount > 0) parts.push(`${guestCount} guest${guestCount > 1 ? 's' : ''}`)
        if (guests.infants > 0) parts.push(`${guests.infants} infant${guests.infants > 1 ? 's' : ''}`)
        if (guests.pets > 0) parts.push(`${guests.pets} pet${guests.pets > 1 ? 's' : ''}`)
        return parts.join(', ')
    }

    return createPortal(
        <div className="mobile-search-overlay">

            {/* top: tab + close */}
            <header className="mso-header">
                <div className="mso-tabs">
                    <button className="mso-tab active">
                        <img src="/img/symbols/house.svg" alt="" />
                        <span>Homes</span>
                    </button>
                </div>
                <button className="mso-close" onClick={onClose}><SvgIcon iconName="close" /></button>
            </header>

            {/* Where card */}
            {activeSection === 'where' ? (
                <section className="mso-card mso-card-open">
                    <h2 className="mso-card-title">Where?</h2>

                    <div className="mso-search-input">
                        <SvgIcon iconName="search" />
                        <input
                            type="text"
                            placeholder="Search destinations"
                            value={whereValue}
                            onChange={(ev) => setWhereValue(ev.target.value)}
                            onKeyDown={(ev) => { if (ev.key === 'Enter') setActiveSection('when') }}
                        />
                    </div>

                    <div className="mso-scroll-list">
                        {recentSearches.length > 0 && <h4 className="mso-list-title">Recent searches</h4>}
                        {recentSearches.map(place => (
                            <div className="mso-row" key={place} onClick={() => {
                                setWhereValue(place)
                                setActiveSection('when')
                            }}>
                                <span className="mso-row-icon"><SvgIcon iconName="clock" /></span>
                                <span className="mso-row-text">
                                    <span className="mso-row-main">{place}</span>
                                    <span className="mso-row-sub">Recent search</span>
                                </span>
                            </div>
                        ))}

                        <h4 className="mso-list-title">Suggested destinations</h4>
                        {suggestions.map(item => {
                            const { icon, color } = iconForType(item.type)
                            return (
                                <div className="mso-row" key={item.type} onClick={() => {
                                    setWhereValue(item.city)
                                    setActiveSection('when')
                                }}>
                                    <span className={`mso-row-icon pin-${color}`}><SvgIcon iconName={icon} /></span>
                                    <span className="mso-row-text">
                                        <span className="mso-row-main">{item.city}</span>
                                        <span className="mso-row-sub">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                </section>
            ) : (
                <section className="mso-card mso-card-collapsed" onClick={() => setActiveSection('where')}>
                    <span className="mso-collapsed-label">Where</span>
                    <span className="mso-collapsed-value">{whereValue.trim() || "I'm flexible"}</span>
                </section>
            )}

            {activeSection === 'when' ? (
                <section className="mso-card mso-card-open">

                    <h2 className="mso-card-title">When?</h2>
                    <div className="mso-weekday-row">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}
                    </div>
                    <div className="mso-scroll-list mso-datepicker">
                        <DatePicker
                            onSelectDates={setDates}
                            numberOfMonths={monthCount}
                            hideNavigation
                            value={dates}
                            formatters={{
                                formatWeekdayName: (day) => day.toLocaleDateString('en-US', { weekday: 'narrow' }),
                            }}
                        />
                        <button className="mso-load-more" onClick={() => setMonthCount(prev => prev + 4)}>
                            Load more dates
                        </button>
                    </div>

                </section>
            ) : (
                <section className="mso-card mso-card-collapsed" onClick={() => setActiveSection('when')}>
                    <span className="mso-collapsed-label">When</span>
                    <span className="mso-collapsed-value">{formatDateRange(dates)}</span>
                </section>
            )}


            {activeSection === 'who' ? (
                <section className="mso-card mso-card-open mso-card-fit">
                    <h2 className="mso-card-title">Who?</h2>
                    {[
                        { type: 'adults', label: 'Adults', sub: 'Ages 13 or above' },
                        { type: 'children', label: 'Children', sub: 'Ages 2 – 12' },
                        { type: 'infants', label: 'Infants', sub: 'Under 2' },
                        { type: 'pets', label: 'Pets', sub: 'Bringing a service animal?' },
                    ].map(row => (
                        <div className="mso-guest-row" key={row.type}>
                            <div className="mso-guest-label">
                                <span className="mso-guest-type">{row.label}</span>
                                <span
                                    className={`mso-guest-sub ${row.type === 'pets' ? 'link' : ''}`}
                                    onClick={row.type === 'pets' ? () => setShowServiceModal(true) : undefined}
                                >{row.sub}</span>
                            </div>
                            <div className="mso-guest-controls">
                                <button
                                    className="mso-guest-btn"
                                    disabled={guests[row.type] === (row.type === 'adults' ? 1 : 0)}
                                    onClick={() => changeGuestCount(row.type, -1)}
                                >−</button>
                                <span className="mso-guest-count">{guests[row.type]}</span>
                                <button
                                    className="mso-guest-btn"
                                    disabled={(row.type === 'infants' || row.type === 'pets') && guests[row.type] === 5}
                                    onClick={() => changeGuestCount(row.type, 1)}
                                >+</button>
                            </div>
                        </div>
                    ))}
                </section>
            ) : (
                <section className="mso-card mso-card-collapsed" onClick={() => setActiveSection('who')}>
                    <span className="mso-collapsed-label">Who</span>
                    <span className="mso-collapsed-value">{getGuestSummary()}</span>
                </section>
            )}

            {showServiceModal && <ServiceAnimalModal onClose={() => setShowServiceModal(false)} />}


            {/* footer */}
            <footer className="mso-footer">
                <button className="mso-clear" onClick={onClearAll}>Clear all</button>
                <button className="mso-search-btn" onClick={onSearch}>
                    <SvgIcon iconName="search" />
                    <span>Search</span>
                </button>
            </footer>
        </div>,
        document.body
    )
}