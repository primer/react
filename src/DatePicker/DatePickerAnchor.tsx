import {CalendarIcon} from '@primer/octicons-react'
import styled from 'styled-components'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import Button, {ButtonInvisible} from '../Button'
import Text from '../Text'
import {get} from '../constants'
import StyledOcticon from '../StyledOcticon'
import useDatePicker from './useDatePicker'
import TextInput from '../TextInput'
import Box from '../Box'
import {SystemStyleObject} from '@styled-system/css'
import {parseDate} from './dateParser'

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

  & ${Text} ~ svg {
    margin-left: ${get('space.2')};
  }
  & svg ~ ${Text} {
    margin-left: ${get('space.2')};
  }
`

export const DatePickerAnchor = React.forwardRef<HTMLDivElement, DatePickerAnchorProps>(({onAction}, ref) => {
  const {
    configuration: {anchorVariant, iconPlacement, placeholder, showInputPrompt, variant},
    disabled,
    formattedDate,
    onDateInput
  } = useDatePicker()
  const [inputValue, setInputValue] = useState(formattedDate)
  const inputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setInputValue(formattedDate)
    }
  }, [formattedDate])

  const onInputChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      if (!value) {
        setInputValue(value)
        return
      }
      const parsedDate = parseDate(value, variant)
      if (parsedDate) {
        onDateInput(parsedDate)
      }
    },
    [onDateInput, variant]
  )

  const onBlurHandler = () => {
    setInputValue(formattedDate)
  }

  if (anchorVariant === 'input') {
    const calendarButton = (side: 'left' | 'right') => (
      <ButtonInvisible
        onClick={clickHandler}
        sx={{width: '32px', px: '6px', position: 'absolute', [side]: '1px', top: '1px', bottom: '1px'}}
      >
        <StyledOcticon icon={CalendarIcon} />
      </ButtonInvisible>
    )

    const inputSx = () => {
      let sxObject: SystemStyleObject = {}

      if (iconPlacement === 'start') {
        sxObject = {...sxObject, pl: 5, pr: 2}
      } else if (iconPlacement === 'end') {
        sxObject = {...sxObject, pl: 2, pr: 5}
      }

      if (showInputPrompt) {
        sxObject = {...sxObject, pt: '20px'}
      }
      return sxObject
    }

    const promptSx = () => {
      let sxObject: SystemStyleObject = {
        position: 'absolute',
        top: '2px',
        fontSize: 0,
        color: 'fg.subtle'
      }

      if (iconPlacement === 'start') {
        sxObject = {...sxObject, left: '36px'}
      }
      return sxObject
    }

    return (
      <Box ref={ref} sx={{position: 'relative', display: 'flex', flex: 1}}>
        {iconPlacement === 'start' && calendarButton('left')}
        {showInputPrompt && <Text sx={promptSx()}>MM/DD/YYYY</Text>}
        <TextInput
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onChange={onInputChangeHandler}
          sx={inputSx()}
          onBlur={onBlurHandler}
        />
        {iconPlacement === 'end' && calendarButton('right')}
      </Box>
    )
  }

  const calendarIcon = () => <StyledOcticon icon={CalendarIcon} color="fg.muted" sx={{my: '2px'}} />

  return (
    <Box ref={ref}>
      <DatePickerAnchorButton onClick={clickHandler} onKeyPress={keyPressHandler}>
        {iconPlacement === 'start' && calendarIcon()}
        {anchorVariant !== 'icon-only' && (
          <Text sx={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{formattedDate}</Text>
        )}
        {iconPlacement === 'end' && calendarIcon()}
      </DatePickerAnchorButton>
    </Box>
  )
})
