import { LuWifi, LuTv, LuChefHat, LuWaves, LuCar, LuLaptop, LuCigarette, LuShieldAlert } from 'react-icons/lu'

const AMENITY_MAP = {
    'wifi': { icon: LuWifi, title: 'Wifi' },
    'tv': { icon: LuTv, title: 'TV' },
    'kitchen': { icon: LuChefHat, title: 'Kitchen' },
    'pool': { icon: LuWaves, title: 'Pool' },
    'free street parking': { icon: LuCar, title: 'Free street parking' },
    'dedicated workspace': { icon: LuLaptop, title: 'Dedicated workspace' },
    'washer': { icon: LuCigarette, title: 'Washer' }, 
    'carbon monoxide alarm': { icon: LuShieldAlert, title: 'Carbon monoxide alarm' }
}
export function AmenitiesPageList({ selectedTypes = [], onToggleType,}) {
 
    return (
        <div className="type-section">
            <header className = "amenitiesHeader">
            <h3>Which amenities does your stay provide?</h3>
            </header>
            
            <div className="type-grid">
                {Object.entries(AMENITY_MAP).map(([key, config]) => {
                    const Icon = config.icon
                    // const isSelected = key === selectedTypes
                    const isSelected = selectedTypes.includes(key)

                    return (
                        <div 
                            key={key} 
                            onClick={() => onToggleType(key)}
                            className={`type-item ${isSelected ? 'selected' : ''}`}
                        >
                            <span className="type-icon">
                                <Icon />
                            </span>
                            <span className="type-text">{config.title}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}