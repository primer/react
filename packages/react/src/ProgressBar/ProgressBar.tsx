import React, {forwardRef} from 'react'
import type {SxProp} from '../sx'
import {clsx} from 'clsx'
import classes from './ProgressBar.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

type ProgressProp = {
  className?: string
  progress?: string | number
  bg?: string
}

type StyledProgressContainerProps = {
  inline?: boolean
  barSize?: 'small' | 'default' | 'large'
  animated?: boolean
} & SxProp

export type ProgressBarItems = React.HTMLAttributes<HTMLSpanElement> & {
  'aria-label'?: string
  className?: string
} & ProgressProp &
  SxProp

export const Item = forwardRef<HTMLSpanElement, ProgressBarItems>(
  (
    {
      progress,
      'aria-label': ariaLabel,
      'aria-valuenow': ariaValueNow,
      'aria-valuetext': ariaValueText,
      className,
      style,
      bg,
      ...rest
    },
    forwardRef,
  ) => {
    const progressAsNumber = typeof progress === 'string' ? parseInt(progress, 10) : progress

    const ariaAttributes = {
      'aria-valuenow':
        ariaValueNow ?? (progressAsNumber !== undefined && progressAsNumber >= 0 ? Math.round(progressAsNumber) : 0),
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-valuetext': ariaValueText,
    }

    const progressBarWidth = '--progress-width'
    const progressBarBg = '--progress-bg'
    const styles: {[key: string]: string} = {}

    const bgType = bg && bg.split('.')
    styles[progressBarWidth] = progress ? `${progress}%` : '0%'
    styles[progressBarBg] =
      (bgType && `var(--bgColor-${bgType[0]}-${bgType[1] || 'emphasis'})`) || 'var(--bgColor-success-emphasis)'

    return (
      <BoxWithFallback
        as="span"
        className={clsx(className, classes.ProgressBarItem)}
        {...rest}
        role="progressbar"
        aria-label={ariaLabel}
        ref={forwardRef}
        progress={progress}
        style={{...styles, ...style}}
        {...ariaAttributes}
      />
    )
  },
)

Item.displayName = 'ProgressBar.Item'

export type ProgressBarProps = React.HTMLAttributes<HTMLSpanElement> & {
  bg?: string
  className?: string
} & StyledProgressContainerProps &
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
      'aria-valuenow': ariaValueNow,
      'aria-valuetext': ariaValueText,
      className,
      inline,
      ...rest
    }: ProgressBarProps,
    forwardRef,
  ) => {
    if (children && progress) {
      throw new Error('You should pass `progress` or children, not both.')
    }

    // Get the number of non-empty nodes passed as children, this will exclude
    // booleans, null, and undefined
    const validChildren = React.Children.toArray(children).length

    return (
      <BoxWithFallback
        as="span"
        ref={forwardRef}
        className={clsx(className, classes.ProgressBarContainer)}
        data-progress-display={inline ? 'inline' : 'block'}
        data-progress-bar-size={barSize}
        {...rest}
      >
        {validChildren ? (
          children
        ) : (
          <Item
            data-animated={animated}
            progress={progress}
            aria-label={ariaLabel}
            aria-valuenow={ariaValueNow}
            aria-valuetext={ariaValueText}
            bg={bg}
          />
        )}
      </BoxWithFallback>
    )
  },
)

ProgressBar.displayName = 'ProgressBar'
