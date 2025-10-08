import {clsx} from 'clsx'
import React, {forwardRef} from 'react'
import {useRefObjectAsForwardedRef} from '../hooks'
import classes from './Text.module.css'

export type TextProps = {
  size?: 'large' | 'medium' | 'small'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
}

interface TextComponent {
  <T extends React.ElementType = 'span'>(
    props: {
      as?: T
    } & TextProps &
      Omit<React.ComponentPropsWithoutRef<T>, keyof TextProps>,
  ): React.ReactElement | null

  displayName?: string
}

const Text = forwardRef<HTMLElement, {as?: React.ElementType} & TextProps & React.HTMLAttributes<HTMLElement>>(
  ({as: Component = 'span', className, size, weight, ...props}, forwardedRef) => {
    const innerRef = React.useRef<HTMLElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, innerRef)

    return (
      <Component
        className={clsx(className, classes.Text)}
        data-size={size}
        data-weight={weight}
        {...props}
        ref={innerRef}
      />
    )
  },
) as TextComponent

Text.displayName = 'Text'

export default Text
