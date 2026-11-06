import {cn} from '../../internal/cn'
import {actionItemClassName, getActionItemStateClassName, type ActionItemStateOptions} from '../ActionList/itemState'

/** How a filtered list lays out its options: inset from the panel edges, inset only horizontally, or edge to edge. */
export type FilteredActionListLayoutVariant = 'inset' | 'horizontal-inset' | 'full'

/** The filter header stays above the list and draws its divider as a shadow, so scrolled rows pass beneath it. */
export const filteredActionListHeaderClassName = 'relative z-1 shrink-0 shadow-[0_1px_0_var(--borderColor-default)]'

/** The scrolling region that holds the list, a loading state, or a message. */
export const filteredActionListContainerClassName = 'flex min-h-0 flex-1 overflow-auto'

export const filteredActionListGroupClassName = 'block pb-2 last:pb-0'

export function getFilteredActionListListClassName({
  variant,
  virtualized = false,
}: {
  variant: FilteredActionListLayoutVariant
  virtualized?: boolean
}) {
  return cn(
    'm-0 min-h-full flex-1 text-default',
    variant === 'inset' && !virtualized && 'py-2',
    variant === 'horizontal-inset' && 'pb-2',
  )
}

export function getFilteredActionListGroupHeadingClassName(variant?: 'subtle' | 'filled') {
  return cn(
    'flex min-h-[30px] items-center px-3 py-1.5 text-xs leading-[18px] font-semibold text-muted',
    variant === 'filled' && 'mb-2 border-y border-muted bg-muted',
  )
}

export interface FilteredActionListOptionClassNameOptions
  extends Pick<ActionItemStateOptions, 'disabled' | 'inactive' | 'variant'> {
  descriptionVariant?: 'block' | 'inline'
  /** Whether the option follows the combobox's virtual focus. Static, unavailable rows do not. */
  highlightable?: boolean
  listVariant: FilteredActionListLayoutVariant
  /** Whether the option is one of a virtualized list's fixed-height rows, sized by `--filtered-action-list-virtual-row-height`. */
  virtualized?: boolean
}

/** Classes for an option of a filtered list, shared by `FilteredActionList` and `SelectPanel`. */
export function getFilteredActionListOptionClassName({
  descriptionVariant,
  disabled,
  highlightable = true,
  inactive,
  listVariant,
  variant,
  virtualized = false,
}: FilteredActionListOptionClassNameOptions) {
  return cn(
    actionItemClassName,
    highlightable ? 'group relative cursor-default items-center outline-none' : 'items-center',
    getActionItemStateClassName({disabled, highlightable, inactive, variant}),
    listVariant !== 'full' && 'mx-2 w-auto',
    descriptionVariant === 'block' && 'items-start',
    // Rows clip only vertically, so the accent line beside a highlighted row stays visible.
    virtualized && 'h-(--filtered-action-list-virtual-row-height) overflow-y-clip',
  )
}
