import { Routes, Route } from 'react-router'
import { Carousel } from 'react-responsive-carousel';
import { HomesPage } from './pages/HomePage'
import { StayDetails } from './pages/StayDetails'


import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'

export function RootCmp() {
    return (
        <div className="main-container">
            <AppHeader />

            <main>
                <Routes>

                    <Route path="" element={<HomesPage />} />
                    <Route path="homes" element={<HomesPage />} />
                    <Route path="homes/:stayId" element={<StayDetails />} />

                    <Route path="/experiences" element={<HomesPage />} />
                    <Route path="/services" element={<HomesPage />} />
                    {/* <Route path="about" element={<AboutUs />}>
                        <Route path="team" element={<AboutTeam />} />
                        <Route path="vision" element={<AboutVision />} />
                    </Route> */}
                  
                    {/* <Route path="user/:id" element={<UserDetails />} /> */}
                    {/* <Route path="review" element={<ReviewIndex />} />
                    <Route path="chat" element={<ChatApp />} />
                    <Route path="admin" element={<AdminIndex />} />
                    <Route path="auth" element={<LoginSignup />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route> */}
                </Routes>
            </main>

            <AppFooter />
        </div>
    )
}