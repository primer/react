/* eslint-disable primer-react/spread-props-first */
import classes from './ButtonReset.module.css'
import {clsx} from 'clsx'

/**
 * Provides an unstyled button that can be styled as-needed for components
 */
export const Button = ({children, className, ...rest}: React.ComponentPropsWithoutRef<'button'>) => {
  return (
    <button className={clsx(className, classes.ButtonReset)} type="button" {...rest}>
      {children}
    </button>
  )
}
