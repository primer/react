import {Button as ButtonComponent} from './Button'
import {Counter} from './ButtonCounter'
import {IconButton} from './IconButton'
export type {ButtonProps, IconButtonProps} from './types'
export {IconButton}

export const Button = Object.assign(ButtonComponent, {
  Counter
})

Button.displayName = 'Button'
