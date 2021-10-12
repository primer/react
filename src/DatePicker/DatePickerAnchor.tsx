import {CalendarIcon} from '@primer/octicons-react'
import styled from 'styled-components'
import {format} from 'date-fns'
import React, {useCallback, useMemo} from 'react'
import Button from '../Button'
import Text from '../Text'
import {get} from '../constants'
import {StyledOcticon} from '..'

export interface DatePickerAnchorProps {
  dateFormat?: 'short' | 'long' | string
  disabled?: boolean
  fromDate: Date
  iconOnly?: boolean
  onAction?: (event?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
  toDate?: Date
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

export const DatePickerAnchor = React.forwardRef<HTMLButtonElement, DatePickerAnchorProps>(
  ({dateFormat = 'short', disabled, fromDate, iconOnly = false, onAction, toDate}, ref) => {
    const formattedDate = useMemo(() => {
      if (iconOnly) return

      if (dateFormat === 'short') {
        return (
          <Text>{`${format(fromDate, 'MMM d')}${toDate ? ' - ' : ''}${toDate ? format(toDate, 'MMM d') : ''}`}</Text>
        )
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

    const keyPressHandler = useCallback(
      event => {
        if (disabled) {
          return
        }
        if ([' ', 'Enter'].includes(event.key)) {
          onAction?.(event)
        }
      },
      [disabled, onAction]
    )

    const clickHandler = useCallback(
      event => {
        if (disabled) {
          return
        }
        onAction?.(event)
      },
      [disabled, onAction]
    )

    return (
      <DatePickerAnchorButton ref={ref} onClick={clickHandler} onKeyPress={keyPressHandler}>
        <StyledOcticon icon={CalendarIcon} color="fg.muted" sx={{my: '2px'}} />
        {formattedDate}
      </DatePickerAnchorButton>
    )
  }
)
