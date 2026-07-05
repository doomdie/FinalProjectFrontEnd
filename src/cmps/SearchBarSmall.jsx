import { SvgIcon } from '../services/svg.service.jsx'
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

    const guestCount = +searchParams.get('guests') || 0
    const guestsLabel = guestCount ? `${guestCount} guest${guestCount > 1 ? 's' : ''}` : 'Add guests'

    const fromDate = searchParams.get('from') ? new Date(searchParams.get('from')) : null
    const toDate = searchParams.get('to') ? new Date(searchParams.get('to')) : null
    let datesLabel = 'Anytime'
    if (fromDate) {
        const opts = { month: 'short', day: 'numeric' }
        const fromStr = fromDate.toLocaleDateString('en-US', opts)
        if (toDate) {
            const sameMonth = fromDate.getMonth() === toDate.getMonth()
            const toStr = toDate.toLocaleDateString('en-US', sameMonth ? { day: 'numeric' } : opts)
            datesLabel = `${fromStr} – ${toStr}`
        } else {
            datesLabel = fromStr
        }
    }



    return (
        <div className="search-bar-small">
            <img src={`/img/symbols/${iconName}.svg`} alt="" className="small-icon" />
            <span className="small-section small-location" onClick={() => onOpenSection('where')}>{locationLabel}</span>
            <span className="small-section" onClick={() => onOpenSection('when')}>{datesLabel}</span>
            <span className="small-section" onClick={() => onOpenSection('who')}>{guestsLabel}</span>
            <button className="search-btn-small" onClick={() => onOpenSection('where')}><SvgIcon iconName="search" /></button>
        </div>
    )
}