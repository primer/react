/* eslint-disable primer-react/spread-props-first */
import React, {useEffect, useState, type MutableRefObject} from 'react'
import {SearchIcon, XCircleFillIcon, XIcon, FilterRemoveIcon, AlertIcon, ArrowLeftIcon} from '@primer/octicons-react'

import type {ButtonProps, TextInputProps, ActionListProps, LinkProps, CheckboxProps} from '../../index'
import {
  Button,
  IconButton,
  Heading,
  TextInput,
  Spinner,
  Link,
  Checkbox,
  useFormControlForwardedProps,
} from '../../index'
import Octicon from '../../Octicon'
import {ActionListContainerContext} from '../../ActionList/ActionListContainerContext'
import {useSlots} from '../../hooks/useSlots'
import {useProvidedRefOrCreate, useId, useAnchoredPosition} from '../../hooks'
import type {OverlayProps} from '../../Overlay/Overlay'
import {BaseOverlay, heightMap} from '../../Overlay/Overlay'
import {InputLabel} from '../../internal/components/InputLabel'
import {invariant} from '../../utils/invariant'
import {AriaStatus} from '../../live-region'
import {useResponsiveValue} from '../../hooks/useResponsiveValue'
import type {ResponsiveValue} from '../../hooks/useResponsiveValue'
import {clsx} from 'clsx'

import classes from './SelectPanel.module.css'
import type {PositionSettings} from '@primer/behaviors'
import type {FCWithSlotMarker, WithSlotMarker} from '../../utils/types'
import {isSlot} from '../../utils/is-slot'

const SelectPanelContext = React.createContext<{
  title: string
  description?: string
  panelId: string
  onCancel: () => void
  onClearSelection: undefined | (() => void)
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  selectionVariant: ActionListProps['selectionVariant'] | 'instant'
  moveFocusToList: () => void
}>({
  title: '',
  description: undefined,
  panelId: '',
  onCancel: () => {},
  onClearSelection: undefined,
  searchQuery: '',
  setSearchQuery: () => {},
  selectionVariant: 'multiple',
  moveFocusToList: () => {},
})

const responsiveButtonSizes: ResponsiveValue<'small' | 'medium'> = {narrow: 'medium', regular: 'small'}

export type SelectPanelProps = {
  title: string
  description?: string
  variant?: 'anchored' | 'modal' | ResponsiveValue<'anchored' | 'modal', 'full-screen' | 'bottom-sheet'>
  selectionVariant?: 'single' | 'multiple' | 'instant'
  id?: string

  defaultOpen?: boolean
  open?: boolean
  anchorRef?: React.RefObject<HTMLButtonElement>
  anchoredPositionSettings?: Partial<PositionSettings>

  onCancel?: () => void
  onClearSelection?: undefined | (() => void)
  onSubmit?: (event?: React.FormEvent<HTMLFormElement>) => void

  // TODO: move these to SelectPanel.Overlay or overlayProps
  width?: OverlayProps['width']
  height?: 'fit-content' // not used, keeping it around temporary for backward compatibility
  maxHeight?: Exclude<OverlayProps['maxHeight'], 'xsmall'>

  children: React.ReactNode
  className?: string
}

