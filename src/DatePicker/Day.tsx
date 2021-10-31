import React, {useCallback, useMemo} from 'react'
import styled from 'styled-components'
import {FontSizeProps} from 'styled-system'
import Box from '../Box'
import Text from '../Text'
import {get, SystemCommonProps, SystemLayoutProps} from '../constants'
import {SxProp} from '../sx'
import useDatePicker, {DaySelection} from './useDatePicker'

export type DayProps = {
  blocked?: boolean
  disabled?: boolean
  focused?: boolean
  onAction?: (date: Date, event?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
  selected?: DaySelection
  date: Date
} & FontSizeProps &
  SystemCommonProps &
  SxProp &
  SystemLayoutProps

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
    borderRadius: get('radii.2'),
    color: get('colors.fg.subtle')
  },
  disabled: {
    background: get('colors.canvas.primary'),
    borderRadius: get('radii.2'),
    color: get('colors.fg.subtle')
  },
  selected: {
    default: {
      background: get('colors.accent.emphasis'),
      borderRadius: get('radii.2'),
      color: get('colors.fg.onEmphasis'),
      todayColor: get('colors.fg.onEmphasis')
    },
    start: {
      background: get('colors.accent.emphasis'),
      borderRadius: '4px 0 0 4px',
      color: get('colors.fg.onEmphasis'),
      todayColor: get('colors.fg.onEmphasis')
    },
    middle: {
      background: get('colors.accent.subtle'),
      borderRadius: '0',
      color: get('colors.fg.default'),
      todayColor: get('colors.accent.fg')
    },
    end: {
      background: get('colors.accent.emphasis'),
      borderRadius: '0 4px 4px 0',
      color: get('colors.fg.onEmphasis'),
      todayColor: get('colors.fg.onEmphasis')
    }
  },
  default: {
    normal: {
      background: get('colors.canvas.primary'),
      borderRadius: get('radii.2'),
      color: get('colors.fg.default'),
      todayColor: get('colors.accent.fg')
    },
    hover: {
      background: get('colors.neutral.muted'),
      borderRadius: get('radii.2'),
      color: get('colors.fg.default'),
      todayColor: get('colors.accent.fg')
    },
    pressed: {
      background: get('colors.neutral.emphasis'),
      borderRadius: get('radii.2'),
      color: get('colors.fg.onEmphasis'),
      todayColor: get('colors.fg.onEmphasis')
    }
  }
}

type DayComponentProps = {today?: boolean} & Omit<DayProps, 'date'>

const getStateStyles = (
  props: DayComponentProps,
  prop: 'background' | 'borderRadius' | 'color',
  state: 'normal' | 'hover' | 'pressed'
) => {
  const {blocked, disabled, focused, selected, today} = props
  if (selected) {
    switch (selected) {
      case 'start':
        return today && prop === 'color' ? states.selected.start['todayColor'] : states.selected.start[prop]
      case 'middle':
        return today && prop === 'color' ? states.selected.middle['todayColor'] : states.selected.middle[prop]
      case 'end':
        return today && prop === 'color' ? states.selected.end['todayColor'] : states.selected.end[prop]
      default:
        return today && prop === 'color' ? states.selected.default['todayColor'] : states.selected.default[prop]
    }
  } else if (blocked) {
    return states.blocked[prop]
  } else if (disabled) {
    return states.disabled[prop]
  } else if (focused) {
    return states.default.hover[prop]
  } else {
    return today && prop === 'color' ? states.default[state]['todayColor'] : states.default[state][prop]
  }
}

const DayComponent = styled(DayBaseComponent).attrs((props: DayComponentProps) => ({
  background: getStateStyles(props, 'background', 'normal'),
  borderRadius: getStateStyles(props, 'borderRadius', 'normal'),
  textColor: getStateStyles(props, 'color', 'normal'),
  backgroundHover: getStateStyles(props, 'background', 'hover'),
  textColorHover: getStateStyles(props, 'color', 'hover'),
  backgroundPressed: getStateStyles(props, 'background', 'pressed'),
  textColorPressed: getStateStyles(props, 'color', 'pressed')
}))<DayComponentProps>`
  background-color: ${props => props.background};
  border-radius: ${props => props.borderRadius};
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  transition: 0.1s background-color ease;

  & ${Text} {
    align-self: center;
    color: ${props => props.textColor};
    display: flex;
    font-family: ${get('fonts.mono')};
    font-size: ${get('fontSizes.0')};
    justify-self: center;
    user-select: none;
    transition: 0.1s color ease;
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

export const Day: React.FC<DayProps> = ({date, onAction}) => {
  const {onDayFocus, onSelection, disabled, blocked, focused, selected, today} = useDatePicker(date)

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
      onSelection(date)
      onAction?.(date, event)
    },
    [disabled, onSelection, date, onAction]
  )

  const todayStyles = useMemo(
    () =>
      today
        ? {
            border: '2px solid',
            padding: '4px 6px',
            borderRadius: '16px',
            fontWeight: 'bold'
          }
        : {},
    [today]
  )

  return (
    <DayComponent
      role="gridcell"
      aria-disabled={disabled}
      aria-selected={selected !== false}
      blocked={blocked}
      disabled={disabled}
      focused={focused}
      selected={selected}
      today={today}
      onClick={clickHandler}
      onMouseEnter={() => onDayFocus(date)}
      onFocus={() => onDayFocus(date)}
      onKeyPress={keyPressHandler}
    >
      <Text sx={todayStyles}>{date.getDate()}</Text>
    </DayComponent>
  )
}

export const BlankDay = styled(DayBaseComponent)`
  background-color: ${get('colors.canvas.primary')};
`
