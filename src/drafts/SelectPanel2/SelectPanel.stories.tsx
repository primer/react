import {FocusKeys} from '@primer/behaviors'
import {SearchIcon, XCircleFillIcon, XIcon} from '@primer/octicons-react'
import React from 'react'
import {Button, IconButton, ActionList, Avatar, Heading, Box, AnchoredOverlay, ThemeProvider, Tooltip} from '../../../'
import TextInput from '../../TextInput'
import repository from './mock-data'

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

/////

const SelectPanel2 = props => {
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button ref={anchorRef}>lol</Button>
      <AnchoredOverlay
        open={true}
        anchorRef={anchorRef}
        renderAnchor={null}
        width="medium"
        focusZoneSettings={{bindKeys: FocusKeys.Tab}}
      >
        {/* TODO: Keyboard navigation of actionlist should be arrow keys
            with tabs to enter and escape
        */}
        <div id="body">{props.children}</div>
      </AnchoredOverlay>
    </>
  )
}
SelectPanel2.Header = props => {
  return (
    <div>
      <Box sx={{padding: 2, border: '1px solid', borderColor: 'border.default'}}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2}}>
          <Heading {...props} sx={{fontSize: 14, fontWeight: 600, marginLeft: 2}} />
          {/* Will not need tooltip after https://github.com/primer/react/issues/2008 */}
          <Box>
            <Tooltip text="Clear selection" direction="s">
              <IconButton variant="invisible" icon={ClearIcon} aria-label="Clear selection" />
            </Tooltip>
            <Tooltip text="Close" direction="s">
              <IconButton variant="invisible" icon={XIcon} aria-label="Close" />
            </Tooltip>
          </Box>
        </Box>
        <TextInput
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
        />
      </Box>
    </div>
  )
}
SelectPanel2.Body = props => {
  return <div>{props.children}</div>
}
SelectPanel2.Footer = props => {
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

// option 1:
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

export const Default = () => {
  return (
    <ThemeProvider>
      <h1>Multi Select Panel</h1>

      <button>open the panel</button>

      <SelectPanel2>
        <SelectPanel2.Header as="h3">Select authors</SelectPanel2.Header>
        <SelectPanel2.Body>
          <ActionList
            sx={{
              /* TODO: pull up */
              height: '400px',
              overflowY: 'scroll',
            }}
          >
            {repository.labels.map(label => (
              <ActionList.Item key={label.id}>
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

      <div id="overlay">
        <div id="header">
          <h2>Select authors</h2>
          <Button>clear</Button>
          <Button>close</Button>
          <input type="search" />
        </div>
        <form>
          <div id="body">
            <ActionList showDividers>
              <ActionList.Item>
                <ActionList.LeadingVisual>
                  <Avatar src="https://github.com/mona.png" />
                </ActionList.LeadingVisual>
                mona
                <ActionList.Description>Monalisa Octocat</ActionList.Description>
              </ActionList.Item>
              <ActionList.Item>
                <ActionList.LeadingVisual>
                  <Avatar src="https://github.com/hubot.png" />
                </ActionList.LeadingVisual>
                hubot
                <ActionList.Description>Hubot</ActionList.Description>
              </ActionList.Item>
              <ActionList.Item>
                <ActionList.LeadingVisual>
                  <Avatar src="https://github.com/primer-css.png" />
                </ActionList.LeadingVisual>
                primer-css
                <ActionList.Description>GitHub Design Systems Bot</ActionList.Description>
              </ActionList.Item>
            </ActionList>
          </div>
          <div id="footer">
            <div id="form-actions">
              <Button type="button">Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
            <div id="secondary-action">
              <Button type="button">View authors</Button>
            </div>
          </div>
        </form>
      </div>
    </ThemeProvider>
  )
}

export default {
  title: 'Drafts/Components/SelectPanel',
  component: SelectPanel2,
}
