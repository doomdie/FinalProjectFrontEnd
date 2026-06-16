import { FiSearch } from 'react-icons/fi'

export function SearchBarBig() {
    return (
        <div className="search-bar">
            <div className="search-section">
                <span className="search-label">Where</span>
                <span className="search-value">Search destinations</span>
            </div>

            <div className="search-section">
                <span className="search-label">When</span>
                <span className="search-value">Add dates</span>
            </div>

            <div className="search-who">
                <div className="search-section">
                    <span className="search-label">Who</span>
                    <span className="search-value">Add guests</span>
                </div>

                <button className="search-btn"><FiSearch /></button>
            </div>
        </div>
    )
}