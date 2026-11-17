import React from 'react'
import {clsx} from 'clsx'
import {SearchIcon} from '@primer/octicons-react'
import {ActionList, type ActionListItemProps, type ActionListGroupProps, type ActionListProps} from '../ActionList'
import {Button, type ButtonProps} from '../Button'
import buttonClasses from '../Button/ButtonBase.module.css'
import {useId} from '../hooks/useId'
import {useSlots} from '../hooks/useSlots'
import VisuallyHidden from '../_VisuallyHidden'
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
import {nativeInvokerProps, useNativeSelectPanel} from './platform/NativeSelectPanelContext'
import {NativeSelectPanelProvider} from './platform/NativeSelectPanelProvider'
import {SelectPanelCloseButton} from './SelectPanelActions'
import {SelectPanelOverlay} from './SelectPanelOverlay'
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
          <SelectPanelDialogContext.Provider value={false}>
            <NativeSelectPanelProvider>{children}</NativeSelectPanelProvider>
          </SelectPanelDialogContext.Provider>
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
    const native = useNativeSelectPanel()
    const invokers = native.invokers && native.targetId === panelId
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
      ...(invokers ? nativeInvokerProps(panelId, 'show-modal') : {}),
      onClick: event => {
        if (formControlProps.disabled) {
          event.preventDefault()
          return
        }
        onClick?.(event)
        if (!event.defaultPrevented) {
          if (invokers) return
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

export const SelectPanelContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function SelectPanelContent({className, ...props}, ref) {
    return <div {...props} className={clsx(classes.Wrapper, className)} ref={ref} />
  },
)

export const SelectPanelHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function SelectPanelHeader({className, ...props}, ref) {
    return <div {...props} className={clsx(classes.Header, className)} ref={ref} />
  },
)

export const SelectPanelTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof Heading>>(
  function SelectPanelTitle({id: suppliedId, className, as, ...props}, ref) {
    const {titleId, setLabelledBy} = useSelectPanelContext()
    const inDialog = React.useContext(SelectPanelDialogContext)
    const id = suppliedId ?? titleId
    useLayoutEffect(() => {
      setLabelledBy(id)
    }, [id, setLabelledBy])
    return (
      <Heading
        {...props}
        as={inDialog ? 'h1' : (as ?? 'h2')}
        id={id}
        className={clsx(classes.Title, className)}
        ref={ref}
      />
    )
  },
)

export const SelectPanelDescription = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function SelectPanelDescription({id: suppliedId, className, ...props}, ref) {
    const {descriptionId, setDescribedBy} = useSelectPanelContext()
    const id = suppliedId ?? descriptionId
    useLayoutEffect(() => {
      setDescribedBy(id)
      return () => setDescribedBy(undefined)
    }, [id, setDescribedBy])
    return <div {...props} id={id} className={clsx(classes.Subtitle, className)} ref={ref} />
  },
)

export type SelectPanelSearchInputProps = Omit<TextInputProps, 'value' | 'defaultValue'>

export const SelectPanelSearchInputBase = React.forwardRef<HTMLInputElement, TextInputProps>(
  function SelectPanelSearchInputBase(props, ref) {
    return <TextInput block contrast leadingVisual={SearchIcon} {...props} ref={ref} />
  },
)

