import React from 'react'
import styled from 'styled-components'
import {width, WidthProps} from 'styled-system'
import {get} from '../constants'
import sx, {SxProp} from '../sx'

type ProgressProp = {progress?: string | number}

export const Item = styled.span<ProgressProp & SxProp>`
  width: ${props => (props.progress ? `${props.progress}%` : 0)};
  background-color: ${get('colors.success.emphasis')};
  ${sx};
`

Item.displayName = 'ProgressBar.Item'

const sizeMap = {
  small: '5px',
  large: '10px',
  default: '8px',
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

export type ProgressBarProps = React.PropsWithChildren & {bg?: string} & StyledProgressContainerProps & ProgressProp

export const ProgressBar = ({
  progress,
  bg = 'success.emphasis',
  barSize = 'default',
  children,
  ...rest
}: ProgressBarProps) => {
  if (children && progress) {
    throw new Error('You should pass `progress` or children, not both.')
  }

  return (
    <ProgressContainer barSize={barSize} {...rest}>
      {children ?? <Item progress={progress} sx={{backgroundColor: bg}} />}
    </ProgressContainer>
  )
}
