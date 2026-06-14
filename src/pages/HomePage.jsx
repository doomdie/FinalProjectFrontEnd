import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadStays,  } from '../store/actions/stay.actions'
import { useSearchParams } from 'react-router-dom'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { userService } from '../services/user/'
import { stayService } from '../services/stays/'
import { StayList } from '../cmps/StayList'
import { CarFilter } from '../cmps/CarFilter'
import { useSyncStayFilter } from '../customHooks/useSyncStayFilter'

export function HomesPage() {
    const [searchParams] = useSearchParams()
    const currentTab = searchParams.get('tab') || 'homes'
    const [filterBy, setFilterBy] = useState(stayService.getDefaultFilter())
    useSyncStayFilter(currentTab, searchParams)
    // const stays = useSelector(storeState => storeState.stayModule.stays)

    useEffect(() => {
        const urlFilter = {
            type: searchParams.get('type') || '',
            amenities: searchParams.get('amenities') || '',
            topRate: searchParams.get('topRate') || ''
        }
        
        const combinedFilter = { ...filterBy, ...urlFilter }
        loadStays(combinedFilter)
    }, [searchParams, filterBy])

    async function onRemoveCar(carId) {
        try {
            await removeCar(carId)
            showSuccessMsg('Car removed')
        } catch (err) {
            showErrorMsg('Cannot remove car')
        }
    }

    async function onAddCar() {
        const car = stayService.getEmptyCar()
        car.vendor = prompt('Vendor?', 'Some Vendor')
        try {
            const savedCar = await addCar(car)
            showSuccessMsg(`Car added (id: ${savedCar._id})`)
        } catch (err) {
            showErrorMsg('Cannot add car')
        }
    }

    async function onUpdateCar(car) {
        const speed = +prompt('New speed?', car.speed) || 0
        if (speed === 0 || speed === car.speed) return

        const carToSave = { ...car, speed }
        try {
            const savedCar = await updateCar(carToSave)
            showSuccessMsg(`Car updated, new speed: ${savedCar.speed}`)
        } catch (err) {
            showErrorMsg('Cannot update car')
        }
    }

    return (
        <section className="homes-page">
            <header className="homes-header">
                <h2>Explore</h2>
                {/* <button onClick={onBecomeHost}>Airbnb your home</button> */}
            </header>
            
            {/* <StayFilter filterBy={filterBy} setFilterBy={setFilterBy} /> */}

            {/* {currentTab === 'homes' && <StayList stays={stays} />} */}
          {currentTab === 'homes' && <StayList />}
            {currentTab === 'experiences' && <StayList />}
            {currentTab === 'services' && <StayList />}
        </section>
    )
}