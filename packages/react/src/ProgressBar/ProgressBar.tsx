import React, {forwardRef} from 'react'
import styled, {keyframes} from 'styled-components'
import type {WidthProps} from 'styled-system'
import {width} from 'styled-system'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import {warning} from '../utils/warning'

type ProgressProp = {
  /**
   * Used to set the size of the green bar
   * @default 0
   */
  progress?: string | number
}

const shimmer = keyframes`
  from { mask-position: 200%; }
  to { mask-position: 0%; }
`

/**
 * A segment of a ProgressBar with multiple parts.
 * @alias ProgressBar.Item
 * @primerparentid progress_bar
 */
export const Item = styled.span<ProgressProp & SxProp>`
  width: ${props => (props.progress ? `${props.progress}%` : 0)};
  background-color: ${get('colors.success.emphasis')};

  @media (prefers-reduced-motion: no-preference) {
    &[data-animated='true'] {
      mask-image: linear-gradient(75deg, #000 30%, rgba(0, 0, 0, 0.65) 80%);
      mask-size: 200%;
      animation: ${shimmer};
      animation-duration: 1s;
      animation-iteration-count: infinite;
    }
  }

  ${sx};
`

Item.displayName = 'ProgressBar.Item'

const sizeMap = {
  small: '5px',
  large: '10px',
  default: '8px',
}

type StyledProgressContainerProps = {
  /**
   * Styles the progress bar inline
   */
  inline?: boolean
  /**
   * Controls the height of the progress bar. If omitted, height is set to the default height.
   * @default default
   */
  barSize?: keyof typeof sizeMap
  /**
   * Whether the filled in area(s) of the progress bar will be animated or not
   */
  animated?: boolean
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

export type ProgressBarProps = React.HTMLAttributes<HTMLSpanElement> & {
  /**
   * Set the progress bar color
   * @default bg.successInverse
   */
  bg?: string
} & StyledProgressContainerProps &
  ProgressProp

/**
 * Progress bar visualizes one or more parts of a whole.
 * @primerid progress_bar
 * @primerstatus alpha
 * @primera11yreviewed false
 */
export const ProgressBar = forwardRef<HTMLSpanElement, ProgressBarProps>(
  (
    {animated, progress, bg = 'success.emphasis', barSize = 'default', children, ...rest}: ProgressBarProps,
    forwardRef,
  ) => {
    if (children && progress) {
      throw new Error('You should pass `progress` or children, not both.')
    }

    warning(
      children &&
        typeof (rest as React.AriaAttributes)['aria-valuenow'] === 'undefined' &&
        typeof (rest as React.AriaAttributes)['aria-valuetext'] === 'undefined',
      'Expected `aria-valuenow` or `aria-valuetext` to be provided to <ProgressBar>. Provide one of these values so screen reader users can determine the current progress. This warning will become an error in the next major release.',
    )

    const progressAsNumber = typeof progress === 'string' ? parseInt(progress, 10) : progress

    const ariaAttributes = {
      'aria-valuenow': progressAsNumber ? Math.round(progressAsNumber) : undefined,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
    }

    return (
      <ProgressContainer ref={forwardRef} role="progressbar" barSize={barSize} {...ariaAttributes} {...rest}>
        {children ?? <Item data-animated={animated} progress={progress} sx={{backgroundColor: bg}} />}
      </ProgressContainer>
    )
  },
)

ProgressBar.displayName = 'ProgressBar'
