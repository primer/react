import {clsx} from 'clsx'
import React from 'react'
import styled from 'styled-components'
import sx, {type SxProp} from '../../sx'
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
        <span className={classes.RequiredText}>
          <span>{children}</span>
          <span aria-hidden={requiredIndicator ? undefined : true}>{requiredText ?? '*'}</span>
        </span>
      ) : (
        children
      )}
    </StyledLabel>
  )
}

const StyledLabel = toggleStyledComponent(
  '',
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

export {InputLabel}
