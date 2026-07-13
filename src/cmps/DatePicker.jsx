import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'

export function DatePicker({ onSelectDates, numberOfMonths = 1, value, formatters, enableHoverPreview = false, activeField = null }) {
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

    // figure out which day should get the "you're editing me" ring
    function isActiveEndpoint(day) {
        if (activeField === 'checkIn' && range?.from) return day.getTime() === range.from.getTime()
        if (activeField === 'checkOut' && range?.to) return day.getTime() === range.to.getTime()
        return false
    }

    // build the modifier maps: always the ring, plus hover-preview when enabled
    const modifiers = { activeEndpoint: isActiveEndpoint }
    const modifiersClassNames = { activeEndpoint: 'active-endpoint' }

    if (enableHoverPreview) {
        modifiers.previewMiddle = isPreviewMiddle
        modifiers.previewEnd = isPreviewEnd
        modifiersClassNames.previewMiddle = 'preview-middle'
        modifiersClassNames.previewEnd = 'preview-end'
    }

    return (
        <div className="date-picker-dropdown">
            <DayPicker

                mode="range"
                className="rdp-left-align"
                numberOfMonths={numberOfMonths}
                startMonth={new Date()}
                defaultMonth={range?.from || undefined}
                disabled={{ before: new Date() }}
                selected={range}
                formatters={formatters}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                onDayMouseEnter={enableHoverPreview ? (day) => setHoveredDay(day) : undefined}
                onDayMouseLeave={enableHoverPreview ? () => setHoveredDay(null) : undefined}
                onSelect={(newRange, clickedDay) => {
                    let safeRange = newRange || { from: null, to: null }

                    // field-aware picking (sticky card passes activeField; search bar doesn't)
                    if (activeField === 'checkIn' && clickedDay) {
                        // clicked day = new check-in; keep checkout only if still after it
                        const keepCheckout = range?.to && clickedDay < range.to
                        safeRange = { from: clickedDay, to: keepCheckout ? range.to : null }
                    } else if (activeField === 'checkOut' && clickedDay) {
                        if (range?.from && clickedDay > range.from) {
                            safeRange = { from: range.from, to: clickedDay }        // valid checkout
                        } else {
                            safeRange = { from: clickedDay, to: null }              // before check-in → restart
                        }
                    }

                    if (!isControlled) setInternalRange(safeRange)  // Yair's case: track internally
                    onSelectDates(safeRange)                         // both cases: report up to parent
                }}
            />
        </div>
    )
}