import {CalendarIcon} from '@primer/octicons-react'
import styled from 'styled-components'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
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
  const [inputValid, setInputValid] = useState(true)

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
      setInputValue(value)
      if (!value) {
        return
      }
      const parsedDate = parseDate(value, variant)
      setInputValid(!!parsedDate)
      if (parsedDate) {
        onDateInput(parsedDate)
      }
    },
    [onDateInput, variant]
  )

  const onBlurHandler = () => {
    setInputValue(formattedDate)
  }

  const inputSx = useMemo(() => {
    let sxObject: SystemStyleObject = {}

    if (iconPlacement === 'start') {
      sxObject = {...sxObject, pl: 5, pr: 2}
    } else if (iconPlacement === 'end') {
      sxObject = {...sxObject, pl: 2, pr: 5}
    }

    if (showInputPrompt) {
      sxObject = {...sxObject, pt: '20px'}
    }

    if (inputValid) {
      sxObject = {...sxObject, color: 'success.emphasis'}
    } else {
      sxObject = {...sxObject, color: 'danger.emphasis'}
    }

    return sxObject
  }, [iconPlacement, inputValid, showInputPrompt])

  const inputPrompt = useMemo(() => {
    if (!showInputPrompt) return

    switch (variant) {
      case 'single':
        return 'MM/DD/YYYY'
      case 'multi':
        return 'MM/DD/YYYY, MM/DD/YYYY, ...'
      case 'range':
        return 'MM/DD/YYYY - MM/DD/YYYY'
      default:
        return 'MM/DD/YYYY'
    }
  }, [showInputPrompt, variant])

  if (anchorVariant === 'input') {
    const calendarButton = (side: 'left' | 'right') => (
      <ButtonInvisible
        onClick={clickHandler}
        sx={{width: '32px', px: '6px', position: 'absolute', [side]: '1px', top: '1px', bottom: '1px'}}
      >
        <StyledOcticon icon={CalendarIcon} />
      </ButtonInvisible>
    )

    const promptSx = () => {
      let sxObject: SystemStyleObject = {
        position: 'absolute',
        top: '2px',
        fontSize: '11px',
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
        {showInputPrompt && <Text sx={promptSx()}>{inputPrompt}</Text>}
        <TextInput
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onChange={onInputChangeHandler}
          sx={inputSx}
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
