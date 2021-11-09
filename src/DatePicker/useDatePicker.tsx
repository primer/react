import {isEqual, isAfter, isBefore, isToday, isWeekend} from 'date-fns'
import {useContext, useEffect, useState} from 'react'
import {Context} from './DatePickerProvider'
import {DatePickerContext, DaySelection, isMultiSelection, isRangeSelection} from './types'

export const useDatePicker = (date?: Date) => {
  const dateCtx = useContext<DatePickerContext | null>(Context)

  if (!dateCtx) {
    throw new Error('useDatePicker must be used inside a DatePickerProvider')
  }

  const [selected, setSelected] = useState<DaySelection>(false)
  const [focused, setFocused] = useState<boolean>(false)
  const today = date ? isToday(date) : false
  const {configuration, hoverRange, selection} = dateCtx
  const {disableWeekends, minDate, maxDate} = configuration

  // Determine if the given date is inside of the hover range
  useEffect(() => {
    if (date && hoverRange) {
      if (isRangeSelection(hoverRange)) {
        if (isEqual(date, hoverRange.from)) {
          setSelected('start')
        } else if (hoverRange.to && isEqual(date, hoverRange.to)) {
          setSelected('end')
        } else if (isAfter(date, hoverRange.from) && hoverRange.to && isBefore(date, hoverRange.to)) {
          setSelected('middle')
        } else {
          setSelected(false)
        }
      }
    }
  }, [date, hoverRange, today])

  // Determine if the given date is selected
  useEffect(() => {
    if (date && selection) {
      if (isMultiSelection(selection)) {
        setSelected(!!selection.find(d => isEqual(d, date)))
      } else if (isRangeSelection(selection)) {
        if (isEqual(date, selection.from)) {
          setSelected('start')
        } else if (selection.to && isEqual(date, selection.to)) {
          setSelected('end')
        } else if (isAfter(date, selection.from) && selection.to && isBefore(date, selection.to)) {
          setSelected('middle')
        } else {
          setSelected(false)
        }
      } else {
        setSelected(isEqual(date, selection))
      }
    }
  }, [date, selection, today])

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
