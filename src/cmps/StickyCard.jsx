import { useState } from 'react'
import { DatePicker } from "./DatePicker" 

export function StickyCard({ stay }) {
    const [dates, setDates] = useState({ checkIn: null, checkOut: null })
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

    function handleSelectDates(selectedRange) {
        setDates({
            checkIn: selectedRange.from,
            checkOut: selectedRange.to
        })
    }

    return (
        <div className="sticky-card-container">
            <div className="date-pickers-trigger" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
                <p>Check-in: {dates.checkIn ? dates.checkIn.toLocaleDateString() : 'Add date'}</p>
                <p>Checkout: {dates.checkOut ? dates.checkOut.toLocaleDateString() : 'Add date'}</p>
            </div>

            {isDatePickerOpen && (
                <DatePicker onSelectDates={handleSelectDates} />
            )}
        </div>
    )
}