import {clsx} from 'clsx'
import type React from 'react'
import classes from './InputLabel.module.css'

type BaseProps = {
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
  as = 'label',
  className,
  ...props
}: Props) {
  const Component = as

  return (
    // @ts-ignore weird typing issue with union for `as` prop
    <Component
      data-control-disabled={disabled ? '' : undefined}
      data-visually-hidden={visuallyHidden ? '' : undefined}
      htmlFor={htmlFor}
      id={id}
      className={clsx(className, classes.Label)}
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
    </Component>
  )
}

export {InputLabel}
