import { useState } from 'react'
import { DayPicker } from 'react-day-picker' 
import 'react-day-picker/dist/style.css'

export function DatePicker({ onSelectDates }) {
    const [range, setRange] = useState({ from: null, to: null })

    return (
        <div className="date-picker-dropdown">
            <DayPicker
                mode="range"
                selected={range}
                onSelect={(newRange) => {
                    setRange(newRange)
                    if (newRange) {
                        onSelectDates({ from: newRange.from, to: newRange.to })
                    }
                }}
            />
        </div>
    )
}