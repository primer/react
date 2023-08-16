import {FocusKeys} from '@primer/behaviors'
import {SearchIcon, XCircleFillIcon, XIcon} from '@primer/octicons-react'
import React from 'react'
import {
  Button,
  IconButton,
  ActionList,
  Heading,
  Box,
  AnchoredOverlay,
  ThemeProvider,
  Tooltip,
  TextInput,
  AnchoredOverlayProps,
} from '../../../'
import {useSlots} from '../../hooks/useSlots'

import data from './mock-data'

function getCircle(color: string) {
  return (
    <Box
      sx={{
        backgroundColor: `#${color}`,
        width: 14,
        height: 14,
        borderRadius: '100%',
      }}
    />
  )
}

const ClearIcon = props => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M.75 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5H.75zM3 7.75A.75.75 0 013.75 7h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 013 7.75zm3 4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        d="M14.914 2.336a.75.75 0 00-1.28-.53l-.884.884-.884-.884a.75.75 0 10-1.06 1.06l.883.884-.883.884a.75.75 0 101.06 1.061l.884-.884.884.884a.75.75 0 101.06-1.06l-.883-.885.883-.883a.75.75 0 00.22-.53z"
      ></path>
    </svg>
  )
}

///// component start

const SelectPanelContext = React.createContext({onCancel: () => {}, onClearSelection: () => {}})

