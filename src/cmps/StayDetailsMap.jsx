import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { SvgIcon } from '../services/svg.service.jsx'

// "Where you'll be" — single-stay map, reuses the search-page map setup.
// data quirk: loc.lan = latitude, loc.lat = longitude (swapped), so we pass lat={lan} lng={lat}
export function StayDetailsMap({ stay }) {
    if (!stay?.loc) return null

    const center = { lat: stay.loc.lan, lng: stay.loc.lat }

    return (
        <section className="details-map-section">
            <h2 className="details-map-title">Where you'll be</h2>


            <div className="details-map-container">
                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
                    <Map
                        key={`${center.lat}-${center.lng}`}
                        mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
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