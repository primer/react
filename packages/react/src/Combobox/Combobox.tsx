import {clsx} from 'clsx'
import classes from '../ActionList/ActionList.module.css'
import styles from '../FilteredActionList/FilteredActionList.module.css'
import selectPanelStyles from '../SelectPanel/SelectPanel.module.css'
import React, {useRef} from 'react'
import {MappedActionListItem} from '../FilteredActionList/components/MappedActionListItem'
import {AnchoredOverlay, type AnchoredOverlayProps} from '../AnchoredOverlay'
import TextInput, {type TextInputProps} from '../TextInput'
import styles2 from './Combobox.module.css'
import Heading from '../Heading'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'
import {scrollIntoView} from '@primer/behaviors'
import {useProvidedRefOrCreate} from '../hooks'

type renderAnchor = <T extends Omit<React.HTMLAttributes<HTMLElement>, 'aria-label' | 'aria-labelledby'>>(
  props: T,
) => JSX.Element | null

export type ComboboxRootProps = {
  children?: React.ReactNode
  /** Defines the keyboard navigation mode for the Combobox */
  focusMode?: 'roving' | 'active-descendant'
  /** A function that renders the anchor element for the Combobox */
  renderAnchor?: renderAnchor | null

  anchoredOverlayProps?: Omit<AnchoredOverlayProps, 'open' | 'renderAnchor' | 'onClose' | 'focusZoneSettings'>

  open?: boolean // TODO: DRY fix
  anchorId?: string // TODO: DRY fix
  side?: AnchoredOverlayProps['side'] // TODO: DRY fix
  anchorRef?: React.RefObject<HTMLElement> // TODO: DRY fix
  width?: AnchoredOverlayProps['width'] // TODO: DRY fix
  anchorOffset?: number // TODO: DRY fix
}

export type ComboboxOverlayProps = {
  /** The content of the Combobox */
  children: React.ReactNode
  /** A function that renders the anchor element for the Combobox */
  renderAnchor?: renderAnchor | null
  /** Whether the Combobox is open */
  open?: boolean

  anchoredOverlayProps?: Omit<AnchoredOverlayProps, 'open' | 'renderAnchor' | 'onClose' | 'focusZoneSettings'>
  anchorRef?: React.RefObject<HTMLElement> // todo: adjust
  listboxRef?: React.RefObject<HTMLUListElement> // todo: adjust
}

export const ComboboxContext = React.createContext<{
  isSubmenu?: boolean
  focusMode?: 'roving' | 'active-descendant'
}>({isSubmenu: false, focusMode: 'active-descendant'})

export const ComboboxRoot = ({children, focusMode: _focusMode, ...rest}: ComboboxRootProps) => {
  return (
    <ComboboxContext.Provider value={{isSubmenu: false, focusMode: _focusMode}}>
      <Combobox {...rest}>{children}</Combobox>
    </ComboboxContext.Provider>
  )
}

type ComboboxProps = {
  children?: React.ReactNode
  options?: any[]
} & ComboboxOverlayProps

export const Combobox = ({children, options, ...rest}: ComboboxProps) => {
  const listboxRef = useRef<HTMLUListElement>(null)

  return (
    <ComboboxOverlay {...rest} listboxRef={listboxRef}>
      {children ? (
        children
      ) : (
        <ComboboxList ref={listboxRef}>
          {options?.map(option => <ComboboxOption key={option.id}>{option.label}</ComboboxOption>)}
        </ComboboxList>
      )}
    </ComboboxOverlay>
  )
}

const ComboboxOverlay = ({
  children,
  open,
  renderAnchor,
  anchorRef,
  listboxRef,
  anchoredOverlayProps,
  ...rest
}: ComboboxOverlayProps) => {
  // TODO: Add conditional logic for focusMode prop
  const {focusMode} = React.useContext(ComboboxContext)
  const [comboboxOpen, setComboboxOpen] = React.useState(false)
  const inputTrigger = React.useRef<HTMLInputElement>(null)

  // TODO: Fix type
  const renderComboboxAnchor: any = props => {
    if (renderAnchor === null) {
      return null
    }

    const anchor = renderAnchor ? renderAnchor(props) : undefined
    if (React.isValidElement(anchor)) {
      return anchor
    }

    return (
      <ComboboxInput
        {...props}
        className={clsx(styles2.TextInput)}
        ref={inputTrigger}
        onFocus={() => setComboboxOpen(true)}
      />
    )
  }

  const activeDescendantRef = React.useRef<HTMLElement | null>(null)
  const menuScrollMargins = {startMargin: 0, endMargin: 8}

  const focusZoneSettings =
    focusMode === 'active-descendant' && listboxRef
      ? {
          containerRef: listboxRef,
          bindKeys: FocusKeys.ArrowVertical | FocusKeys.PageUpDown,
          focusOutBehavior: 'wrap',
          focusableElementFilter: (element: HTMLElement) => {
            return !(element instanceof HTMLInputElement) && !element.hasAttribute('aria-hidden')
          },
          activeDescendantFocus: inputTrigger,
          onActiveDescendantChanged: (
            current: HTMLElement | null,
            previous: HTMLElement | null,
            directlyActivated: boolean,
          ) => {
            activeDescendantRef.current = current

            if (current && listboxRef.current && directlyActivated) {
              scrollIntoView(current, listboxRef.current, menuScrollMargins)
            }
          },
          focusInStrategy: 'previous',
        }
      : {
          focusableElementFilter: (element: HTMLElement) => {
            return (
              !element.hasAttribute('aria-hidden') &&
              !(element instanceof HTMLInputElement) &&
              !(element instanceof HTMLButtonElement)
            )
          },
          focusOutBehavior: 'wrap',
        }

  return (
    <AnchoredOverlay
      open={open !== undefined ? open : comboboxOpen}
      onOpen={() => setComboboxOpen(true)}
      renderAnchor={renderComboboxAnchor}
      anchorRef={renderAnchor === null ? anchorRef : inputTrigger}
      // focusTrapSettings={{disabled: focusMode === 'active-descendant' && !renderAnchor ? true : false}}
      width="medium"
      focusZoneSettings={focusZoneSettings}
      onClose={() => {
        if (renderAnchor) setComboboxOpen(false)
      }}
      displayCloseButton={false}
      {...anchoredOverlayProps}
      {...rest}
    >
      {children}
    </AnchoredOverlay>
  )
}

