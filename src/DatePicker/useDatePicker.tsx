import {format, isEqual, isAfter, isBefore} from 'date-fns'
import deepmerge from 'deepmerge'
import React, {createContext, useCallback, useContext, useMemo, useEffect, useState} from 'react'

export type AnchorVariant = 'input' | 'button' | 'icon-only'
export type DateFormat = 'short' | 'long' | string
export type SelectionVariant = 'single' | 'multi' | 'range'
export interface DatePickerConfiguration {
  anchorVariant?: AnchorVariant
  blockedDates?: Array<Date>
  confirmation?: boolean
  contiguousSelection?: boolean
  dateFormat?: DateFormat
  dimWeekends?: boolean
  minDate?: Date
  maxDate?: Date
  placeholder?: string
  rangeIncrement?: number
  selection?: SelectionVariant
  view?: '1-month' | '2-month'
}

export type RangeSelection = {
  from: Date
  to: Date | null
}

export type StringRangeSelection = {
  from: string
  to: string
}

export interface DatePickerContext {
  disabled?: boolean
  configuration: DatePickerConfiguration
  selection?: Selection
  softSelection?: Partial<RangeSelection> | null
  selectionActive?: boolean
  formattedDate: string
  onSelection: (date: Date) => void
  onDayFocus: (date: Date) => void
  onDayBlur: (date: Date) => void
}

export type Selection = Date | Array<Date> | RangeSelection | null
export type StringSelection = string | Array<string> | {to: string; from: string} | null
export type DaySelection = boolean | 'start' | 'middle' | 'end'

const DatePickerContext = createContext<DatePickerContext | null>(null)

