import {isEqual, isAfter, isBefore, isToday, isWeekend} from 'date-fns'
import {useContext, useEffect, useState} from 'react'
import {Context} from './DatePickerProvider'
import {DatePickerContext, DaySelection, isMultiSelection, isRangeSelection} from './types'

const useDatePicker = (date?: Date) => {
  const dateCtx = useContext<DatePickerContext | null>(Context)

  if (!dateCtx) {
    throw new Error('useDatePicker must be used inside a DatePickerProvider')
  }

  const [selected, setSelected] = useState<DaySelection>(false)
  const [focused, setFocused] = useState<boolean>(false)
  const today = date ? isToday(date) : false
  const {disableWeekends, minDate, maxDate} = dateCtx.configuration

  useEffect(() => {
    if (date) {
      if (dateCtx.hoverRange) {
        if (isRangeSelection(dateCtx.hoverRange)) {
          if (isEqual(date, dateCtx.hoverRange.from)) {
            setSelected('start')
          } else if (dateCtx.hoverRange.to && isEqual(date, dateCtx.hoverRange.to)) {
            setSelected('end')
          } else if (
            isAfter(date, dateCtx.hoverRange.from) &&
            dateCtx.hoverRange.to &&
            isBefore(date, dateCtx.hoverRange.to)
          ) {
            setSelected('middle')
          } else {
            setSelected(false)
          }
        }
      } else if (dateCtx.selection) {
        if (isMultiSelection(dateCtx.selection)) {
          setSelected(!!dateCtx.selection.find(d => isEqual(d, date)))
        } else if (isRangeSelection(dateCtx.selection)) {
          if (isEqual(date, dateCtx.selection.from)) {
            setSelected('start')
          } else if (dateCtx.selection.to && isEqual(date, dateCtx.selection.to)) {
            setSelected('end')
          } else if (
            isAfter(date, dateCtx.selection.from) &&
            dateCtx.selection.to &&
            isBefore(date, dateCtx.selection.to)
          ) {
            setSelected('middle')
          } else {
            setSelected(false)
          }
        } else {
          setSelected(isEqual(date, dateCtx.selection))
        }
      }
    }
  }, [date, dateCtx.hoverRange, dateCtx.selection, today])

  useEffect(() => {
    if (date) {
      // Check if date should have focus
      setFocused(isEqual(dateCtx.focusDate, date))
    }
  }, [date, dateCtx.focusDate])

  let disabled = false

  if (date) {
    // Check if date should be disabled
    if (minDate || maxDate || disableWeekends) {
      disabled =
        (minDate ? isBefore(date, minDate) : false) ||
        (maxDate ? isAfter(date, maxDate) : false) ||
        (disableWeekends ? isWeekend(date) : false)
    }
  }

  return {...dateCtx, disabled, focused, selected, today}
}

export default useDatePicker
