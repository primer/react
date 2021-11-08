import {CheckIcon, TrashIcon} from '@primer/octicons-react'
import {
  isEqual,
  isAfter,
  isBefore,
  addMonths,
  subMonths,
  isWeekend,
  differenceInDays,
  addDays,
  subDays,
  previousFriday,
  differenceInBusinessDays,
  addYears,
  setDate
} from 'date-fns'
import {addBusinessDays, subBusinessDays} from 'date-fns/esm'
import React, {useCallback, useMemo, useEffect, useState, createContext} from 'react'
import {Text, useConfirm} from '..'
import {useResizeObserver} from '../hooks/useResizeObserver'
import {formatDate, castToSelection} from './dateParser'
import {
  DatePickerConfiguration,
  DatePickerContext,
  isRangeSelection,
  RangeSelection,
  Selection,
  UnsanitizedSelection
} from './types'
import {getInitialFocusDate, initializeConfigurations, sanitizeDate} from './utils'

export const Context = createContext<DatePickerContext | null>(null)

export interface DatePickerProviderProps {
  closePicker?: () => void
  configuration?: DatePickerConfiguration
  isOpen?: boolean
  onChange?: (value?: Selection) => void
  value?: UnsanitizedSelection
}

export const defaultConfiguration: DatePickerConfiguration = {
  anchorVariant: 'button',
  confirmation: false,
  confirmUnsavedClose: false,
  compressedHeader: false,
  disableWeekends: false,
  iconPlacement: 'start',
  placeholder: 'Choose Date...',
  variant: 'single',
  view: '1-month',
  weekStartsOn: 'Sunday'
}

