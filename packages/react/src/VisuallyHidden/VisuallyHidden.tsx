import styled from 'styled-components'
import type {SxProp} from '../sx'
import sx from '../sx'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {clsx} from 'clsx'
import {useFeatureFlag} from '../FeatureFlags'
import React, {type HTMLAttributes} from 'react'
import classes from './VisuallyHidden.module.css'

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_ga'

/**
 * Provides a component that implements the "visually hidden" technique. This is
 * analagous to the common `sr-only` class. Children that are rendered inside
 * this component will not be visible but will be available to screen readers.
 *
 * Note: if this component, or a descendant, has focus then this component will
 * no longer be visually hidden.
 *
 * @see https://www.scottohara.me/blog/2023/03/21/visually-hidden-hack.html
 */
const StyledVisuallyHidden = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'span',
  styled.span<SxProp>`
    &:not(:focus):not(:active):not(:focus-within) {
      clip-path: inset(50%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }

    ${sx}
  `,
)

export const VisuallyHidden = ({className, children, ...rest}: VisuallyHiddenProps) => {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  return (
    <StyledVisuallyHidden className={clsx(className, enabled && classes.VisuallyHidden)} {...rest}>
      {children}
    </StyledVisuallyHidden>
  )
}

export type VisuallyHiddenProps = React.PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    className?: string
  } & SxProp
>
