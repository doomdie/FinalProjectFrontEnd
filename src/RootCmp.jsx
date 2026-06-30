import { Carousel } from 'react-responsive-carousel';
import { Routes, Route, useLocation } from 'react-router-dom'

/*=== PAGES ===*/
import { HomesPage } from './pages/HomePage.jsx'
import { StayDetails } from './pages/StayDetails.jsx'
import { SearchPage } from './pages/SearchPage.jsx'
import { BecomeAHost } from './pages/BecomeAHost.jsx'
import { HostMenu } from './pages/HostMenu.jsx'

/*=== CMPS ===*/
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { UserDetails } from './pages/UserDetails'

import { UserMsg } from './cmps/UserMsg'

export function RootCmp() {
    const location = useLocation()
    const isHostPage = location.pathname === '/become-a-host'
    return (
        <div className="main-container">
            {!isHostPage && <AppHeader />}
            <UserMsg />
           
                <Routes>
                    
                    <Route path="" element={<HomesPage />} />
                    <Route path="/homes" element={<HomesPage />} />
                    <Route path="homes/:stayId" element={<StayDetails />} />
                    <Route path="/experiences" element={<HomesPage />} />
                    <Route path="/services" element={<HomesPage />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/hosting" element={<HostMenu />} />
                    <Route path="/become-a-host" element={<BecomeAHost />} />


                </Routes>
           

            {!isHostPage && <AppFooter />}
        </div>
    )
}