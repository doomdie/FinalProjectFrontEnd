import { useState, useRef, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'

export function SearchBarBig() {
    // which section is open: 'where', 'when', 'who', or null
    const [activeSection, setActiveSection] = useState(null)
    const [pillPos, setPillPos] = useState({ left: 0, width: 0 })

    const searchBarRef = useRef()   // the search-bar div, for click-outside check
    const whereRef = useRef()
    const whenRef = useRef()
    const whoRef = useRef()

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
                onClick={() => setActiveSection('where')}
            >
                <span className="search-label">Where</span>
                <span className="search-value">Search destinations</span>
            </div>

            <div
                ref={whenRef}
                className={`search-section ${activeSection === 'when' ? 'active' : ''}`}
                onClick={() => setActiveSection('when')}
            >
                <span className="search-label">When</span>
                <span className="search-value">Add dates</span>
            </div>

            <div className="search-who" ref={whoRef}>
                <div
                    className={`search-section ${activeSection === 'who' ? 'active' : ''}`}
                    onClick={() => setActiveSection('who')}
                >
                    <span className="search-label">Who</span>
                    <span className="search-value">Add guests</span>
                </div>

               <button className={`search-btn ${activeSection ? 'expanded' : ''}`}>
                    <FiSearch />
                    <span className="search-btn-text">Search</span>
                </button>

            </div>
        </div>
    )
}