const SelectPanel2 = props => {
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
    // TODO: cancel should reset the internal state of the component
    if (typeof props.onCancel === 'function') props.onCancel()
  }
  const onInternalSubmit = event => {
    setOpen(false)
    if (typeof props.onSubmit === 'function') props.onSubmit(event)
  }

  const onInternalClearSelection = () => {
    setOpen(false)
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
SelectPanel2.Button = SelectPanelButton

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
SelectPanel2.Header = SelectPanelHeader

const SelectPanelHeading: React.FC<
  React.PropsWithChildren<{as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; children: string}>
> = ({as, children, ...props}) => {
  return (
    <Heading as={as} sx={{fontSize: 14, fontWeight: 600, marginLeft: 2}} {...props}>
      {children}
    </Heading>
  )
}
SelectPanel2.Heading = SelectPanelHeading

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
SelectPanel2.SearchInput = SelectPanelSearchInput

SelectPanel2.Body = props => {
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
SelectPanel2.Footer = SelectPanelFooter

// option 1 (not used):
SelectPanel2.SecondaryButton = props => {
  return <Button {...props} size="small" type="button" />
}
SelectPanel2.SecondaryLink = props => {
  return <a {...props} />
}

// option 2:
SelectPanel2.SecondaryActionSlot = props => {
  return <div id="left-layout">{props.children}</div>
}

///// component end

export const Default = () => {
  // TODO/question: should the search work uncontrolled as well?
  const [filteredLabels, setFilteredLabels] = React.useState(data.labels)

  const initialSelectedLabels = [] // initial state: no labels
  // const initialSelectedLabels = data.issue.labelIds // initial state: has labels

  const [selectedLabelIds, setSelectedLabelIds] = React.useState<string[]>(initialSelectedLabels)

  const [query, setQuery] = React.useState('')

  // TODO: should this be baked-in
  const searchOnChange = event => {
    const query = event.target.value
    setQuery(query)

    if (query === '') setFilteredLabels(data.labels)
    else {
      // TODO: should probably add a highlight for matching text
      setFilteredLabels(
        data.labels
          .map(label => {
            if (label.name.toLowerCase().startsWith(query)) return {priority: 1, label}
            else if (label.name.toLowerCase().includes(query)) return {priority: 2, label}
            else if (label.description?.toLowerCase().includes(query)) return {priority: 3, label}
            else return {priority: -1, label}
          })
          .filter(result => result.priority > 0)
          .map(result => result.label),
      )
    }
  }

  const onLabelSelect = (labelId: string) => {
    if (!selectedLabelIds.includes(labelId)) setSelectedLabelIds([...selectedLabelIds, labelId])
    else setSelectedLabelIds(selectedLabelIds.filter(id => id !== labelId))
  }

  const onSubmit = event => {
    event.preventDefault() // coz form submit, innit
    onSave(selectedLabelIds)
  }

  const onClearSelection = () => {
    setSelectedLabelIds([])
    onSave([])
  }

  const onSave = (selectedLabelIds: string[]) => {
    data.issue.labelIds = selectedLabelIds // pretending to persist changes
    console.log('form submitted')
  }

  return (
    <ThemeProvider>
      <h1>Multi Select Panel</h1>

      {/* TODO: overlayProps on SelectPanel vs SelectPanel.Overlay */}

      <SelectPanel2
        // onSubmit and onCancel feel out of place here instead of the footer,
        // but cancel can be called from 4 different actions - Cancel button, X iconbutton up top, press escape key, click outside
        // also, what if there is no footer? onSubmit is maybe not needed, but we need to put the onCancel callback somewhere.
        onSubmit={onSubmit}
        onCancel={() => {
          /* optional callback, for example: for multi-step overlay or to fire sync actions */
          console.log('panel was closed')
        }}
        // TODO: onClearSelection feels even more odd on the parent, instead of on the header.
        onClearSelection={event => {
          // not optional, we don't control the selection, so we just pass this through
          onClearSelection(event)
        }}
      >
        {/* TODO: the ref types don't match here, use useProvidedRefOrCreate */}
        <SelectPanel2.Button>Assign label</SelectPanel2.Button>

        {/* TODO: header and heading is confusing. maybe skip header completely. */}
        <SelectPanel2.Header>
          {/* TODO: Heading is not optional, but what if you don't give it
              Should we throw a big error or should we make that impossible in the API?
          */}
          <SelectPanel2.Heading as="h4">Select authors</SelectPanel2.Heading>

          <SelectPanel2.SearchInput onChange={searchOnChange} />
        </SelectPanel2.Header>

        <SelectPanel2.Body>
          <ActionList selectionVariant="multiple">
            {query ? (
              filteredLabels.map(label => (
                <ActionList.Item
                  key={label.id}
                  onSelect={() => onLabelSelect(label.id)}
                  selected={selectedLabelIds.includes(label.id)}
                >
                  <ActionList.LeadingVisual>{getCircle(label.color)}</ActionList.LeadingVisual>
                  {label.name}
                  <ActionList.Description>{label.description}</ActionList.Description>
                </ActionList.Item>
              ))
            ) : (
              <>
                {data.labels
                  .filter(label => selectedLabelIds.includes(label.id))
                  .sort((a, b) => {
                    /* Important! This sorting is only for initial selected ids, not for subsequent changes!
                      deterministic sorting for better UX: don't change positions with other selected items.

                      TODO: should this sorting be baked-in OR we only validate + warn OR do nothing
                      need to either own or accept the selection state to make that automatic
                      OR provide a API for sorting in ActionList like sort by key or sort fn
                    */
                    if (selectedLabelIds.includes(a.id) && selectedLabelIds.includes(b.id)) return 1
                    else if (selectedLabelIds.includes(a.id)) return -1
                    else if (selectedLabelIds.includes(b.id)) return 1
                    else return 1
                  })
                  .map(label => (
                    <ActionList.Item
                      key={label.id}
                      onSelect={() => onLabelSelect(label.id)}
                      selected={selectedLabelIds.includes(label.id)}
                    >
                      <ActionList.LeadingVisual>{getCircle(label.color)}</ActionList.LeadingVisual>
                      {label.name}
                      <ActionList.Description>{label.description}</ActionList.Description>
                    </ActionList.Item>
                  ))}
                {selectedLabelIds.length > 0 ? <ActionList.Divider /> : null}

                {data.labels
                  .filter(label => !selectedLabelIds.includes(label.id))
                  .map(label => (
                    <ActionList.Item
                      key={label.id}
                      onSelect={() => onLabelSelect(label.id)}
                      selected={selectedLabelIds.includes(label.id)}
                    >
                      <ActionList.LeadingVisual>{getCircle(label.color)}</ActionList.LeadingVisual>
                      {label.name}
                      <ActionList.Description>{label.description}</ActionList.Description>
                    </ActionList.Item>
                  ))}
              </>
            )}
          </ActionList>
        </SelectPanel2.Body>
        <SelectPanel2.Footer>
          <SelectPanel2.SecondaryButton>View authors</SelectPanel2.SecondaryButton>
        </SelectPanel2.Footer>
      </SelectPanel2>
    </ThemeProvider>
  )
}

export default {
  title: 'Drafts/Components/SelectPanel',
  component: SelectPanel2,
}
