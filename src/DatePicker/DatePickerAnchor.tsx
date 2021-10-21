import {CalendarIcon} from '@primer/octicons-react'
import styled from 'styled-components'
import {format} from 'date-fns'
import React, {useCallback, useMemo} from 'react'
import Button from '../Button'
import Text from '../Text'
import {get} from '../constants'
import StyledOcticon from '../StyledOcticon'
import {useDatePicker} from './useDatePicker'
import TextInput from '../TextInput'

export interface DatePickerAnchorProps {
  onAction?: (event?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
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

export const DatePickerAnchor = React.forwardRef<HTMLButtonElement, DatePickerAnchorProps>(({onAction}, ref) => {
  const {
    configuration: {dateFormat, anchorStyle},
    selection
  } = useDatePicker()
  const formattedDate = useMemo(() => {
    if (anchorStyle === 'icon-only') return
    let value = ''
    const format = 

    if (dateFormat === 'short') {
      value = `${format(fromDate, 'MMM d')}${toDate ? ' - ' : ''}${toDate ? format(toDate, 'MMM d') : ''}`
    } else if (dateFormat === 'long') {
      value = `${format(fromDate, 'MMM d, yyyy')}${toDate ? ' - ' : ''}${toDate ? format(toDate, 'MMM d, yyyy') : ''}`
    } else {
      value = `${format(fromDate, dateFormat)}${toDate ? ' - ' : ''}${toDate ? format(toDate, dateFormat) : ''}`
    }

    if (anchorStyle === 'button') {
      return <Text>{value}</Text>
    } else {
      return <TextInput value={value} />
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
})
