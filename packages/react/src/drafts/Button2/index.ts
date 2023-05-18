import {ButtonComponent} from './Button'
import {Counter} from './ButtonCounter'
export type {ButtonProps, IconButtonProps} from './types'

export const Button = Object.assign(ButtonComponent, {
  Counter,
})
