import React from 'react'
import {SearchIcon, XCircleFillIcon, XIcon, FilterRemoveIcon, AlertIcon, ArrowLeftIcon} from '@primer/octicons-react'
import {FocusKeys} from '@primer/behaviors'

import type {ButtonProps, TextInputProps, ActionListProps, LinkProps, CheckboxProps} from '../../index'
import {Button, IconButton, Heading, Box, Tooltip, TextInput, Spinner, Text, Octicon, Link, Checkbox} from '../../index'
import {ActionListContainerContext} from '../../ActionList/ActionListContainerContext'
import {useSlots} from '../../hooks/useSlots'
import {useProvidedRefOrCreate, useId, useAnchoredPosition} from '../../hooks'
import {useFocusZone} from '../../hooks/useFocusZone'
import type {OverlayProps} from '../../Overlay/Overlay'
import {StyledOverlay, heightMap} from '../../Overlay/Overlay'
import InputLabel from '../../internal/components/InputLabel'
import {invariant} from '../../utils/invariant'

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

export type SelectPanelProps = {
  title: string
  description?: string
  variant?: 'anchored' | 'modal'
  selectionVariant?: ActionListProps['selectionVariant'] | 'instant'
  id?: string

  defaultOpen?: boolean
  open?: boolean
  anchorRef?: React.RefObject<HTMLButtonElement>

  onCancel?: () => void
  onClearSelection?: undefined | (() => void)
  onSubmit?: (event?: React.FormEvent<HTMLFormElement>) => void

  // TODO: move these to SelectPanel.Overlay or overlayProps
  width?: OverlayProps['width']
  height?: 'fit-content' // not used, keeping it around temporary for backward compatibility
  maxHeight?: Exclude<OverlayProps['maxHeight'], 'xsmall'>

  children: React.ReactNode
}

const Panel: React.FC<SelectPanelProps> = ({
  title,
  description,
  variant = 'anchored',
  selectionVariant = 'multiple',
  id,

  defaultOpen = false,
  open: propsOpen,
  anchorRef: providedAnchorRef,

  onCancel: propsOnCancel,
  onClearSelection: propsOnClearSelection,
  onSubmit: propsOnSubmit,

  width = 'medium',
  maxHeight = 'large',
  ...props
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)

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
    if (React.isValidElement(child) && child.type === SelectPanelButton) {
      Anchor = React.cloneElement(child, {
        // @ts-ignore TODO
        ref: anchorRef,
        onClick: onAnchorClick,
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

  const onInternalCancel = () => {
    onInternalClose()
    if (typeof propsOnCancel === 'function') propsOnCancel()
  }

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

  /* Arrow keys navigation for list items */
  const {containerRef: listContainerRef} = useFocusZone(
    {
      bindKeys: FocusKeys.ArrowVertical | FocusKeys.HomeAndEnd | FocusKeys.PageUpDown,
      focusableElementFilter: element => element.tagName === 'LI',
    },
    [internalOpen],
  )

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
  })

  // Autofocus hack: React doesn't support autoFocus for dialog: https://github.com/facebook/react/issues/23301
  // tl;dr: react takes over autofocus instead of letting the browser handle it,
  // but not for dialogs, so we have to do it
  React.useEffect(
    function intialFocus() {
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
    },
    [internalOpen, anchorRef.current, dialogRef.current],
  )

  /* 
    We want to cancel and close the panel when user clicks outside.
    See decision log: https://github.com/github/primer/discussions/2614#discussioncomment-8544561
  */
  const onClickOutside = onInternalCancel

  return (
    <>
      {Anchor}

      <StyledOverlay
        as="dialog"
        ref={dialogRef}
        aria-labelledby={`${panelId}--title`}
        aria-describedby={description ? `${panelId}--description` : undefined}
        width={width}
        height="fit-content"
        maxHeight={maxHeight}
        sx={{
          '--max-height': heightMap[maxHeight],
          // reset dialog default styles
          border: 'none',
          padding: 0,
          '&[open]': {display: 'flex'}, // to fit children

          ...(variant === 'anchored' ? {margin: 0, top: position?.top, left: position?.left} : {}),
          '::backdrop': {backgroundColor: variant === 'anchored' ? 'transparent' : 'primer.canvas.backdrop'},

          '@keyframes selectpanel-gelatine': {
            '0%': {transform: 'scale(1, 1)'},
            '25%': {transform: 'scale(0.9, 1.1)'},
            '50%': {transform: 'scale(1.1, 0.9)'},
            '75%': {transform: 'scale(0.95, 1.05)'},
            '100%': {transform: 'scale(1, 1)'},
          },
        }}
        {...props}
        onClick={event => {
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
              <Box
                as="form"
                method="dialog"
                onSubmit={onInternalSubmit}
                sx={{display: 'flex', flexDirection: 'column', width: '100%'}}
              >
                {slots.header ?? /* render default header as fallback */ <SelectPanelHeader />}

                <Box
                  as="div"
                  ref={listContainerRef as React.RefObject<HTMLDivElement>}
                  sx={{
                    flexShrink: 1,
                    flexGrow: 1,
                    overflow: 'hidden',

                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    ul: {overflowY: 'auto', flexGrow: 1},
                  }}
                >
                  <ActionListContainerContext.Provider
                    value={{
                      container: 'SelectPanel',
                      listRole: 'listbox',
                      selectionAttribute: 'aria-selected',
                      selectionVariant: selectionVariant === 'instant' ? 'single' : selectionVariant,
                      afterSelect: internalAfterSelect,
                      listLabelledBy: `${panelId}--title`,
                    }}
                  >
                    {childrenInBody}
                  </ActionListContainerContext.Provider>
                </Box>
                {slots.footer}
              </Box>
            </SelectPanelContext.Provider>
          </>
        )}
      </StyledOverlay>
    </>
  )
}

const SelectPanelButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, anchorRef) => {
  return <Button ref={anchorRef} {...props} />
})

