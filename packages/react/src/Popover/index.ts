import {Popover as PopoverImpl, PopoverContent} from './Popover'
import type {PopoverProps, PopoverContentProps} from './Popover'

export const Popover = Object.assign(PopoverImpl, {Content: PopoverContent})

export type {PopoverProps, PopoverContentProps}
