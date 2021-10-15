import React, {createContext, useCallback, useContext, useMemo, useState} from 'react'

export interface DatePickerConfiguration {
  anchorStyle?: 'input' | 'full-date' | 'icon-only'
  confirmation?: boolean
  contiguousSelection?: boolean
  dimWeekends?: boolean
  minDate?: Date
  maxDate?: Date
  rangeIncrement?: number
  selection?: 'single' | 'range'
  view?: '1-month' | '2-month'
}

type SingleSelection = {
  date: Date
}

type BaseRangeSelection = {
  from: Date
}

type RangeSelection = {
  to: Date
} & BaseRangeSelection

type SoftRangeSelection = {
  from: Date
  to?: Date
} & BaseRangeSelection

export interface DatePickerContext {
  configuration: DatePickerConfiguration
  selection?: SingleSelection | RangeSelection | null
  softSelection?: SingleSelection | SoftRangeSelection | null
  selectionActive?: boolean
  onSelection?: (date: Date) => void
  onDayFocus?: (date: Date) => void
  onDayBlur?: () => void
}

const DatePickerContext = createContext<DatePickerContext | null>(null)

export const useDatePicker = () => {
  const value = useContext(DatePickerContext)

  if (!value) {
    throw new Error('useDatePicker must be used inside the Provider')
  }

  return value
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
