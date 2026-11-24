import React from 'react'
import {clsx} from 'clsx'
import {SearchIcon} from '@primer/octicons-react'
import {ActionList, type ActionListItemProps, type ActionListGroupProps} from '../ActionList'
import {Button, type ButtonProps} from '../Button'
import {useId} from '../hooks/useId'
import {useFormControlForwardedProps} from '../FormControl/_FormControlContext'
import Heading from '../Heading'
import TextInput, {type TextInputProps} from '../TextInput'
import {useMergedRefs} from '../hooks/useMergedRefs'
import {getListboxOptions, isListboxInputAvailable, useListboxFocus} from '../internal/hooks/useListboxFocus'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {
  ParentPanelContext,
  SelectPanelContext,
  SelectPanelDialogContext,
  SelectPanelSelectionContext,
  useSelectPanelContext,
  useSelectPanelSelection,
} from './SelectPanelContext'
import {useSelectPanel, type SelectPanelStateOptions, type SelectPanelValue} from './useSelectPanel'
import classes from './SelectPanel.module.css'

export {SelectPanelOverlay, type SelectPanelOverlayProps} from './SelectPanelOverlay'

export interface SelectPanelRootProps extends Omit<SelectPanelStateOptions, 'isItemEqual' | 'isItemDisabled'> {
  children?: React.ReactNode
}

export const SelectPanelRoot: React.FC<SelectPanelRootProps> = ({children, ...options}) => {
  const parent = React.useContext(SelectPanelContext)
  const state = useSelectPanel(options)
  return (
    <ParentPanelContext.Provider value={parent}>
      <SelectPanelContext.Provider value={state}>
        <SelectPanelSelectionContext.Provider value={state}>
          <SelectPanelDialogContext.Provider value={false}>{children}</SelectPanelDialogContext.Provider>
        </SelectPanelSelectionContext.Provider>
      </SelectPanelContext.Provider>
    </ParentPanelContext.Provider>
  )
}

interface SelectPanelTriggerRenderProps extends ButtonProps {
  ref: React.Ref<HTMLButtonElement>
}

export interface SelectPanelTriggerProps extends ButtonProps {
  render?: (props: SelectPanelTriggerRenderProps) => React.ReactElement
}

export const SelectPanelTrigger = React.forwardRef<HTMLButtonElement, SelectPanelTriggerProps>(
  function SelectPanelTrigger({render, onClick, onKeyDown, ...props}, forwardedRef) {
    const {open, requestOpenChange, dismiss, anchorRef, panelId} = useSelectPanelContext()
    const formControlProps = useFormControlForwardedProps(props)
    const setAnchor = React.useCallback(
      (element: HTMLButtonElement | null) => {
        anchorRef.current = element
      },
      [anchorRef],
    )
    const ref = useMergedRefs(forwardedRef, setAnchor)
    const triggerProps: SelectPanelTriggerRenderProps = {
      ...props,
      id: formControlProps.id,
      disabled: formControlProps.disabled,
      'aria-describedby': formControlProps['aria-describedby'],
      ref,
      type: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': open,
      'aria-controls': open ? panelId : undefined,
      onClick: event => {
        if (formControlProps.disabled) {
          event.preventDefault()
          return
        }
        onClick?.(event)
        if (!event.defaultPrevented) {
          if (open) dismiss('anchor-click')
          else requestOpenChange(true, 'anchor-click')
        }
      },
      onKeyDown: event => {
        if (formControlProps.disabled) {
          event.preventDefault()
          return
        }
        onKeyDown?.(event)
        if (!event.defaultPrevented && !open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
          event.preventDefault()
          requestOpenChange(true, 'anchor-key-press')
        }
      },
    }
    return render ? render(triggerProps) : <Button {...triggerProps} />
  },
)

export const SelectPanelContent = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<'div'>>(
  function SelectPanelContent({className, ...props}, ref) {
    return (
      <div
        {...props}
        data-component="SelectPanel.Content"
        className={clsx(classes.Wrapper, className)}
        ref={ref as React.Ref<HTMLDivElement>}
      />
    )
  },
)

export const SelectPanelHeader = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<'div'>>(
  function SelectPanelHeader({className, ...props}, ref) {
    return (
      <div
        {...props}
        data-component="SelectPanel.Header"
        className={clsx(classes.Header, className)}
        ref={ref as React.Ref<HTMLDivElement>}
      />
    )
  },
)

