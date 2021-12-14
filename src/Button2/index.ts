import {Button} from './Button'
import {Counter} from './ButtonCounter'
import IconButton from './IconButton'
import ButtonLink from './ButtonLink'
import {ButtonProps, IconButtonProps} from './types'
// change this when moving to released state
export type {ButtonProps as Button2Props, IconButtonProps}
export const Button2 = Object.assign(Button, {
  Counter
})
export {IconButton, ButtonLink}
