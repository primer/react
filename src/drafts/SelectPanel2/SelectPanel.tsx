import React from 'react'
import {SearchIcon, XCircleFillIcon, XIcon, FilterRemoveIcon, AlertIcon} from '@primer/octicons-react'
import {FocusKeys} from '@primer/behaviors'

import {
  Button,
  ButtonProps,
  IconButton,
  Heading,
  Box,
  Tooltip,
  TextInput,
  TextInputProps,
  Spinner,
  Text,
  ActionListProps,
  Octicon,
} from '../../index'
import {ActionListContainerContext} from '../../ActionList/ActionListContainerContext'
import {useSlots} from '../../hooks/useSlots'
import {useProvidedRefOrCreate, useId, useAnchoredPosition} from '../../hooks'
import {useFocusZone} from '../../hooks/useFocusZone'
import {StyledOverlay, OverlayProps} from '../../Overlay/Overlay'

const SelectPanelContext = React.createContext<{
  title: string
  description?: string
  panelId: string
  onCancel: () => void
  onClearSelection: undefined | (() => void)
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  selectionVariant: ActionListProps['selectionVariant'] | 'instant'
}>({
  title: '',
  description: undefined,
  panelId: '',
  onCancel: () => {},
  onClearSelection: undefined,
  searchQuery: '',
  setSearchQuery: () => {},
  selectionVariant: 'multiple',
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
  height?: OverlayProps['height'] | 'fit-content'

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
  height = 'large',
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

  const internalAfterSelect = () => {
    if (selectionVariant === 'instant') onInternalSubmit()
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
  React.useEffect(() => {
    if (internalOpen) document.querySelector('input')?.focus()
  }, [internalOpen])

  /* Anchored */
  const {position} = useAnchoredPosition(
    {
      anchorElementRef: anchorRef,
      floatingElementRef: dialogRef,
      side: 'outside-bottom',
      align: 'start',
    },
    [anchorRef.current, dialogRef.current],
  )

  /* 
    We don't close the panel when clicking outside.
    For many years, we used to save changes and closed the dialog (for label picker)
    which isn't accessible, clicking outside should discard changes and close the dialog
    Fixing this a11y bug would confuse users, so as a middle ground,
    we don't close the menu and nudge the user towards the footer actions
  */
  const [footerAnimationEnabled, setFooterAnimationEnabled] = React.useState(false)
  const onClickOutside = () => {
    setFooterAnimationEnabled(true)
    window.setTimeout(() => setFooterAnimationEnabled(false), 350)
  }

  return (
    <>
      {Anchor}
      {/* @ts-ignore TODO: StyledOverlay does not like height:fit-content */}
      <StyledOverlay
        as="dialog"
        ref={dialogRef}
        aria-labelledby={`${panelId}--title`}
        aria-describedby={description ? `${panelId}--description` : undefined}
        width={width}
        height={height}
        sx={{
          // reset dialog default styles
          border: 'none',
          padding: 0,

          ...(variant === 'anchored' ? {margin: 0, top: position?.top, left: position?.left} : {}),
          '::backdrop': {backgroundColor: variant === 'anchored' ? 'transparent' : 'primer.canvas.backdrop'},

          '& [data-selectpanel-primary-actions]': {
            animation: footerAnimationEnabled ? 'selectpanel-gelatine 350ms linear' : 'none',
          },
          '@keyframes selectpanel-gelatine': {
            '0%': {transform: 'scale(1, 1)'},
            '25%': {transform: 'scale(0.9, 1.1)'},
            '50%': {transform: 'scale(1.1, 0.9)'},
            '75%': {transform: 'scale(0.95, 1.05)'},
            '100%': {transform: 'scale(1, 1)'},
          },
        }}
        onClick={event => {
          if (event.target === event.currentTarget) onClickOutside()
        }}
      >
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
          }}
        >
          <Box
            as="form"
            method="dialog"
            onSubmit={onInternalSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: 'initial',
              minHeight: '100%',
            }}
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
                }}
              >
                {childrenInBody}
              </ActionListContainerContext.Provider>
            </Box>
            {slots.footer}
          </Box>
        </SelectPanelContext.Provider>
      </StyledOverlay>
    </>
  )
}

const SelectPanelButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, anchorRef) => {
  return <Button ref={anchorRef} {...props} />
})

const SelectPanelHeader: React.FC<React.PropsWithChildren> = ({children, ...props}) => {
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
        <Box sx={{marginLeft: 2, marginTop: description ? '2px' : 0}}>
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

const SelectPanelSearchInput: React.FC<TextInputProps> = ({onChange: propsOnChange, ...props}) => {
  // TODO: use forwardedRef
  const inputRef = React.createRef<HTMLInputElement>()

  const {setSearchQuery} = React.useContext(SelectPanelContext)

  const internalOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // If props.onChange is given, the application controls search,
    // otherwise the component does
    if (typeof propsOnChange === 'function') propsOnChange(event)
    else setSearchQuery(event.target.value)
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
      sx={
        {
          /* TODO: uncommenting this breaks keyboard navigation, that's odd */
          // '& input:empty + .TextInput-action': {display: 'none'},
        }
      }
      onChange={internalOnChange}
      {...props}
    />
  )
}

const SelectPanelFooter = ({...props}) => {
  const {onCancel, selectionVariant} = React.useContext(SelectPanelContext)

  const hidePrimaryActions = selectionVariant === 'instant'

  if (hidePrimaryActions && !props.children) {
    // nothing to render
    // todo: we can inform them the developer footer will render nothing
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: 3,
        borderTop: '1px solid',
        borderColor: 'border.default',
      }}
    >
      <Box sx={{flexGrow: hidePrimaryActions ? 1 : 0}}>{props.children}</Box>

      {hidePrimaryActions ? null : (
        <Box data-selectpanel-primary-actions sx={{display: 'flex', gap: 2}}>
          <Button size="small" type="button" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button size="small" type="submit" variant="primary">
            Save
          </Button>
        </Box>
      )}
    </Box>
  )
}

// TODO: is this the right way to add button props?
const SelectPanelSecondaryButton: React.FC<ButtonProps> = props => {
  return <Button type="button" size="small" block {...props} />
}
// SelectPanel.SecondaryLink = props => {
//   return <a {...props}>{props.children}</a>
// }

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
      }}
    >
      <Spinner size="medium" />
      <Text sx={{fontSize: 1, color: 'fg.muted'}}>{children}</Text>
    </Box>
  )
}

type SelectPanelMessageProps = {children: React.ReactNode} & (
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
  SecondaryButton: SelectPanelSecondaryButton,
  Loading: SelectPanelLoading,
  Message: SelectPanelMessage,
})