const Panel: React.FC<SelectPanelProps> = ({
  title,
  description,
  variant: propsVariant,
  selectionVariant = 'multiple',
  id,

  defaultOpen = false,
  open: propsOpen,
  anchorRef: providedAnchorRef,
  anchoredPositionSettings,

  onCancel: propsOnCancel,
  onClearSelection: propsOnClearSelection,
  onSubmit: propsOnSubmit,

  width = 'medium',
  maxHeight = 'large',
  className,
  ...props
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)

  const responsiveVariants = Object.assign(
    {regular: 'anchored', narrow: 'full-screen'}, // defaults
    typeof propsVariant === 'string' ? {regular: propsVariant} : propsVariant,
  )
  const currentVariant = useResponsiveValue(responsiveVariants, 'anchored')

  // sync open state with props
  if (propsOpen !== undefined && internalOpen !== propsOpen) setInternalOpen(propsOpen)

  // TODO: replace this hack with clone element?

  // 🚨 Hack for good API!
  // we strip out Anchor from children and wire it up to Dialog
  // with additional props for accessibility
  let Anchor: React.ReactElement | undefined
  const anchorRef = useProvidedRefOrCreate(providedAnchorRef)

  const onAnchorClick = () => {
    if (!internalOpen) setInternalOpen(true)
    else onInternalCancel()
  }

  const contents = React.Children.map(props.children, child => {
    if (React.isValidElement(child) && (child.type === SelectPanelButton || isSlot(child, SelectPanelButton))) {
      // eslint-disable-next-line react-compiler/react-compiler
      Anchor = React.cloneElement(child, {
        // @ts-ignore TODO
        ref: anchorRef,
        onClick: child.props.onClick || onAnchorClick,
        'aria-haspopup': true,
        'aria-expanded': internalOpen,
      })
      return null
    }
    return child
  })

  const onInternalClose = React.useCallback(() => {
    if (internalOpen === false) return // nothing to do here
    if (propsOpen === undefined) setInternalOpen(false)
  }, [internalOpen, propsOpen])

  const onInternalCancel = React.useCallback(() => {
    onInternalClose()
    if (typeof propsOnCancel === 'function') propsOnCancel()
  }, [onInternalClose, propsOnCancel])

  const onInternalSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault() // there is no event with selectionVariant=instant
    onInternalClose()
    if (typeof propsOnSubmit === 'function') propsOnSubmit(event)
  }

  const onInternalClearSelection = () => {
    if (typeof propsOnClearSelection === 'function') propsOnClearSelection()
  }

  const internalAfterSelect = (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => {
    if (selectionVariant === 'instant') onInternalSubmit()

    if (event.type === 'keypress') {
      if ((event as React.KeyboardEvent<HTMLLIElement>).key === 'Enter') onInternalSubmit()
    }
  }

  /* Search/Filter */
  const [searchQuery, setSearchQuery] = React.useState<string>('')

  /* Panel plumbing */
  const panelId = useId(id)
  const [slots, childrenInBody] = useSlots(contents, {header: SelectPanelHeader, footer: SelectPanelFooter})

  // used in SelectPanel.SearchInput
  const moveFocusToList = () => {
    const selector = 'ul[role=listbox] li:not([role=none])'
    // being specific about roles because there can be another ul (tabs in header) and an ActionList.Group (li[role=none])
    const firstListElement = dialogRef.current?.querySelector(selector) as HTMLLIElement | undefined
    firstListElement?.focus()
  }

  /* Dialog */
  const dialogRef = React.useRef<HTMLDialogElement>(null)

  // sync dialog open state (imperative) with internal component state
  React.useEffect(() => {
    if (internalOpen) dialogRef.current?.showModal()
    else if (dialogRef.current?.open) dialogRef.current.close()
  }, [internalOpen])

  // dialog handles Esc automatically, so we have to sync internal state
  // but it doesn't call onCancel, so have another effect for that!
  React.useEffect(() => {
    const dialogEl = dialogRef.current
    dialogEl?.addEventListener('close', onInternalClose)
    return () => dialogEl?.removeEventListener('close', onInternalClose)
  }, [onInternalClose])

  // Esc handler
  React.useEffect(() => {
    const dialogEl = dialogRef.current
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onInternalCancel()
    }
    dialogEl?.addEventListener('keydown', handler)
    return () => dialogEl?.removeEventListener('keydown', handler)
  }, [onInternalCancel])

  // Autofocus hack: React doesn't support autoFocus for dialog: https://github.com/facebook/react/issues/23301
  // tl;dr: react takes over autofocus instead of letting the browser handle it,
  // but not for dialogs, so we have to do it
  React.useEffect(
    function initialFocus() {
      if (internalOpen) {
        const searchInput = document.querySelector('dialog[open] input') as HTMLInputElement | undefined
        if (searchInput) searchInput.focus()
        else moveFocusToList()
      }
    },
    [internalOpen],
  )

  /* Anchored */
  const {position} = useAnchoredPosition(
    {
      anchorElementRef: anchorRef,
      floatingElementRef: dialogRef,
      side: 'outside-bottom',
      align: 'start',
      ...anchoredPositionSettings,
    },
    [internalOpen, anchorRef.current, dialogRef.current],
  )

  /*
    We want to cancel and close the panel when user clicks outside.
    See decision log: https://github.com/github/primer/discussions/2614#discussioncomment-8544561
  */
  const onClickOutside = onInternalCancel

  let maxHeightValue = heightMap[maxHeight]
  if (currentVariant === 'bottom-sheet') {
    maxHeightValue = 'calc(100vh - 64px)'
  } else if (currentVariant === 'full-screen') {
    maxHeightValue = '100vh'
  }

  return (
    <>
      {Anchor}

      <BaseOverlay
        as="dialog"
        ref={dialogRef}
        aria-labelledby={`${panelId}--title`}
        aria-describedby={description ? `${panelId}--description` : undefined}
        width={width}
        height="fit-content"
        maxHeight={maxHeight}
        data-variant={currentVariant}
        style={
          {
            '--max-height': maxHeightValue,
            '--position-top': `${position?.top ?? 0}px`,
            '--position-left': `${position?.left ?? 0}px`,
            visibility: internalOpen ? 'visible' : 'hidden',
            display: 'flex',
          } as React.CSSProperties
        }
        className={clsx(classes.Overlay, className)}
        {...props}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          if (event.target === event.currentTarget) onClickOutside()
        }}
      >
        {internalOpen && (
          <>
            <SelectPanelContext.Provider
              value={{
                panelId,
                title,
                description,
                onCancel: onInternalCancel,
                onClearSelection: propsOnClearSelection ? onInternalClearSelection : undefined,
                searchQuery,
                setSearchQuery,
                selectionVariant,
                moveFocusToList,
              }}
            >
              <form method="dialog" onSubmit={onInternalSubmit} className={classes.Form}>
                {slots.header ?? /* render default header as fallback */ <SelectPanelHeader />}

                <div className={classes.Container}>
                  <ActionListContainerContext.Provider
                    value={{
                      container: 'SelectPanel',
                      listRole: 'listbox',
                      selectionAttribute: 'aria-selected',
                      selectionVariant: selectionVariant === 'instant' ? 'single' : selectionVariant,
                      afterSelect: internalAfterSelect,
                      listLabelledBy: `${panelId}--title`,
                      enableFocusZone: true, // Arrow keys navigation for list items
                    }}
                  >
                    {childrenInBody}
                  </ActionListContainerContext.Provider>
                </div>
                {slots.footer}
              </form>
            </SelectPanelContext.Provider>
          </>
        )}
      </BaseOverlay>
    </>
  )
}

const SelectPanelButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, anchorRef) => {
  const inputProps = useFormControlForwardedProps(props)
  const [labelText, setLabelText] = useState('')
  useEffect(() => {
    const label = document.querySelector(`[for='${inputProps.id}']`)
    if (label?.textContent) {
      setLabelText(label.textContent)
    }
  }, [inputProps.id])

  if (labelText) {
    return (
      <Button
        ref={anchorRef}
        aria-label={`${(anchorRef as MutableRefObject<HTMLButtonElement>).current.textContent}, ${labelText}`}
        {...inputProps}
      />
    )
  } else {
    return <Button ref={anchorRef} {...props} />
  }
}) as WithSlotMarker<React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>>

SelectPanelButton.__SLOT__ = Symbol('SelectPanel.Button')

const SelectPanelHeader: FCWithSlotMarker<React.ComponentPropsWithoutRef<'div'> & {onBack?: () => void}> = ({
  children,
  onBack,
  className,
  ...props
}) => {
  const [slots, childrenWithoutSlots] = useSlots(children, {
    searchInput: SelectPanelSearchInput,
  })

  const {title, description, panelId, onCancel, onClearSelection} = React.useContext(SelectPanelContext)

  return (
    <div className={clsx(classes.Header, className)} {...props}>
      <div
        className={classes.HeaderContent}
        data-description={description ? true : undefined}
        data-search-input={slots.searchInput ? true : undefined}
      >
        <div className={classes.FlexBox}>
          {onBack ? (
            <IconButton
              type="button"
              variant="invisible"
              icon={ArrowLeftIcon}
              aria-label="Back"
              onClick={() => onBack()}
            />
          ) : null}

          <div
            className={classes.TitleWrapper}
            data-description={description ? true : undefined}
            data-on-back={onBack ? true : undefined}
          >
            {/* heading element is intentionally hardcoded to h1, it is not customisable
            see https://github.com/github/primer/issues/2578 for context
          */}
            <Heading as="h1" id={`${panelId}--title`} className={classes.Title}>
              {title}
            </Heading>
            {description ? (
              <span id={`${panelId}--description`} className={classes.Description}>
                {description}
              </span>
            ) : null}
          </div>
        </div>

        <div>
          {onClearSelection ? (
            <IconButton
              type="button"
              variant="invisible"
              icon={FilterRemoveIcon}
              aria-label="Clear selection"
              onClick={onClearSelection}
            />
          ) : null}
          <IconButton type="button" variant="invisible" icon={XIcon} aria-label="Close" onClick={() => onCancel()} />
        </div>
      </div>

      {slots.searchInput}
      {childrenWithoutSlots}
    </div>
  )
}

