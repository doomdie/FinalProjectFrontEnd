import { useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { loadStays } from '../store/actions/stay.actions'

export function useSyncStayFilter() {
    const location = useLocation()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        console.log('=== HOOK TRIGGERED ===')
        console.log('Current URL Search String:', location.search)
        if (!searchParams || typeof searchParams.get !== 'function') { 
            console.log('Search params missing or malformed')
            return }

        const currentTab = location.pathname.substring(1) || 'homes'

        const filterBy = {
            tab: currentTab,
            search: searchParams.get('search') || '',
            type: searchParams.get('type') || '',
            amenities: searchParams.get('amenities') || '',
            guests: searchParams.get('guests') || '',
            category: searchParams.get('category') || ''
        }

        loadStays(filterBy)

    }, [location.pathname, location.search])
}