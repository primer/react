import {Stack as StackImpl, StackItem} from './Stack'

export const Stack = Object.assign(StackImpl, {
  Item: StackItem,
})
export type {StackProps, StackItemProps} from './Stack'
