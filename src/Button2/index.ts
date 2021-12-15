import {Button as ButtonComponent} from './Button'
import {Counter} from './ButtonCounter'
import IconButton from './IconButton'
import ButtonLink from './ButtonLink'
import {ButtonProps, IconButtonProps} from './types'
// change this when moving to released state
export type {ButtonProps, IconButtonProps}
export const Button = Object.assign(ButtonComponent, {
  Counter
})
export {IconButton, ButtonLink}
