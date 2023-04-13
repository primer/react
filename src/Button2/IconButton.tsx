import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {Button, ButtonProps} from './Button'

type ButtonA11yProps =
  | {'aria-label': string; 'aria-labelledby'?: undefined}
  | {'aria-label'?: undefined; 'aria-labelledby': string}

export type IconButtonProps = ButtonA11yProps & {
  icon: React.ComponentType
} & Omit<ButtonProps, 'aria-label' | 'aria-labelledby'>

const IconButton = React.forwardRef(({icon: Icon, ...props}, forwardedRef): JSX.Element => {
  return (
    <Button
      leadingIcon={Icon}
      data-component="IconButton"
      // @ts-expect-error StyledButton wants both Anchor and Button refs
      ref={forwardedRef}
      {...props}
    />
  )
}) as PolymorphicForwardRefComponent<'button' | 'a', IconButtonProps>

export {IconButton}
