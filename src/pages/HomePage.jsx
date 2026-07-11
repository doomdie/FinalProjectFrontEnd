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

    const currentTab = location.pathname.substring(1) || 'all'
    const stays = useSelector(storeState => storeState.stayModule.stays)

    // const isLoading = !stays || !stays.length
    const isLoading = useSelector(storeState => storeState.stayModule.isLoading)
    return (
        <section className="homes-page">
            <SkeletonLoader variant="home" isLoading={isLoading} />

            <header className="homes-header">
                {/* <h2>Explore {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</h2> */}
            </header>

            {(currentTab === 'all' || currentTab === 'homes') && !isLoading && (
                <StayList stays={stays} byCity={currentTab === 'homes'} />
            )}

            {(currentTab === 'experiences' || currentTab === 'services') && (
                <div className="under-construction">
                    <div className = "under-construction-content">
                    <h2>Page under construction</h2>
                    <p>We're working on it. Check back soon.</p>
                    </div>
                </div>
            )}
        </section>
    )
}