// src/hooks/useSyncStayFilters.js
import { useEffect } from 'react'
import { loadStays } from '../store/actions/stay.actions'

export function useSyncStayFilter(currentTab, searchParams) {
    useEffect(() => {
        const filterBy = {
            search: searchParams.get('search') || '',
            tab: currentTab 
        }

        if (currentTab === 'homes') {
            filterBy.type = searchParams.get('type') || ''
            filterBy.amenities = searchParams.get('amenities') || ''
        } else if (currentTab === 'experiences') {
            filterBy.guests = searchParams.get('guests') || ''
        } else if (currentTab === 'services') {
            filterBy.category = searchParams.get('category') || ''
        }

        loadStays(filterBy)

    }, [currentTab, searchParams]) 
}