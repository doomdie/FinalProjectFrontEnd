import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import { FiSearch } from 'react-icons/fi'
import { SvgIcon } from '../services/svg.service.jsx'
import { ServiceAnimalModal } from './ServiceAnimalModal.jsx'
import { DatePicker } from './DatePicker.jsx'
import { iconForType, buildSuggestions } from '../services/util.service.js'

export function SearchBarBig({ forcedSection = null, onOpenChange = () => { } }) {
    // which section is open: 'where', 'when', 'who', or null
    const [activeSection, setActiveSection] = useState(null)
    const [pillPos, setPillPos] = useState({ left: 0, width: 0 })
    const [searchParams, setSearchParams] = useSearchParams()
    const [whereValue, setWhereValue] = useState(searchParams.get('search') || '')
    const [dates, setDates] = useState({ from: null, to: null })
    const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })
    const [showServiceModal, setShowServiceModal] = useState(false)
    // recent destinations the user searched, persisted across refreshes
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem('recentSearches')
        return saved ? JSON.parse(saved) : []
    })
    const navigate = useNavigate()
    const stays = useSelector(storeState => storeState.stayModule.stays)

// one suggested destination per unique stay type, with its city — for the Where dropdown
    const suggestions = buildSuggestions(stays)


    const searchBarRef = useRef()   // the search-bar div, for click-outside check
    const whereRef = useRef()
    const whenRef = useRef()
    const whoRef = useRef()

    const whereInputRef = useRef()

    // small bar told us which section to open
    useEffect(() => {
        if (forcedSection) setActiveSection(forcedSection)
    }, [forcedSection])

    // report open/closed so the header can show the overlay + re-collapse
    useEffect(() => {
        onOpenChange(!!activeSection)
    }, [activeSection])

    useEffect(() => {
        // close when clicking outside the bar
        function handleClickOutside(clickEvent) {
            const bar = searchBarRef.current
            if (bar && !bar.contains(clickEvent.target))
                setActiveSection(null)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside) // cleanup
    }, [])

    useEffect(() => {
        // move the pill onto the active section
        const refByName = { where: whereRef, when: whenRef, who: whoRef }
        const activeEl = activeSection ? refByName[activeSection].current : null

        if (!activeEl) return
        setPillPos({ left: activeEl.offsetLeft, width: activeEl.offsetWidth })
    }, [activeSection])

    // useEffect(() => {
    //     // push the typed text into the URL ?search= param, debounced
    //     const timer = setTimeout(() => {
    //         const params = new URLSearchParams(searchParams)
    //         if (whereValue) params.set('search', whereValue)
    //         else params.delete('search')
    //         setSearchParams(params)
    //     }, 400)

    //     return () => clearTimeout(timer)
    // }, [whereValue])

    function formatDates() {
        if (!dates.from) return 'Add dates'

        const opts = { month: 'short', day: 'numeric' }
        const from = dates.from.toLocaleDateString('en-US', opts)

        if (!dates.to || dates.from.getTime() === dates.to.getTime()) return from

        // show the month on the "to" side only when it differs from "from"
        const sameMonth = dates.from.getMonth() === dates.to.getMonth()
        const toOpts = sameMonth ? { day: 'numeric' } : opts
        const to = dates.to.toLocaleDateString('en-US', toOpts)

        return `${from} - ${to}`
    }

    function onSearch() {
        // save the typed destination to recent searches (newest first, no duplicates, max 5)
        if (whereValue.trim()) {
            const updated = [whereValue, ...recentSearches.filter(item => item !== whereValue)].slice(0, 5)
            setRecentSearches(updated)
            localStorage.setItem('recentSearches', JSON.stringify(updated))
        }

        const guestCount = guests.adults + guests.children
        const params = new URLSearchParams()

        if (whereValue.trim()) params.set('search', whereValue)
        if (guestCount > 0) params.set('guests', guestCount)
        // save the picked dates so the small bar can show them
        // (format LOCALLY — toISOString converts to UTC and shifts the day back in UTC+ timezones)
        const toLocalYMD = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

        if (dates.from) params.set('from', toLocalYMD(dates.from))
        if (dates.to) {
            params.set('to', toLocalYMD(dates.to))
        } else if (dates.from) {
            // only a check-in picked → assume a 1-night stay (checkout = next day)
            const nextDay = new Date(dates.from)
            nextDay.setDate(nextDay.getDate() + 1)
            params.set('to', toLocalYMD(nextDay))
        }

        navigate(`/search?${params.toString()}`)
        window.scrollTo(0, 0)   // land at the top of the results

        setActiveSection(null)   // close the section — triggers onOpenChange(false) → header re-collapses
    }

    const hasGuests = guests.adults + guests.children + guests.infants + guests.pets > 0

    function resetGuests(ev) {
        ev.stopPropagation()
        setGuests({ adults: 0, children: 0, infants: 0, pets: 0 })
    }

    function getGuestSummary() {
        const guestCount = guests.adults + guests.children
        const parts = []
        if (guestCount > 0) parts.push(`${guestCount} guest${guestCount > 1 ? 's' : ''}`)
        if (guests.infants > 0) parts.push(`${guests.infants} infant${guests.infants > 1 ? 's' : ''}`)
        if (guests.pets > 0) parts.push(`${guests.pets} pet${guests.pets > 1 ? 's' : ''}`)
        return parts.length ? parts.join(', ') : 'Add guests'
    }


    function changeGuestCount(type, delta) {
        setGuests(prev => {
            const next = Math.max(0, prev[type] + delta)
            return { ...prev, [type]: next }
        })
    }



    return (
        <div className="search-bar" ref={searchBarRef}>
            {activeSection && (
                <span
                    className="search-pill"
                    style={{ left: pillPos.left + 'px', width: pillPos.width + 'px' }}
                />
            )}

            <div
                ref={whereRef}
                className={`search-section ${activeSection === 'where' ? 'active' : ''}`}
                onClick={() => {
                    setActiveSection('where')
                    whereInputRef.current?.focus()

                }}
            >
                <span className="search-label">Where</span>
                <input
                    ref={whereInputRef}
                    className="search-input"
                    type="text"
                    placeholder="Search destinations"
                    value={whereValue}
                    onChange={(ev) => setWhereValue(ev.target.value)}
                    onKeyDown={(ev) => {
                        if (ev.key === 'Enter') setActiveSection('when')
                    }}
                />

                <button
                    className={`clear-btn ${whereValue && activeSection === 'where' ? 'visible' : ''}`}
                    onClick={(ev) => {
                        ev.stopPropagation()
                        setWhereValue('')
                        whereInputRef.current?.focus()
                    }}
                >×</button>
            </div>


            <div
                ref={whenRef}
                className={`search-section ${activeSection === 'when' ? 'active' : ''}`}
                onClick={() => setActiveSection('when')}
            >
                <span className="search-label">When</span>
                <span className={`search-value ${dates.from ? 'filled' : ''}`}>{formatDates()}</span>


                <button
                    className={`clear-btn ${dates.from && activeSection === 'when' ? 'visible' : ''}`}
                    onClick={(ev) => {
                        ev.stopPropagation()
                        setDates({ from: null, to: null })
                    }}
                >×</button>

            </div>

            {activeSection === 'when' && (
                <div className="when-dropdown">
                    <DatePicker
                        onSelectDates={setDates}
                        numberOfMonths={2}
                        value={dates}
                        enableHoverPreview
                        formatters={{
                            // single-letter weekday headers: S M T W T F S
                            formatWeekdayName: (day) => day.toLocaleDateString('en-US', { weekday: 'narrow' }),
                        }}
                    />
                </div>
            )}

            {activeSection === 'where' && (
                <div className="where-dropdown">
                    {recentSearches.length > 0 && <h4 className="where-dropdown-title">Recent searches</h4>}
                    {recentSearches.map(place => (
                        <div
                            className="recent-row"
                            key={place}
                            onClick={() => {
                                setWhereValue(place)
                                setActiveSection('when')
                            }}
                        >
                            <span className="recent-pin"><SvgIcon iconName="clock" /></span>
                            <span className="recent-text">{place}</span>
                        </div>
                    ))}

                    {/* suggested destinations — built from stay types, each with its icon */}
                    <h4 className="where-dropdown-title">Suggested destinations</h4>
                    {suggestions.map(item => {
                        const { icon, color } = iconForType(item.type)
                        return (
                            <div
                                className="recent-row"
                                key={item.type}
                                onClick={() => {
                                    setWhereValue(item.city)
                                    setActiveSection('when')
                                }}
                            >
                                <span className={`recent-pin pin-${color}`}><SvgIcon iconName={icon} /></span>
                                <span className="recent-text">{item.type.charAt(0).toUpperCase() + item.type.slice(1)} in {item.city}</span>
                            </div>
                        )
                    })}
                </div>
            )}



            <div className="search-who" ref={whoRef}>
                <div
                    className={`search-section search-section-row ${activeSection === 'who' ? 'active' : ''}`}
                    onClick={() => setActiveSection('who')}
                >
                    <div className="search-section-text">
                        <span className="search-label">Who</span>
                        <span className={`search-value ${hasGuests ? 'filled' : ''}`}>{getGuestSummary()}</span>

                    </div>

                    <button
                        className={`clear-btn clear-btn-inline ${hasGuests && activeSection === 'who' ? 'visible' : ''}`}
                        onClick={resetGuests}
                    >×</button>
                </div>

                <button
                    className={`search-btn ${activeSection ? 'expanded' : ''}`}
                    onClick={onSearch}
                >
                    <SvgIcon iconName="search" />
                    <span className="search-btn-text">Search</span>
                </button>

            </div>

            {/* Who dropdown lives at bar level so width:50% measures against the whole bar */}
            {activeSection === 'who' && (
                <div className="who-dropdown">
                    {[
                        { type: 'adults', label: 'Adults', sub: 'Ages 13 or above' },
                        { type: 'children', label: 'Children', sub: 'Ages 2 – 12' },
                        { type: 'infants', label: 'Infants', sub: 'Under 2' },
                        { type: 'pets', label: 'Pets', sub: 'Bringing a service animal?' },
                    ].map(row => (
                        <div className="guest-row" key={row.type}>
                            <div className="guest-row-label">
                                <span className="guest-type">{row.label}</span>
                                <span
                                    className="guest-sub"
                                    onClick={(ev) => {
                                        if (row.type === 'pets') {
                                            ev.stopPropagation()
                                            setShowServiceModal(true)
                                        }
                                    }}
                                >{row.sub}</span>
                            </div>

                            <div className="guest-controls">
                                <button
                                    className="guest-btn"
                                    disabled={guests[row.type] === 0}
                                    onClick={(ev) => { ev.stopPropagation(); changeGuestCount(row.type, -1) }}
                                >−</button>

                                <span className="guest-count">{guests[row.type]}</span>

                                <button
                                    className="guest-btn"
                                    onClick={(ev) => { ev.stopPropagation(); changeGuestCount(row.type, 1) }}
                                >+</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showServiceModal && <ServiceAnimalModal onClose={() => setShowServiceModal(false)} />}

        </div>
    )
}