import React, {forwardRef} from 'react'
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
  tabIndex?: number
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

export const ProgressBar = forwardRef<HTMLSpanElement, ProgressBarProps>(
  ({progress, bg = 'success.emphasis', barSize = 'default', children, ...rest}: ProgressBarProps, forwardRef) => {
    if (children && progress) {
      throw new Error('You should pass `progress` or children, not both.')
    }

    if (
      children &&
      typeof (rest as React.AriaAttributes)['aria-valuenow'] === 'undefined' &&
      typeof (rest as React.AriaAttributes)['aria-valuetext'] === 'undefined'
    ) {
      throw new Error(
        'Use the `aria-valuenow` or `aria-valuetext` so screen reader users can determine the `progress`.',
      )
    }

    const progressAsNumber = typeof progress === 'string' ? parseInt(progress) : progress

    const ariaAttributes = {
      'aria-valuenow': progressAsNumber ? Math.round(progressAsNumber) : undefined,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-busy': progressAsNumber ? progressAsNumber !== 100 : false,
    }

    return (
      <ProgressContainer ref={forwardRef} role="progressbar" barSize={barSize} {...ariaAttributes} {...rest}>
        {children ?? <Item progress={progress} sx={{backgroundColor: bg}} />}
      </ProgressContainer>
    )
  },
)

ProgressBar.displayName = 'ProgressBar'
