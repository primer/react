import React, {createContext, useContext, useMemo, useRef} from 'react'
import {clsx} from 'clsx'
import type {AnchorAlignment, AnchorSide} from '@primer/behaviors'
import {CheckIcon, SearchIcon} from '@primer/octicons-react'
import {
  SelectPanel as Foundation,
  useSelectPanelFoundation,
  type UseSelectPanelOptions,
} from '../../foundations/experimental/SelectPanel'
import {useAnchoredPosition} from '../../hooks/useAnchoredPosition'
import {useMergedRefs} from '../../hooks/useMergedRefs'
import {Button} from '../../Button'
import TextInput from '../../TextInput'
import type {SelectionVariant} from '../../hooks/experimental/useSelectionState'

import classes from './SelectPanel.module.css'

// --- Context (styling concerns only; behaviour lives in the foundation) ---

interface SelectPanelContextValue {
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

/**
 * The styled Root **wraps** the unstyled foundation Root, so there is a single
 * `useSelectPanel` instance shared by every styled part below. The styled parts
 * wrap their foundation counterparts (via `as`) rather than re-binding the hook.
 */
const Root = React.forwardRef<HTMLDivElement, SelectPanelRootProps>(function SelectPanelRoot(
  {selectionVariant = 'single', children, className, ...options},
  forwardedRef,
) {
  const anchorRef = useRef<HTMLButtonElement | null>(null)
  const ctx = useMemo(() => ({selectionVariant, anchorRef}), [selectionVariant])

  return (
    <Foundation.Root {...options}>
      <SelectPanelContext.Provider value={ctx}>
        <div ref={forwardedRef} className={clsx(className, classes.Root)} data-component="SelectPanel">
          {children}
        </div>
      </SelectPanelContext.Provider>
    </Foundation.Root>
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
  const {anchorRef} = useSelectPanelContext()
  const ref = useMergedRefs(anchorRef, forwardedRef)

  return (
    <Foundation.Anchor as={Button} ref={ref} className={className} data-component="SelectPanel.Anchor">
      {children}
    </Foundation.Anchor>
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
  const {anchorRef} = useSelectPanelContext()
  const foundation = useSelectPanelFoundation()
  const floatingRef = useRef<HTMLDivElement | null>(null)

  const {position} = useAnchoredPosition({anchorElementRef: anchorRef, floatingElementRef: floatingRef, side, align}, [
    foundation.isOpen,
    side,
    align,
  ])

  return (
    <Foundation.Overlay
      ref={floatingRef}
      className={clsx(className, classes.Overlay)}
      data-component="SelectPanel.Overlay"
      data-width={width}
      style={{...style, top: position?.top ?? 0, left: position?.left ?? 0}}
      {...props}
    >
      {children}
    </Foundation.Overlay>
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
  return <Foundation.Title className={clsx(className, classes.Title)} data-component="SelectPanel.Title" {...props} />
}
Title.displayName = 'SelectPanel.Title'

// --- SelectPanel.Input (shared search) ---

type SelectPanelInputProps = Omit<React.ComponentProps<typeof TextInput>, 'role' | 'as'>

const Input = React.forwardRef<HTMLInputElement, SelectPanelInputProps>(function SelectPanelInput(
  {className, onKeyDown, ...props},
  forwardedRef,
) {
  return (
    <Foundation.Input
      leadingVisual={SearchIcon}
      {...props}
      as={TextInput}
      ref={forwardedRef}
      onKeyDown={onKeyDown}
      className={clsx(className, classes.Input)}
      data-component="SelectPanel.Input"
    />
  )
})
Input.displayName = 'SelectPanel.Input'

// --- SelectPanel.List ---

function List({className, ...props}: React.ComponentProps<'ul'>) {
  const {selectionVariant} = useSelectPanelContext()
  return (
    <Foundation.List
      multiselectable={selectionVariant === 'multiple'}
      className={clsx(className, classes.List)}
      data-component="SelectPanel.List"
      {...props}
    />
  )
}
List.displayName = 'SelectPanel.List'

// --- SelectPanel.Option ---

interface SelectPanelOptionProps extends Omit<React.ComponentProps<'li'>, 'id'> {
  id: string
  selected?: boolean
  disabled?: boolean
}

function Option({id, selected, disabled, className, children, ...props}: SelectPanelOptionProps) {
  return (
    <Foundation.Option
      id={id}
      selected={selected}
      disabled={disabled}
      className={clsx(className, classes.Option)}
      data-component="SelectPanel.Option"
      {...props}
    >
      <span>{children}</span>
      <CheckIcon className={classes.OptionCheck} aria-hidden />
    </Foundation.Option>
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
