import {CalendarIcon} from '@primer/octicons-react'
import styled from 'styled-components'
import {format} from 'date-fns'
import React, {useMemo} from 'react'
import Button from '../Button'
import Text from '../Text'
import {get} from '../constants'
import {StyledOcticon} from '..'

export interface DatePickerAnchorProps {
  iconOnly?: boolean
  fromDate: Date
  toDate?: Date
  dateFormat?: 'short' | 'long' | string
}

const DatePickerAnchorButton = styled(Button)`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  & ${Text} {
    margin-left: ${get('space.2')};
  }
`

export const DatePickerAnchor: React.FC<DatePickerAnchorProps> = ({
  iconOnly = false,
  dateFormat = 'short',
  fromDate,
  toDate
}) => {
  const formattedDate = useMemo(() => {
    if (iconOnly) return

    if (dateFormat === 'short') {
      return <Text>{`${format(fromDate, 'MMM d')}${toDate ? ' - ' : ''}${toDate ? format(toDate, 'MMM d') : ''}`}</Text>
    } else if (dateFormat === 'long') {
      return (
        <Text>
          {`${format(fromDate, 'MMM d, yyyy')}${toDate ? ' - ' : ''}${toDate ? format(toDate, 'MMM d, yyyy') : ''}`}
        </Text>
      )
    } else {
      return (
        <Text>
          {`${format(fromDate, dateFormat)}${toDate ? ' - ' : ''}${toDate ? format(toDate, dateFormat) : ''}`}
        </Text>
      )
    }
  }, [dateFormat, fromDate, iconOnly, toDate])

  return (
    <DatePickerAnchorButton>
      <StyledOcticon icon={CalendarIcon} color="fg.muted" sx={{my: '2px'}} />
      {formattedDate}
    </DatePickerAnchorButton>
  )
}
