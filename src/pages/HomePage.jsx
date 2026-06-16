import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { StayList } from '../cmps/StayList'
import { CarIndex } from '../pages/CarIndex'
import { TabNav } from '../cmps/TabNav'
import { useSyncStayFilter } from '../customHooks/useSyncStayFilter'





export function HomesPage() {
    const location = useLocation()

    useSyncStayFilter()

    const currentTab = location.pathname.substring(1) || 'homes'
    const stays = useSelector(storeState => storeState.stayModule.stays)

    return (
        <section className="homes-page">
            <TabNav />

            <header className="homes-header">
                <h2>Explore {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</h2>
            </header>

            {currentTab === 'homes' && (
                <StayList stays={stays} />
            )}

            {currentTab === 'experiences' && (
                <CarIndex />
            )}
        </section>
    )
}