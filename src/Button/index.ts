import {ButtonComponent} from './Button'
import {Counter} from './ButtonCounter'
import {IconButton} from './IconButton'
import {LinkButton} from './LinkButton'
export type {ButtonProps, IconButtonProps} from './types'
export {IconButton, LinkButton}

export const Button = Object.assign(ButtonComponent, {
  Counter
})
