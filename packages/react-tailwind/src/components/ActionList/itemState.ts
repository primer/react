import {cva} from 'class-variance-authority'
import {cn} from '../../internal/cn'

/**
 * Item parts read their colors from custom properties set on the element that owns the item's state: the list item in
 * `ActionList` and `NavList`, and the item itself in menus and listboxes. Every tone sets all of them, so an item never
 * inherits the state of an item it is nested in.
 */
export const actionItemPartClassName = {
  /** Text that is not part of a region, such as custom content. */
  content: 'text-[var(--action-list-item-fgColor,var(--control-fgColor-rest))]',
  label: 'text-[var(--action-list-item-label-fgColor,var(--fgColor-default))]',
  /** Leading visuals and selection indicators. */
  leadingVisual: 'fill-current text-[var(--action-list-item-visual-fgColor,var(--fgColor-muted))]',
  description: 'text-[var(--action-list-item-description-fgColor,var(--fgColor-muted))]',
  trailingVisual: 'fill-current text-[var(--action-list-item-trailing-fgColor,var(--fgColor-muted))]',
} as const

// State colors and backgrounds come from `getActionItemStateClassName` on the element that owns the item's state.
export const actionItemClassName = cn(
  'flex !min-w-0 w-full !justify-start gap-2 appearance-none rounded-md !border-0 bg-transparent px-2 py-1.5 text-left text-sm font-normal ![line-height:20px] whitespace-normal no-underline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus data-[disabled]:cursor-not-allowed items-start',
  actionItemPartClassName.content,
)

export type ActionItemTone = 'default' | 'danger' | 'loading' | 'inactive' | 'disabled'

export interface ActionItemStateOptions {
  /** The item is the current one, so it is filled and marked with an accent line. */
  active?: boolean
  disabled?: boolean
  /** The item follows virtual focus, as an option of a combobox does through `data-highlighted`. */
  highlightable?: boolean
  inactive?: boolean
  loading?: boolean
  /** A trailing action is loading, so the label and description stay at full contrast. */
  trailingActionLoading?: boolean
  variant?: 'default' | 'danger'
}

/** Resolves the tone of an item with several states, letting the state that most limits the item win. */
export function getActionItemTone({disabled, inactive, loading, variant}: ActionItemStateOptions): ActionItemTone {
  if (disabled) return 'disabled'
  if (inactive) return 'inactive'
  if (loading) return 'loading'
  return variant === 'danger' ? 'danger' : 'default'
}

const defaultColorsClassName =
  '[--action-list-item-fgColor:var(--control-fgColor-rest)] [--action-list-item-label-fgColor:var(--fgColor-default)] [--action-list-item-visual-fgColor:var(--fgColor-muted)] [--action-list-item-description-fgColor:var(--fgColor-muted)] [--action-list-item-trailing-fgColor:var(--fgColor-muted)]'

// The thin inset border is transparent except in high contrast themes. The transparent outline marks the state in
// forced colors, where box shadows are not drawn.
const hoverBorderClassName =
  'hover:not-data-active:not-focus-visible:shadow-[inset_0_0_0_var(--borderWidth-thin)_var(--control-transparent-borderColor-active)] hover:not-data-active:not-focus-visible:[outline:var(--borderWidth-thin)_solid_transparent] hover:not-data-active:not-focus-visible:-outline-offset-1 active:not-data-active:shadow-[inset_0_0_0_var(--borderWidth-thin)_var(--control-transparent-borderColor-active)] active:not-data-active:[outline:var(--borderWidth-thin)_solid_transparent] active:not-data-active:-outline-offset-1'

const interactiveClassName = cn(
  'hover:bg-[var(--control-transparent-bgColor-hover)] active:bg-[var(--control-transparent-bgColor-active)]',
  hoverBorderClassName,
)

const activeIndicatorClassName =
  "after:pointer-events-none after:absolute after:top-1 after:-left-2 after:h-[calc(100%-8px)] after:w-1 after:rounded-md after:bg-[var(--borderColor-accent-emphasis)] after:content-['']"

// A loading trailing action keeps the label and description at full contrast, over any other state.
const trailingActionLoadingClassName =
  '[--action-list-item-label-fgColor:var(--fgColor-default)] [--action-list-item-description-fgColor:var(--fgColor-default)]'

