import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'


import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { userService } from '../services/user/'
import { stayService } from '../services/stays/'
import { CarList } from '../cmps/CarList'
import { CarFilter } from '../cmps/CarFilter'

export function HomesPage() {

    const [filterBy, setFilterBy] = useState(stayService.getDefaultFilter())
    const cars = useSelector(storeState => storeState.carModule.cars)

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
        <section className="car-index">
            <header>
                <h2>Cars</h2>
                {userService.getLoggedinUser() && <button onClick={onAddCar}>Add a Car</button>}
            </header>
            <CarFilter filterBy={filterBy} setFilterBy={setFilterBy} />
            <CarList
                cars={cars}
                onRemoveCar={onRemoveCar}
                onUpdateCar={onUpdateCar} />
        </section>
    )
}