import { FiSearch } from 'react-icons/fi'

export function SearchBarSmall() {
    return (
        <div className="search-bar-small">
            <img src="/img/symbols/balloon.svg" alt="Anywhere" className="small-icon" />
            <span className="small-section">Anywhere</span>
            <span className="small-section">Anytime</span>
            <span className="small-section">Add guests</span>
            <button className="search-btn-small"><FiSearch /></button>
        </div>
    )
}