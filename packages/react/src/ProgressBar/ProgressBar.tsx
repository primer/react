import React, {forwardRef} from 'react'
import styled, {keyframes} from 'styled-components'
import type {WidthProps} from 'styled-system'
import {width} from 'styled-system'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import {warning} from '../utils/warning'

type ProgressProp = {progress?: string | number}

const shimmer = keyframes`
  from { mask-position: 200%; }
  to { mask-position: 0%; }
`

const ProgressItem = styled.span<ProgressProp & SxProp>`
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

const sizeMap = {
  small: '5px',
  large: '10px',
  default: '8px',
}

type StyledProgressContainerProps = {
  inline?: boolean
  barSize?: keyof typeof sizeMap
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

export type ProgressBarItems = React.HTMLAttributes<HTMLSpanElement> & {'aria-label'?: string} & ProgressProp & SxProp

export const Item = forwardRef<HTMLSpanElement, ProgressBarItems>(
  ({progress, 'aria-label': ariaLabel, ...rest}, forwardRef) => {
    const progressAsNumber = typeof progress === 'string' ? parseInt(progress, 10) : progress

    const ariaAttributes = {
      'aria-valuenow': progressAsNumber ? Math.round(progressAsNumber) : undefined,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
    }

    warning(
      !ariaAttributes['aria-valuenow'] &&
        typeof (rest as React.AriaAttributes)['aria-valuenow'] === 'undefined' &&
        typeof (rest as React.AriaAttributes)['aria-valuetext'] === 'undefined',
      'Expected `aria-valuenow` or `aria-valuetext` to be provided to <ProgressBar>. Provide one of these values so screen reader users can determine the current progress. This warning will become an error in the next major release.',
    )

    return (
      <ProgressItem
        role="progressbar"
        aria-label={ariaLabel}
        ref={forwardRef}
        progress={progress}
        {...ariaAttributes}
        {...rest}
      />
    )
  },
)

Item.displayName = 'ProgressBar.Item'

export type ProgressBarProps = React.HTMLAttributes<HTMLSpanElement> & {bg?: string} & StyledProgressContainerProps &
  ProgressProp

export const ProgressBar = forwardRef<HTMLSpanElement, ProgressBarProps>(
  (
    {
      animated,
      progress,
      bg = 'success.emphasis',
      barSize = 'default',
      children,
      'aria-label': ariaLabel,
      ...rest
    }: ProgressBarProps,
    forwardRef,
  ) => {
    if (children && progress) {
      throw new Error('You should pass `progress` or children, not both.')
    }

    return (
      <ProgressContainer ref={forwardRef} barSize={barSize} {...rest}>
        {children ?? (
          <Item data-animated={animated} progress={progress} aria-label={ariaLabel} sx={{backgroundColor: bg}} />
        )}
      </ProgressContainer>
    )
  },
)

ProgressBar.displayName = 'ProgressBar'
