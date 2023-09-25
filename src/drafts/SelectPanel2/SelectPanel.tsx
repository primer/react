import React from 'react'
import {SearchIcon, XCircleFillIcon, XIcon} from '@primer/octicons-react'
import {FocusKeys} from '@primer/behaviors'

import {
  Button,
  IconButton,
  Heading,
  Box,
  AnchoredOverlay,
  Tooltip,
  TextInput,
  AnchoredOverlayProps,
  ActionList,
  ActionListProps,
  Spinner,
  Text,
} from '../../../src/index'
import {useSlots} from '../../hooks/useSlots'
import {ClearIcon} from './tmp-ClearIcon'

const SelectPanelContext = React.createContext<{
  onCancel: () => void
  onClearSelection: undefined | (() => void)
  searchQuery: string
  setSearchQuery: () => void
}>({
  onCancel: () => {},
  onClearSelection: undefined,
  searchQuery: '',
  setSearchQuery: () => {},
})

// @ts-ignore todo
const SelectPanel = props => {
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  // 🚨 Hack for good API!
  // we strip out Anchor from children and pass it to AnchoredOverlay to render
  // with additional props for accessibility
  let renderAnchor: AnchoredOverlayProps['renderAnchor'] = null
  const contents = React.Children.map(props.children, child => {
    if (child.type === SelectPanelButton) {
      renderAnchor = anchorProps => React.cloneElement(child, anchorProps)
      return null
    }
    return child
  })

  // TODO: defaultOpen is not for debugging, I don't intend to make
  // it part of the API
  const [open, setOpen] = React.useState(props.defaultOpen)

  const onInternalClose = () => {
    setOpen(false)

    if (typeof props.onCancel === 'function') props.onCancel()
  }
  // @ts-ignore todo
  const onInternalSubmit = event => {
    event.preventDefault()
    setOpen(false)
    if (typeof props.onSubmit === 'function') props.onSubmit(event)
  }

  const onInternalClearSelection = () => {
    if (typeof props.onSubmit === 'function') props.onClearSelection()
  }

  /* Search/Filter */
  const [searchQuery, setSearchQuery] = React.useState('')

  return (
    <>
      <AnchoredOverlay
        anchorRef={anchorRef}
        renderAnchor={renderAnchor}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={onInternalClose}
        width="medium"
        height="large"
        focusZoneSettings={{bindKeys: FocusKeys.Tab}}
      >
        {/* TODO: Keyboard navigation of actionlist should be arrow keys
            with tabs to enter and escape
        */}
        <SelectPanelContext.Provider
          value={{
            onCancel: onInternalClose,
            onClearSelection: props.onClearSelection ? onInternalClearSelection : undefined,
            searchQuery,
            // @ts-ignore todo
            setSearchQuery,
          }}
        >
          <Box as="form" onSubmit={onInternalSubmit} sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            {contents}
          </Box>
        </SelectPanelContext.Provider>
      </AnchoredOverlay>
    </>
  )
}

const SelectPanelButton = React.forwardRef((props, anchorRef) => {
  // @ts-ignore todo
  return <Button ref={anchorRef} {...props} />
})
SelectPanel.Button = SelectPanelButton

