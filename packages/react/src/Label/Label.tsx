import {clsx} from 'clsx'
import {useFeatureFlag} from '../FeatureFlags'
import Box from '../Box'
import classes from './Label.module.css'
import React, {useContext} from 'react'
import styled from 'styled-components'
import {variant} from 'styled-system'
import {get} from '../constants'
import type {BetterSystemStyleObject, SxProp} from '../sx'
import sx from '../sx'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {LabelGroupContext} from '../LabelGroup/LabelGroupContext'

export type LabelProps = {
  /** The color of the label */
  variant?: LabelColorOptions
  /** How large the label is rendered */
  size?: LabelSizeKeys
} & SxProp

export type LabelColorOptions =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'attention'
  | 'severe'
  | 'danger'
  | 'done'
  | 'sponsors'

type LabelSizeKeys = 'small' | 'large'

export const variants: Record<LabelColorOptions, BetterSystemStyleObject> = {
  default: {
    borderColor: 'border.default',
  },
  primary: {
    borderColor: 'fg.default',
  },
  secondary: {
    borderColor: 'border.muted',
    color: 'fg.muted',
  },
  accent: {
    borderColor: 'accent.emphasis',
    color: 'accent.fg',
  },
  success: {
    borderColor: 'success.emphasis',
    color: 'success.fg',
  },
  attention: {
    borderColor: 'attention.emphasis',
    color: 'attention.fg',
  },
  severe: {
    borderColor: 'severe.emphasis',
    color: 'severe.fg',
  },
  danger: {
    borderColor: 'danger.emphasis',
    color: 'danger.fg',
  },
  done: {
    borderColor: 'done.emphasis',
    color: 'done.fg',
  },
  sponsors: {
    borderColor: 'sponsors.emphasis',
    color: 'sponsors.fg',
  },
}

const sizes: Record<LabelSizeKeys, BetterSystemStyleObject> = {
  small: {
    height: 'var(--base-size-20, 20px)',
    padding: '0 var(--base-size-6, 6px)',
  },
  large: {
    height: 'var(--base-size-24, 24px)',
    padding: '0 var(--base-size-8, 8px)',
  },
}

const StyledLabel = styled.span<LabelProps>`
  align-items: center;
  background-color: transparent;
  border-width: 1px;
  border-radius: 999px;
  border-style: solid;
  display: inline-flex;
  font-weight: ${get('fontWeights.semibold')};
  font-size: ${get('fontSizes.0')};
  line-height: 1;
  white-space: nowrap;
  ${variant({variants})};
  ${variant({prop: 'size', variants: sizes})};
  ${sx};
`

const Label = React.forwardRef(function Label({as, size = 'small', variant = 'default', className, ...rest}, ref) {
  const enabled = useFeatureFlag('primer_react_css_modules_ga')
  const {isList} = useContext(LabelGroupContext)
  if (enabled) {
    const Component = as || (isList ? 'li' : 'span')
    if (rest.sx) {
      return (
        <Box
          as={Component}
          className={clsx(className, classes.Label)}
          data-size={size}
          data-variant={variant}
          ref={ref}
          {...rest}
        />
      )
    }
    return <Component className={clsx(className, classes.Label)} data-size={size} data-variant={variant} {...rest} />
  }
  return (
    <StyledLabel
      as={as || (isList ? 'li' : 'span')}
      className={className}
      size={size}
      variant={variant}
      ref={ref}
      {...rest}
    />
  )
}) as PolymorphicForwardRefComponent<'span', LabelProps>

export default Label
