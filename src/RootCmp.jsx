import { Routes, Route } from 'react-router-dom'
import { Carousel } from 'react-responsive-carousel';


/*=== PAGES ===*/
import { HomesPage } from './pages/HomePage.jsx'
import { StayDetails } from './pages/StayDetails.jsx'
import { SearchPage } from './pages/SearchPage.jsx'


/*=== CMPS ===*/
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'


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
                    <Route path="/search" element={<SearchPage />} />
                </Routes>
            </main>

            <AppFooter />
        </div>
    )
}