export const DatePickerProvider: React.FC<DatePickerProviderProps> = ({
  configuration: externalConfig,
  children,
  closePicker,
  onChange,
  value
}) => {
  const [configuration, setConfiguration] = useState(initializeConfigurations(externalConfig))
  const initialSelection = castToSelection(value, configuration.variant)

  const [previousSelection, setPreviousSelection] = useState<Selection | undefined>(
    castToSelection(value, configuration.variant)
  )
  const [isDirty, setIsDirty] = useState(false)
  const [selection, setSelection] = useState<Selection | undefined>(initialSelection)
  const [hoverRange, setHoverRange] = useState<RangeSelection | null>(null)
  const [currentViewingDate, setCurrentViewingDate] = useState(getInitialFocusDate(initialSelection))
  const [multiMonthSupport, setMultiMonthSupport] = useState(true)
  const confirm = useConfirm()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [focusDate, setFocusDate] = useState(getInitialFocusDate(initialSelection))

  useEffect(() => {
    setConfiguration(initializeConfigurations(externalConfig))
    setSelection(castToSelection(selection, configuration.variant))

    // Don't want this to run every time selection gets updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration.variant, externalConfig])

  const goToMonth = useCallback(
    (date: Date) => {
      let newDate = date
      const {minDate, maxDate} = configuration
      if (minDate && isBefore(date, minDate)) {
        newDate = minDate
      } else if (maxDate && isAfter(date, maxDate)) {
        newDate = maxDate
      }

      setFocusDate(sanitizeDate(newDate))
      setCurrentViewingDate(sanitizeDate(newDate))
    },
    [configuration]
  )

  const nextMonth = useCallback(() => {
    const date = addMonths(currentViewingDate, 1)
    setFocusDate(sanitizeDate(date))
    setCurrentViewingDate(date)
  }, [currentViewingDate])

  const previousMonth = useCallback(() => {
    const date = subMonths(currentViewingDate, 1)
    setFocusDate(sanitizeDate(date))
    setCurrentViewingDate(date)
  }, [currentViewingDate])

  const formattedDate = useMemo(() => {
    const {anchorVariant, dateFormat, placeholder, variant} = configuration
    return formatDate({selection, anchorVariant, dateFormat, placeholder, rawFormat: false, variant})
  }, [configuration, selection])

  const inputDate = useMemo(() => {
    const {dateFormat, placeholder, variant} = configuration
    return formatDate({selection, dateFormat, placeholder, rawFormat: true, variant})
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
      const {maxDate, minDate, variant} = configuration

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
            const {maxSelections} = configuration
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
          const {maxRangeSize} = configuration
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
    setFocusDate(getInitialFocusDate(selection))
    onChange?.(selection)
  }, [onChange, selection])

  useEffect(() => {
    if (configuration.view === '1-month' || !multiMonthSupport) {
      if (
        currentViewingDate.getMonth() === focusDate.getMonth() &&
        currentViewingDate.getFullYear() === focusDate.getFullYear()
      ) {
        return
      } else {
        setCurrentViewingDate(setDate(focusDate, 1))
        return
      }
    }

    /**
     * This logic is rough, so buckle up.
     * We want to set the currently shown months based on what has focus. If the focus leaves what we're able to view,
     * we want to be able to change the currently shown month. However, this gets complicated with the 2-month view.
     * FIRST: If it's the same month/year: Easy
     * SECOND: If it's the next month, but same year: Done
     * THIRD: If it's the next month AND next year, but it's January (i.e. we're viewing Dec/Jan): Good to go
     */
    if (
      (currentViewingDate.getMonth() === focusDate.getMonth() &&
        currentViewingDate.getFullYear() === focusDate.getFullYear()) ||
      (addMonths(currentViewingDate, 1).getMonth() === focusDate.getMonth() &&
        currentViewingDate.getFullYear() === focusDate.getFullYear()) ||
      (addMonths(currentViewingDate, 1).getMonth() === focusDate.getMonth() &&
        focusDate.getMonth() === 0 &&
        addYears(currentViewingDate, 1).getFullYear() === focusDate.getFullYear())
    ) {
      return
    } else {
      setCurrentViewingDate(setDate(focusDate, 1))
    }
  }, [configuration.view, currentViewingDate, focusDate, multiMonthSupport])

  const selectionHandler = useCallback(
    (date: Date) => {
      setIsDirty(true)
      if (configuration.variant === 'multi') {
        const selections = Array.isArray(selection) ? selection : []
        const existingIndex = selections.findIndex((s: Date) => isEqual(s, date))
        if (existingIndex > -1) {
          selections.splice(existingIndex, 1)
          setSelection([...selections].sort((a, b) => a.getTime() - b.getTime()))
        } else {
          if (configuration.maxSelections && selections.length + 1 > configuration.maxSelections) return
          setSelection([...selections, date].sort((a, b) => a.getTime() - b.getTime()))
        }
      } else if (configuration.variant === 'range') {
        const {maxRangeSize} = configuration
        if (selection && isRangeSelection(selection) && !selection.to) {
          let toDate = date
          if (maxRangeSize && Math.abs(differenceInDays(selection.from, date)) >= maxRangeSize) {
            toDate = isBefore(date, selection.from)
              ? subDays(selection.from, maxRangeSize - 1)
              : addDays(selection.from, maxRangeSize - 1)
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
    [configuration, saveValue, selection]
  )

  const focusHandler = useCallback(
    (date: Date) => {
      if (!selection) return
      const {minDate, maxDate, disableWeekends, variant} = configuration

      if (variant === 'range' && isRangeSelection(selection) && hoverRange) {
        const {maxRangeSize} = configuration
        let hoverDate = date
        if (minDate) hoverDate = isBefore(date, minDate) ? minDate : hoverDate
        if (maxDate) hoverDate = isAfter(date, maxDate) ? maxDate : hoverDate

        const daysInRange = disableWeekends
          ? Math.abs(differenceInBusinessDays(selection.from, hoverDate))
          : Math.abs(differenceInDays(selection.from, hoverDate))

        if (maxRangeSize && daysInRange >= maxRangeSize) {
          if (disableWeekends) {
            hoverDate = isBefore(hoverDate, selection.from)
              ? subBusinessDays(selection.from, maxRangeSize - 1)
              : addBusinessDays(selection.from, maxRangeSize - 1)
          } else {
            hoverDate = isBefore(hoverDate, selection.from)
              ? subDays(selection.from, maxRangeSize - 1)
              : addDays(selection.from, maxRangeSize - 1)
          }
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

  const onResize = (windowEntry: ResizeObserverEntry) => {
    // Only care about the first element, we expect one element ot be watched
    const {width} = windowEntry.contentRect
    // 610 is the panel width with 2 months
    setMultiMonthSupport(width > 610)
  }
  useResizeObserver(onResize)

  const datePickerCtx: DatePickerContext = useMemo(() => {
    return {
      configuration,
      currentViewingDate,
      disabled: false,
      focusDate,
      formattedDate,
      inputDate,
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
      setFocusDate,
      setHoverRange,
      selection,
      setDialogOpen,
      viewMode: configuration.view === '2-month' && multiMonthSupport ? '2-month' : '1-month'
    }
  }, [
    configuration,
    currentViewingDate,
    dialogOpen,
    focusDate,
    focusHandler,
    formattedDate,
    goToMonth,
    handleClose,
    hoverRange,
    inputDate,
    inputHandler,
    multiMonthSupport,
    nextMonth,
    previousMonth,
    revertValue,
    saveValue,
    selection,
    selectionHandler
  ])

  return <Context.Provider value={datePickerCtx}>{children}</Context.Provider>
}
