import {clsx} from 'clsx'
import styled, {type StyledComponent} from 'styled-components'
import React, {forwardRef} from 'react'
import type {SystemCommonProps, SystemTypographyProps} from '../constants'
import {COMMON, TYPOGRAPHY} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import {useFeatureFlag} from '../FeatureFlags'
import Box from '../Box'
import {useRefObjectAsForwardedRef} from '../hooks'
import type {ComponentProps} from '../utils/types'
import {includesSystemProps} from '../utils/includeSystemProps'
import classes from './Text.module.css'

type StyledTextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ComponentType<any> | keyof JSX.IntrinsicElements
  size?: 'large' | 'medium' | 'small'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
} & SystemTypographyProps &
  SystemCommonProps &
  SxProp

const StyledText = styled.span<StyledTextProps>`
  ${TYPOGRAPHY};
  ${COMMON};

  &:where([data-size='small']) {
    font-size: var(--text-body-size-small, 0.75rem);
    line-height: var(--text-body-lineHeight-small, 1.6666);
  }

  &:where([data-size='medium']) {
    font-size: var(--text-body-size-medium, 0.875rem);
    line-height: var(--text-body-lineHeight-medium, 1.4285);
  }

  &:where([data-size='large']) {
    font-size: var(--text-body-size-large, 1rem);
    line-height: var(--text-body-lineHeight-large, 1.5);
  }

  &:where([data-weight='light']) {
    font-weight: var(--base-text-weight-light, 300);
  }

  &:where([data-weight='normal']) {
    font-weight: var(--base-text-weight-normal, 400);
  }

  &:where([data-weight='medium']) {
    font-weight: var(--base-text-weight-medium, 500);
  }

  &:where([data-weight='semibold']) {
    font-weight: var(--base-text-weight-semibold, 600);
  }

  ${sx};
`

const Text = forwardRef(({as: Component = 'span', className, size, weight, ...props}, forwardedRef) => {
  const enabled = useFeatureFlag('primer_react_css_modules_ga')

  const innerRef = React.useRef<HTMLElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, innerRef)
  if (enabled) {
    // If props includes TYPOGRAPHY or COMMON props, pass them to the Box component
    if (includesSystemProps(props)) {
      return (
        // @ts-ignore shh
        <Box
          as={Component}
          className={clsx(className, classes.Text)}
          data-size={size}
          data-weight={weight}
          {...props}
          // @ts-ignore shh
          ref={innerRef}
        />
      )
    }

    return (
      <Component
        className={clsx(className, classes.Text)}
        data-size={size}
        data-weight={weight}
        {...props}
        // @ts-ignore shh
        ref={innerRef}
      />
    )
  }

  return (
    <StyledText
      as={Component}
      className={className}
      data-size={size}
      data-weight={weight}
      {...props}
      // @ts-ignore shh
      ref={innerRef}
    />
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as StyledComponent<'span', any, StyledTextProps, never>

Text.displayName = 'Text'

export type TextProps = ComponentProps<typeof StyledText>
export default Text