type ComboboxInputProps = {
  className?: string
  placeholder?: string
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  listboxRef?: React.RefObject<HTMLUListElement>
}

export const ComboboxInput = React.forwardRef<TextInputProps, ComboboxInputProps>(function ComboboxInput(
  {className, placeholder = 'Search...', onFocus, value, onChange, listboxRef, ...rest},
  ref,
) {
  const inputRef = useProvidedRefOrCreate(ref as React.RefObject<HTMLInputElement>)

  const activeDescendantRef = React.useRef<HTMLElement>()
  const scrollContainerRef = listboxRef
  const menuScrollMargins = {startMargin: 0, endMargin: 8}

  const {focusMode} = React.useContext(ComboboxContext)

  // We only want to use the focus zone if a external listboxRef is provided and -
  // the focusMode is set to "active-descendant"
  useFocusZone(
    listboxRef && focusMode === 'active-descendant'
      ? {
          containerRef: listboxRef,
          bindKeys: FocusKeys.ArrowVertical | FocusKeys.PageUpDown,
          focusOutBehavior: 'wrap',
          focusableElementFilter: element => {
            return !(element instanceof HTMLInputElement) && !element.hasAttribute('aria-hidden')
          },
          activeDescendantFocus: inputRef,
          onActiveDescendantChanged: (current, previous, directlyActivated) => {
            activeDescendantRef.current = current

            if (current && scrollContainerRef?.current && directlyActivated) {
              scrollIntoView(current, scrollContainerRef.current, menuScrollMargins)
            }
          },
          focusInStrategy: 'previous',
        }
      : undefined,
    [],
  )

  return (
    <TextInput
      type="text"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded="false"
      className={clsx(className, styles2.TextInput)}
      placeholder={placeholder}
      onFocus={onFocus}
      ref={inputRef}
      value={value}
      onChange={onChange}
      {...rest}
    />
  )
})

type ComboboxListProps = {
  className?: string
  children?: React.ReactNode
} & React.ComponentPropsWithoutRef<'ul'>

export const ComboboxList = React.forwardRef<HTMLUListElement, ComboboxListProps>(function ComboboxList(
  {className, children, ...rest},
  ref,
) {
  return (
    <ul role="listbox" ref={ref} className={clsx(classes.ActionList, className)} data-variant="inset" {...rest}>
      {children}
    </ul>
  )
})

type ComboboxOptionProps = {
  className?: string
  children?: React.ReactNode
  selected?: boolean
} & React.ComponentPropsWithoutRef<typeof MappedActionListItem>

export const ComboboxOption = React.forwardRef<HTMLLIElement, ComboboxOptionProps>(function ComboboxOption(
  {className, children = 'Combobox Option', selected, ...rest},
  _ref,
) {
  return (
    <MappedActionListItem
      role="option"
      aria-selected={selected}
      className={clsx(styles.ActionListItem, className)}
      {...rest}
    >
      {children}
    </MappedActionListItem>
  )
})

type ComboboxGroupProps = {
  className?: string
  children: React.ReactNode
  groupLabel?: string
} & React.ComponentPropsWithoutRef<'div'>

export const ComboboxGroup = React.forwardRef<HTMLDivElement, ComboboxGroupProps>(function ComboboxGroup(
  {className, children, groupLabel, ...rest},
  ref,
) {
  return (
    <div ref={ref} className={clsx(classes.ActionListGroup, className)} {...rest}>
      {groupLabel && <div>{groupLabel}</div>}
      {children}
    </div>
  )
})

type ComboboxTitleProps = {
  className?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
}

export const ComboboxTitle = ({className, title, subtitle, ...rest}: ComboboxTitleProps) => {
  return (
    <div className={className} {...rest}>
      {/* TODO: adjust spread/classname */}
      <div className={selectPanelStyles.Header}>
        <div>
          <Heading as="h1" className={selectPanelStyles.Title}>
            {title}
          </Heading>
          {subtitle ? <div className={selectPanelStyles.Subtitle}>{subtitle}</div> : null}
        </div>
      </div>
    </div>
  )
}
