import React from 'react'
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { SvgIcon } from '../services/svg.service.jsx'
import { getStayCoords } from '../services/util.service.js'
export function StayDetailsMap({ stay }) {
    console.log(stay)
    console.log('DEBUG: Full stay.loc object:', stay?.loc)

    if (!stay?.loc) return null

    const rawLat = stay.loc.Lat ?? stay.loc.lat
    const rawLng = stay.loc.Lng ?? stay.loc.lng

    const lat = Number(rawLat)
    const lng = Number(rawLng)
    
    console.log('DEBUG: Final Lat/Lng being passed to Map:', lat, lng)

    if (isNaN(lat) || isNaN(lng)) {
        return <section className="details-map-section">Map data unavailable</section>
    }

    const center = { lat, lng }

    return (
        <section className="details-map-section">
            <h2 className="details-map-title">Where you'll be</h2>

            <div className="details-map-container" style={{ width: '100%', height: '400px' }}>
                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
                    <Map
                        mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
                        defaultZoom={13}
                        defaultCenter={center}
                        gestureHandling="greedy"
                        disableDefaultUI={true}
                        zoomControl={true}
                        zoomControlOptions={{ position: 3 }}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <AdvancedMarker position={center}>
                            <div className="details-map-pin">
                                <SvgIcon iconName="houseFill" />
                            </div>
                        </AdvancedMarker>
                    </Map>
                </APIProvider>
            </div>
        </section>
    )
}