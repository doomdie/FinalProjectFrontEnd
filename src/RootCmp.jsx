import { Routes, Route } from 'react-router'
import { Carousel } from 'react-responsive-carousel';


/*=== PAGES ===*/
import { HomesPage } from './pages/HomePage'
import { StayDetails } from './pages/StayDetails'

/*=== CMPS ===*/
import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'

export function RootCmp() {
    return (
        <div className="main-container">
            <AppHeader />

            <main>
                <Routes>
                    <Route path="" element={<HomesPage />} />
                    <Route path="homes/:stayId" element={<StayDetails />} />

                    <Route path="/experiences" element={<HomesPage />} />
                    <Route path="/services" element={<HomesPage />} />
                </Routes>
            </main>

            <AppFooter />
        </div>
    )
}