import {format, isEqual, isAfter, isBefore} from 'date-fns'
import deepmerge from 'deepmerge'
import React, {createContext, useCallback, useContext, useMemo, useEffect, useState} from 'react'

export type DateFormat = 'short' | 'long' | string
export interface DatePickerConfiguration {
  anchorStyle?: 'input' | 'button' | 'icon-only'
  blockedDates?: Array<Date>
  confirmation?: boolean
  contiguousSelection?: boolean
  dateFormat?: DateFormat
  dimWeekends?: boolean
  minDate?: Date
  maxDate?: Date
  placeholder?: string
  rangeIncrement?: number
  selection?: 'single' | 'multi' | 'range'
  view?: '1-month' | '2-month'
}

export type RangeSelection = {
  from: Date
  to: Date
}

export interface DatePickerContext {
  configuration: DatePickerConfiguration
  selection?: Selection
  softSelection?: Partial<RangeSelection> | null
  selectionActive?: boolean
  formattedDate: string
  onSelection: (date: Date) => void
  onDayFocus: (date: Date) => void
  onDayBlur: () => void
}

export type Selection = Date | Array<Date> | RangeSelection | string | null

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
      selected = !!value.selection.find(d => isEqual(d, date))
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
  value?: Selection
}

function isSingleSelection(selection: Selection): selection is Date {
  return selection instanceof Date
}

function isMultiSelection(selection: Selection): selection is Array<Date> {
  return Array.isArray(selection) && selection.every(d => d instanceof Date)
}

function isRangeSelection(selection: Selection): selection is RangeSelection {
  return !!(selection as RangeSelection).from
}

const defaultConfiguration: DatePickerConfiguration = {
  anchorStyle: 'button',
  confirmation: false,
  contiguousSelection: false,
  dimWeekends: false,
  placeholder: 'Select a Date...',
  selection: 'single',
  view: '2-month'
}

export const DatePickerProvider: React.FC<DatePickerProviderProps> = ({
  configuration: externalConfig = {},
  children,
  value
}) => {
  const [configuration, setConfiguration] = useState(deepmerge(defaultConfiguration, externalConfig))
  const [selection, setSelection] = useState<Selection | undefined>(value)
  const [softSelection, setSoftSelection] = useState<Partial<Selection> | null>(null)

  useEffect(() => {
    setConfiguration(deepmerge(defaultConfiguration, externalConfig))
  }, [externalConfig])

  const getFormattedDate = useMemo(() => {
    if (!selection) {
      return configuration.placeholder
    }

    let template = 'MMM d'
    if (configuration.dateFormat) {
      switch (configuration.dateFormat) {
        case 'short':
          template = 'MMM d'
          break
        case 'long':
          template = 'MMM d, yyyy'
          break
        default:
          template = configuration.dateFormat
          break
      }
    }

    switch (configuration.selection) {
      case 'single': {
        if (selection instanceof Date) {
          return format(selection, template)
        } else {
          return 'Invalid Selection'
        }
      }
      case 'multi': {
        if (Array.isArray(selection)) {
          return selection.map(d => format(d, template)).join(', ')
        } else {
          return 'Invalid Selection'
        }
      }
      case 'range': {
        if (isRangeSelection(selection)) {
          return Object.entries(selection)
            .map(([_, date]) => format(date, template))
            .join(', ')
        } else {
          return 'Invalid Selection'
        }
      }
      default: {
        return 'Invalid Configuration'
      }
    }
  }, [configuration.dateFormat, configuration.placeholder, configuration.selection, selection])

  const selectionHandler = useCallback(
    (date: Date) => {
      if (configuration.selection === 'single') {
        setSelection(date)
      } else if (configuration.selection === 'multi') {
        const selections = selection as Array<Date>
        if(selections.includes(s => isEqual(s, date)))
      } else if (configuration.selection === 'range') {
        if (softSelection && isRangeSelection(softSelection)) {
          setSelection({from: softSelection.from, to: date})
        } else {
          setSoftSelection({from: date, to: date})
        }
      }

      // Handle close if no confirmation required
    },
    [configuration.selection, softSelection]
  )

  const focusHnadler = useCallback(
    (date: Date) => {
      if (configuration.selection === 'single' || !softSelection) {
        setSoftSelection({date})
      }
      if (configuration.selection === 'range' && softSelection && isRangeSelection(softSelection)) {
        setSoftSelection({...softSelection, to: date})
      }
    },
    [configuration.selection, softSelection]
  )

  const blurHnadler = useCallback(() => {
    if (configuration.selection === 'single' || !softSelection) {
      setSoftSelection(null)
    }
    if (configuration.selection === 'range' && softSelection && isRangeSelection(softSelection)) {
      setSoftSelection({from: softSelection.from})
    }
  }, [configuration.selection, softSelection])

  const datePickerCtx: DatePickerContext = useMemo(() => {
    return {
      configuration,
      selectionActive: false,
      formattedDate: getFormattedDate,
      selection,
      onSelection: selectionHandler,
      onDayFocus: focusHnadler,
      onDayBlur: blurHnadler
    }
  }, [blurHnadler, configuration, focusHnadler, getFormattedDate, selection, selectionHandler])

  return <DatePickerContext.Provider value={datePickerCtx}>{children}</DatePickerContext.Provider>
}
