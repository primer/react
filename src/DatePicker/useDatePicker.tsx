import {CheckIcon, TrashIcon} from '@primer/octicons-react'
import {
  isEqual,
  isAfter,
  isBefore,
  addMonths,
  subMonths,
  isToday,
  isWeekend,
  differenceInDays,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  isSaturday,
  isSunday,
  nextSaturday,
  previousFriday,
  previousSunday,
  subYears,
  addYears
} from 'date-fns'
import deepmerge from 'deepmerge'
import React, {createContext, useCallback, useContext, useMemo, useEffect, useState} from 'react'
import {Text, useConfirm} from '..'
import {formatDate} from './dateParser'

export type AnchorVariant = 'input' | 'button' | 'icon-only'
export type DateFormat = 'short' | 'long' | string
export type SelectionVariant = 'single' | 'multi' | 'range'
export interface DatePickerConfiguration {
  anchorVariant?: AnchorVariant
  blockedDates?: Array<Date>
  confirmation?: boolean
  confirmUnsavedClose?: boolean
  dateFormat?: DateFormat
  disableWeekends?: boolean
  iconPlacement?: 'start' | 'end' | 'none'
  maxDate?: Date | null
  maxSelections?: number
  maxRangeSize?: number
  minDate?: Date | null
  placeholder?: string
  rangeIncrement?: number
  showInputPrompt?: boolean
  variant?: SelectionVariant
  view?: '1-month' | '2-month'
  weekStartsOn?: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
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
  currentViewingDate: Date
  dialogOpen: boolean
  focusDate: Date
  goToMonth: (date: Date) => void
  hoverRange?: RangeSelection | null
  selection?: Selection
  softSelection?: Partial<RangeSelection> | null
  selectionActive?: boolean
  formattedDate: string
  nextMonth: () => void
  onClose: () => void
  onDateInput: (updatedSelection: Selection) => void
  onDayFocus: (date: Date) => void
  onSelection: (date: Date) => void
  previousMonth: () => void
  revertValue: () => void
  saveValue: (selection?: Selection) => void
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type Selection = Date | Array<Date> | RangeSelection | null
export type StringSelection = string | Array<string> | {to: string; from: string} | null
export type DaySelection = boolean | 'start' | 'middle' | 'end'

const DatePickerContext = createContext<DatePickerContext | null>(null)

const useDatePicker = (date?: Date) => {
  const dateCtx = useContext(DatePickerContext)
  const [selected, setSelected] = useState<DaySelection>(false)
  const [focused, setFocused] = useState<boolean>(false)
  const today = date ? isToday(date) : false

  if (!dateCtx) {
    throw new Error('useDatePicker must be used inside a DatePickerProvider')
  }

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
      // Determine if date is focused
      setFocused(isEqual(dateCtx.focusDate, date))
    }
  }, [date, dateCtx.focusDate])

  let blocked,
    disabled = false

  if (date) {
    // Determine if date is blocked out
    if (dateCtx.configuration.blockedDates) {
      blocked = !!dateCtx.configuration.blockedDates.find(d => isEqual(d, date))
    }

    // Determine if date is disabled
    if (dateCtx.configuration.minDate || dateCtx.configuration.maxDate || dateCtx.configuration.disableWeekends) {
      disabled =
        (dateCtx.configuration.minDate ? isBefore(date, dateCtx.configuration.minDate) : false) ||
        (dateCtx.configuration.maxDate ? isAfter(date, dateCtx.configuration.maxDate) : false) ||
        (dateCtx.configuration.disableWeekends ? isWeekend(date) : false)
    }
  }

  return {...dateCtx, blocked, disabled, focused, selected, today}
}

export default useDatePicker

export interface DatePickerProviderProps {
  closePicker?: () => void
  configuration?: DatePickerConfiguration
  isOpen?: boolean
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
        parsedSelection.push(normalizeDate(d))
      }
      return parsedSelection.sort((a, b) => a.getTime() - b.getTime())
    } else if (selection instanceof Date) {
      return [normalizeDate(selection)]
    } else if (isRangeSelection(selection)) {
      const parsedSelection: Array<Date> = []
      parsedSelection.push(normalizeDate(selection.from))
      if (selection.to) {
        parsedSelection.push(normalizeDate(selection.to))
      }
      return parsedSelection.sort((a, b) => a.getTime() - b.getTime())
    }
  } else if (variant === 'range') {
    if (isRangeSelection(selection)) {
      return {
        from: normalizeDate(selection.from),
        to: selection.to ? normalizeDate(selection.to) : null
      }
    } else if (isMultiSelection(selection)) {
      return {
        from: normalizeDate(selection[0]),
        to: selection[1] ? normalizeDate(selection[1]) : null
      }
    } else if (selection instanceof Date) {
      return {
        from: normalizeDate(selection),
        to: null
      }
    }
  } else {
    if (selection instanceof Date) {
      return normalizeDate(selection)
    } else if (isMultiSelection(selection)) {
      return normalizeDate(selection[0])
    } else if (isRangeSelection(selection)) {
      return normalizeDate(selection.from)
    } else {
      return
    }
  }
}