const actionItemState = cva('', {
  variants: {
    tone: {
      default: cn(defaultColorsClassName, interactiveClassName),
      danger: cn(
        defaultColorsClassName,
        interactiveClassName,
        '[--action-list-item-label-fgColor:var(--control-danger-fgColor-rest)] [--action-list-item-visual-fgColor:var(--control-danger-fgColor-rest)]',
        'hover:bg-[var(--control-danger-bgColor-hover)] hover:[--action-list-item-label-fgColor:var(--control-danger-fgColor-hover)] hover:[--action-list-item-visual-fgColor:var(--control-danger-fgColor-hover)]',
        'active:bg-[var(--control-danger-bgColor-active)] active:[--action-list-item-label-fgColor:var(--control-danger-fgColor-hover)] active:[--action-list-item-visual-fgColor:var(--control-danger-fgColor-hover)]',
      ),
      loading: cn(
        defaultColorsClassName,
        interactiveClassName,
        '[--action-list-item-label-fgColor:var(--fgColor-muted)]',
      ),
      inactive: cn(
        defaultColorsClassName,
        hoverBorderClassName,
        'cursor-not-allowed hover:bg-transparent active:bg-transparent [--action-list-item-fgColor:var(--fgColor-muted)] [--action-list-item-label-fgColor:var(--fgColor-muted)]',
      ),
      disabled:
        'cursor-not-allowed [--action-list-item-fgColor:var(--control-fgColor-disabled)] [--action-list-item-label-fgColor:var(--control-fgColor-disabled)] [--action-list-item-visual-fgColor:var(--control-fgColor-disabled)] [--action-list-item-description-fgColor:var(--control-fgColor-disabled)] [--action-list-item-trailing-fgColor:var(--control-fgColor-disabled)]',
    },
    active: {
      true: cn(
        'bg-[var(--control-transparent-bgColor-selected)] not-focus-visible:[outline:2px_solid_transparent] [&_[data-item-label]]:font-semibold',
        activeIndicatorClassName,
      ),
      false: '',
    },
    highlightable: {
      true: "[&:where([data-highlighted])]:bg-[var(--control-transparent-bgColor-selected)] [&:where([data-highlighted])]:[outline:2px_solid_transparent] [&:where([data-highlighted])]:after:pointer-events-none [&:where([data-highlighted])]:after:absolute [&:where([data-highlighted])]:after:top-1 [&:where([data-highlighted])]:after:-left-2 [&:where([data-highlighted])]:after:h-[calc(100%-8px)] [&:where([data-highlighted])]:after:w-1 [&:where([data-highlighted])]:after:rounded-md [&:where([data-highlighted])]:after:bg-[var(--borderColor-accent-emphasis)] [&:where([data-highlighted])]:after:content-['']",
      false: '',
    },
  },
  compoundVariants: [
    // The current item's label keeps the control color at rest unless a tone mutes it.
    {
      active: true,
      tone: ['default', 'danger'],
      className: '[--action-list-item-label-fgColor:var(--control-fgColor-rest)]',
    },
    // The current item keeps the neutral hover fill, even when it is destructive.
    {active: true, tone: 'danger', className: 'hover:bg-[var(--control-transparent-bgColor-hover)]'},
  ],
})

/**
 * Classes for the element that owns an item's state. A disabled item drops its hover, current, and highlight
 * treatments, so it reads as unavailable whatever else is set.
 */
export function getActionItemStateClassName(options: ActionItemStateOptions) {
  const tone = getActionItemTone(options)
  const enabled = tone !== 'disabled'
  return cn(
    actionItemState({
      tone,
      active: enabled && Boolean(options.active),
      highlightable: enabled && Boolean(options.highlightable),
    }),
    enabled && options.trailingActionLoading && trailingActionLoadingClassName,
  )
}

/** Data attributes that expose an item's state for styling and tests, matching upstream's list item attributes. */
export function getActionItemStateAttributes(options: ActionItemStateOptions) {
  const tone = getActionItemTone(options)
  return {
    'data-active': tone !== 'disabled' && options.active ? true : undefined,
    'data-inactive': options.inactive ? true : undefined,
    'data-is-disabled': options.disabled ? true : undefined,
    'data-loading': options.loading && !options.inactive ? true : undefined,
    'data-variant': options.variant === 'danger' ? 'danger' : undefined,
  } as const
}
