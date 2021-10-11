import {lastDayOfMonth, getDaysInMonth} from 'date-fns/esm'
import React, {useMemo} from 'react'
import styled from 'styled-components'
import {FontSizeProps} from 'styled-system'
import Box from '../Box'
import {SystemCommonProps, SystemLayoutProps} from '../constants'
import {SxProp} from '../sx'
import {BlankDay, Day} from './Day'

export interface MonthProps extends FontSizeProps, SystemCommonProps, SxProp, SystemLayoutProps {
  month: number
  year: number
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

export const Month: React.FC<MonthProps> = ({month, year}) => {
  const dayComponents = useMemo(() => {
    const components = []
    const firstDay = new Date(year, month, 1)

    for (let i = 0; i < firstDay.getDay(); i++) {
      components.push(<BlankDay />)
    }
    for (let i = 1; i <= getDaysInMonth(firstDay); i++) {
      components.push(<Day day={i} />)
    }

    const lastDay = lastDayOfMonth(firstDay)
    for (let i = 6; i > lastDay.getDay(); i--) {
      components.push(<BlankDay />)
    }

    return components
  }, [month, year])
  return <MonthComponent role="grid">{dayComponents}</MonthComponent>
}
