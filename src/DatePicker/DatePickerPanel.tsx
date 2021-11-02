import {addMonths, subMonths} from 'date-fns'
import React, {useCallback, useMemo, useRef} from 'react'
import Box from '../Box'
import {Month} from './Month'
import styled from 'styled-components'
import {COMMON, get, SystemCommonProps, SystemTypographyProps, TYPOGRAPHY} from '../constants'
import useDatePicker from './useDatePicker'
import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import StyledOcticon from '../StyledOcticon'
import Button, {ButtonPrimary} from '../Button'
import sx, {SxProp} from '../sx'
import {useFocusZone} from '../hooks/useFocusZone'
import {FocusKeys} from '../behaviors/focusZone'

const DatePickerPanelContainer = styled(Box)`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  position: relative;
`

const DatePickerTopNav = styled(Box)`
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: ${get('space.3')};
  z-index: 10;
`

const DatePickerPanelMonths = styled(Box)`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  gap: ${get('space.6')};
  margin-top: ${get('space.1')};
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
  width: 40px;
  height: 28px;
`

const Select = styled.select<SystemTypographyProps & SystemCommonProps & SxProp>`
  background: ${get('colors.canvas.default')};
  border: 0;
  color: ${get('colors.fg.default')};
  font-weight: 600;
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

const Option = styled.option<SystemTypographyProps & SystemCommonProps & SxProp>`
  background: ${get('colors.canvas.default')};
  border: 0;
  color: ${get('colors.fg.default')};
  font-weight: 400;
  padding: ${get('space.2')} ${get('space.2')};
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

export const DatePickerPanel = () => {
  const {configuration, saveValue, revertValue, currentViewingDate, goToMonth, nextMonth, previousMonth, viewMode} =
    useDatePicker()
  const panelRef = useRef(null)
  const headerRef = useRef(null)
  const datePanelRef = useRef(null)
  const footerRef = useRef(null)

  useFocusZone({
    containerRef: headerRef,
    bindKeys: FocusKeys.Tab,
    focusInStrategy: 'closest'
  })

  useFocusZone({
    containerRef: footerRef,
    bindKeys: FocusKeys.Tab,
    focusInStrategy: 'closest'
  })

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
        <Option key={i} value={i}>
          {months[i]}
        </Option>
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
        <Option key={i} value={i}>
          {i}
        </Option>
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
      <DatePickerTopNav ref={headerRef}>
        {configuration.compressedHeader && (
          <Box sx={{flex: 1}}>
            {getMonthPicker}
            {getYearPicker}
          </Box>
        )}
        <ArrowButton
          variant="small"
          sx={{mr: 1}}
          onClick={previousMonth}
          disabled={previousDisabled}
          aria-label="Previous Month"
          aria-live="polite"
        >
          <StyledOcticon icon={ChevronLeftIcon} color="fg.muted" />
        </ArrowButton>
        <ArrowButton
          variant="small"
          onClick={nextMonth}
          disabled={nextDisabled}
          aria-label="Next Month"
          aria-live="polite"
        >
          <StyledOcticon icon={ChevronRightIcon} color="fg.muted" />
        </ArrowButton>
      </DatePickerTopNav>
      <DatePickerPanelMonths ref={datePanelRef} tabIndex={0}>
        <Month date={currentViewingDate} />
        {viewMode === '2-month' && <Month date={addMonths(currentViewingDate, 1)} />}
      </DatePickerPanelMonths>
      <DatePickerPanelFooter ref={footerRef}>
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
