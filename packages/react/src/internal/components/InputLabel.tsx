import {clsx} from 'clsx'
import React from 'react'
import styled from 'styled-components'
import sx, {type SxProp} from '../../sx'
import {cssModulesFlag} from '../../FormControl/feature-flags'
import {useFeatureFlag} from '../../FeatureFlags'
import classes from './InputLabel.module.css'
import {toggleStyledComponent} from '../utils/toggleStyledComponent'

type BaseProps = SxProp & {
  disabled?: boolean
  required?: boolean
  requiredText?: string
  requiredIndicator?: boolean
  visuallyHidden?: boolean
  id?: string
  className?: string
}

export type LabelProps = BaseProps & {
  htmlFor?: string
  as?: 'label'
}

export type LegendOrSpanProps = BaseProps & {
  as: 'legend' | 'span'
  htmlFor?: undefined
}

type Props = React.PropsWithChildren<LabelProps | LegendOrSpanProps>

function InputLabel({
  children,
  disabled,
  htmlFor,
  id,
  required,
  requiredText,
  requiredIndicator,
  visuallyHidden,
  sx,
  as = 'label',
  className,
  ...props
}: Props) {
  const enabled = useFeatureFlag(cssModulesFlag)
  return (
    <StyledLabel
      as={as}
      data-control-disabled={disabled ? '' : undefined}
      data-visually-hidden={visuallyHidden ? '' : undefined}
      htmlFor={htmlFor}
      id={id}
      className={clsx(className, {
        [classes.Label]: enabled,
      })}
      sx={sx}
      {...props}
    >
      {required || requiredText ? (
        <StyledRequiredText
          className={clsx({
            [classes.RequiredText]: enabled,
          })}
        >
          <span>{children}</span>
          <span aria-hidden={requiredIndicator ? undefined : true}>{requiredText ?? '*'}</span>
        </StyledRequiredText>
      ) : (
        children
      )}
    </StyledLabel>
  )
}

const StyledLabel = toggleStyledComponent(
  cssModulesFlag,
  'label',
  styled.label`
    align-self: flex-start;
    display: block;
    color: var(--fgColor-default);
    cursor: pointer;
    font-weight: 600;
    font-size: var(--text-body-size-medium);

    &:where([data-control-disabled]) {
      color: var(--fgColor-muted);
      cursor: not-allowed;
    }

    &:where([data-visually-hidden]) {
      border: 0;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }

    ${sx}
  `,
)

const StyledRequiredText = toggleStyledComponent(
  cssModulesFlag,
  'span',
  styled.span`
    display: flex;
    column-gap: var(--base-size-4);
  `,
)

export {InputLabel}
