import {addMonths} from 'date-fns'
import React from 'react'
import Box from '../Box'
import {Month} from './Month'
import styled from 'styled-components'
import {get} from '../constants'
import useDatePicker from './useDatePicker'
import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import StyledOcticon from '../StyledOcticon'
import Button, {ButtonPrimary} from '../Button'
import type {ButtonProps} from '../Button'

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

type ArrowButtonProps = {
  side: 'left' | 'right'
} & ButtonProps

const ArrowButton = styled(Button)<ArrowButtonProps>`
  position: absolute;
  width: 40px;
  height: 28px;
  top: 12px;
  ${props => `${props.side}: ${get('space.3')(props)}`};
`

export const DatePickerPanel = () => {
  const {configuration, saveValue, revertValue, currentViewingDate, goToMonth, nextMonth, previousMonth} =
    useDatePicker()
  return (
    <DatePickerPanelContainer>
      <DatePickerPanelMonths>
        {/* <Month
          month={subMonths(new Date(), 1).getMonth()}
          year={subMonths(new Date(), 1).getFullYear()}
          sx={{left: '100%', position: 'absolute'}}
        /> */}
        <ArrowButton variant="small" side="left" onClick={previousMonth}>
          <StyledOcticon icon={ChevronLeftIcon} color="fg.muted" />
        </ArrowButton>
        <Month month={currentViewingDate.getMonth()} year={currentViewingDate.getFullYear()} />
        {configuration.view === '2-month' && (
          <Month
            month={addMonths(currentViewingDate, 1).getMonth()}
            year={addMonths(currentViewingDate, 1).getFullYear()}
          />
        )}

        <ArrowButton variant="small" side="right" onClick={nextMonth}>
          <StyledOcticon icon={ChevronRightIcon} color="fg.muted" />
        </ArrowButton>
      </DatePickerPanelMonths>
      <DatePickerPanelFooter>
        <Box>
          <Button variant="small" sx={{mr: 1}} onClick={() => revertValue()}>
            Reset
          </Button>
          <Button variant="small" onClick={() => goToMonth(new Date())}>
            Today
          </Button>
        </Box>
        {configuration.confirmation && (
          <ButtonPrimary variant="small" onClick={() => saveValue()}>
            Apply
          </ButtonPrimary>
        )}
      </DatePickerPanelFooter>
    </DatePickerPanelContainer>
  )
}