const SelectPanelHeader: React.FC<React.PropsWithChildren & {onBack?: () => void}> = ({children, onBack, ...props}) => {
  const [slots, childrenWithoutSlots] = useSlots(children, {
    searchInput: SelectPanelSearchInput,
  })

  const {title, description, panelId, onCancel, onClearSelection} = React.useContext(SelectPanelContext)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // gap: 2,
        padding: 2,
        borderBottom: '1px solid',
        borderColor: 'border.default',
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: description ? 'start' : 'center',
          marginBottom: slots.searchInput ? 2 : 0,
        }}
      >
        <Box sx={{display: 'flex'}}>
          {onBack ? (
            <Tooltip text="Back" direction="s">
              <IconButton
                type="button"
                variant="invisible"
                icon={ArrowLeftIcon}
                aria-label="Back"
                onClick={() => onBack()}
              />
            </Tooltip>
          ) : null}

          <Box sx={{marginLeft: onBack ? 1 : 2, marginTop: description ? '2px' : 0}}>
            {/* heading element is intentionally hardcoded to h1, it is not customisable 
            see https://github.com/github/primer/issues/2578 for context
          */}
            <Heading as="h1" id={`${panelId}--title`} sx={{fontSize: 14, fontWeight: 600}}>
              {title}
            </Heading>
            {description ? (
              <Text id={`${panelId}--description`} sx={{fontSize: 0, color: 'fg.muted', display: 'block'}}>
                {description}
              </Text>
            ) : null}
          </Box>
        </Box>

        <Box>
          {/* Will not need tooltip after https://github.com/primer/react/issues/2008 */}
          {onClearSelection ? (
            <Tooltip text="Clear selection" direction="s" onClick={onClearSelection}>
              <IconButton type="button" variant="invisible" icon={FilterRemoveIcon} aria-label="Clear selection" />
            </Tooltip>
          ) : null}
          <Tooltip text="Close" direction="s">
            <IconButton type="button" variant="invisible" icon={XIcon} aria-label="Close" onClick={() => onCancel()} />
          </Tooltip>
        </Box>
      </Box>

      {slots.searchInput}
      {childrenWithoutSlots}
    </Box>
  )
}

const SelectPanelSearchInput: React.FC<TextInputProps> = ({
  onChange: propsOnChange,
  onKeyDown: propsOnKeyDown,
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
          sx={{color: 'fg.subtle', bg: 'none'}}
          onClick={() => {
            if (inputRef.current) inputRef.current.value = ''
            if (typeof propsOnChange === 'function') {
              // @ts-ignore TODO this is a hacky solution to clear
              propsOnChange({target: inputRef.current, currentTarget: inputRef.current})
            }
          }}
        />
      }
      sx={{'&:has(input:placeholder-shown) .TextInput-action': {display: 'none'}}}
      onChange={internalOnChange}
      onKeyDown={internalKeyDown}
      {...props}
    />
  )
}

