import {cva} from 'class-variance-authority'
import {cn} from '../../internal/cn'

/**
 * Item parts read their colors from custom properties set on the element that owns the item's state: the list item in
 * `ActionList` and `NavList`, and the item itself in menus and listboxes. Every tone sets all of them, so an item never
 * inherits the state of an item it is nested in.
 */
export const actionItemPartClassName = {
  /** Text that is not part of a region, such as custom content. */
  content: 'primer:text-[var(--action-list-item-fgColor,var(--control-fgColor-rest))]',
  label: 'primer:text-[var(--action-list-item-label-fgColor,var(--fgColor-default))]',
  /** Leading visuals and selection indicators. */
  leadingVisual: 'primer:fill-current primer:text-[var(--action-list-item-visual-fgColor,var(--fgColor-muted))]',
  description: 'primer:text-[var(--action-list-item-description-fgColor,var(--fgColor-muted))]',
  trailingVisual: 'primer:fill-current primer:text-[var(--action-list-item-trailing-fgColor,var(--fgColor-muted))]',
} as const

// State colors and backgrounds come from `getActionItemStateClassName` on the element that owns the item's state.
export const actionItemClassName = cn(
  'primer:box-border primer:flex primer:!min-w-0 primer:w-full primer:!justify-start primer:gap-2 primer:appearance-none primer:rounded-md primer:!border-0 primer:bg-transparent primer:px-2 primer:py-1.5 primer:text-left primer:text-sm primer:font-normal primer:![line-height:20px] primer:whitespace-normal primer:no-underline primer:focus-visible:outline-2 primer:focus-visible:outline-offset-0 primer:focus-visible:outline-focus primer:data-[disabled]:cursor-not-allowed primer:items-start',
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

/** Colors for a static, non-interactive item, which has no hover, pressed, or focus treatment. */
export const staticActionItemClassName =
  'primer:[--action-list-item-fgColor:var(--control-fgColor-rest)] primer:[--action-list-item-label-fgColor:var(--fgColor-default)] primer:[--action-list-item-visual-fgColor:var(--fgColor-muted)] primer:[--action-list-item-description-fgColor:var(--fgColor-muted)] primer:[--action-list-item-trailing-fgColor:var(--fgColor-muted)]'

const defaultColorsClassName = staticActionItemClassName

// The thin inset border is transparent except in high contrast themes. The transparent outline marks the state in
// forced colors, where box shadows are not drawn.
const hoverBorderClassName =
  'primer:hover:not-data-active:not-focus-visible:shadow-[inset_0_0_0_var(--borderWidth-thin)_var(--control-transparent-borderColor-active)] primer:hover:not-data-active:not-focus-visible:[outline:var(--borderWidth-thin)_solid_transparent] primer:hover:not-data-active:not-focus-visible:-outline-offset-1 primer:active:not-data-active:shadow-[inset_0_0_0_var(--borderWidth-thin)_var(--control-transparent-borderColor-active)] primer:active:not-data-active:[outline:var(--borderWidth-thin)_solid_transparent] primer:active:not-data-active:-outline-offset-1'

const interactiveClassName = cn(
  'primer:hover:bg-[var(--control-transparent-bgColor-hover)] primer:active:bg-[var(--control-transparent-bgColor-active)]',
  hoverBorderClassName,
)

const activeIndicatorClassName =
  "primer:after:pointer-events-none primer:after:absolute primer:after:top-1 primer:after:-left-2 primer:after:h-[calc(100%-8px)] primer:after:w-1 primer:after:rounded-md primer:after:bg-[var(--borderColor-accent-emphasis)] primer:after:content-['']"

// A loading trailing action keeps the label and description at full contrast, over any other state.
const trailingActionLoadingClassName =
  'primer:[--action-list-item-label-fgColor:var(--fgColor-default)] primer:[--action-list-item-description-fgColor:var(--fgColor-default)]'

const actionItemState = cva('', {
  variants: {
    tone: {
      default: cn(defaultColorsClassName, interactiveClassName),
      danger: cn(
        defaultColorsClassName,
        interactiveClassName,
        'primer:[--action-list-item-label-fgColor:var(--control-danger-fgColor-rest)] primer:[--action-list-item-visual-fgColor:var(--control-danger-fgColor-rest)]',
        'primer:hover:bg-[var(--control-danger-bgColor-hover)] primer:hover:[--action-list-item-label-fgColor:var(--control-danger-fgColor-hover)] primer:hover:[--action-list-item-visual-fgColor:var(--control-danger-fgColor-hover)]',
        'primer:active:bg-[var(--control-danger-bgColor-active)] primer:active:[--action-list-item-label-fgColor:var(--control-danger-fgColor-hover)] primer:active:[--action-list-item-visual-fgColor:var(--control-danger-fgColor-hover)]',
      ),
      loading: cn(
        defaultColorsClassName,
        interactiveClassName,
        'primer:[--action-list-item-label-fgColor:var(--fgColor-muted)]',
      ),
      inactive: cn(
        defaultColorsClassName,
        hoverBorderClassName,
        'primer:cursor-not-allowed primer:hover:bg-transparent primer:active:bg-transparent primer:[--action-list-item-fgColor:var(--fgColor-muted)] primer:[--action-list-item-label-fgColor:var(--fgColor-muted)]',
      ),
      disabled:
        'primer:cursor-not-allowed primer:[--action-list-item-fgColor:var(--control-fgColor-disabled)] primer:[--action-list-item-label-fgColor:var(--control-fgColor-disabled)] primer:[--action-list-item-visual-fgColor:var(--control-fgColor-disabled)] primer:[--action-list-item-description-fgColor:var(--control-fgColor-disabled)] primer:[--action-list-item-trailing-fgColor:var(--control-fgColor-disabled)]',
    },
    active: {
      true: cn(
        'primer:bg-[var(--control-transparent-bgColor-selected)] primer:not-focus-visible:[outline:2px_solid_transparent] primer:[&_[data-item-label]]:font-semibold',
        activeIndicatorClassName,
      ),
      false: '',
    },
    highlightable: {
      true: "primer:[&:where([data-highlighted])]:bg-[var(--control-transparent-bgColor-selected)] primer:[&:where([data-highlighted])]:[outline:2px_solid_transparent] primer:[&:where([data-highlighted])]:after:pointer-events-none primer:[&:where([data-highlighted])]:after:absolute primer:[&:where([data-highlighted])]:after:top-1 primer:[&:where([data-highlighted])]:after:-left-2 primer:[&:where([data-highlighted])]:after:h-[calc(100%-8px)] primer:[&:where([data-highlighted])]:after:w-1 primer:[&:where([data-highlighted])]:after:rounded-md primer:[&:where([data-highlighted])]:after:bg-[var(--borderColor-accent-emphasis)] primer:[&:where([data-highlighted])]:after:content-['']",
      false: '',
    },
  },
  compoundVariants: [
    // The current item's label keeps the control color at rest unless a tone mutes it.
    {
      active: true,
      tone: ['default', 'danger'],
      className: 'primer:[--action-list-item-label-fgColor:var(--control-fgColor-rest)]',
    },
    // The current item keeps the neutral hover fill, even when it is destructive.
    {active: true, tone: 'danger', className: 'primer:hover:bg-[var(--control-transparent-bgColor-hover)]'},
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