const useDatePicker = (date?: Date) => {
  const value = useContext(DatePickerContext)

  if (!value) {
    throw new Error('useDatePicker must be used inside a DatePickerProvider')
  }

  let selected: DaySelection = false
  let blocked,
    disabled = false

  if (date) {
    if (value.selection) {
      if (isMultiSelection(value.selection)) {
        selected = !!value.selection.find(d => isEqual(d, date))
      } else if (isRangeSelection(value.selection)) {
        if (isEqual(date, value.selection.from)) {
          selected = 'start'
        } else if (value.selection.to && isEqual(date, value.selection.to)) {
          selected = 'end'
        } else if (isAfter(date, value.selection.from) && value.selection.to && isBefore(date, value.selection.to)) {
          selected = 'middle'
        } else {
          selected = false
        }
      } else {
        selected = isEqual(date, value.selection)
      }
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

export default useDatePicker

export interface DatePickerProviderProps {
  closePicker?: () => void
  configuration?: DatePickerConfiguration
  value?: Selection | StringSelection
}

export function isSingleSelection(selection: Selection): selection is Date {
  return selection instanceof Date
}

export function isMultiSelection(selection: Selection | StringSelection): selection is Array<Date> | Array<string> {
  return Array.isArray(selection)
}

export function isRangeSelection(
  selection: Selection | StringSelection
): selection is RangeSelection | StringRangeSelection {
  return !!(selection as RangeSelection).from
}

export function isStringRangeSelection(selection: StringSelection): selection is StringRangeSelection {
  return !!(selection as StringRangeSelection).from
}

function parseSelection(
  selection: Selection | StringSelection | null | undefined,
  variant: SelectionVariant
): Selection | undefined {
  if (!selection) return

  if (variant === 'multi') {
    if (isMultiSelection(selection)) {
      const parsedSelection: Array<Date> = []
      for (const d of selection) {
        parsedSelection.push(new Date(new Date(d).toDateString()))
      }
      return parsedSelection.sort((a, b) => a.getTime() - b.getTime())
    } else if (selection instanceof Date) {
      return [new Date(new Date(selection).toDateString())]
    } else if (isRangeSelection(selection)) {
      const parsedSelection: Array<Date> = []
      parsedSelection.push(new Date(new Date(selection.from).toDateString()))
      if (selection.to) {
        parsedSelection.push(new Date(new Date(selection.to).toDateString()))
      }
      return parsedSelection.sort((a, b) => a.getTime() - b.getTime())
    }
  } else if (variant === 'range') {
    if (isRangeSelection(selection)) {
      return {
        from: new Date(new Date(selection.from).toDateString()),
        to: selection.to ? new Date(new Date(selection.to).toDateString()) : null
      }
    } else if (isMultiSelection(selection)) {
      return {
        from: new Date(new Date(selection[0]).toDateString()),
        to: selection[1] ? new Date(new Date(selection[1]).toDateString()) : null
      }
    } else if (selection instanceof Date) {
      return {
        from: new Date(new Date(selection).toDateString()),
        to: null
      }
    }
  } else {
    if (selection instanceof Date) {
      return new Date(new Date(selection).toDateString())
    } else if (isMultiSelection(selection)) {
      return new Date(new Date(selection[0]).toDateString())
    } else if (isRangeSelection(selection)) {
      return new Date(new Date(selection.from).toDateString())
    } else {
      return
    }
  }
}

const defaultConfiguration: DatePickerConfiguration = {
  anchorVariant: 'button',
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
  closePicker,
  value
}) => {
  const [configuration, setConfiguration] = useState(deepmerge(defaultConfiguration, externalConfig))
  const [selection, setSelection] = useState<Selection | undefined>(parseSelection(value, configuration.selection))
  const [hoverRange, setHoverRange] = useState<RangeSelection | null>(null)

  useEffect(() => {
    setConfiguration(deepmerge(defaultConfiguration, externalConfig))
    setSelection(parseSelection(selection, configuration.selection))

    // Don't want this to run every time selection gets updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration.selection, externalConfig])

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
        } else if (Array.isArray(selection)) {
          return format(selection[0], template)
        } else if (isRangeSelection(selection)) {
          return format(selection.from, template)
        } else {
          return 'Invalid Selection'
        }
      }
      case 'multi': {
        if (Array.isArray(selection)) {
          if (selection.length > 3) return `${selection.length} Selected`
          const formatted = selection.map(d => format(d, template)).join(', ')
          return formatted
        } else if (selection instanceof Date) {
          return [selection].map(d => format(d, template)).join(', ')
        } else if (isRangeSelection(selection)) {
          return [selection.to, selection.from].map(d => (d ? format(d, template) : '')).join(', ')
        } else {
          return 'Invalid Selection'
        }
      }
      case 'range': {
        if (isRangeSelection(selection)) {
          return Object.entries(selection)
            .map(([_, date]) => (date ? format(date, template) : ''))
            .join(' - ')
        } else if (selection instanceof Date) {
          return Object.entries({from: selection, to: null})
            .map(([_, date]) => (date ? format(date, template) : ''))
            .join(' - ')
        } else if (Array.isArray(selection)) {
          return (
            Object.entries({from: selection[0], to: selection[1]})
              // to date can still be null
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              .map(([_, date]) => (date ? format(date, template) : ''))
              .join(' - ')
          )
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
      if (configuration.selection === 'multi') {
        const selections = [...(selection as Array<Date>)]
        const existingIndex = selections.findIndex((s: Date) => isEqual(s, date))
        if (existingIndex > -1) {
          selections.splice(existingIndex, 1)
          setSelection(selections.sort((a, b) => a.getTime() - b.getTime()))
        } else {
          setSelection([...selections, date].sort((a, b) => a.getTime() - b.getTime()))
        }
      } else if (configuration.selection === 'range') {
        if (selection && isRangeSelection(selection) && !selection.to) {
          setSelection(
            isBefore(date, selection.from) ? {from: date, to: selection.from} : {from: selection.from, to: date}
          )
          if (!configuration.confirmation) {
            closePicker?.()
          }
        } else {
          setSelection({from: date, to: null})
        }
      } else {
        setSelection(date)

        if (!configuration.confirmation) {
          closePicker?.()
        }
      }
    },
    [closePicker, configuration.confirmation, configuration.selection, selection]
  )

  const focusHnadler = useCallback(
    (date: Date) => {
      if (!selection) return

      if (configuration.selection === 'range' && isRangeSelection(selection)) {
        setHoverRange(
          isBefore(date, selection.from) ? {from: date, to: selection.from} : {from: selection.from, to: date}
        )
      }
    },
    [configuration.selection, selection]
  )

  const blurHnadler = useCallback(
    (date: Date) => {
      if (!selection || !hoverRange) return

      if (
        configuration.selection === 'range' &&
        isRangeSelection(selection) &&
        (hoverRange.from === date || hoverRange.to === date)
      ) {
        setHoverRange(null)
      }
    },
    [configuration.selection, hoverRange, selection]
  )

  const datePickerCtx: DatePickerContext = useMemo(() => {
    return {
      configuration,
      disabled: false,
      formattedDate: getFormattedDate,
      onDayBlur: blurHnadler,
      onDayFocus: focusHnadler,
      onSelection: selectionHandler,
      selectionActive: false,
      selection
    }
  }, [blurHnadler, configuration, focusHnadler, getFormattedDate, selection, selectionHandler])

  return <DatePickerContext.Provider value={datePickerCtx}>{children}</DatePickerContext.Provider>
}
