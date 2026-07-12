import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { DatePicker } from "./DatePicker"
// import { Modal } from '@mui/material'
import { GuestMenu } from './GuestMenu'
import { saveOrder } from '../store/actions/order.actions'
import { socketService } from '../services/socket.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { SvgIcon } from '../services/svg.service.jsx'
import { getFakeDates, getTotalPrice } from '../services/util.service.js'

export function StickyCard({ stay, onUpdateFooter }) {
    const user = useSelector(storeState => storeState.userModule.user)
    const [searchParams] = useSearchParams()

    function parseLocalYMD(str) {
        if (!str) return null
        const parts = str.split('-').map(Number)
        if (parts.length !== 3 || parts.some(isNaN)) return null
        return new Date(parts[0], parts[1] - 1, parts[2])
    }

    const [dates, setDates] = useState(() => {
        const fromParam = parseLocalYMD(searchParams.get('from'))
        const toParam = parseLocalYMD(searchParams.get('to'))
        if (fromParam && toParam) return { checkIn: fromParam, checkOut: toParam }

        const fake = getFakeDates(stay)
        if (fake) return fake

        const today = new Date()
        const twoDaysFromNow = new Date()
        twoDaysFromNow.setDate(today.getDate() + 2)
        return { checkIn: today, checkOut: twoDaysFromNow }
    })

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [activeField, setActiveField] = useState('checkIn')
    const datePickerRef = useRef(null)


    useEffect(() => {
        const fromParam = parseLocalYMD(searchParams.get('from'))
        const toParam = parseLocalYMD(searchParams.get('to'))
        if (fromParam && toParam) {
            setDates({ checkIn: fromParam, checkOut: toParam })
            return
        }
        const fake = getFakeDates(stay)
        if (fake) setDates(fake)
    }, [stay._id])


    useEffect(() => {
        if (!isDatePickerOpen) return

        function handleClickOutside(ev) {
            if (datePickerRef.current && !datePickerRef.current.contains(ev.target)) {
                setIsDatePickerOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isDatePickerOpen])



    const [guestCounts, setGuestCounts] = useState(() => {
        const g = parseInt(searchParams.get('guests'), 10)
        return { adults: g > 0 ? g : 1, children: 0, infants: 0, pets: 0 }
    })

    const pricePerNight = stay.price || 1000

    const totalNights = dates.checkIn && dates.checkOut
        ? Math.ceil((dates.checkOut - dates.checkIn) / (1000 * 60 * 60 * 24))
        : 0

    const totalPayingGuests = (guestCounts.adults || 0) + (guestCounts.children || 0) + (guestCounts.infants || 0) + (guestCounts.pets || 0)

    const totalPrice = getTotalPrice(stay, dates.checkIn, dates.checkOut)

    const originalPrice = totalPrice > 0 ? Math.round(totalPrice * 1.33) : 0

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
            buyer: { _id: user._id, fullname: user.fullname },
            stay: { _id: stay._id, name: stay.name, price: stay.price },
            startDate: dates.checkIn.toISOString().split('T')[0],
            endDate: dates.checkOut.toISOString().split('T')[0],
            guests: { ...guestCounts },
            totalPrice,
            imgUrl: stay.imgUrls?.[0] || '',
        }

        try {
            const savedOrder = await saveOrder(orderToSave)
            socketService.emit('order-submitted', savedOrder)
            showSuccessMsg('Reservation request sent successfully!')
        } catch (err) {
            showErrorMsg('Failed to process reservation')
        }
    }

    function handleReport() {
        showSuccessMsg('Thanks for reporting. Our team will review this listing.')
    }

    function handleReserveMouseMove(ev) {
        const btn = ev.currentTarget
        const rect = btn.getBoundingClientRect()
        const x = ev.clientX - rect.left
        const y = ev.clientY - rect.top
        btn.style.setProperty('--x', `${x}px`)
        btn.style.setProperty('--y', `${y}px`)
    }

    function getFormattedDateRange() {
        if (!dates.checkIn || !dates.checkOut) return 'Add dates'
        const startOpt = { month: 'short', day: 'numeric' }
        const endOpt = dates.checkIn.getMonth() === dates.checkOut.getMonth()
            ? { day: 'numeric' }
            : { month: 'short', day: 'numeric' }
        return `${dates.checkIn.toLocaleDateString('en-US', startOpt)} – ${dates.checkOut.toLocaleDateString('en-US', endOpt)}`
    }

    useEffect(() => {
        if (onUpdateFooter) onUpdateFooter(totalPrice, getFormattedDateRange())
    }, [totalPrice, dates.checkIn, dates.checkOut])

    return (
        <div className="sticky-card-container">

            <div className="rare-find-banner">
                <span className="rare-find-icon">💎</span>
                <span className="rare-find-text">Rare find! This place is usually booked</span>
            </div>

            <div className="booking-box">

                {totalPrice > 0 && (
                    <div className="price-line">
                        {originalPrice > totalPrice && (
                            <span className="price-strike">₪{originalPrice}</span>
                        )}
                        <span className="price-current">
                            <span className="price-final">₪{totalPrice}</span>
                            {' '}
                            <span className="price-total-label">total</span>
                        </span>
                    </div>
                )}
                <div className="booking-form-wrapper" ref={datePickerRef}>
                    <div className="booking-form">
                        <div className="date-pickers-trigger" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
                            <div className="date-cell date-cell--in">
                                <span className="date-cell-label">Check-in</span>
                                <span className="date-cell-value">
                                    {dates.checkIn ? dates.checkIn.toLocaleDateString() : 'Add date'}
                                </span>
                            </div>
                            <div className="date-cell date-cell--out">
                                <span className="date-cell-label">Checkout</span>
                                <span className="date-cell-value">
                                    {dates.checkOut ? dates.checkOut.toLocaleDateString() : 'Add date'}
                                </span>
                            </div>
                        </div>

                        <GuestMenu stay={stay} currentList={guestCounts} onUpdateList={setGuestCounts} />
                    </div>

                    {isDatePickerOpen && (
                        <div className="date-picker-panel">

                            <div className="date-picker-panel-header">
                                <div className="picker-header-left">
                                    <h2 className="picker-nights">
                                        {totalNights > 0 ? `${totalNights} night${totalNights === 1 ? '' : 's'}` : 'Select dates'}
                                    </h2>
                                    <p className="picker-date-range">
                                        {dates.checkIn && dates.checkOut
                                            ? `${dates.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${dates.checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                                            : 'Add your travel dates for exact pricing'}
                                    </p>
                                </div>

                                <div className="picker-header-fields">
                                    <div
                                        className={`picker-field ${activeField === 'checkIn' ? 'active' : ''} ${!dates.checkIn ? 'empty' : ''}`}
                                        onClick={() => setActiveField('checkIn')}
                                    >
                                        <div className="picker-field-text">
                                            <span className="picker-field-label">Check-in</span>
                                            <span className="picker-field-value">
                                                {dates.checkIn ? dates.checkIn.toLocaleDateString() : 'MM/DD/YYYY'}
                                            </span>
                                        </div>
                                        {dates.checkIn && (
                                            <button
                                                className="picker-field-clear"
                                                onClick={() => setDates({ checkIn: null, checkOut: null })}
                                                aria-label="Clear check-in"
                                            >×</button>
                                        )}
                                    </div>

                                    <div
                                        className={`picker-field ${activeField === 'checkOut' ? 'active' : ''} ${!dates.checkOut ? 'empty' : ''}`}
                                        onClick={() => setActiveField('checkOut')}
                                    >
                                        <div className="picker-field-text">
                                            <span className="picker-field-label">Checkout</span>
                                            <span className="picker-field-value">
                                                {dates.checkOut ? dates.checkOut.toLocaleDateString() : 'Add date'}
                                            </span>

                                        </div>
                                        {dates.checkOut && (
                                            <button
                                                className="picker-field-clear"
                                                onClick={() => setDates({ ...dates, checkOut: null })}
                                                aria-label="Clear checkout"
                                            >×</button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <DatePicker onSelectDates={handleSelectDates} numberOfMonths={2} />
                            <div className="date-picker-panel-footer">
                                <button className="picker-close-btn" onClick={() => setIsDatePickerOpen(false)}>Close</button>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleReserve}
                    onMouseMove={handleReserveMouseMove}
                    className="reserve-btn"
                >
                    Reserve
                </button>

                <p className="charge-note">You won't be charged yet</p>
            </div>

            <button className="report-listing" onClick={handleReport}>
                <SvgIcon iconName="report" />
                <span>Report this listing</span>
            </button>
            {/* 
            <Modal open={isDatePickerOpen} onClose={() => setIsDatePickerOpen(false)} hideBackdrop>
                <div className="custom-modal-card">
                    <h2>Select Dates</h2>
                    <DatePicker onSelectDates={handleSelectDates} numberOfMonths={2} />
                    <button onClick={() => setIsDatePickerOpen(false)}>Close</button>
                </div>
            </Modal> */}

        </div>
    )
}