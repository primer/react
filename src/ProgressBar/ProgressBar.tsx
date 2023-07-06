import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {width, WidthProps} from 'styled-system'
import {get} from '../constants'
import sx, {SxProp} from '../sx'

type ProgressProp = {progress?: string | number} & SxProp

export const Item = styled.span<ProgressProp>`
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
  tabIndex?: number
} & WidthProps &
  SxProp &
  React.PropsWithChildren

const ProgressContainer = styled.span<StyledProgressContainerProps>`
  display: ${props => (props.inline ? 'inline-flex' : 'flex')};
  overflow: hidden;
  background-color: ${get('colors.border.default')};
  border-radius: ${get('radii.1')};
  height: ${props => sizeMap[props.barSize || 'default']};
  ${width}
  ${sx};
`

export type ProgressBarProps = {bg?: string} & StyledProgressContainerProps & Pick<ProgressProp, 'progress'>

export const ProgressBar = forwardRef<HTMLSpanElement, ProgressBarProps>(
  ({progress, bg = 'success.emphasis', barSize = 'default', children, ...rest}: ProgressBarProps, forwardRef) => {
    if (children && progress) {
      throw new Error('You should pass `progress` or children, not both.')
    }

    const ariaAttributes = {
      'aria-valuenow': typeof progress === 'number' ? Math.round(progress) : undefined,
      'aria-valuetext': typeof progress === 'string' ? progress : undefined,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-busy': progress !== 100,
    }

    return (
      <ProgressContainer role="progressbar" barSize={barSize} ref={forwardRef} {...ariaAttributes} {...rest}>
        {children ?? <Item progress={progress} sx={{backgroundColor: bg}} />}
      </ProgressContainer>
    )
  },
)
