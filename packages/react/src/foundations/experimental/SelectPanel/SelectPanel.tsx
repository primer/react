import type React from 'react'
import {createContext, forwardRef, useContext, useMemo, type JSX} from 'react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../../../utils/polymorphic'
import {useMergedRefs} from '../../../hooks/useMergedRefs'
import {
  useSelectPanel,
  type UseSelectPanelOptions,
  type UseSelectPanelReturn,
  type OptionDescriptor,
} from './useSelectPanel'

// --- Context (internal only) ---

interface SelectPanelFoundationContextValue {
  foundation: UseSelectPanelReturn
}

const SelectPanelFoundationContext = createContext<SelectPanelFoundationContextValue | null>(null)

function useSelectPanelFoundationContext(): SelectPanelFoundationContextValue {
  const ctx = useContext(SelectPanelFoundationContext)
  if (!ctx) {
    throw new Error('SelectPanel foundation components must be used within <SelectPanel.Root>')
  }
  return ctx
}

/**
 * Read the single `useSelectPanel` instance from the nearest foundation `<Root>`.
 *
 * This is the seam that lets a styled layer **wrap** the foundation rather than
 * stand up its own behaviour instance: the styled `Root` renders the foundation
 * `Root`, and styled parts reuse the same hook via this accessor.
 */
export function useSelectPanelFoundation(): UseSelectPanelReturn {
  return useSelectPanelFoundationContext().foundation
}

// --- Root ---

interface RootProps extends UseSelectPanelOptions {
  children: React.ReactNode
}

function Root({children, ...options}: RootProps) {
  const foundation = useSelectPanel(options)
  const ctx = useMemo(() => ({foundation}), [foundation])

  return <SelectPanelFoundationContext.Provider value={ctx}>{children}</SelectPanelFoundationContext.Provider>
}

// --- Anchor (polymorphic; default `button`) ---

const Anchor = forwardRef(({as, children, ...props}, forwardedRef): JSX.Element => {
  const Component: React.ElementType = as ?? 'button'
  const {foundation} = useSelectPanelFoundationContext()
  const {ref: foundationRef, ...anchorProps} = foundation.getAnchorProps()
  const ref = useMergedRefs(foundationRef as React.Ref<HTMLElement>, forwardedRef as React.Ref<HTMLElement>)

  // `as` can swap the element at runtime (e.g. Primer's Button), so default the
  // intrinsic trigger to type="button". The impl-local type can't see the swap,
  // hence the disable — when rendered `as` another component it owns its type.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const intrinsicButtonProps = Component === 'button' ? {type: 'button' as const} : {}

  return (
    <Component {...intrinsicButtonProps} {...anchorProps} {...props} ref={ref}>
      {children}
    </Component>
  )
}) as PolymorphicForwardRefComponent<'button'>

// --- Overlay (renders only while open) ---

const Overlay = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(function Overlay(
  {children, ...props},
  forwardedRef,
) {
  const {foundation} = useSelectPanelFoundationContext()
  const {ref: foundationRef, ...overlayProps} = foundation.getOverlayProps()
  const ref = useMergedRefs(foundationRef as React.Ref<HTMLDivElement>, forwardedRef)

  if (!foundation.isOpen) return null

  return (
    <div {...overlayProps} {...props} ref={ref}>
      {children}
    </div>
  )
})

// --- Title ---

const Title = forwardRef<HTMLHeadingElement, React.ComponentProps<'h2'>>(function Title({children, ...props}, ref) {
  const {foundation} = useSelectPanelFoundationContext()
  const titleProps = foundation.getTitleProps()
  return (
    <h2 {...titleProps} {...props} ref={ref}>
      {children}
    </h2>
  )
})

// --- Input (polymorphic; default `input`) ---

const Input = forwardRef(({as: Component = 'input', onKeyDown, ...props}, forwardedRef): JSX.Element => {
  const {foundation} = useSelectPanelFoundationContext()
  const inputProps = foundation.getInputProps()
  return (
    <Component
      {...inputProps}
      {...props}
      ref={forwardedRef}
      onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event)
        if (!event.defaultPrevented) inputProps.onKeyDown(event)
      }}
    />
  )
}) as PolymorphicForwardRefComponent<'input'>

// --- List ---

interface ListOwnProps {
  multiselectable?: boolean
}

const List = forwardRef<HTMLUListElement, React.ComponentProps<'ul'> & ListOwnProps>(function List(
  {multiselectable, children, ...props},
  ref,
) {
  const {foundation} = useSelectPanelFoundationContext()
  const listProps = foundation.getListProps({multiselectable})
  return (
    <ul {...listProps} {...props} ref={ref}>
      {children}
    </ul>
  )
})

// --- Option ---

interface OptionComponentProps extends Omit<React.ComponentProps<'li'>, 'id'>, OptionDescriptor {}

const Option = forwardRef<HTMLLIElement, OptionComponentProps>(function Option(
  {id, selected, disabled, children, ...props},
  ref,
) {
  const {foundation} = useSelectPanelFoundationContext()
  const optionProps = foundation.getOptionProps({id, selected, disabled})
  return (
    <li {...optionProps} {...props} ref={ref}>
      {children}
    </li>
  )
})

// --- Compose ---

export const SelectPanel = Object.assign(Root, {
  Root,
  Anchor,
  Overlay,
  Title,
  Input,
  List,
  Option,
})

export type {RootProps as SelectPanelRootProps}
