import type {UnderlineNavItemProps} from './UnderlineNavItemsRegistry'

export const isCurrent = (props: UnderlineNavItemProps) =>
  props['aria-current'] !== undefined && props['aria-current'] !== false && props['aria-current'] !== 'false'
