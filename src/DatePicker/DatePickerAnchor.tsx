import {AlertIcon, CalendarIcon, CheckIcon} from '@primer/octicons-react'
import styled from 'styled-components'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import Button, {ButtonInvisible} from '../Button'
import Text from '../Text'
import {get} from '../constants'
import StyledOcticon from '../StyledOcticon'
import {useDatePicker} from './useDatePicker'
import TextInput from '../TextInput'
import Box from '../Box'
import {SystemStyleObject} from '@styled-system/css'
import {parseStringDate} from './dateParser'
import {BoxProps, Tooltip} from '..'
import {IconPlacement} from './types'

export interface DatePickerAnchorProps {
  /**
   * Callback for when anchor is engaged
   */
  onAction?: (event?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => void
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

const IconContainer = styled(Box)<BoxProps & {iconPlacement?: IconPlacement}>`
  position: absolute;
  top: 0;
  bottom: 0;
  right: ${props => (props.iconPlacement === 'end' ? '36px' : '10px')};
  display: flex;
  align-items: center;
`

export const DatePickerAnchor = React.forwardRef<HTMLDivElement, DatePickerAnchorProps>(({onAction}, ref) => {
  const {
    configuration: {anchorVariant, iconPlacement, placeholder, variant},
    disabled,
    formattedDate,
    inputDate,
    onDateInput
  } = useDatePicker()
  const [inputValue, setInputValue] = useState(formattedDate)
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValid, setInputValid] = useState(true)
  const [inputHasChanged, setInputHasChanged] = useState(false)

  const actionHandler = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) {
        return
      }
      if ('key' in event) {
        if ([' ', 'Enter'].includes(event.key)) {
          onAction?.(event)
        }
      } else {
        onAction?.(event)
      }
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
      setInputHasChanged(true)
      setInputValue(value)
      if (!value) {
        return
      }
      const parsedDate = parseStringDate(value, variant)
      setInputValid(!!parsedDate)
      if (parsedDate) {
        onDateInput(parsedDate)
      }
    },
    [onDateInput, variant]
  )

  const onFocusHandler = () => {
    setInputValue(inputDate)
    setInputHasChanged(true)
  }

  const onBlurHandler = () => {
    setInputValue(formattedDate)
    setInputHasChanged(false)
  }

  const inputSx = useMemo(() => {
    let sxObject: SystemStyleObject = {}

    if (iconPlacement === 'start') {
      sxObject = {...sxObject, pl: 5, pr: 2}
    } else if (iconPlacement === 'end') {
      sxObject = {...sxObject, pl: 2, pr: 5}
    }

    return sxObject
  }, [iconPlacement])

  if (anchorVariant === 'input') {
    const calendarButton = (side: 'left' | 'right') => (
      <ButtonInvisible
        onClick={actionHandler}
        sx={{width: '32px', px: '6px', position: 'absolute', [side]: '1px', top: '1px', bottom: '1px'}}
      >
        <StyledOcticon icon={CalendarIcon} />
      </ButtonInvisible>
    )

    return (
      <Box ref={ref} sx={{position: 'relative', display: 'flex'}}>
        {iconPlacement === 'start' && calendarButton('left')}
        <TextInput
          onBlur={onBlurHandler}
          onChange={onInputChangeHandler}
          onFocus={onFocusHandler}
          placeholder={placeholder}
          ref={inputRef}
          sx={inputSx}
          value={inputValue}
          data-testId="anchor-input"
        />
        <IconContainer iconPlacement={iconPlacement}>
          {inputValid && inputHasChanged && <StyledOcticon icon={CheckIcon} color="success.emphasis" />}
          {!inputValid && (
            <Tooltip direction="s" text="Invalid entry. Please make sure you use the 'MM/DD/YYYY' format.">
              <StyledOcticon icon={AlertIcon} color="attention.emphasis" />
            </Tooltip>
          )}
        </IconContainer>
        {iconPlacement === 'end' && calendarButton('right')}
      </Box>
    )
  }

  const calendarIcon = () => <StyledOcticon icon={CalendarIcon} color="fg.muted" sx={{my: '2px'}} />

  return (
    <Box ref={ref}>
      <DatePickerAnchorButton
        aria-label={formattedDate}
        onClick={actionHandler}
        onKeyPress={actionHandler}
        data-testId="anchor-button"
      >
        {(iconPlacement === 'start' || anchorVariant === 'icon-only') && calendarIcon()}
        {anchorVariant !== 'icon-only' && (
          <Text sx={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{formattedDate}</Text>
        )}
        {iconPlacement === 'end' && calendarIcon()}
      </DatePickerAnchorButton>
    </Box>
  )
})
