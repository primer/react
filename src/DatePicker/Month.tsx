import React from 'react'
import styled from 'styled-components'
import {FontSizeProps} from 'styled-system'
import Box from '../Box'
import {get, SystemCommonProps, SystemLayoutProps} from '../constants'
import {SxProp} from '../sx'

export interface MonthProps extends FontSizeProps, SystemCommonProps, SxProp, SystemLayoutProps {
  blockedOut?: boolean
  disabled?: boolean
  day: number
}

const MonthComponent = styled(Box)`
  display: grid;
  grid-auto-rows: min-content;
  grid-template-columns: repeat(1fr, 7);
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-template-areas: 'sunday monday tuesday wednesday thursday friday saturday';
  justify-items: stretch;
  align-items: stretch;
`

export const Month: React.FC<MonthProps> = ({}) => {
  return <MonthComponent role="grid"></MonthComponent>
}