export const SelectPanelTitle = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<typeof Heading>>(
  function SelectPanelTitle({id: suppliedId, className, as, ...props}, ref) {
    const {titleId, setLabelledBy} = useSelectPanelContext()
    const inDialog = React.useContext(SelectPanelDialogContext)
    const id = suppliedId ?? titleId
    const registerTitle = React.useCallback(
      (node: HTMLElement | null) => setLabelledBy(node ? id : undefined),
      [id, setLabelledBy],
    )
    const mergedRef = useMergedRefs(ref, registerTitle)
    return (
      <Heading
        {...props}
        as={as ?? (inDialog ? 'h1' : 'h2')}
        id={id}
        className={clsx(classes.Title, className)}
        ref={mergedRef}
      />
    )
  },
)

export const SelectPanelDescription = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<'div'>>(
  function SelectPanelDescription({id: suppliedId, className, ...props}, ref) {
    const {descriptionId, setDescribedBy} = useSelectPanelContext()
    const id = suppliedId ?? descriptionId
    const registerDescription = React.useCallback(
      (node: HTMLElement | null) => setDescribedBy(node ? id : undefined),
      [id, setDescribedBy],
    )
    const mergedRef = useMergedRefs(ref, registerDescription)
    return (
      <div
        {...props}
        data-component="SelectPanel.Description"
        id={id}
        className={clsx(classes.Subtitle, className)}
        ref={mergedRef as React.Ref<HTMLDivElement>}
      />
    )
  },
)

export type SelectPanelSearchInputProps = Omit<TextInputProps, 'value' | 'defaultValue'>

export const SelectPanelSearchInput = React.forwardRef<HTMLInputElement, SelectPanelSearchInputProps>(
  function SelectPanelSearchInput(
    {onChange, onKeyDown, className, placeholder = 'Filter items', ...props},
    forwardedRef,
  ) {
    const state = useSelectPanelContext()
    const ref = useMergedRefs(forwardedRef, state.registerInput)
    const activeDescendant = state.focusStrategy === 'active-descendant'
    return (
      <TextInput
        block
        contrast
        leadingVisual={SearchIcon}
        placeholder={placeholder}
        aria-label={placeholder}
        {...props}
        ref={ref}
        className={clsx(classes.TextInput, classes.SearchInput, className)}
        aria-controls={state.collectionElement?.id}
        {...(activeDescendant
          ? {role: 'combobox', 'aria-expanded': Boolean(state.collectionElement), 'aria-autocomplete': 'list' as const}
          : {})}
        value={state.filterValue}
        onChange={event => {
          onChange?.(event)
          if (!event.defaultPrevented) state.setFilterValue(event.target.value, event)
        }}
        onKeyDown={event => {
          onKeyDown?.(event)
          if (event.defaultPrevented || event.nativeEvent.isComposing) return
          if (activeDescendant) {
            state.collectionKeyDownRef.current?.(event)
            if (event.key === 'Enter') event.preventDefault()
            return
          }
          if (event.key === 'ArrowDown' && !event.altKey && !event.ctrlKey && !event.metaKey) {
            const first = state.collectionElement && getListboxOptions(state.collectionElement)[0]
            if (first) {
              event.preventDefault()
              first.focus()
            }
          } else if (event.key === 'Enter') {
            event.preventDefault()
          }
        }}
      />
    )
  },
)

