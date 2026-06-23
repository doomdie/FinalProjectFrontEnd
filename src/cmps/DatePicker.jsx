import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export function DatePicker({ onSelectDates, numberOfMonths = 1, value }) {
    // internal state — used only when the parent doesn't pass `value`
    const [internalRange, setInternalRange] = useState({ from: null, to: null })

    // controlled if parent passes `value`; otherwise fall back to internal state
    const isControlled = value !== undefined
    const range = isControlled ? value : internalRange


    return (
        <div className="date-picker-dropdown">
            <DayPicker
                mode="range"
                numberOfMonths={numberOfMonths}
                startMonth={new Date()}
                month={range?.from || undefined}
                disabled={{ before: new Date() }}
                selected={range}
                onSelect={(newRange) => {
                    const safeRange = newRange || { from: null, to: null }
                    if (!isControlled) setInternalRange(safeRange)  // Yair's case: track internally
                    onSelectDates(safeRange)                         // both cases: report up to parent
                }}
            />
        </div>
    )
}