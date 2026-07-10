import { Carousel } from 'react-responsive-carousel';
import { Routes, Route, useLocation } from 'react-router-dom'

/*=== PAGES ===*/
import { HomesPage } from './pages/HomePage.jsx'
import { StayDetails } from './pages/StayDetails.jsx'
import { WishlistPage } from './pages/WishlistPage.jsx'
import { SearchPage } from './pages/SearchPage.jsx'
import { BecomeAHost } from './pages/BecomeAHost.jsx'
import { HostMenu } from './pages/HostMenu.jsx'
import { useEffect } from 'react'

/*=== CMPS ===*/
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { UserDetails } from './pages/UserDetails'
import { PublicProfile } from './pages/PublicProfile.jsx'
import { HostListings } from './cmps/HostListings.jsx'
import { checkLoggedinUser } from './store/actions/user.actions'
import { UserMsg } from './cmps/UserMsg'
import { ScrollToTop } from './cmps/ScrollToTop.jsx'

export function RootCmp() {
    useEffect(() => {
        checkLoggedinUser()
    }, [])
    const location = useLocation()
    const isHostPage = location.pathname === '/become-a-host'
    return (
        <div className="main-container">
            {!isHostPage && <AppHeader />}
            <UserMsg />

            <ScrollToTop />

            <Routes>

                <Route path="" element={<HomesPage />} />
                <Route path="/homes" element={<HomesPage />} />
                {/* <Route path="homes/:stayId" element={<StayDetails />} /> */}
                <Route path="/homes/:stayId" element={<StayDetails />} />
                <Route path="/experiences" element={<HomesPage />} />
                <Route path="/services" element={<HomesPage />} />
                {/* <Route path="user/:id" element={<UserDetails />} /> */}
                <Route path="/user/:id" element={<UserDetails />} />
                <Route path="user/public/:id" element={<PublicProfile />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/hosting" element={<HostMenu />} />
                <Route path="/hosting/listings" element={<HostListings />} />
                <Route path="/become-a-host" element={<BecomeAHost />} />

            </Routes>


            {!isHostPage && <AppFooter />}
        </div>
    )
}