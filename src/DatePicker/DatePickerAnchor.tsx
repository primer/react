import {CalendarIcon} from '@primer/octicons-react'
import styled from 'styled-components'
import React, {useCallback} from 'react'
import Button from '../Button'
import Text from '../Text'
import {get} from '../constants'
import StyledOcticon from '../StyledOcticon'
import useDatePicker from './useDatePicker'
import TextInput from '../TextInput'

export interface DatePickerAnchorProps {
  onAction?: (event?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
}

const DatePickerAnchorButton = styled(Button)`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 350px;
  overflow: hidden;

  & ${Text} {
    margin-left: ${get('space.2')};
  }
`

export const DatePickerAnchor = React.forwardRef<HTMLButtonElement, DatePickerAnchorProps>(({onAction}, ref) => {
  const {
    configuration: {anchorVariant},
    disabled,
    formattedDate
  } = useDatePicker()

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

  if (anchorVariant === 'input') {
    return <TextInput value={formattedDate} />
  }

  return (
    <DatePickerAnchorButton ref={ref} onClick={clickHandler} onKeyPress={keyPressHandler}>
      <StyledOcticon icon={CalendarIcon} color="fg.muted" sx={{my: '2px'}} />
      {anchorVariant !== 'icon-only' && (
        <Text sx={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{formattedDate}</Text>
      )}
    </DatePickerAnchorButton>
  )
})