export const SelectPanelList = React.forwardRef<HTMLUListElement, React.ComponentPropsWithoutRef<'ul'>>(
  function SelectPanelList({className, ...props}, forwardedRef) {
    const state = useSelectPanelContext()
    const scrollRef = React.useRef<HTMLUListElement>(null)
    const {setCollectionKeyDown} = state
    const ref = useMergedRefs(forwardedRef, useMergedRefs(scrollRef, state.setCollectionElement))
    const input = state.focusStrategy === 'active-descendant' ? state.inputElement : null
    const onNavigationKeyDown = useListboxFocus({
      container: state.collectionElement,
      input,
      scrollContainerRef: scrollRef,
      fallbackFocusRef: state.inputRef,
    })
    useLayoutEffect(() => {
      setCollectionKeyDown(onNavigationKeyDown)
      return () => {
        setCollectionKeyDown(undefined)
      }
    }, [setCollectionKeyDown, onNavigationKeyDown])
    return (
      <ActionList
        {...props}
        ref={ref}
        id={props.id ?? state.listId}
        role="listbox"
        disableFocusZone
        selectionVariant={state.selectionMode}
        aria-multiselectable={state.selectionMode === 'multiple' ? true : undefined}
        aria-labelledby={props['aria-label'] ? undefined : (props['aria-labelledby'] ?? state.labelledBy)}
        className={clsx(classes.List, className)}
        onMouseDown={event => {
          props.onMouseDown?.(event)
          if (isListboxInputAvailable(input) && !event.defaultPrevented && event.target instanceof Element) {
            const option = event.target.closest('[role="option"]')
            if (option?.closest('[role="listbox"]') === event.currentTarget) {
              event.preventDefault()
              input.focus()
            }
          }
        }}
        onKeyDown={event => {
          props.onKeyDown?.(event)
          onNavigationKeyDown(event)
        }}
      />
    )
  },
)

export type SelectPanelItemProps = Omit<ActionListItemProps, 'selected' | 'value'> & {
  value: SelectPanelValue
}

export const SelectPanelItem = React.forwardRef<HTMLLIElement, SelectPanelItemProps>(function SelectPanelItem(
  {value, ...props},
  ref,
) {
  const {isSelected, selectItem} = useSelectPanelSelection()
  return (
    <SelectPanelItemBase
      {...props}
      ref={ref}
      selectionValue={value}
      selected={isSelected(value)}
      onSelectItem={() => selectItem(value)}
    />
  )
})

interface SelectPanelItemBaseProps extends ActionListItemProps {
  selectionValue?: SelectPanelValue
  onSelectItem?: () => void
}

export const SelectPanelItemBase = React.forwardRef<HTMLLIElement, SelectPanelItemBaseProps>(
  function SelectPanelItemBase(
    {
      selectionValue,
      selected,
      onSelectItem,
      children,
      onSelect,
      onClick,
      onKeyDown,
      onKeyPress,
      disabled: suppliedDisabled,
      ...props
    },
    forwardedRef,
  ) {
    const itemId = useId(props.id)
    const disabled = Boolean(suppliedDisabled || props['aria-disabled'] === true || props['aria-disabled'] === 'true')
    const unavailable = disabled || props.loading || Boolean(props.inactiveText)
    const select = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
      if (
        unavailable ||
        event.defaultPrevented ||
        !(event.target instanceof Node) ||
        !event.currentTarget.contains(event.target)
      ) {
        return
      }
      onSelect?.(event)
      if (!event.isDefaultPrevented()) onSelectItem?.()
    }
    return (
      <ActionList.Item
        {...props}
        ref={forwardedRef}
        id={itemId}
        role="option"
        {...(selectionValue !== undefined ? {'data-id': selectionValue} : {})}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        {...(disabled ? {tabIndex: -1} : {})}
        selected={selected}
        aria-selected={selected}
        onClick={event => {
          if (unavailable) return
          onClick?.(event)
          select(event)
        }}
        onKeyDown={event => {
          if (unavailable) return
          onKeyDown?.(event)
          if (event.defaultPrevented) return
          if (event.target !== event.currentTarget) return
          if (event.key === 'Enter' || event.key === ' ') {
            if (!event.repeat) select(event)
            event.preventDefault()
          }
        }}
        onKeyPress={event => {
          if (unavailable) return
          onKeyPress?.(event)
          if (event.defaultPrevented) return
          // Configured comboboxes forward activation to the active option as a keypress.
          if (event.key === 'Enter' || event.key === ' ') {
            select(event)
            event.preventDefault()
          }
        }}
      >
        {children}
      </ActionList.Item>
    )
  },
)

export const SelectPanelGroup: React.FC<ActionListGroupProps & {label: string}> = ({label, children, ...props}) => (
  <ActionList.Group {...props}>
    <ActionList.GroupHeading>{label}</ActionList.GroupHeading>
    {children}
  </ActionList.Group>
)

export const SelectPanelFooter = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<'div'>>(
  function SelectPanelFooter({className, ...props}, ref) {
    return (
      <div
        {...props}
        data-component="SelectPanel.Footer"
        className={clsx(classes.Footer, className)}
        ref={ref as React.Ref<HTMLDivElement>}
      />
    )
  },
)
