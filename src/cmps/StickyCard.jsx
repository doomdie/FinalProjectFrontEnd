import { useState } from 'react'
import { DatePicker } from "./DatePicker" 
import { Modal } from '@mui/material'
export function StickyCard({ stay }) {
    const [dates, setDates] = useState({ checkIn: null, checkOut: null })
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

    function handleSelectDates(selectedRange) {
        setDates({
            checkIn: selectedRange.from,
            checkOut: selectedRange.to
        })
    }

    return <div className="sticky-card-container">
    <div className="date-pickers-trigger" onClick={() => setIsDatePickerOpen(true)}>
        <p>Check-in: {dates.checkIn ? dates.checkIn.toLocaleDateString() : 'Add date'}</p>
        <p>Checkout: {dates.checkOut ? dates.checkOut.toLocaleDateString() : 'Add date'}</p>
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
</div>
}