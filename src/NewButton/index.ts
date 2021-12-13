import {Button} from './button'
import {Counter} from './button-counter'
import IconButton from './icon-button'
import ButtonLink from './button-link'
import {ButtonProps, IconButtonProps} from './types'
// change this when moving to released state
export type {ButtonProps as NewButtonProps, IconButtonProps}
export const NewButton = Object.assign(Button, {
  Counter
})
export {IconButton, ButtonLink}
