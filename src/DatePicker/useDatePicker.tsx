import {isEqual} from 'date-fns'
import {isAfter, isBefore} from 'date-fns/esm'
import React, {createContext, useCallback, useContext, useMemo, useState} from 'react'

export interface DatePickerConfiguration {
  anchorStyle?: 'input' | 'full-date' | 'icon-only'
  blockedDates?: Array<Date>
  confirmation?: boolean
  contiguousSelection?: boolean
  dimWeekends?: boolean
  minDate?: Date
  maxDate?: Date
  rangeIncrement?: number
  selection?: 'single' | 'multi' | 'range'
  view?: '1-month' | '2-month'
}

type SingleSelection = {
  date: Date
}

type BaseRangeSelection = {
  from: Date
}

type RangeSelection = {to: Date} & BaseRangeSelection
type SoftRangeSelection = {to?: Date} & BaseRangeSelection

export interface DatePickerContext {
  configuration: DatePickerConfiguration
  selection?: SingleSelection | Array<SingleSelection> | RangeSelection | null
  softSelection?: SingleSelection | SoftRangeSelection | null
  selectionActive?: boolean
  onSelection: (date: Date) => void
  onDayFocus: (date: Date) => void
  onDayBlur: () => void
}

const DatePickerContext = createContext<DatePickerContext | null>(null)

export const useDatePicker = (date?: Date) => {
  const value = useContext(DatePickerContext)

  if (!value) {
    throw new Error('useDatePicker must be used inside a DatePickerProvider')
  }

  let selected,
    blocked,
    disabled = false

  if (date) {
    if (Array.isArray(value.selection)) {
      selected = !!value.selection.find(d => isEqual(d.date, date))
    }

    // Determine if date is blocked out
    if (value.configuration.blockedDates) {
      blocked = !!value.configuration.blockedDates.find(d => isEqual(d, date))
    }

    // Determine if date is disabled
    if (value.configuration.minDate || value.configuration.maxDate) {
      disabled =
        (value.configuration.minDate ? isBefore(date, value.configuration.minDate) : false) ||
        (value.configuration.maxDate ? isAfter(date, value.configuration.maxDate) : false)
    }
  }

  return {...value, blocked, disabled, selected}
}

export interface DatePickerProviderProps {
  configuration?: DatePickerConfiguration
}

function isRangeSelection(
  selection: SingleSelection | RangeSelection | SoftRangeSelection
): selection is BaseRangeSelection {
  return !!(selection as BaseRangeSelection).from
}

export const DatePickerProvider: React.FC<DatePickerProviderProps> = ({configuration, children}) => {
  const [selection, setSelection] = useState<SingleSelection | RangeSelection | null>(null)
  const [softSelection, setSoftSelection] = useState<SingleSelection | SoftRangeSelection | null>(null)

  const selectionHandler = useCallback(
    (date: Date) => {
      if (configuration?.selection === 'single') {
        setSelection({date})
      } else if (configuration?.selection === 'range') {
        if (softSelection && isRangeSelection(softSelection)) {
          setSelection({from: softSelection.from, to: date})
        } else {
          setSoftSelection({from: date, to: date})
        }
      }
    },
    [configuration?.selection, softSelection]
  )

  const focusHnadler = useCallback(
    (date: Date) => {
      if (configuration?.selection === 'single' || !softSelection) {
        setSoftSelection({date})
      }
      if (configuration?.selection === 'range' && softSelection && isRangeSelection(softSelection)) {
        setSoftSelection({...softSelection, to: date})
      }
    },
    [configuration?.selection, softSelection]
  )

  const blurHnadler = useCallback(() => {
    if (configuration?.selection === 'single' || !softSelection) {
      setSoftSelection(null)
    }
    if (configuration?.selection === 'range' && softSelection && isRangeSelection(softSelection)) {
      setSoftSelection({from: softSelection.from})
    }
  }, [configuration?.selection, softSelection])

  const datePickerCtx: DatePickerContext = useMemo(() => {
    return {
      configuration: {
        anchorStyle: 'full-date',
        confirmation: false,
        contiguousSelection: false,
        dimWeekends: false,
        selection: 'single',
        view: '2-month',
        ...configuration
      },
      selectionActive: false,
      selection,
      onSelection: selectionHandler,
      onDayFocus: focusHnadler,
      onDayBlur: blurHnadler
    }
  }, [blurHnadler, configuration, focusHnadler, selection, selectionHandler])

  return <DatePickerContext.Provider value={datePickerCtx}>{children}</DatePickerContext.Provider>
}