SelectPanelHeader.__SLOT__ = Symbol('SelectPanel.Header')

const SelectPanelSearchInput: FCWithSlotMarker<TextInputProps> = ({
  onChange: propsOnChange,
  onKeyDown: propsOnKeyDown,
  className,
  ...props
}) => {
  // TODO: use forwardedRef
  const inputRef = React.createRef<HTMLInputElement>()

  const {setSearchQuery, moveFocusToList} = React.useContext(SelectPanelContext)

  const internalOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // If props.onChange is given, the application controls search,
    // otherwise the component does
    if (typeof propsOnChange === 'function') propsOnChange(event)
    else setSearchQuery(event.target.value)
  }

  const internalKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault() // prevent scroll
      moveFocusToList()
    }

    if (typeof propsOnKeyDown === 'function') propsOnKeyDown(event)
  }

  return (
    <TextInput
      ref={inputRef}
      block
      leadingVisual={SearchIcon}
      placeholder="Search"
      trailingAction={
        <TextInput.Action
          icon={XCircleFillIcon}
          aria-label="Clear"
          tooltipDirection="w"
          className={classes.ClearAction}
          onClick={() => {
            if (inputRef.current) inputRef.current.value = ''
            if (typeof propsOnChange === 'function') {
              // @ts-ignore TODO this is a hacky solution to clear
              propsOnChange({target: inputRef.current, currentTarget: inputRef.current})
            }
          }}
        />
      }
      className={clsx(classes.TextInput, className)}
      onChange={internalOnChange}
      onKeyDown={internalKeyDown}
      {...props}
    />
  )
}

SelectPanelSearchInput.__SLOT__ = Symbol('SelectPanel.SearchInput')

const FooterContext = React.createContext<boolean>(false)
const SelectPanelFooter = ({...props}) => {
  const {onCancel, selectionVariant} = React.useContext(SelectPanelContext)

  const hidePrimaryActions = selectionVariant === 'instant'
  const buttonSize = useResponsiveValue(responsiveButtonSizes, 'small')

  if (hidePrimaryActions && !props.children) {
    // nothing to render
    // todo: we can inform them the developer footer will render nothing
    return null
  }

  return (
    <FooterContext.Provider value={true}>
      <div className={classes.Footer} data-hide-primary-actions={hidePrimaryActions || undefined}>
        <div className={classes.FooterContent} data-hide-primary-actions={hidePrimaryActions || undefined}>
          {props.children}
        </div>

        {hidePrimaryActions ? null : (
          <div className={classes.FooterActions}>
            <Button type="button" size={buttonSize} onClick={() => onCancel()}>
              Cancel
            </Button>
            <Button type="submit" size={buttonSize} variant="primary">
              Save
            </Button>
          </div>
        )}
      </div>
    </FooterContext.Provider>
  )
}

SelectPanelFooter.__SLOT__ = Symbol('SelectPanel.Footer')

const SecondaryButton: React.FC<ButtonProps> = props => {
  const size = useResponsiveValue(responsiveButtonSizes, 'small')
  return <Button type="button" size={size} block {...props} />
}