const SelectPanelHeader: React.FC<React.PropsWithChildren> = ({children, ...props}) => {
  const [slots, childrenWithoutSlots] = useSlots(children, {
    heading: SelectPanelHeading,
    searchInput: SelectPanelSearchInput,
  })

  const {onCancel, onClearSelection} = React.useContext(SelectPanelContext)

  return (
    <Box id="header" sx={{padding: 2, borderBottom: '1px solid', borderColor: 'border.default'}} {...props}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2}}>
        {slots.heading}
        <Box>
          {/* Will not need tooltip after https://github.com/primer/react/issues/2008 */}
          {onClearSelection ? (
            <Tooltip text="Clear selection" direction="s" onClick={onClearSelection}>
              <IconButton type="button" variant="invisible" icon={ClearIcon} aria-label="Clear selection" />
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
SelectPanel.Header = SelectPanelHeader

const SelectPanelHeading: React.FC<React.PropsWithChildren<{children: string}>> = ({children, ...props}) => {
  // heading element is intentionally hardcoded to h1, it is not customisable
  // see https://github.com/github/primer/issues/2578 for context
  return (
    <Heading as="h1" sx={{fontSize: 14, fontWeight: 600, marginLeft: 2}} {...props}>
      {children}
    </Heading>
  )
}
SelectPanel.Heading = SelectPanelHeading

// @ts-ignore todo
const SelectPanelSearchInput = props => {
  const inputRef = React.createRef<HTMLInputElement>()

  const {setSearchQuery} = React.useContext(SelectPanelContext)

  // @ts-ignore todo
  const internalOnChange = event => {
    // If props.onChange is given, the application controls search,
    // otherwise the component does
    if (typeof props.onChange === 'function') props(props.onChange)
    // @ts-ignore todo
    else setSearchQuery(event.target.value)
  }

  return (
    <TextInput
      // this autofocus doesn't seem to apply 🤔
      // probably because the focus zone overrides autoFocus
      autoFocus
      ref={inputRef}
      block
      leadingVisual={SearchIcon}
      placeholder="Search"
      trailingAction={
        <TextInput.Action
          icon={XCircleFillIcon}
          aria-label="Clear"
          sx={{color: 'fg.subtle', bg: 'none'}}
          onClick={() => {
            if (inputRef.current) inputRef.current.value = ''
            if (typeof props.onChange === 'function') {
              props.onChange({target: inputRef.current, currentTarget: inputRef.current})
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
SelectPanel.SearchInput = SelectPanelSearchInput

const SelectPanelActionList: React.FC<React.PropsWithChildren<ActionListProps>> = props => {
  /* features to implement for uncontrolled:
     1. select
     2. sort
     3. divider
     4. search
     5. different results view
  */

  return (
    <>
      <ActionList id="body" sx={{flexShrink: 1, flexGrow: 1, overflowY: 'auto'}} selectionVariant="multiple" {...props}>
        {props.children}
      </ActionList>
    </>
  )
}
SelectPanel.ActionList = SelectPanelActionList

const SelectPanelFooter = ({...props}) => {
  const {onCancel} = React.useContext(SelectPanelContext)

  return (
    <Box
      id="footer"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: 3,
        borderTop: '1px solid',
        borderColor: 'border.default',
      }}
    >
      <div>{props.children}</div>
      <Box sx={{display: 'flex', gap: 2}}>
        <Button size="small" type="button" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button size="small" type="submit" variant="primary">
          Save
        </Button>
      </Box>
    </Box>
  )
}
SelectPanel.Footer = SelectPanelFooter

// @ts-ignore todo
SelectPanel.SecondaryButton = props => {
  return <Button {...props} size="small" type="button" />
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
        flexGrow: 1,
        gap: 3,
      }}
    >
      <Spinner size="medium" />
      <Text sx={{fontSize: 1, color: 'fg.muted'}}>{children}</Text>
    </Box>
  )
}

SelectPanel.Loading = SelectPanelLoading

const SelectPanelEmptyMessage: React.FC<{children: string | React.ReactNode}> = ({children = 'No items found...'}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        height: '100%',
        gap: 2,
      }}
    >
      <Text sx={{fontSize: 1}}>{children}</Text>
      <Text sx={{fontSize: 0, color: 'fg.muted'}}>Try a different search term</Text>
    </Box>
  )
}

SelectPanel.EmptyMessage = SelectPanelEmptyMessage

export {SelectPanel}

// This is probably a horrible idea and we would not ship this...
// const deriveItemsFromActionList = (actionListItems: React.ReactNode[]) => {
//   return React.Children.toArray(actionListItems).map(actionListItemNode => {
//     const itemProps = actionListItemNode.props

//     const [slots, childrenWithoutSlots] = useSlots(itemProps.children, {
//       leadingVisual: ActionList.LeadingVisual,
//       trailingVisual: ActionList.TrailingVisual,
//       description: ActionList.Description,
//     })

//     return {
//       description: slots.description?.props.children,
//       name: childrenWithoutSlots[0],
//       selected: itemProps.selected,
//     }
//   })
// }
