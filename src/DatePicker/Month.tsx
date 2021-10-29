import {format, isEqual, lastDayOfMonth, getDaysInMonth, eachDayOfInterval, startOfWeek, endOfWeek} from 'date-fns'
import React, {useMemo, useState} from 'react'
import styled from 'styled-components'
import {FontSizeProps} from 'styled-system'
import Box from '../Box'
import Text from '../Text'
import {SystemCommonProps, SystemLayoutProps, get} from '../constants'
import {SxProp} from '../sx'
import {BlankDay, Day} from './Day'
import useDatePicker from './useDatePicker'

type DayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6
const weekdayEnum: Record<string, DayNumber> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
}

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
  grid-template-areas:
    'month month month month month month month'
    'sunday monday tuesday wednesday thursday friday saturday';
  justify-items: stretch;
  align-items: stretch;
`

const MonthTitle = styled(Text)`
  font-size: ${get('fontSizes.1')};
  font-weight: ${get('fontWeights.bold')};
  grid-area: month;
  justify-self: center;
`

const WeekdayHeader = styled(Text)`
  color: ${get('colors.fg.subtle')};
  font-family: ${get('fonts.mono')};
  font-size: ${get('fontSizes.0')};
  justify-self: center;
  padding: ${get('space.3')} 0 ${get('space.2')};
`

export const Month: React.FC<MonthProps> = ({month, year}) => {
  const {configuration} = useDatePicker()
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const getTitle = useMemo(() => `${format(new Date(year, month), 'MMMM yyyy')}`, [month, year])

  const weekdayHeaders = useMemo(() => {
    const now = new Date(year, month)
    const weekOptions: {weekStartsOn: DayNumber} = {
      weekStartsOn: weekdayEnum[configuration.weekStartsOn ?? 'Sunday']
    }

    return eachDayOfInterval({start: startOfWeek(now, weekOptions), end: endOfWeek(now, weekOptions)}).map(d => (
      <WeekdayHeader key={`weekday-${d}-header`}>{format(d, 'EEEEEE')}</WeekdayHeader>
    ))
  }, [configuration.weekStartsOn, month, year])

  const dayAction = (date: Date) => {
    setSelectedDay(date)
  }

  const dayComponents = useMemo(() => {
    const components = []
    const firstDay = new Date(year, month, 1)

    const preBlanks = (firstDay.getDay() + (7 - weekdayEnum[configuration.weekStartsOn ?? 'Sunday'])) % 7
    for (let i = 0; i < preBlanks; i++) {
      components.push(<BlankDay key={`month-pre-blank-${i}`} />)
    }
    for (let i = 1; i <= getDaysInMonth(firstDay); i++) {
      const date = new Date(year, month, i)
      components.push(
        <Day
          key={`day-component-${date.toString()}`}
          date={date}
          selected={selectedDay ? isEqual(date, selectedDay) : false}
          onAction={dayAction}
        />
      )
    }

    const lastDay = lastDayOfMonth(firstDay)
    const postBlanks = (lastDay.getDay() + (7 - weekdayEnum[configuration.weekStartsOn ?? 'Sunday'])) % 7
    for (let i = 6; i > postBlanks; i--) {
      components.push(<BlankDay key={`month-post-blank-${i}`} />)
    }

    return components
  }, [configuration.weekStartsOn, month, selectedDay, year])
  return (
    <MonthComponent role="grid">
      <MonthTitle aria-live="polite">{getTitle}</MonthTitle>
      {weekdayHeaders}
      {dayComponents}
    </MonthComponent>
  )
}
