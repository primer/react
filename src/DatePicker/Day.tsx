import React, {useCallback} from 'react'
import styled from 'styled-components'
import {FontSizeProps} from 'styled-system'
import Box from '../Box'
import Text from '../Text'
import {get, SystemCommonProps, SystemLayoutProps} from '../constants'
import {SxProp} from '../sx'
import {useDatePicker} from './useDatePicker'

export interface DayProps extends FontSizeProps, SystemCommonProps, SxProp, SystemLayoutProps {
  blocked?: boolean
  disabled?: boolean
  onAction?: (date: Date, event?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
  selected?: boolean
  date: Date
}

const DayBaseComponent = styled(Box)`
  align-content: center;
  display: flex;
  justify-content: center;
  min-width: 38px;
  min-height: 38px;
  padding: ${get('space.1')};
`

const states = {
  blocked: {
    background: get('colors.neutral.subtle'),
    color: get('colors.fg.subtle')
  },
  disabled: {
    background: get('colors.canvas.primary'),
    color: get('colors.fg.subtle')
  },
  selected: {
    background: get('colors.accent.emphasis'),
    color: get('colors.fg.onEmphasis')
  },
  default: {
    normal: {
      background: get('colors.canvas.primary'),
      color: get('colors.fg.default')
    },
    hover: {
      background: get('colors.neutral.muted'),
      color: get('colors.fg.default')
    },
    pressed: {
      background: get('colors.neutral.emphasis'),
      color: get('colors.fg.onEmphasis')
    }
  }
}

const getStateColors = (
  props: Omit<DayProps, 'date'>,
  prop: 'background' | 'color',
  state: 'normal' | 'hover' | 'pressed'
) => {
  const {blocked, disabled, selected} = props
  if (blocked) {
    return states.blocked[prop]
  } else if (disabled) {
    return states.disabled[prop]
  } else if (selected) {
    return states.selected[prop]
  } else {
    return states.default[state][prop]
  }
}

const DayComponent = styled(DayBaseComponent).attrs((props: DayProps) => ({
  background: getStateColors(props, 'background', 'normal'),
  textColor: getStateColors(props, 'color', 'normal'),
  backgroundHover: getStateColors(props, 'background', 'hover'),
  textColorHover: getStateColors(props, 'color', 'hover'),
  backgroundPressed: getStateColors(props, 'background', 'pressed'),
  textColorPressed: getStateColors(props, 'color', 'pressed')
}))<Omit<DayProps, 'date'>>`
  background-color: ${props => props.background};
  border-radius: ${get('radii.2')};
  transition: 0.2s background-color ease;

  & ${Text} {
    align-self: center;
    color: ${props => props.textColor};
    display: flex;
    font-family: ${get('fonts.mono')};
    font-size: ${get('fontSizes.0')};
    justify-self: center;
    user-select: none;
    transition: 0.2s color ease;
  }

  &:hover {
    background-color: ${props => props.backgroundHover};
    cursor: pointer;
    transition: 0.05s background-color ease;
    & ${Text} {
      color: ${props => props.textColorHover};
      transition: 0.1s color ease;
    }
  }

  &:active {
    background-color: ${props => props.backgroundPressed};
    box-shadow: inset ${get('shadows.shadow.medium')};
    transition: 0.1s background-color ease, 0.1s box-shadow ease, 0.1s color ease;

    & ${Text} {
      color: ${props => props.textColorPressed};
      transition: 0.1s color ease;
    }
  }
`

export const Day: React.FC<DayProps> = ({blocked, disabled, date, onAction, selected}) => {
  const {onDayFocus, onDayBlur, onSelection, selection, softSelection} = useDatePicker()
  const keyPressHandler = useCallback(
    event => {
      if (disabled) {
        return
      }
      if ([' ', 'Enter'].includes(event.key)) {
        onSelection(date)
        onAction?.(date, event)
      }
    },
    [disabled, onSelection, onAction, date]
  )

  const clickHandler = useCallback(
    event => {
      if (disabled) {
        return
      }
      onAction?.(date, event)
    },
    [disabled, onAction, date]
  )

  return (
    <DayComponent
      role="button"
      blocked={blocked}
      disabled={disabled}
      selected={selected}
      onClick={clickHandler}
      onKeyPress={keyPressHandler}
    >
      <Text>{date.getDate()}</Text>
    </DayComponent>
  )
}

export const BlankDay = styled(DayBaseComponent)`
  background-color: ${get('colors.canvas.primary')};
`