export const SelectPanelSearchInput = React.forwardRef<HTMLInputElement, SelectPanelSearchInputProps>(
  function SelectPanelSearchInput(
    {onChange, onKeyDown, className, placeholder = 'Filter items', ...props},
    forwardedRef,
  ) {
    const state = useSelectPanelContext()
    const ref = useMergedRefs(forwardedRef, state.registerInput)
    const activeDescendant = state.focusStrategy === 'active-descendant'
    return (
      <SelectPanelSearchInputBase
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
      <SelectPanelListBase
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

export const SelectPanelListBase = React.forwardRef<HTMLUListElement, ActionListProps>(
  function SelectPanelListBase(props, ref) {
    return <ActionList role="listbox" disableFocusZone {...props} ref={ref} />
  },
)

export interface SelectPanelItemAction {
  label: string
  icon: React.ElementType
  onClick: () => void
  disabled?: boolean
}
const noItemActions: readonly SelectPanelItemAction[] = []
export type SelectPanelItemProps = Omit<ActionListItemProps, 'selected' | 'value'> & {
  value: SelectPanelValue
  secondaryActions?: readonly SelectPanelItemAction[]
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
  secondaryActions?: readonly SelectPanelItemAction[]
  onSelectItem?: () => void
}

export const SelectPanelItemBase = React.forwardRef<HTMLLIElement, SelectPanelItemBaseProps>(
  function SelectPanelItemBase(
    {
      selectionValue,
      selected,
      onSelectItem,
      children,
      secondaryActions = noItemActions,
      onSelect,
      onClick,
      onKeyDown,
      onKeyPress,
      disabled: suppliedDisabled,
      ...props
    },
    forwardedRef,
  ) {
    const itemRef = React.useRef<HTMLLIElement>(null)
    const panel = React.useContext(SelectPanelContext)
    const returnFocusRef =
      panel?.focusStrategy === 'active-descendant' && isListboxInputAvailable(panel.inputElement)
        ? panel.inputRef
        : itemRef
    const ref = useMergedRefs(itemRef, forwardedRef)
    const itemId = useId(props.id)
    const shortcutId = useId()
    const [slots, childrenWithoutSlots] = useSlots(children, {
      description: ActionList.Description,
      trailingVisual: ActionList.TrailingVisual,
    })
    const [actionsOpen, setActionsOpen] = React.useState(false)
    const disabled = Boolean(suppliedDisabled || props['aria-disabled'] === true || props['aria-disabled'] === 'true')
    const unavailable = disabled || props.loading || Boolean(props.inactiveText)
    const hasActions = secondaryActions.length > 0
    const shortcutAvailable = !unavailable && secondaryActions.some(action => !action.disabled)
    const closeActions = () => setActionsOpen(false)
    const activateAction = (action: SelectPanelItemAction) => {
      if (unavailable || action.disabled) return
      returnFocusRef.current?.focus()
      action.onClick()
    }
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
      <>
        <ActionList.Item
          {...props}
          ref={ref}
          id={itemId}
          role="option"
          {...(selectionValue !== undefined ? {'data-id': selectionValue} : {})}
          disabled={disabled}
          aria-disabled={disabled || undefined}
          {...(disabled ? {tabIndex: -1} : {})}
          selected={selected}
          aria-selected={selected}
          {...(shortcutAvailable
            ? {
                'aria-describedby': [
                  props['aria-describedby'],
                  slots.description?.props.variant === 'block' ? `${itemId}--block-description` : undefined,
                  shortcutId,
                ]
                  .filter(Boolean)
                  .join(' '),
              }
            : {})}
          aria-keyshortcuts={shortcutAvailable ? 'Meta+Shift+U Control+Shift+U' : undefined}
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
            if (
              shortcutAvailable &&
              event.key.toLowerCase() === 'u' &&
              event.shiftKey &&
              (event.metaKey || event.ctrlKey) &&
              !event.altKey
            ) {
              event.preventDefault()
              event.stopPropagation()
              if (event.repeat) return
              if (secondaryActions.length === 1) activateAction(secondaryActions[0])
              else setActionsOpen(true)
              return
            }
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
          {childrenWithoutSlots}
          {slots.description}
          {shortcutAvailable ? (
            <VisuallyHidden id={shortcutId} aria-hidden="true">
              Press Cmd/Ctrl+Shift+U for more actions.
            </VisuallyHidden>
          ) : null}
          {hasActions ? (
            <ActionList.TrailingVisual {...slots.trailingVisual?.props}>
              {slots.trailingVisual?.props.children}
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- Pointer-only actions; keyboard access is on the option. */}
              <span
                className={classes.ItemActions}
                onClick={event => event.stopPropagation()}
                onKeyDown={event => event.stopPropagation()}
                onKeyPress={event => event.stopPropagation()}
                onMouseDown={event => event.preventDefault()}
              >
                {/* Even a tabindex=-1 button would be a focusable descendant of the option. */}
                {secondaryActions.map((action, index) => (
                  // eslint-disable-next-line github/a11y-no-title-attribute -- Pointer-only hint; keyboard and AT access use the option shortcut.
                  <span
                    key={index}
                    data-component="SelectPanel.Item.SecondaryAction"
                    className={clsx(buttonClasses.ButtonBase, buttonClasses.IconButton)}
                    aria-hidden="true"
                    data-disabled={Boolean(unavailable || action.disabled) || undefined}
                    data-inactive={Boolean(unavailable || action.disabled) || undefined}
                    title={action.label}
                    data-variant="invisible"
                    data-size="small"
                    data-no-visuals="true"
                    onClick={() => activateAction(action)}
                  >
                    <action.icon />
                  </span>
                ))}
              </span>
            </ActionList.TrailingVisual>
          ) : (
            slots.trailingVisual
          )}
        </ActionList.Item>
        {actionsOpen && !unavailable ? (
          <SelectPanelItemActionDialog actions={secondaryActions} onClose={closeActions} itemRef={returnFocusRef} />
        ) : null}
      </>
    )
  },
)

function SelectPanelItemActionDialog({
  actions,
  onClose,
  itemRef,
}: {
  actions: readonly SelectPanelItemAction[]
  onClose: () => void
  itemRef: React.RefObject<HTMLElement | null>
}) {
  const initialFocusRef = React.useRef<HTMLLIElement>(null)
  const firstEnabledIndex = actions.findIndex(action => !action.disabled)
  return (
    <SelectPanelRoot open onDismiss={onClose}>
      <SelectPanelOverlay anchorRef={itemRef} variant={{regular: 'modal'}} focusTrapSettings={{initialFocusRef}}>
        <SelectPanelContent>
          <SelectPanelHeader>
            <SelectPanelTitle>Supplemental actions</SelectPanelTitle>
            <SelectPanelCloseButton />
          </SelectPanelHeader>
          <ActionList>
            {actions.map((action, index) => (
              <ActionList.Item
                ref={index === firstEnabledIndex ? initialFocusRef : undefined}
                key={index}
                disabled={action.disabled}
                onSelect={() => {
                  onClose()
                  action.onClick()
                }}
              >
                <ActionList.LeadingVisual>
                  <action.icon />
                </ActionList.LeadingVisual>
                {action.label}
              </ActionList.Item>
            ))}
          </ActionList>
        </SelectPanelContent>
      </SelectPanelOverlay>
    </SelectPanelRoot>
  )
}

export const SelectPanelGroup: React.FC<ActionListGroupProps & {label: string}> = ({label, children, ...props}) => (
  <ActionList.Group {...props}>
    <ActionList.GroupHeading>{label}</ActionList.GroupHeading>
    {children}
  </ActionList.Group>
)

export const SelectPanelFooter = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function SelectPanelFooter({className, ...props}, ref) {
    return <div {...props} className={clsx(classes.Footer, className)} ref={ref} />
  },
)
