import { FiSearch } from 'react-icons/fi'
import { useLocation, useSearchParams } from 'react-router-dom'


export function SearchBarSmall() {
    const location = useLocation()
    const [searchParams] = useSearchParams()

    const iconByPath = {
        '/': 'house',
        '/experiences': 'balloon',
        '/services': 'bell',
    }

    const iconName = iconByPath[location.pathname] || 'house'
    const searchTerm = searchParams.get('search') || ''

    const cityOnly = searchTerm.split(',')[0].trim()
    const locationLabel = cityOnly ? `Homes in ${cityOnly}` : 'Anywhere'


    return (
        <div className="search-bar-small">
            <img src={`/img/symbols/${iconName}.svg`} alt="" className="small-icon" />
            <span className="small-section small-location">{locationLabel}</span>
            <span className="small-section">Anytime</span>
            <span className="small-section">Add guests</span>
            <button className="search-btn-small"><FiSearch /></button>
        </div>
    )
}