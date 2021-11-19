import {Button} from './button'
import {Counter} from './button-counter'
import {ButtonProps} from './types'
// change this when moving to released state

export type {ButtonProps as NewButtonProps}

export const NewButton = Object.assign(Button, {
  Counter
})
