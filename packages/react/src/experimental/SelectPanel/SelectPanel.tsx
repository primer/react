import React, {createContext, useContext, useMemo, useRef} from 'react'
import {clsx} from 'clsx'
import type {AnchorAlignment, AnchorSide} from '@primer/behaviors'
import {CheckIcon, SearchIcon} from '@primer/octicons-react'
import {
  useSelectPanel,
  type UseSelectPanelOptions,
  type UseSelectPanelReturn,
} from '../../foundations/experimental/SelectPanel'
import {useAnchoredPosition} from '../../hooks/useAnchoredPosition'
import {Button} from '../../Button'
import TextInput from '../../TextInput'
import type {SelectionVariant} from '../../hooks/experimental/useSelectionState'

import classes from './SelectPanel.module.css'

// --- Context (internal only) ---

interface SelectPanelContextValue {
  foundation: UseSelectPanelReturn
  selectionVariant: SelectionVariant
  anchorRef: React.MutableRefObject<HTMLButtonElement | null>
}

const SelectPanelContext = createContext<SelectPanelContextValue | null>(null)

function useSelectPanelContext(): SelectPanelContextValue {
  const ctx = useContext(SelectPanelContext)
  if (!ctx) {
    throw new Error('SelectPanel compound components must be used within <SelectPanel.Root>')
  }
  return ctx
}

// --- SelectPanel.Root ---

interface SelectPanelRootProps extends UseSelectPanelOptions {
  /** @default 'single' */
  selectionVariant?: SelectionVariant
  children: React.ReactNode
  className?: string
}

const Root = React.forwardRef<HTMLDivElement, SelectPanelRootProps>(function SelectPanelRoot(
  {selectionVariant = 'single', children, className, ...options},
  forwardedRef,
) {
  const foundation = useSelectPanel(options)
  const anchorRef = useRef<HTMLButtonElement | null>(null)
  const ctx = useMemo(() => ({foundation, selectionVariant, anchorRef}), [foundation, selectionVariant])

  return (
    <SelectPanelContext.Provider value={ctx}>
      <div ref={forwardedRef} className={clsx(className, classes.Root)} data-component="SelectPanel">
        {children}
      </div>
    </SelectPanelContext.Provider>
  )
})

// --- SelectPanel.Anchor ---

interface SelectPanelAnchorProps {
  children: React.ReactNode
  className?: string
}

const Anchor = React.forwardRef<HTMLButtonElement, SelectPanelAnchorProps>(function SelectPanelAnchor(
  {children, className},
  forwardedRef,
) {
  const {foundation, anchorRef} = useSelectPanelContext()
  const anchorProps = foundation.getAnchorProps()

  const mergedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      anchorProps.ref(node)
      anchorRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    [anchorProps, anchorRef, forwardedRef],
  )

  return (
    <Button
      ref={mergedRef}
      aria-haspopup={anchorProps['aria-haspopup']}
      aria-expanded={anchorProps['aria-expanded']}
      aria-controls={anchorProps['aria-controls']}
      onClick={anchorProps.onClick}
      className={className}
      data-component="SelectPanel.Anchor"
    >
      {children}
    </Button>
  )
})

// --- SelectPanel.Overlay ---

interface SelectPanelOverlayProps extends React.ComponentProps<'div'> {
  width?: 'small' | 'medium' | 'large'
  /** Which side of the anchor the overlay opens against. @default 'outside-bottom' */
  side?: AnchorSide
  /** How the overlay aligns to the anchor. @default 'start' */
  align?: AnchorAlignment
}

