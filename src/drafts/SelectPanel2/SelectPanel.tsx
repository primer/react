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
} from '../../../src/index'
import {ActionListContainerContext} from '../../../src/ActionList/ActionListContainerContext'
import {useSlots} from '../../hooks/useSlots'
import {useProvidedRefOrCreate, useId, useAnchoredPosition} from '../../hooks'
import {useFocusZone} from '../../hooks/useFocusZone'
import {StyledOverlay, OverlayProps} from '../../Overlay/Overlay'
import {mergeRefs} from 'react-merge-refs'

export type SelectPanelProps = {
  title: string
  description?: string
  selectionVariant?: ActionListProps['selectionVariant'] | 'instant'
  id?: string

  defaultOpen?: boolean
  open?: boolean
  anchorRef?: React.RefObject<HTMLButtonElement> // external anchorRef

  onCancel?: () => void
  onClearSelection?: undefined | (() => void)
  onSubmit?: (event?: React.FormEvent<HTMLFormElement>) => void

  children: React.ReactNode
}

const SelectPanelContext = React.createContext<
  Pick<SelectPanelProps, 'title' | 'description' | 'selectionVariant' | 'onClearSelection'> & {
    panelId: SelectPanelProps['id']
    anchorRef?: SelectPanelProps['anchorRef']
    internalOpen: SelectPanelProps['open']
    setInternalOpen: (open: boolean) => void
    onInternalSubmit: (event?: React.FormEvent<HTMLFormElement>) => void
    onInternalClose: () => void
  }
>({
  title: '',
  panelId: '',
  internalOpen: false,
  setInternalOpen: () => {},
  onInternalSubmit: () => {},
  onInternalClose: () => {},
})

const SelectPanelContainer: React.FC<SelectPanelProps> = ({
  title,
  description,
  selectionVariant = 'multiple',
  id,

  defaultOpen = false,
  open: propsOpen,
  anchorRef: providedAnchorRef,

  onCancel: propsOnCancel,
  onClearSelection: propsOnClearSelection,
  onSubmit: propsOnSubmit,

  children,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)

  // sync open state with props
  if (propsOpen !== undefined && internalOpen !== propsOpen) setInternalOpen(propsOpen)

  const anchorRef = useProvidedRefOrCreate(providedAnchorRef)

  const onInternalClose = () => {
    if (propsOpen === undefined) setInternalOpen(false)
    if (typeof propsOnCancel === 'function') propsOnCancel()
  }

  const onInternalSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault() // there is no event with selectionVariant=instant
    if (propsOpen === undefined) setInternalOpen(false)
    if (typeof propsOnSubmit === 'function') propsOnSubmit(event)
  }

  /* a11y plumbing */
  const panelId = useId(id)

  return (
    <SelectPanelContext.Provider
      value={{
        title, // used in SelectPanelHeader
        panelId, // SelectPanelDialog, SelectPanelHeader
        description, // SelectPanelDialog, SelectPanelHeader
        selectionVariant, // SelectPanelDialog, SelectPanelFooter
        onClearSelection: propsOnClearSelection, // SelectPanelHeader
        internalOpen, // SelectPanelButton, SelectPanelDialog
        setInternalOpen, // SelectPanelButton
        onInternalSubmit, // SelectPanelDialog
        onInternalClose, // SelectPanelButton, SelectPanelDialog, SelectPanelHeader, SelectPanelFooter
        anchorRef, // SelectPanelButton, SelectPanelDialog
      }}
    >
      {children}
    </SelectPanelContext.Provider>
  )
}

const SelectPanelButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, forwardedRef) => {
  const {internalOpen, setInternalOpen, onInternalClose, anchorRef} = React.useContext(SelectPanelContext)

  const onClick = () => {
    if (!internalOpen) setInternalOpen(true)
    else onInternalClose()
  }

  return (
    <Button
      {...props}
      ref={mergeRefs([anchorRef, forwardedRef])}
      onClick={onClick}
      aria-haspopup={true}
      aria-expanded={internalOpen}
    />
  )
})

type SelectPanelDialogProps = {
  /** open is handled at root SelectPanel, not SelectPanel.Dialog */
  open?: never

  width?: OverlayProps['width']
  height?: OverlayProps['height']
}
const SelectPanelDialog: React.FC<React.PropsWithChildren<SelectPanelDialogProps>> = ({
  width = 'medium',
  height = 'large',
  ...props
}) => {
  const {description, panelId, onInternalSubmit, selectionVariant, internalOpen, onInternalClose, anchorRef} =
    React.useContext(SelectPanelContext)

  const [slots, childrenInBody] = useSlots(props.children, {header: SelectPanelHeader, footer: SelectPanelFooter})

  /* Dialog plumbing */
  const dialogRef = React.useRef<HTMLDialogElement>(null)
  if (internalOpen) dialogRef.current?.showModal()
  else dialogRef.current?.close()

  // dialog handles Esc automatically, so we have to sync internal state
  React.useEffect(() => dialogRef.current?.addEventListener('close', onInternalClose))

  // React doesn't support autoFocus for dialog: https://github.com/facebook/react/issues/23301
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
    [anchorRef?.current, dialogRef.current],
  )

  /* Arrow keys navigation for list items */
  const {containerRef: listContainerRef} = useFocusZone(
    {
      bindKeys: FocusKeys.ArrowVertical | FocusKeys.HomeAndEnd | FocusKeys.PageUpDown,
      focusableElementFilter: element => element.tagName === 'LI',
    },
    [internalOpen],
  )

  const internalAfterSelect = () => {
    if (selectionVariant === 'instant') onInternalSubmit()
  }

  return (
    <StyledOverlay
      as="dialog"
      ref={dialogRef}
      aria-labelledby={`${panelId}--title`}
      aria-describedby={description ? `${panelId}--description` : undefined}
      width={width}
      height={height}
      sx={{
        ...position,
        // reset dialog default styles
        border: 'none',
        padding: 0,
        margin: 0,
        '::backdrop': {background: 'transparent'},
      }}
    >
      <Box
        as="form"
        method="dialog"
        onSubmit={onInternalSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
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
    </StyledOverlay>
  )
}

const SelectPanelHeader: React.FC<React.PropsWithChildren> = ({children, ...props}) => {
  const [slots, childrenWithoutSlots] = useSlots(children, {
    searchInput: SelectPanelSearchInput,
  })

  const {title, description, panelId, onInternalClose, onClearSelection} = React.useContext(SelectPanelContext)

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
            <IconButton
              type="button"
              variant="invisible"
              icon={XIcon}
              aria-label="Close"
              onClick={() => onInternalClose()}
            />
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
      {...props}
    />
  )
}

const SelectPanelFooter = ({...props}) => {
  const {onInternalClose, selectionVariant} = React.useContext(SelectPanelContext)

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
        <Box sx={{display: 'flex', gap: 2}}>
          <Button size="small" type="button" onClick={() => onInternalClose()}>
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

export const SelectPanel = Object.assign(SelectPanelContainer, {
  Button: SelectPanelButton,
  Header: SelectPanelHeader,
  SearchInput: SelectPanelSearchInput,
  Footer: SelectPanelFooter,
  SecondaryButton: SelectPanelSecondaryButton,
  Loading: SelectPanelLoading,
  Message: SelectPanelMessage,
  Dialog: SelectPanelDialog,
})
