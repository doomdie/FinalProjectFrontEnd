import { useState } from 'react'
import { SvgIcon } from '../services/svg.service.jsx'
import { SeeMoreModal } from './SeeMoreModal.jsx'

// amenity name (lowercase) → icon key in svg.service. Real Airbnb SVGs.
const AMENITY_ICON_MAP = {
    'wifi': 'amWifi',
    'internet': 'amWifi',
    'pocket wifi': 'amWifi',
    'kitchen': 'amKitchen',
    'kitchenette': 'amKitchen',
    'full kitchen': 'amKitchen',
    'tv': 'amTv',
    'cable tv': 'amTv',
    'washer': 'amWasher',
    'dryer': 'amWasher',
    'smoke detector': 'amSmokeAlarm',
    'smoke alarm': 'amSmokeAlarm',
    'dedicated workspace': 'amWorkspace',
    'laptop friendly workspace': 'amWorkspace',
    'air conditioning': 'amAirConditioning',
    'essentials': 'amEssentials',
    'hangers': 'amHangers',
    'carbon monoxide detector': 'amCarbonMonoxideAlarm',
    'carbon monoxide alarm': 'amCarbonMonoxideAlarm',
    'patio or balcony': 'amPatio',
    'balcony': 'amPatio',
    'iron': 'amIron',
    'heating': 'amHeating',
    'luggage dropoff allowed': 'amLuggage',
    'luggage dropoff allowed': 'amLuggage',
    'free parking on premises': 'amFreeParking',
    'free street parking': 'amFreeParking',
    'paid parking off premises': 'amFreeParking',
    'paid parking on premises': 'amFreeParking',
    'hair dryer': 'amHairDryer',
}

const PREVIEW_COUNT = 10   // Airbnb shows 10 in the grid, rest behind "Show all"
export function AmenitiesList({ amenities = [] }) {
    const [isOpen, setIsOpen] = useState(false)
    // guard: drop empty strings and junk like "translation missing: en.hosting_amenity_49"
    const cleanAmenities = amenities.filter(a => a && a.trim() && !a.startsWith('translation missing'))

    if (!cleanAmenities.length) return null

    const previewAmenities = cleanAmenities.slice(0, PREVIEW_COUNT)

    return (
        <section className="amenities-section">
            <h3>What this place offers</h3>

            <div className="amenities-grid">
                {previewAmenities.map(amenity => {
                    const iconKey = AMENITY_ICON_MAP[amenity.toLowerCase().trim()]
                    return (
                        <div key={amenity} className="amenity-item">
                            <span className="amenity-icon">
                                {/* mapped amenities get the real Airbnb SVG, the rest a generic fallback — nothing is dropped */}
                                <SvgIcon iconName={iconKey || 'house'} />
                            </span>
                            <span className="amenity-text">{amenity}</span>
                        </div>
                    )
                })}
            </div>

            {cleanAmenities.length > PREVIEW_COUNT && (
                <button className="amenities-show-all" onClick={() => setIsOpen(true)}>
                    Show all {cleanAmenities.length} amenities
                </button>
            )}

            {isOpen && (
                <SeeMoreModal title="What this place offers" onClose={() => setIsOpen(false)}>
                    <div className="amenities-modal-list">
                        {cleanAmenities.map(amenity => {
                            const iconKey = AMENITY_ICON_MAP[amenity.toLowerCase().trim()]
                            return (
                                <div key={amenity} className="amenity-item">
                                    <span className="amenity-icon">
                                        <SvgIcon iconName={iconKey || 'house'} />
                                    </span>
                                    <span className="amenity-text">{amenity}</span>
                                </div>
                            )
                        })}
                    </div>
                </SeeMoreModal>
            )}
        </section>
    )
}