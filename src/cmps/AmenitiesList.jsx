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
//I'll finish this after I just ''finish" the details page
export function AmenitiesList({ amenities = [] }) {
    return (
        <div className="amenities-section">
            <h3>What this place offers</h3>
            
            <div className="amenities-grid">
                {amenities.map(amenityKey => {
                    const config = AMENITY_MAP[amenityKey.toLowerCase().trim()]
                    if (!config) return null

                    const Icon = config.icon

                    return (
                        <div key={amenityKey} className="amenity-item">
                            <span className="amenity-icon">
                                <Icon />
                            </span>
                            <span className="amenity-text">{config.title}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}