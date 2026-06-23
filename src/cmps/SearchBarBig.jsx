import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'

import { DatePicker } from './DatePicker.jsx'


export function SearchBarBig() {
    // which section is open: 'where', 'when', 'who', or null
    const [activeSection, setActiveSection] = useState(null)
    const [pillPos, setPillPos] = useState({ left: 0, width: 0 })
    const [searchParams, setSearchParams] = useSearchParams()
    const [whereValue, setWhereValue] = useState(searchParams.get('search') || '')
    const [dates, setDates] = useState({ from: null, to: null })
    const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })

    const navigate = useNavigate()

    const searchBarRef = useRef()   // the search-bar div, for click-outside check
    const whereRef = useRef()
    const whenRef = useRef()
    const whoRef = useRef()

    const whereInputRef = useRef()


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

    // format the picked range like "Jul 20 - 31"
    function formatDates() {
        if (!dates.from) return 'Add dates'

        const opts = { month: 'short', day: 'numeric' }
        const from = dates.from.toLocaleDateString('en-US', opts)

        if (!dates.to || dates.from.getTime() === dates.to.getTime()) return from

        const to = dates.to.toLocaleDateString('en-US', { day: 'numeric' })
        return `${from} - ${to}`
    }

    function onSearch() {
        navigate(`/search?search=${encodeURIComponent(whereValue)}`)
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
                <span className="search-value">{formatDates()}</span>


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
                    <DatePicker onSelectDates={setDates} numberOfMonths={2} value={dates} />
                </div>
            )}

            <div className="search-who" ref={whoRef}>
                <div
                    className={`search-section ${activeSection === 'who' ? 'active' : ''}`}
                    onClick={() => setActiveSection('who')}
                >
                    <span className="search-label">Who</span>
                    <span className="search-value">Add guests</span>
                </div>

                <button
                    className={`search-btn ${activeSection ? 'expanded' : ''}`}
                    onClick={onSearch}
                >                    <FiSearch />
                    <span className="search-btn-text">Search</span>
                </button>

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
                                    <span className="guest-sub">{row.sub}</span>
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

            </div>
        </div>
    )
}