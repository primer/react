import {addMonths} from 'date-fns'
import React from 'react'
import Box from '../Box'
import {Month} from './Month'
import styled from 'styled-components'
import {get} from '../constants'

const DatePickerPanelContainer = styled(Box)`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  gap: ${get('space.6')};
  padding: ${get('space.3')};
`

export const DatePickerPanel = () => {
  return (
    <DatePickerPanelContainer>
      <Month month={new Date().getMonth()} year={new Date().getFullYear()} />
      <Month month={addMonths(new Date(), 1).getMonth()} year={addMonths(new Date(), 1).getFullYear()} />
    </DatePickerPanelContainer>
  )
}
