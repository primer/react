import {createContext} from 'react'
import {ActionListItemProps} from './Item'

type ActionListItemContext = Pick<ActionListItemProps, 'variant' | 'disabled'> & {
  inlineDescriptionId: string
  blockDescriptionId: string
}

export const ActionListItemContext = createContext<ActionListItemContext | null>(null)
