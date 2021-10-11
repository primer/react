import React from 'react'
import styled from 'styled-components'
import {FontSizeProps} from 'styled-system'
import Box from '../Box'
import Text from '../Text'
import {get, SystemCommonProps, SystemLayoutProps} from '../constants'
import {SxProp} from '../sx'

export interface DayProps extends FontSizeProps, SystemCommonProps, SxProp, SystemLayoutProps {
  blockedOut?: boolean
  disabled?: boolean
  selected?: boolean
  day: number
}

const DayBaseComponent = styled(Box)`
  align-content: center;
  border: 1px solid ${get('colors.border.default')};
  color: ${get('colors.fg.primary')};
  display: flex;
  justify-content: center;
  min-width: 38px;
  min-height: 38px;
  padding: ${get('space.1')};
`

const DayComponent = styled(DayBaseComponent).attrs((props: DayProps) => ({
  background: props.selected ? get('colors.accent.subtle') : get('colors.canvas.primary'),
  backgroundHover: props.selected ? get('colors.accent.muted') : get('colors.neutral.muted')
}))<Omit<DayProps, 'day'>>`
  background-color: ${props => props.background};

  &:hover {
    background-color: ${props => props.backgroundHover};
    cursor: pointer;
    transition: 0.1s background-color ease;
  }

  &:active {
    /* background-color: ${get('colors.neutral.emphasis')}; */
    box-shadow: inset ${get('shadows.shadow.medium')};
    transition: 0.1s background-color ease, 0.1s box-shadow ease;
  }

  & ${Text} {
    display: flex;
    align-self: center;
    justify-self: center;
    user-select: none;
  }
`

export const Day: React.FC<DayProps> = ({day, selected}) => {
  return (
    <DayComponent role="button" selected={selected}>
      <Text>{day}</Text>
    </DayComponent>
  )
}

export const BlankDay = styled(DayBaseComponent)`
  background-color: ${get('colors.canvas.subtle')};
`
