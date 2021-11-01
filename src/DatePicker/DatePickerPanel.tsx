import {addMonths, subMonths} from 'date-fns'
import React, {useCallback, useMemo, useRef, useState} from 'react'
import Box from '../Box'
import {Month} from './Month'
import styled from 'styled-components'
import {COMMON, get, SystemCommonProps, SystemTypographyProps, TYPOGRAPHY} from '../constants'
import useDatePicker from './useDatePicker'
import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import StyledOcticon from '../StyledOcticon'
import Button, {ButtonPrimary} from '../Button'
import {useResizeObserver} from '../hooks/useResizeObserver'
import sx, {SxProp} from '../sx'

const DatePickerPanelContainer = styled(Box)`
  align-items: stretch;
  display: flex;
  flex-direction: column;
`

const DatePickerPanelMonths = styled(Box)`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  gap: ${get('space.6')};
  padding: ${get('space.3')};
  position: relative;
`

const DatePickerPanelFooter = styled(Box)`
  align-items: flex-start;
  border-top: 1px solid;
  border-top-color: ${get('colors.border.default')};
  display: flex;

  gap: ${get('space.6')};
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: ${get('space.3')};
  padding-right: ${get('space.3')};
  flex-direction: row;
  justify-content: space-between;
  position: relative;
`

const ArrowButton = styled(Button)`
  position: absolute;
  width: 40px;
  height: 28px;
  top: 12px;
`

const Select = styled.select<SystemTypographyProps & SystemCommonProps & SxProp>`
  background: transparent;
  border: 0;
  color: 'fg.default';
  font-weight: 600;
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

export const DatePickerPanel = () => {
  const {configuration, saveValue, revertValue, currentViewingDate, goToMonth, nextMonth, previousMonth} =
    useDatePicker()
  const [multiMonthSupport, setMultiMonthSupport] = useState(true)
  const panelRef = useRef<HTMLDivElement>(null)

  const onResize = (windowEntry: ResizeObserverEntry) => {
    // Only care about the first element, we expect one element ot be watched
    const {width} = windowEntry.contentRect
    // 610 is the panel width with 2 months
    setMultiMonthSupport(width > 610)
  }
  useResizeObserver(onResize)

  const previousDisabled = useMemo(() => {
    const {minDate} = configuration
    if (!minDate) return false

    const previous = subMonths(currentViewingDate, 1)
    if (minDate.getFullYear() >= previous.getFullYear() && minDate.getMonth() > previous.getMonth()) {
      return true
    }

    return false
  }, [configuration, currentViewingDate])

  const nextDisabled = useMemo(() => {
    const {maxDate, view} = configuration
    if (!maxDate) return false

    const next = addMonths(currentViewingDate, view === '2-month' ? 2 : 1)
    if (maxDate.getFullYear() <= next.getFullYear() && maxDate.getMonth() < next.getMonth()) {
      return true
    }

    return false
  }, [configuration, currentViewingDate])

  const currentMonth = useMemo(() => currentViewingDate.getMonth(), [currentViewingDate])
  const currentYear = useMemo(() => currentViewingDate.getFullYear(), [currentViewingDate])

  const headerSelectionHandler = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selection = parseInt(e.currentTarget.value, 10)
      if (e.currentTarget.id === 'picker-header-year') {
        goToMonth(new Date(selection, currentMonth))
      } else {
        goToMonth(new Date(currentYear, selection))
      }
    },
    [currentMonth, currentYear, goToMonth]
  )

  const getMonthPicker = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthElements = []
    for (let i = 0; i < months.length; i++) {
      monthElements.push(
        <option key={i} value={i}>
          {months[i]}
        </option>
      )
    }

    return (
      <Select id="picker-header-month" value={currentMonth} sx={{mr: '6px'}} onChange={headerSelectionHandler}>
        {monthElements}
      </Select>
    )
  }, [currentMonth, headerSelectionHandler])
  const getYearPicker = useMemo(() => {
    const years = []
    const minYear = currentYear - 200
    const maxYear = currentYear + 200
    for (let i = minYear; i <= maxYear; i++) {
      years.push(
        <option key={i} value={i}>
          {i}
        </option>
      )
    }

    return (
      <Select id="picker-header-year" value={currentYear} onChange={headerSelectionHandler}>
        {years}
      </Select>
    )
  }, [currentYear, headerSelectionHandler])

  return (
    <DatePickerPanelContainer ref={panelRef}>
      <DatePickerPanelMonths>
        {configuration.compressedHeader && (
          <Box sx={{position: 'absolute'}}>
            {getMonthPicker}
            {getYearPicker}
          </Box>
        )}
        <ArrowButton
          variant="small"
          sx={configuration.compressedHeader ? {right: 8} : {left: 3}}
          onClick={previousMonth}
          disabled={previousDisabled}
          aria-label="Previous Month"
          aria-live="polite"
        >
          <StyledOcticon icon={ChevronLeftIcon} color="fg.muted" />
        </ArrowButton>
        <Month date={currentViewingDate} />
        {configuration.view === '2-month' && multiMonthSupport && <Month date={addMonths(currentViewingDate, 1)} />}

        <ArrowButton
          variant="small"
          sx={{right: 3}}
          onClick={nextMonth}
          disabled={nextDisabled}
          aria-label="Next Month"
          aria-live="polite"
        >
          <StyledOcticon icon={ChevronRightIcon} color="fg.muted" />
        </ArrowButton>
      </DatePickerPanelMonths>
      <DatePickerPanelFooter>
        <Box>
          <Button
            variant="small"
            sx={{mr: 1}}
            onClick={() => revertValue()}
            aria-label="Reset Selection"
            aria-live="polite"
          >
            Reset
          </Button>
          <Button variant="small" onClick={() => goToMonth(new Date())} aria-label="Go to Today" aria-live="polite">
            Today
          </Button>
        </Box>
        {configuration.confirmation && (
          <ButtonPrimary variant="small" onClick={() => saveValue()} aria-label="Apply Selection" aria-live="polite">
            Apply
          </ButtonPrimary>
        )}
      </DatePickerPanelFooter>
    </DatePickerPanelContainer>
  )
}
