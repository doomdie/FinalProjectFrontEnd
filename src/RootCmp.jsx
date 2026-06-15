import { Routes, Route } from 'react-router'

import { HomesPage } from './pages/HomePage'
import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'

export function RootCmp() {
    return (
        <div className="main-container">
            <AppHeader />

            <main>
                <Routes>
                    <Route path="" element={<HomesPage />} />
                </Routes>
            </main>

            <AppFooter />
        </div>
    )
}