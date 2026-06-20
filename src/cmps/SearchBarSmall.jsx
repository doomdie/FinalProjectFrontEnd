import { FiSearch } from 'react-icons/fi'
import { useLocation } from 'react-router-dom'


export function SearchBarSmall() {
    const location = useLocation()

    const iconByPath = {
        '/': 'house',
        '/experiences': 'balloon',
        '/services': 'bell',
    }

    const iconName = iconByPath[location.pathname] || 'house'


    return (
        <div className="search-bar-small">
            <img src={`/img/symbols/${iconName}.svg`} alt="" className="small-icon" />
            <span className="small-section">Anywhere</span>
            <span className="small-section">Anytime</span>
            <span className="small-section">Add guests</span>
            <button className="search-btn-small"><FiSearch /></button>
        </div>
    )
}