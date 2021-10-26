import {CalendarIcon} from '@primer/octicons-react'
import styled from 'styled-components'
import React, {useCallback} from 'react'
import Button, {ButtonInvisible} from '../Button'
import Text from '../Text'
import {get} from '../constants'
import StyledOcticon from '../StyledOcticon'
import useDatePicker, {RangeSelection} from './useDatePicker'
import TextInput from '../TextInput'
import Box from '../Box'
import {configure} from '@testing-library/dom'

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

export const DatePickerAnchor = React.forwardRef<HTMLDivElement, DatePickerAnchorProps>(({onAction}, ref) => {
  const {
    configuration: {anchorVariant, iconPlacement, selection},
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

  const onInputChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      if (!value) return

      if (selection === 'range') {
        const values = value.split(' - ')
        const dates: RangeSelection = {from: new Date(values[0]?.trim()), to: new Date(values[1]?.trim())}
        console.log(dates)
      } else if (selection === 'multi') {
        const values = value.split(',')
        const dates = []
        for (const date of values) {
          dates.push(new Date(date.trim()))
        }
        console.log(dates)
      } else {
        const date = new Date(value)
        console.log(date)
      }
    },
    [selection]
  )

  if (anchorVariant === 'input') {
    const calendarButton = (side: 'left' | 'right') => (
      <ButtonInvisible
        onClick={clickHandler}
        sx={{width: '32px', px: '6px', position: 'absolute', [side]: '1px', top: '1px'}}
      >
        <StyledOcticon icon={CalendarIcon} />
      </ButtonInvisible>
    )

    const inputSx = () => {
      if (iconPlacement === 'start') {
        return {
          pl: 5,
          pr: 2
        }
      } else if (iconPlacement === 'end') {
        return {
          pl: 2,
          pr: 5
        }
      } else {
        return {}
      }
    }

    return (
      <Box ref={ref} sx={{position: 'relative', display: 'flex', flex: 1}}>
        {iconPlacement === 'start' && calendarButton('left')}
        <TextInput defaultValue={formattedDate} onChange={onInputChangeHandler} sx={inputSx()} />
        {iconPlacement === 'end' && calendarButton('right')}
      </Box>
    )
  }

  return (
    <Box ref={ref}>
      <DatePickerAnchorButton onClick={clickHandler} onKeyPress={keyPressHandler}>
        <StyledOcticon icon={CalendarIcon} color="fg.muted" sx={{my: '2px'}} />
        {anchorVariant !== 'icon-only' && (
          <Text sx={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{formattedDate}</Text>
        )}
      </DatePickerAnchorButton>
    </Box>
  )
})
