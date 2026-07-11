import { useState, useCallback } from 'react'
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import { SvgIcon } from '../services/svg.service.jsx'

export function ChooseYourLoc({ onSelectLocation }) {
    const [address, setAddress] = useState('Drag the map to set your location')

    return (
        <div className="loc-chooser">
            <h1 className="loc-chooser-title">Is the pin in the right spot?</h1>
            <p className="loc-chooser-subtitle">
                Your address is only shared with guests after they've made a reservation.
            </p>

            <div className="loc-chooser-map">
                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
                    <Map
                        mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
                        defaultZoom={15}
                        defaultCenter={{ lat: 32.0735, lng: 34.7756 }}  // Tel Aviv default
                        gestureHandling="greedy"
                        disableDefaultUI={true}
                        zoomControl={true}
                        style={{ width: '100%', height: '100%', borderRadius: '16px' }}
                    >
                        <CenterPinTracker
                            onSelectLocation={onSelectLocation}
                            setAddress={setAddress}
                        />
                    </Map>
                </APIProvider>

                {/* the address bar floating over the map */}
                <div className="loc-chooser-address">
                    <span className="loc-chooser-pin-icon"><SvgIcon iconName="locPin" /></span>
                    <span>{address}</span>
                </div>

                {/* fixed pin in the exact center — the map moves under it */}
                <div className="loc-chooser-center-pin">
                    <div className="loc-chooser-pin-house"><SvgIcon iconName="houseFill" /></div>
                    <div className="loc-chooser-pin-hint">Drag the map to reposition the pin</div>
                </div>
            </div>
        </div>
    )
}


function CenterPinTracker({ onSelectLocation, setAddress }) {
    const map = useMap()

    const handleIdle = useCallback(() => {
        if (!map) return
        const center = map.getCenter()
        if (!center) return

        const lat = center.lat()
        const lng = center.lng()

        // reverse-geocode: turn lat/lng into a readable address
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            let address = ''
            let city = ''
            let country = ''
            let countryCode = ''

            if (status === 'OK' && results[0]) {
                address = results[0].formatted_address
                for (const comp of results[0].address_components) {
                    if (comp.types.includes('locality')) city = comp.long_name
                    if (comp.types.includes('country')) {
                        country = comp.long_name
                        countryCode = comp.short_name
                    }
                }
                setAddress(address)
            }

            onSelectLocation({ lat, lng, address, city, country, countryCode })
        })
    }, [map, onSelectLocation, setAddress])

    // attach the idle (drag/zoom settled) listener once the map exists
    if (map) {
        window.google.maps.event.clearListeners(map, 'idle')
        map.addListener('idle', handleIdle)
    }

    return null
}