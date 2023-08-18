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
} from '../../../src/index'
import {useSlots} from '../../hooks/useSlots'
import {ClearIcon} from './tmp-ClearIcon'

const SelectPanelContext = React.createContext({onCancel: () => {}, onClearSelection: () => {}})

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

  const [open, setOpen] = React.useState(false)

  const onInternalClose = () => {
    setOpen(false)

    if (typeof props.onCancel === 'function') props.onCancel()
  }
  const onInternalSubmit = event => {
    setOpen(false)
    if (typeof props.onSubmit === 'function') props.onSubmit(event)
  }

  const onInternalClearSelection = () => {
    if (typeof props.onSubmit === 'function') props.onClearSelection()
  }

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
        <SelectPanelContext.Provider value={{onCancel: onInternalClose, onClearSelection: onInternalClearSelection}}>
          <Box as="form" onSubmit={onInternalSubmit} sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            {contents}
          </Box>
        </SelectPanelContext.Provider>
      </AnchoredOverlay>
    </>
  )
}

const SelectPanelButton = React.forwardRef((props, anchorRef) => {
  return <Button ref={anchorRef} {...props} />
})
SelectPanel.Button = SelectPanelButton

const SelectPanelHeader: React.FC<React.PropsWithChildren> = ({children, ...props}) => {
  const [slots] = useSlots(children, {
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
          <Tooltip text="Clear selection" direction="s" onClick={onClearSelection}>
            <IconButton type="button" variant="invisible" icon={ClearIcon} aria-label="Clear selection" />
          </Tooltip>
          <Tooltip text="Close" direction="s">
            <IconButton type="button" variant="invisible" icon={XIcon} aria-label="Close" onClick={() => onCancel()} />
          </Tooltip>
        </Box>
      </Box>
      {slots.searchInput}
    </Box>
  )
}
SelectPanel.Header = SelectPanelHeader

const SelectPanelHeading: React.FC<
  React.PropsWithChildren<{as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; children: string}>
> = ({as = 'h1', children, ...props}) => {
  return (
    <Heading as={as} sx={{fontSize: 14, fontWeight: 600, marginLeft: 2}} {...props}>
      {children}
    </Heading>
  )
}
SelectPanel.Heading = SelectPanelHeading

const SelectPanelSearchInput = props => {
  const inputRef = React.createRef<HTMLInputElement>()

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
            if (typeof props.onChange === 'function') props.onChange({target: inputRef.current})
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
SelectPanel.SearchInput = SelectPanelSearchInput

SelectPanel.Body = props => {
  return (
    <Box id="body" sx={{flexShrink: 1, flexGrow: 1, overflowY: 'scroll'}}>
      {props.children}
    </Box>
  )
}

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
      {props.children}
      <Box sx={{display: 'flex', gap: 2}}>
        <Button size="small" type="button" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button size="small" type="submit" variant="primary">
          Submit
        </Button>
      </Box>
    </Box>
  )
}
SelectPanel.Footer = SelectPanelFooter

// option 1 (not used):
SelectPanel.SecondaryButton = props => {
  return <Button {...props} size="small" type="button" />
}
SelectPanel.SecondaryLink = props => {
  return <a {...props}>{props.children}</a>
}

// option 2:
SelectPanel.SecondaryActionSlot = props => {
  return <div id="left-layout">{props.children}</div>
}

export {SelectPanel}
