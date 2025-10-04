import type React from 'react'
import {clsx} from 'clsx'
import type {SxProp} from '../../sx'
import classes from './Header.module.css'

/**
 * Contract for props passed to the `Header` component.
 */
export interface HeaderProps extends React.ComponentPropsWithoutRef<'div'>, SxProp {
  /**
   * Style variations. Usage is discretionary.
   *
   * - `"filled"` - Superimposed on a background, offset from nearby content
   * - `"subtle"` - Relatively less offset from nearby content
   */
  variant?: 'subtle' | 'filled'

  /**
   * Primary text which names a `Group`.
   */
  title: string

  /**
   * Secondary text which provides additional information about a `Group`.
   */
  auxiliaryText?: string
}

/**
 * Displays the name and description of a `Group`.
 */
export function Header({
  variant = 'subtle',
  title,
  auxiliaryText,
  children: _children,
  className,
  ...props
}: HeaderProps): JSX.Element {
  return (
    <div
      role="heading"
      className={clsx(className, classes.Header)}
      data-filled={variant === 'filled' ? '' : undefined}
      data-component="ActionList.Header"
      {...props}
    >
      {title}
      {auxiliaryText && <span>{auxiliaryText}</span>}
    </div>
  )
}