function Overlay({
  width = 'medium',
  side = 'outside-bottom',
  align = 'start',
  className,
  style,
  children,
  ...props
}: SelectPanelOverlayProps) {
  const {foundation, anchorRef} = useSelectPanelContext()
  const {ref: foundationOverlayRef, ...overlayProps} = foundation.getOverlayProps()
  const floatingRef = useRef<HTMLDivElement | null>(null)

  const {position} = useAnchoredPosition({anchorElementRef: anchorRef, floatingElementRef: floatingRef, side, align}, [
    foundation.isOpen,
    side,
    align,
  ])

  const mergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      floatingRef.current = node
      foundationOverlayRef(node)
    },
    [foundationOverlayRef],
  )

  if (!foundation.isOpen) return null

  return (
    <div
      {...overlayProps}
      ref={mergedRef}
      className={clsx(className, classes.Overlay)}
      data-component="SelectPanel.Overlay"
      data-width={width}
      style={{...style, top: position?.top ?? 0, left: position?.left ?? 0}}
      {...props}
    >
      {children}
    </div>
  )
}
Overlay.displayName = 'SelectPanel.Overlay'

// --- SelectPanel.Header ---

function Header({className, ...props}: React.ComponentProps<'div'>) {
  return <div className={clsx(className, classes.Header)} data-component="SelectPanel.Header" {...props} />
}
Header.displayName = 'SelectPanel.Header'

// --- SelectPanel.Title ---

function Title({className, ...props}: React.ComponentProps<'h2'>) {
  const {foundation} = useSelectPanelContext()
  const titleProps = foundation.getTitleProps()
  return <h2 {...titleProps} className={clsx(className, classes.Title)} data-component="SelectPanel.Title" {...props} />
}
Title.displayName = 'SelectPanel.Title'

// --- SelectPanel.Input (shared search) ---

type SelectPanelInputProps = Omit<React.ComponentProps<typeof TextInput>, 'role'>

function Input({className, onKeyDown, ...props}: SelectPanelInputProps) {
  const {foundation} = useSelectPanelContext()
  const inputProps = foundation.getInputProps()
  return (
    <TextInput
      leadingVisual={SearchIcon}
      {...inputProps}
      onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event)
        if (!event.defaultPrevented) inputProps.onKeyDown(event)
      }}
      className={clsx(className, classes.Input)}
      data-component="SelectPanel.Input"
      {...props}
    />
  )
}
Input.displayName = 'SelectPanel.Input'

// --- SelectPanel.List ---

function List({className, ...props}: React.ComponentProps<'ul'>) {
  const {foundation, selectionVariant} = useSelectPanelContext()
  const listProps = foundation.getListProps({multiselectable: selectionVariant === 'multiple'})
  return <ul {...listProps} className={clsx(className, classes.List)} data-component="SelectPanel.List" {...props} />
}
List.displayName = 'SelectPanel.List'

// --- SelectPanel.Option ---

interface SelectPanelOptionProps extends Omit<React.ComponentProps<'li'>, 'id'> {
  id: string
  selected?: boolean
  disabled?: boolean
}

function Option({id, selected, disabled, className, children, ...props}: SelectPanelOptionProps) {
  const {foundation} = useSelectPanelContext()
  const optionProps = foundation.getOptionProps({id, selected, disabled})
  return (
    <li {...optionProps} className={clsx(className, classes.Option)} data-component="SelectPanel.Option" {...props}>
      <span>{children}</span>
      <CheckIcon className={classes.OptionCheck} aria-hidden />
    </li>
  )
}
Option.displayName = 'SelectPanel.Option'

// --- SelectPanel.Empty ---

function Empty({className, ...props}: React.ComponentProps<'div'>) {
  return <div className={clsx(className, classes.Empty)} data-component="SelectPanel.Empty" {...props} />
}
Empty.displayName = 'SelectPanel.Empty'

// --- SelectPanel.Footer ---

function Footer({className, ...props}: React.ComponentProps<'div'>) {
  return <div className={clsx(className, classes.Footer)} data-component="SelectPanel.Footer" {...props} />
}
Footer.displayName = 'SelectPanel.Footer'

// --- Compose ---

export const SelectPanelParts = Object.assign(Root, {
  Root,
  Anchor,
  Overlay,
  Header,
  Title,
  Input,
  List,
  Option,
  Empty,
  Footer,
})

export type {SelectPanelRootProps, SelectPanelOverlayProps}
