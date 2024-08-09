import {Select as SelectImpl, Option, OptGroup} from './Select'

export const Select = Object.assign(SelectImpl, {
  Option,
  OptGroup,
})

export type {SelectProps} from './Select'
