import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export function DatePicker({ onSelectDates, numberOfMonths = 1, value, formatters, enableHoverPreview = false }) {
    // console.log('DATEPICKER RENDER', { enableHoverPreview, value })
    // internal state — used only when the parent doesn't pass `value`
    const [internalRange, setInternalRange] = useState({ from: null, to: null })
    // the day currently under the mouse — drives the live range preview while picking the end date
    const [hoveredDay, setHoveredDay] = useState(null)

    // controlled if parent passes `value`; otherwise fall back to internal state
    const isControlled = value !== undefined
    const range = isControlled ? value : internalRange

    // we're picking the END date when start is set and the range is still a single day
    // (range mode sets to === from on the first click, not to === null)
    const isPickingEnd = range?.from && (!range?.to || range.from.getTime() === range.to.getTime())

    // grey "bar" days: everything strictly between `from` and the hovered day (only while picking the end)
    function isPreviewMiddle(day) {
        if (!isPickingEnd || !hoveredDay) return false
        if (hoveredDay <= range.from) return false   // only preview forward in time
        return day > range.from && day < hoveredDay
    }

    // solid endpoint of the preview = the hovered day itself (while picking the end)
    function isPreviewEnd(day) {
        if (!isPickingEnd || !hoveredDay) return false
        if (hoveredDay <= range.from) return false
        return day.getTime() === hoveredDay.getTime()
    }

    return (
        <div className="date-picker-dropdown">
            <DayPicker
                mode="range"
                numberOfMonths={numberOfMonths}
                startMonth={new Date()}
                month={range?.from || undefined}
                disabled={{ before: new Date() }}
                selected={range}
                formatters={formatters}
                modifiers={enableHoverPreview ? { previewMiddle: isPreviewMiddle, previewEnd: isPreviewEnd } : undefined}
                modifiersClassNames={enableHoverPreview ? { previewMiddle: 'preview-middle', previewEnd: 'preview-end' } : undefined}
                onDayMouseEnter={enableHoverPreview ? (day) => setHoveredDay(day) : undefined}
                onDayMouseLeave={enableHoverPreview ? () => setHoveredDay(null) : undefined}
                onSelect={(newRange) => {
                    const safeRange = newRange || { from: null, to: null }
                    if (!isControlled) setInternalRange(safeRange)  // Yair's case: track internally
                    onSelectDates(safeRange)                         // both cases: report up to parent
                }}
            />
        </div>
    )
}