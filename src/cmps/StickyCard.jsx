import { useState } from 'react'
import { DatePicker } from "./DatePicker"
import { Modal, Box } from '@mui/material'
import { GuestMenu } from './GuestMenu'
export function StickyCard({ stay }) {
    const [dates, setDates] = useState(() => {
        const today = new Date()

        const twoDaysFromNow = new Date()
        twoDaysFromNow.setDate(today.getDate() + 2)

        return {
            checkIn: today,
            checkOut: twoDaysFromNow
        }
    })
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [guestCounts, setGuestCounts] = useState({ adults: 1, children: 0, infants: 0, pets: 0 })

    const pricePerNight = stay.price || 1000

    const totalNights = dates.checkIn && dates.checkOut
        ? Math.ceil((dates.checkOut - dates.checkIn) / (1000 * 60 * 60 * 24))
        : 0

    const accommodationBasePrice = pricePerNight * totalNights
    const petFee = guestCounts.pets > 0 ? 150 : 0
    const serviceFee = accommodationBasePrice > 0 ? Math.round(accommodationBasePrice * 0.12) : 0
    const totalPrice = accommodationBasePrice + petFee + serviceFee

    function handleSelectDates(selectedRange) {
        setDates({ checkIn: selectedRange.from, checkOut: selectedRange.to })
    }
    function handleReserve() {
        if (!dates.checkIn || !dates.checkOut) {
            alert('Please select your check-in and check-out dates!')
            return
        }
        alert(`Success! Final Total: ₪${totalPrice}`)
    }
    console.log("Current guest counts object:", guestCounts)
    return (
        
        <div className="sticky-card-container">
             {totalNights > 0 && (
                <div className="price-breakdown-summary">
                    
                 

                    <div className="price-row total-row">
                         <h3>₪{totalPrice}</h3>
                    </div>
                </div>
            )}
            <div className="sticky-part-one">
                <div className="date-pickers-trigger" onClick={() => setIsDatePickerOpen(true)}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#000000ff' }}>Check-in </span>
                        <span >{dates.checkIn ? dates.checkIn.toLocaleDateString() : 'Add date'}</span>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#000000ff' }}>Check-out </span>
                        <span >{dates.checkOut ? dates.checkOut.toLocaleDateString() : 'Add date'}</span>
                    </Box>

                </div>
                <GuestMenu stay={stay} currentList={guestCounts} onUpdateList={setGuestCounts} ></GuestMenu>
            </div>

            <Modal
                open={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
            >
                <div className="custom-modal-card">
                    <h2>Select Dates</h2>

                    <DatePicker onSelectDates={handleSelectDates} />

                    <button onClick={() => setIsDatePickerOpen(false)}>Close</button>
                </div>
            </Modal>

           

            <button onClick={handleReserve} className="reserve-btn">Reserve</button>
        </div>
    )
}