const getInitialFocusDate = (selection?: Selection) => {
  if (!selection) return normalizeDate(new Date())

  if (selection instanceof Date) {
    return normalizeDate(selection)
  } else if (Array.isArray(selection)) {
    return normalizeDate(selection[0])
  } else if (isRangeSelection(selection)) {
    return normalizeDate(selection.from)
  } else {
    return normalizeDate(new Date())
  }
}

const normalizeDate = (date: Date | string) => new Date(new Date(date).toDateString())

const defaultConfiguration: DatePickerConfiguration = {
  anchorVariant: 'button',
  confirmation: false,
  confirmUnsavedClose: false,
  disableWeekends: false,
  iconPlacement: 'start',
  placeholder: 'Choose Date...',
  showInputPrompt: false,
  variant: 'single',
  view: '2-month',
  weekStartsOn: 'Sunday'
}

export const DatePickerProvider: React.FC<DatePickerProviderProps> = ({
  configuration: externalConfig = {},
  children,
  closePicker,
  isOpen = false,
  value
}) => {
  const [configuration, setConfiguration] = useState(deepmerge(defaultConfiguration, externalConfig))
  const initialSelection = parseSelection(value, configuration.variant)

  const [previousSelection, setPreviousSelection] = useState<Selection | undefined>(
    parseSelection(value, configuration.variant)
  )
  const [isDirty, setIsDirty] = useState(false)
  const [selection, setSelection] = useState<Selection | undefined>(initialSelection)
  const [hoverRange, setHoverRange] = useState<RangeSelection | null>(null)
  const [currentViewingDate, setCurrentViewingDate] = useState(new Date())
  const confirm = useConfirm()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [focusDate, setFocusDate] = useState(getInitialFocusDate(initialSelection))

  useEffect(() => {
    setConfiguration(deepmerge(defaultConfiguration, externalConfig))
    setSelection(parseSelection(selection, configuration.variant))

    // Don't want this to run every time selection gets updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration.variant, externalConfig])

  const goToMonth = useCallback((date: Date) => {
    setCurrentViewingDate(normalizeDate(date))
  }, [])

  const nextMonth = useCallback(() => {
    setCurrentViewingDate(addMonths(currentViewingDate, 1))
  }, [currentViewingDate])

  const previousMonth = useCallback(() => {
    setCurrentViewingDate(subMonths(currentViewingDate, 1))
  }, [currentViewingDate])

  const getFormattedDate = useMemo(() => {
    const {anchorVariant, dateFormat, placeholder, variant} = configuration
    return formatDate({selection, anchorVariant, dateFormat, placeholder, variant})
  }, [configuration, selection])

  const saveValue = useCallback(
    (updatedSelection?: Selection) => {
      setPreviousSelection(updatedSelection ?? selection)
      setIsDirty(false)
      closePicker?.()
    },
    [closePicker, selection]
  )

  const revertValue = useCallback(() => {
    setSelection(previousSelection)
    setIsDirty(false)
  }, [previousSelection])

  const handleClose = useCallback(async () => {
    if (configuration.confirmUnsavedClose) {
      if (isDirty) {
        const result = await confirm({
          title: 'Save Changes?',
          content: 'You have unsaved changes, would you like to save them?',
          confirmButtonContent: (
            <>
              <CheckIcon />
              <Text sx={{ml: 1}}>Save</Text>
            </>
          ),
          cancelButtonContent: (
            <>
              <TrashIcon />
              <Text sx={{ml: 1}}>Discard</Text>
            </>
          )
        })
        if (result) {
          saveValue()
        } else {
          revertValue()
        }
      }
    } else if (isDirty) revertValue()
  }, [configuration.confirmUnsavedClose, confirm, isDirty, revertValue, saveValue])

  const inputHandler = useCallback(
    (updatedSelection: Selection) => {
      if (!updatedSelection) return
      const {maxDate, minDate, variant, maxSelections, maxRangeSize} = configuration

      switch (variant) {
        case 'single': {
          if (updatedSelection instanceof Date) {
            if (maxDate && isAfter(updatedSelection, maxDate)) {
              setSelection(maxDate)
            } else if (minDate && isBefore(minDate, updatedSelection)) {
              setSelection(minDate)
            } else {
              setSelection(updatedSelection)
            }
          }
          break
        }
        case 'multi': {
          if (Array.isArray(updatedSelection)) {
            let validSelections = updatedSelection.filter(
              d => (maxDate ? isBefore(d, maxDate) : true) && (minDate ? isAfter(d, minDate) : true)
            )
            if (maxSelections) {
              validSelections = validSelections.slice(0, maxSelections)
            }

            setSelection(validSelections)
          }
          break
        }
        case 'range': {
          if (isRangeSelection(updatedSelection)) {
            const validRange: RangeSelection = updatedSelection
            if (minDate) {
              validRange.from = isAfter(updatedSelection.from, minDate) ? updatedSelection.from : minDate
              if (updatedSelection.to) {
                validRange.to = isAfter(updatedSelection.to, minDate) ? updatedSelection.to : minDate
              }
            }
            if (maxDate) {
              validRange.from = isBefore(updatedSelection.from, maxDate) ? updatedSelection.from : maxDate
              if (updatedSelection.to) {
                validRange.to = isBefore(updatedSelection.to, maxDate) ? updatedSelection.to : maxDate
              }
            }

            if (
              maxRangeSize &&
              validRange.to &&
              Math.abs(differenceInDays(validRange.from, validRange.to)) >= maxRangeSize
            ) {
              validRange.to = addDays(validRange.from, maxRangeSize - 1)
            }
            setSelection(updatedSelection)
          }
          break
        }
      }
    },
    [configuration]
  )

  useEffect(() => {
    if (
      currentViewingDate.getMonth() !== focusDate.getMonth() ||
      currentViewingDate.getFullYear() !== focusDate.getFullYear()
    ) {
      setCurrentViewingDate(focusDate)
    }
  }, [currentViewingDate, focusDate])

  const selectionHandler = useCallback(
    (date: Date) => {
      setIsDirty(true)
      if (configuration.variant === 'multi') {
        const selections = [...(selection as Array<Date>)]
        const existingIndex = selections.findIndex((s: Date) => isEqual(s, date))
        if (existingIndex > -1) {
          selections.splice(existingIndex, 1)
          setSelection(selections.sort((a, b) => a.getTime() - b.getTime()))
        } else {
          if (configuration.maxSelections && selections.length + 1 > configuration.maxSelections) return
          setSelection([...selections, date].sort((a, b) => a.getTime() - b.getTime()))
        }
      } else if (configuration.variant === 'range') {
        if (selection && isRangeSelection(selection) && !selection.to) {
          let toDate = date
          if (
            configuration.maxRangeSize &&
            Math.abs(differenceInDays(selection.from, date)) >= configuration.maxRangeSize
          ) {
            toDate = isBefore(date, selection.from)
              ? subDays(selection.from, configuration.maxRangeSize - 1)
              : addDays(selection.from, configuration.maxRangeSize - 1)
          }

          const updatedSelection = isBefore(toDate, selection.from)
            ? {from: toDate, to: selection.from}
            : {from: selection.from, to: toDate}
          setSelection(updatedSelection)
          setHoverRange(null)
          if (!configuration.confirmation) {
            saveValue(updatedSelection)
          }
        } else {
          setHoverRange({from: date, to: date})
          setSelection({from: date, to: null})
        }
      } else {
        setSelection(date)

        if (!configuration.confirmation) {
          saveValue(date)
        }
      }
    },
    [
      configuration.confirmation,
      configuration.maxRangeSize,
      configuration.maxSelections,
      configuration.variant,
      saveValue,
      selection
    ]
  )

  const focusHandler = useCallback(
    (date: Date) => {
      if (!selection) return
      const {minDate, maxDate, maxRangeSize, disableWeekends, variant} = configuration

      if (variant === 'range' && isRangeSelection(selection) && hoverRange) {
        let hoverDate = date
        if (minDate) hoverDate = isBefore(date, minDate) ? minDate : hoverDate
        if (maxDate) hoverDate = isAfter(date, maxDate) ? maxDate : hoverDate
        if (maxRangeSize && Math.abs(differenceInDays(selection.from, hoverDate)) >= maxRangeSize) {
          hoverDate = isBefore(hoverDate, selection.from)
            ? subDays(selection.from, configuration.maxRangeSize - 1)
            : addDays(selection.from, configuration.maxRangeSize - 1)
        }

        if (disableWeekends && isWeekend(hoverDate)) {
          hoverDate = previousFriday(hoverDate)
        }

        setHoverRange(
          isBefore(hoverDate, selection.from)
            ? {from: hoverDate, to: selection.from}
            : {from: selection.from, to: hoverDate}
        )
      }
    },
    [configuration, hoverRange, selection]
  )

  const handleKeyDown = useCallback(
    async (e: KeyboardEvent) => {
      const key = e.key
      const {minDate, maxDate} = configuration
      switch (key) {
        case 'ArrowRight': {
          // Increase selection by 1 day
          let newDate = normalizeDate(addDays(focusDate, 1))
          if (maxDate && isAfter(newDate, maxDate)) newDate = maxDate
          setFocusDate(newDate)
          focusHandler(newDate)
          break
        }
        case 'ArrowLeft': {
          // Decrease selection by 1 day
          let newDate = normalizeDate(subDays(focusDate, 1))
          if (minDate && isBefore(newDate, minDate)) newDate = minDate
          setFocusDate(newDate)
          focusHandler(newDate)
          break
        }
        case 'ArrowUp': {
          // Decrease selection by 1 week
          let newDate = normalizeDate(subWeeks(focusDate, 1))
          if (minDate && isBefore(newDate, minDate)) newDate = minDate
          setFocusDate(newDate)
          focusHandler(newDate)
          break
        }
        case 'ArrowDown': {
          // Increase selection by 1 week
          let newDate = normalizeDate(addWeeks(focusDate, 1))
          if (maxDate && isAfter(newDate, maxDate)) newDate = maxDate
          setFocusDate(newDate)
          focusHandler(newDate)
          break
        }
        case 'Home': {
          let newDate = normalizeDate(isSunday(focusDate) ? focusDate : previousSunday(focusDate))
          if (minDate && isBefore(newDate, minDate)) newDate = minDate
          setFocusDate(newDate)
          focusHandler(newDate)
          break
        }
        case 'End': {
          let newDate = normalizeDate(isSaturday(focusDate) ? focusDate : nextSaturday(focusDate))
          if (maxDate && isAfter(newDate, maxDate)) newDate = maxDate
          setFocusDate(newDate)
          focusHandler(newDate)
          break
        }
        case 'PageUp': {
          let newDate = normalizeDate(e.shiftKey ? subYears(focusDate, 1) : subMonths(focusDate, 1))
          if (minDate && isBefore(newDate, minDate)) newDate = minDate
          setFocusDate(newDate)
          focusHandler(newDate)
          break
        }
        case 'PageDown': {
          let newDate = normalizeDate(e.shiftKey ? addYears(focusDate, 1) : addMonths(focusDate, 1))
          if (maxDate && isAfter(newDate, maxDate)) newDate = maxDate
          setFocusDate(newDate)
          focusHandler(newDate)
          break
        }
        case 'Enter':
        case ' ': {
          // Start Selection
          selectionHandler(focusDate)
          break
        }
        case 'Esc': {
          // Cancel Selection if started, reset if not? or close
          if (hoverRange) {
            setHoverRange(null)
          }
          break
        }
        default: {
          break
        }
      }
    },
    [configuration, focusDate, focusHandler, hoverRange, selectionHandler]
  )

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    } else {
      window.removeEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, isOpen])

  const datePickerCtx: DatePickerContext = useMemo(() => {
    return {
      configuration,
      currentViewingDate,
      disabled: false,
      focusDate,
      formattedDate: getFormattedDate,
      goToMonth,
      hoverRange,
      dialogOpen,
      nextMonth,
      onClose: handleClose,
      onDateInput: inputHandler,
      onDayFocus: focusHandler,
      onSelection: selectionHandler,
      previousMonth,
      revertValue,
      saveValue,
      selectionActive: false,
      selection,
      setDialogOpen
    }
  }, [
    configuration,
    currentViewingDate,
    dialogOpen,
    focusDate,
    focusHandler,
    getFormattedDate,
    goToMonth,
    handleClose,
    hoverRange,
    inputHandler,
    nextMonth,
    previousMonth,
    revertValue,
    saveValue,
    selection,
    selectionHandler
  ])

  return <DatePickerContext.Provider value={datePickerCtx}>{children}</DatePickerContext.Provider>
}