const FooterContext = React.createContext<boolean>(false)
const SelectPanelFooter = ({...props}) => {
  const {onCancel, selectionVariant} = React.useContext(SelectPanelContext)

  const hidePrimaryActions = selectionVariant === 'instant'

  if (hidePrimaryActions && !props.children) {
    // nothing to render
    // todo: we can inform them the developer footer will render nothing
    return null
  }

  return (
    <FooterContext.Provider value={true}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          padding: hidePrimaryActions ? 2 : 3,
          minHeight: '44px',
          borderTop: '1px solid',
          borderColor: 'border.default',
        }}
      >
        <Box sx={{flexGrow: hidePrimaryActions ? 1 : 0}}>{props.children}</Box>

        {hidePrimaryActions ? null : (
          <Box sx={{display: 'flex', gap: 2}}>
            <Button size="small" type="button" onClick={() => onCancel()}>
              Cancel
            </Button>
            <Button size="small" type="submit" variant="primary">
              Save
            </Button>
          </Box>
        )}
      </Box>
    </FooterContext.Provider>
  )
}

const SecondaryButton: React.FC<ButtonProps> = props => {
  return <Button type="button" size="small" block {...props} />
}

const SecondaryLink: React.FC<LinkProps> = props => {
  return (
    // @ts-ignore TODO: is as prop is not recognised by button?
    <Button as={Link} size="small" variant="invisible" block {...props} sx={{fontSize: 0}}>
      {props.children}
    </Button>
  )
}

const SecondaryCheckbox: React.FC<CheckboxProps> = ({id, children, ...props}) => {
  const checkboxId = useId(id)
  const {selectionVariant} = React.useContext(SelectPanelContext)

  // Checkbox should not be used with instant selection
  invariant(
    selectionVariant !== 'instant',
    'Sorry! SelectPanel.SecondaryAction with variant="checkbox" is not allowed inside selectionVariant="instant"',
  )

  return (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
      <Checkbox id={checkboxId} sx={{marginTop: 0}} {...props} />
      <InputLabel htmlFor={checkboxId} sx={{fontSize: 0}}>
        {children}
      </InputLabel>
    </Box>
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

const SelectPanelLoading: React.FC<{children: string}> = ({children = 'Fetching items...'}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        gap: 3,
        minHeight: 'min(calc(var(--max-height) - 150px), 324px)',
        //                 maxHeight of dialog - (header & footer)
      }}
    >
      <Spinner size="medium" />
      <Text sx={{fontSize: 1, color: 'fg.muted'}}>{children}</Text>
    </Box>
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
      <Box
        aria-live={variant === 'empty' ? undefined : 'polite'}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          height: '100%',
          gap: 1,
          paddingX: 4,
          textAlign: 'center',
          a: {color: 'inherit', textDecoration: 'underline'},
          minHeight: 'min(calc(var(--max-height) - 150px), 324px)',
          //                 maxHeight of dialog - (header & footer)
        }}
      >
        {variant !== 'empty' ? (
          <Octicon icon={AlertIcon} sx={{color: variant === 'error' ? 'danger.fg' : 'attention.fg', marginBottom: 2}} />
        ) : null}
        <Text sx={{fontSize: 1, fontWeight: 'semibold'}}>{title}</Text>
        <Text sx={{fontSize: 1, color: 'fg.muted'}}>{children}</Text>
      </Box>
    )
  } else {
    const inlineVariantStyles = {
      empty: {},
      warning: {
        backgroundColor: 'attention.subtle',
        color: 'attention.fg',
        borderBottomColor: 'attention.muted',
      },
      error: {
        backgroundColor: 'danger.subtle',
        color: 'danger.fg',
        borderColor: 'danger.muted',
      },
    }

    return (
      <Box
        aria-live={variant === 'empty' ? undefined : 'polite'}
        sx={{
          display: 'flex',
          gap: 2,
          paddingX: 3,
          paddingY: '12px',
          fontSize: 0,
          borderBottom: '1px solid',
          a: {color: 'inherit', textDecoration: 'underline'},
          ...inlineVariantStyles[variant],
        }}
      >
        <AlertIcon size={16} />
        <Box>{children}</Box>
      </Box>
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
