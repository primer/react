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

  return (
    <>
      <AnchoredOverlay
        open={true}
        anchorRef={anchorRef}
        renderAnchor={renderAnchor}
        width="medium"
        height="large"
        focusZoneSettings={{bindKeys: FocusKeys.Tab}}
      >
        {/* TODO: Keyboard navigation of actionlist should be arrow keys
            with tabs to enter and escape
        */}
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>{contents}</Box>
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

  return (
    <Box id="header" sx={{padding: 2, borderBottom: '1px solid', borderColor: 'border.default'}} {...props}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2}}>
        {slots.heading}
        <Box>
          {/* Will not need tooltip after https://github.com/primer/react/issues/2008 */}
          <Tooltip text="Clear selection" direction="s">
            <IconButton variant="invisible" icon={ClearIcon} aria-label="Clear selection" />
          </Tooltip>
          <Tooltip text="Close" direction="s">
            <IconButton variant="invisible" icon={XIcon} aria-label="Close" />
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
  return (
    <TextInput
      // this autofocus doesn't seem to apply 🤔
      // probably because the focus zone overrides autoFocus
      autoFocus
      block
      leadingVisual={SearchIcon}
      placeholder="Search"
      trailingAction={
        <TextInput.Action icon={XCircleFillIcon} aria-label="Clear" sx={{color: 'fg.subtle', bg: 'none'}} />
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
SelectPanel2.Footer = props => {
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
        <Button size="small">Cancel</Button>
        <Button size="small" variant="primary">
          Submit
        </Button>
      </Box>
    </Box>
  )
}

// option 1 (not used):
SelectPanel2.SecondaryButton = props => {
  return <Button {...props} size="small" />
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

  const defaultSelectedLabels = data.issue.labelIds
  const [selectedLabelIds, setSelectedLabelIds] = React.useState<string[]>(defaultSelectedLabels)

  const searchOnChange = event => {
    const query = event.target.value

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

  return (
    <ThemeProvider>
      <h1>Multi Select Panel</h1>

      {/* TODO: overlayProps on SelectPanel vs SelectPanel.Overlay */}
      <SelectPanel2>
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
          {/* TODO: this should be automatic, you can change it to single */}
          <ActionList selectionVariant="multiple">
            {filteredLabels

              /* TODO: should this sorting be baked-in OR we only validate + warn OR do nothing
                 need to either own or accept the selection state to make that automatic
                 OR provide a API for sorting in ActionList like sort by key or sort fn
              */
              .sort((a, b) => {
                /* Important! This sorting is only for initial selected ids, not for subsequent changes!
                   deterministic sorting for better UX: don't change positions with other selected items.
                */
                if (defaultSelectedLabels.includes(a.id) && defaultSelectedLabels.includes(b.id)) return 1
                else if (defaultSelectedLabels.includes(a.id)) return -1
                else if (defaultSelectedLabels.includes(b.id)) return 1
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
          </ActionList>
        </SelectPanel2.Body>
        <SelectPanel2.Footer>
          <SelectPanel2.SecondaryButton>View authors</SelectPanel2.SecondaryButton>
        </SelectPanel2.Footer>
      </SelectPanel2>

      <hr />
    </ThemeProvider>
  )
}

export default {
  title: 'Drafts/Components/SelectPanel',
  component: SelectPanel2,
}
