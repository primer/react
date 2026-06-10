import type React from 'react'
import {createContext, useContext, useMemo} from 'react'
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

// --- Root ---

interface RootProps extends UseSelectPanelOptions {
  children: React.ReactNode
}

function Root({children, ...options}: RootProps) {
  const foundation = useSelectPanel(options)
  const ctx = useMemo(() => ({foundation}), [foundation])

  return <SelectPanelFoundationContext.Provider value={ctx}>{children}</SelectPanelFoundationContext.Provider>
}

// --- Anchor ---

function Anchor({children, className, ...props}: React.ComponentProps<'button'>) {
  const {foundation} = useSelectPanelFoundationContext()
  const {ref: anchorRef, ...anchorProps} = foundation.getAnchorProps()

  return (
    <button
      type="button"
      {...anchorProps}
      ref={anchorRef as React.Ref<HTMLButtonElement>}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}

// --- Overlay (renders only while open) ---

function Overlay({children, className, ...props}: React.ComponentProps<'div'>) {
  const {foundation} = useSelectPanelFoundationContext()
  const {ref: overlayRef, ...overlayProps} = foundation.getOverlayProps()

  if (!foundation.isOpen) return null

  return (
    <div {...overlayProps} ref={overlayRef as React.Ref<HTMLDivElement>} className={className} {...props}>
      {children}
    </div>
  )
}

// --- Title ---

function Title({children, className, ...props}: React.ComponentProps<'h2'>) {
  const {foundation} = useSelectPanelFoundationContext()
  const titleProps = foundation.getTitleProps()
  return (
    <h2 {...titleProps} className={className} {...props}>
      {children}
    </h2>
  )
}

// --- Input ---

function Input({className, onKeyDown, ...props}: React.ComponentProps<'input'>) {
  const {foundation} = useSelectPanelFoundationContext()
  const inputProps = foundation.getInputProps()
  return (
    <input
      {...inputProps}
      onKeyDown={event => {
        onKeyDown?.(event)
        if (!event.defaultPrevented) inputProps.onKeyDown(event)
      }}
      className={className}
      {...props}
    />
  )
}

// --- List ---

interface ListProps extends React.ComponentProps<'ul'> {
  multiselectable?: boolean
}

function List({multiselectable, children, className, ...props}: ListProps) {
  const {foundation} = useSelectPanelFoundationContext()
  const listProps = foundation.getListProps({multiselectable})
  return (
    <ul {...listProps} className={className} {...props}>
      {children}
    </ul>
  )
}

// --- Option ---

interface OptionComponentProps extends Omit<React.ComponentProps<'li'>, 'id'>, OptionDescriptor {}

function Option({id, selected, disabled, children, className, ...props}: OptionComponentProps) {
  const {foundation} = useSelectPanelFoundationContext()
  const optionProps = foundation.getOptionProps({id, selected, disabled})
  return (
    <li {...optionProps} className={className} {...props}>
      {children}
    </li>
  )
}

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
