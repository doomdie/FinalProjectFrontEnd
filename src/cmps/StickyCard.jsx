import { useState } from 'react'
import { useSelector } from 'react-redux'
import { DatePicker } from "./DatePicker"
import { Modal, Box } from '@mui/material'
import { GuestMenu } from './GuestMenu'
import { saveOrder } from '../store/actions/order.actions'
import { socketService } from '../services/socket.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

export function StickyCard({ stay }) {
    const user = useSelector(storeState => storeState.userModule.user)

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
    const [guestCounts, setGuestCounts] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })

    const pricePerNight = stay.price || 1000

    const totalNights = dates.checkIn && dates.checkOut
        ? Math.ceil((dates.checkOut - dates.checkIn) / (1000 * 60 * 60 * 24))
        : 0

    const totalPayingGuests = (guestCounts.adults || 0) + (guestCounts.children || 0) + (guestCounts.infants || 0) + (guestCounts.pets || 0)

    const accommodationBasePrice = pricePerNight * totalNights * (totalPayingGuests || 1)
    const petFee = guestCounts.pets > 0 ? 150 : 0
    const serviceFee = accommodationBasePrice > 0 ? Math.round(accommodationBasePrice * 0.12) : 0
    const totalPrice = accommodationBasePrice + petFee + serviceFee

    function handleSelectDates(selectedRange) {
        setDates({ checkIn: selectedRange.from, checkOut: selectedRange.to })
    }

    async function handleReserve() {
        if (!user) {
            showErrorMsg('Please sign in to make a reservation')
            return
        }
        if (!dates.checkIn || !dates.checkOut) {
            showErrorMsg('Please select your check-in and check-out dates!')
            return
        }

        const orderToSave = {
            hostId: stay.host?.id || stay.host?._id,
            buyer: {
                _id: user._id,
                fullname: user.fullname
            },
            stay: {
                _id: stay._id,
                name: stay.name,
                price: stay.price
            },
            startDate: dates.checkIn.toISOString().split('T')[0],
            endDate: dates.checkOut.toISOString().split('T')[0],
            guests: { ...guestCounts },
            totalPrice,
            status: 'pending'
        }

        try {
            const savedOrder = await saveOrder(orderToSave)
            socketService.emit('order-submitted', savedOrder)
            showSuccessMsg('Reservation request sent successfully!')
        } catch (err) {
            showErrorMsg('Failed to process reservation')
        }
    }

    return (
        <div className="sticky-card-container">
            <div className="rare-find-banner">
                <span className="gem-icon">💎</span>
                <span className="banner-text">Rare find! This place is usually booked</span>
            </div>

            <div className="booking-box-content">
                {totalNights > 0 && (
                    <div className="price-breakdown-summary">
                        <div className="price-row total-row">
                            <h3>₪{totalPrice} total</h3>
                        </div>
                    </div>
                )}
                <div className="sticky-part-one">
                    <div className="date-pickers-trigger" onClick={() => setIsDatePickerOpen(true)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '12px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#000000ff' }}>Check-in </span>
                            <span>{dates.checkIn ? dates.checkIn.toLocaleDateString() : 'Add date'}</span>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '12px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#000000ff' }}>Check-out </span>
                            <span>{dates.checkOut ? dates.checkOut.toLocaleDateString() : 'Add date'}</span>
                        </Box>
                    </div>
                    <GuestMenu stay={stay} currentList={guestCounts} onUpdateList={setGuestCounts}></GuestMenu>
                </div>

                <Modal
                    open={isDatePickerOpen}
                    onClose={() => setIsDatePickerOpen(false)}
                >
                    <div className="custom-modal-card"  >
                        <h2>Select Dates</h2>
                        <DatePicker onSelectDates={handleSelectDates} />
                        <button onClick={() => setIsDatePickerOpen(false)}>Close</button>
                    </div>
                </Modal>

                <button onClick={handleReserve} className="reserve-btn">Reserve</button>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#000000ff' }}>This Stay is Awesome! </span>
                </Box>
            </div>
        </div>
    )
}