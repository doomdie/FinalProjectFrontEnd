import { NavLink, useLocation } from 'react-router-dom'

export function TabNav() {
    const location = useLocation()
    const tabs = ['homes', 'experiences', 'services']

    return (
        <nav className="tab-navigation">
            {tabs.map(tab => (
                <NavLink 
                    key={tab} 
                   
                    to={`/${tab}${location.search}`}
                    className={({ isActive }) => isActive ? 'active-tab' : 'tab'}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </NavLink>
            ))}
        </nav>
    )
}