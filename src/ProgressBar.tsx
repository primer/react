import React from 'react'
import styled from 'styled-components'
import {width, WidthProps} from 'styled-system'
import {get} from './constants'
import sx, {SxProp} from './sx'

type ProgressProp = {progress?: string | number}

const Bar = styled.span<ProgressProp & SxProp>`
  width: ${props => (props.progress ? `${props.progress}%` : 0)};

  ${sx};
`

const sizeMap = {
  small: '5px',
  large: '10px',
  default: '8px'
}

type StyledProgressContainerProps = {
  inline?: boolean
  barSize?: keyof typeof sizeMap
} & WidthProps &
  SxProp

const ProgressContainer = styled.span<StyledProgressContainerProps>`
  display: ${props => (props.inline ? 'inline-flex' : 'flex')};
  overflow: hidden;
  background-color: ${get('colors.border.default')};
  border-radius: ${get('radii.1')};
  height: ${props => sizeMap[props.barSize || 'default']};

  ${width}
  ${sx};
`

export type ProgressBarProps = {bg: string} & StyledProgressContainerProps & ProgressProp

function ProgressBar({progress, bg, ...rest}: ProgressBarProps) {
  return (
    <ProgressContainer {...rest}>
      <Bar progress={progress} sx={{bg}} />
    </ProgressContainer>
  )
}

ProgressBar.defaultProps = {
  bg: 'success.emphasis',
  barSize: 'default'
}

export default ProgressBar
