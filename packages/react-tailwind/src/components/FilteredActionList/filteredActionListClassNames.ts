import {cn} from '../../internal/cn'
import {actionItemClassName, getActionItemStateClassName, type ActionItemStateOptions} from '../ActionList/itemState'

/** How a filtered list lays out its options: inset from the panel edges, inset only horizontally, or edge to edge. */
export type FilteredActionListLayoutVariant = 'inset' | 'horizontal-inset' | 'full'

/** The filter header stays above the list and draws its divider as a shadow, so scrolled rows pass beneath it. */
export const filteredActionListHeaderClassName =
  'primer:relative primer:z-1 primer:shrink-0 primer:shadow-[0_1px_0_var(--borderColor-default)]'

/** The scrolling region that holds the list, a loading state, or a message. */
export const filteredActionListContainerClassName = 'primer:flex primer:min-h-0 primer:flex-1 primer:overflow-auto'

export const filteredActionListGroupClassName = 'primer:block primer:pb-2 primer:last:pb-0'

export function getFilteredActionListListClassName({
  variant,
  virtualized = false,
}: {
  variant: FilteredActionListLayoutVariant
  virtualized?: boolean
}) {
  return cn(
    'primer:m-0 primer:min-h-full primer:flex-1 primer:text-default',
    variant === 'inset' && !virtualized && 'primer:py-2',
    variant === 'horizontal-inset' && 'primer:pb-2',
  )
}

export function getFilteredActionListGroupHeadingClassName(variant?: 'subtle' | 'filled') {
  return cn(
    'primer:flex primer:min-h-[30px] primer:items-center primer:px-3 primer:py-1.5 primer:text-xs primer:leading-[18px] primer:font-semibold primer:text-muted',
    variant === 'filled' && 'primer:mb-2 primer:border-y primer:border-muted primer:bg-muted',
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
    highlightable
      ? 'primer:group primer:relative primer:cursor-default primer:items-center primer:outline-none'
      : 'primer:items-center',
    getActionItemStateClassName({disabled, highlightable, inactive, variant}),
    listVariant !== 'full' && 'primer:mx-2 primer:w-auto',
    descriptionVariant === 'block' && 'primer:items-start',
    // Rows clip only vertically, so the accent line beside a highlighted row stays visible.
    virtualized && 'primer:h-(--filtered-action-list-virtual-row-height) primer:overflow-y-clip',
  )
}
