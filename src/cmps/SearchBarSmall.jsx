import { FiSearch } from 'react-icons/fi'
import { useLocation, useSearchParams } from 'react-router-dom'


export function SearchBarSmall({ onOpenSection = () => { } }) {
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
            <span className="small-section small-location" onClick={() => onOpenSection('where')}>{locationLabel}</span>
            <span className="small-section" onClick={() => onOpenSection('when')}>Anytime</span>
            <span className="small-section" onClick={() => onOpenSection('who')}>Add guests</span>
            <button className="search-btn-small" onClick={() => onOpenSection('where')}><FiSearch /></button>
        </div>
    )
}