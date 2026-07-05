import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { StayList } from '../cmps/StayList'
import { CarIndex } from '../pages/CarIndex'
import { TabNav } from '../cmps/TabNav'
import { useSyncStayFilter } from '../customHooks/useSyncStayFilter'
import { SkeletonLoader } from '../cmps/SkeletonLoader.jsx'

export function HomesPage() {
    const location = useLocation()

    useSyncStayFilter()

    const currentTab = location.pathname.substring(1) || 'homes'
    const stays = useSelector(storeState => storeState.stayModule.stays)
    const isLoading = !stays || !stays.length

    return (
        <section className="homes-page">
            <SkeletonLoader variant="home" isLoading={isLoading} />

            <header className="homes-header">
                {/* <h2>Explore {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</h2> */}
            </header>

            {currentTab === 'homes' && !isLoading && (
                <StayList stays={stays} />
            )}

            {currentTab === 'experiences' && (
                <CarIndex />
            )}
        </section>
    )
}