const SecondaryLink: React.FC<LinkProps> = ({className, ...props}) => {
  const size = useResponsiveValue(responsiveButtonSizes, 'small')

  return (
    // @ts-ignore TODO: is as prop is not recognised by button?
    <Button as={Link} size={size} variant="invisible" block {...props} className={clsx(classes.SmallText, className)}>
      {props.children}
    </Button>
  )
}

const SecondaryCheckbox: React.FC<CheckboxProps> = ({id, children, className, ...props}) => {
  const checkboxId = useId(id)
  const {selectionVariant} = React.useContext(SelectPanelContext)

  // Checkbox should not be used with instant selection
  invariant(
    selectionVariant !== 'instant',
    'Sorry! SelectPanel.SecondaryAction with variant="checkbox" is not allowed inside selectionVariant="instant"',
  )

  return (
    <div className={classes.SecondaryCheckbox}>
      <Checkbox id={checkboxId} className={clsx(classes.Checkbox, className)} {...props} />
      <InputLabel htmlFor={checkboxId} className={classes.SmallText}>
        {children}
      </InputLabel>
    </div>
  )
}

export type SelectPanelSecondaryActionProps = {children: React.ReactNode} & (
  | ({variant: 'button'} & Partial<Omit<ButtonProps, 'variant'>>)
  | ({variant: 'link'} & Partial<LinkProps>)
  | ({variant: 'checkbox'; id?: string} & CheckboxProps)
)

const SelectPanelSecondaryAction: React.FC<SelectPanelSecondaryActionProps> = ({variant, ...props}) => {
  const insideFooter = React.useContext(FooterContext)
  invariant(insideFooter, 'SelectPanel.SecondaryAction is only allowed inside SelectPanel.Footer')

  // @ts-ignore TODO
  if (variant === 'button') return <SecondaryButton {...props} />
  // @ts-ignore TODO
  else if (variant === 'link') return <SecondaryLink {...props} />
  // @ts-ignore TODO
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (variant === 'checkbox') return <SecondaryCheckbox {...props} />
}

const SelectPanelLoading = ({children = 'Fetching items...'}: React.PropsWithChildren) => {
  return (
    <AriaStatus announceOnShow className={classes.SelectPanelLoading}>
      <Spinner size="medium" srText={null} />
      <span className={classes.LoadingText}>{children}</span>
    </AriaStatus>
  )
}

export type SelectPanelMessageProps = {children: React.ReactNode} & (
  | {
      size?: 'full'
      title: string // title is required with size:full
      variant: 'warning' | 'error' | 'empty' // default: warning
    }
  | {
      size?: 'inline'
      title?: never // title is invalid with size:inline
      variant: 'warning' | 'error' // variant:empty + size:inline = invalid combination
    }
)

const SelectPanelMessage: React.FC<SelectPanelMessageProps> = ({
  variant = 'warning',
  size = variant === 'empty' ? 'full' : 'inline',
  title,
  children,
}) => {
  if (size === 'full') {
    return (
      <div aria-live={variant === 'empty' ? undefined : 'polite'} className={classes.MessageFull}>
        {variant !== 'empty' ? (
          <Octicon
            icon={AlertIcon}
            className={clsx(
              classes.Octicon,
              variant === 'error' ? classes.Error : undefined,
              variant === 'warning' ? classes.Warning : undefined,
            )}
          />
        ) : null}
        <span className={classes.MessageTitle}>{title}</span>
        <span className={classes.MessageContent}>{children}</span>
      </div>
    )
  } else {
    return (
      <div
        aria-live={variant === 'empty' ? undefined : 'polite'}
        className={classes.MessageInline}
        data-variant={variant}
      >
        <AlertIcon size={16} />
        <div>{children}</div>
      </div>
    )
  }
}

export const SelectPanel = Object.assign(Panel, {
  Button: SelectPanelButton,
  Header: SelectPanelHeader,
  SearchInput: SelectPanelSearchInput,
  Footer: SelectPanelFooter,
  Loading: SelectPanelLoading,
  Message: SelectPanelMessage,
  SecondaryAction: SelectPanelSecondaryAction,
})
