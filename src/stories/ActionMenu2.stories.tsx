import React from 'react'
import {Meta} from '@storybook/react'
import {ThemeProvider} from '..'
import BaseStyles from '../BaseStyles'
import {ActionMenu} from '../ActionMenu2'
import {ActionList} from '../ActionList2'
import Button, {ButtonPrimary} from '../Button'
import Box from '../Box'
import Text from '../Text'
import TextInput from '../TextInput'
import {ServerIcon, PlusCircleIcon, TriangleDownIcon} from '@primer/octicons-react'

const meta: Meta = {
  title: 'Composite components/ActionMenu2',
  component: ActionMenu,
  decorators: [
    (Story: React.ComponentType): JSX.Element => (
      <ThemeProvider>
        <BaseStyles>
          <Story />
        </BaseStyles>
      </ThemeProvider>
    )
  ],
  parameters: {
    controls: {
      disabled: true
    }
  }
}
export default meta

export function SimpleListStory(): JSX.Element {
  const [actionFired, fireAction] = React.useState('')
  const onSelect = (name: string) => fireAction(name)

  return (
    <>
      <h1>Simple Menu</h1>
      <h2>Last option activated: {actionFired}</h2>
      <ActionMenu>
        <ActionMenu.Button>Menu</ActionMenu.Button>

        <ActionList>
          <ActionList.Item onSelect={() => onSelect('Copy link')}>
            Copy link
            <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => onSelect('Quote reply')}>
            Quote reply
            <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => onSelect('Edit comment')}>
            Edit comment
            <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Divider />
          <ActionList.Item variant="danger" onSelect={() => onSelect('Delete file')}>
            Delete file
            <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
          </ActionList.Item>
        </ActionList>
      </ActionMenu>
    </>
  )
}
SimpleListStory.storyName = 'Simple Menu'

export function ActionsStory(): JSX.Element {
  return (
    <>
      <h1>Actions</h1>

      <ActionMenu overlayProps={{width: 'medium'}}>
        <ActionMenu.Button>
          <ServerIcon />
        </ActionMenu.Button>
        <ActionList>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <ServerIcon />
            </ActionList.LeadingVisual>
            Open current Codespace
            <ActionList.Description variant="block">
              Your existing Codespace will be opened to its previous state, and you&apos;ll be asked to manually switch
              to new-branch.
            </ActionList.Description>
            <ActionList.TrailingVisual>⌘O</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <PlusCircleIcon />
            </ActionList.LeadingVisual>
            Create new Codespace
            <ActionList.Description variant="block">
              Create a brand new Codespace with a fresh image and checkout this branch.
            </ActionList.Description>
            <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
          </ActionList.Item>
        </ActionList>
      </ActionMenu>
    </>
  )
}
ActionsStory.storyName = 'Actions'

export function ControlledMenu(): JSX.Element {
  const [actionFired, fireAction] = React.useState('')
  const onSelect = (name: string) => fireAction(name)

  const [open, setOpen] = React.useState(false)
  const triggerRef = React.createRef<HTMLButtonElement>()

  return (
    <>
      <h1>Controlled Menu</h1>
      <h2>External Open State: {open ? 'Open' : 'Closed'}</h2>
      <h2>Last option activated: {actionFired}</h2>
      <div>
        <Button ref={triggerRef} onClick={() => setOpen(!open)}>
          {open ? 'Close Menu' : 'Open Menu'}
        </Button>
      </div>
      <br />

      <ActionMenu
        open={open}
        setOpen={setOpen}
        anchorRef={triggerRef}
        overlayProps={{
          // clicking the button should not be counted as "clicking outside"
          ignoreClickRefs: [triggerRef]
        }}
      >
        {/**
         * Even though the state is controlled externally,
         * we still need an Anchor for the menu to "anchor" to.
         */}
        <ActionMenu.Button>Menu</ActionMenu.Button>
        <ActionList>
          <ActionList.Item onSelect={() => onSelect('Copy link')}>
            Copy link
            <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => onSelect('Quote reply')}>
            Quote reply
            <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => onSelect('Edit comment')}>
            Edit comment
            <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Divider />
          <ActionList.Item variant="danger" onSelect={() => onSelect('Delete file')}>
            Delete file
            <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
          </ActionList.Item>
        </ActionList>
      </ActionMenu>
    </>
  )
}
ControlledMenu.storyName = 'Controlled Menu'

export function CustomAnchor(): JSX.Element {
  const [actionFired, fireAction] = React.useState('')
  const onSelect = (name: string) => fireAction(name)

  return (
    <>
      <h1>Custom Anchor</h1>
      <h2>Last option activated: {actionFired}</h2>
      <ActionMenu>
        <ActionMenu.Anchor>
          <ButtonPrimary sx={{cursor: 'pointer'}}>Custom Anchor</ButtonPrimary>
        </ActionMenu.Anchor>
        <ActionList>
          <ActionList.Item onSelect={() => onSelect('Copy link')}>
            Copy link
            <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => onSelect('Quote reply')}>
            Quote reply
            <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => onSelect('Edit comment')}>
            Edit comment
            <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Divider />
          <ActionList.Item variant="danger" onSelect={() => onSelect('Delete file')}>
            Delete file
            <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
          </ActionList.Item>
        </ActionList>
      </ActionMenu>
    </>
  )
}
CustomAnchor.storyName = 'Custom Anchor'

export function MemexTableMenu(): JSX.Element {
  const [name, setName] = React.useState('Estimate')
  const [open, setOpen] = React.useState(false)
  const inputRef = React.createRef<HTMLInputElement>()

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setName(event.currentTarget.value)
      /** This feels odd. To add custom components to the Menu,
       *  you need to switch to a controlled menu
       */
      setOpen(false)
    }
  }

  /** This requires inside knowledge. If you to do this with onBlur
   *  on the input, it doesn't work :(
   */
  const handleClickOutside = () => {
    if (inputRef.current) setName(inputRef.current.value)
    setOpen(false)
  }

  return (
    <>
      <h1>Memex Table Menu</h1>
      <Box
        sx={{
          width: 200,
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
          border: '1px solid',
          borderColor: 'border.default'
        }}
      >
        <Text sx={{fontSize: 0, fontWeight: 'bold'}}>{name}</Text>
        <ActionMenu open={open} setOpen={setOpen} overlayProps={{onClickOutside: handleClickOutside}}>
          <ActionMenu.Button
            sx={{
              p: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <TriangleDownIcon />
          </ActionMenu.Button>

          <TextInput ref={inputRef} sx={{m: 2}} defaultValue={name} onKeyPress={handleKeyPress} />
          <ActionMenu.Divider sx={{m: 0}} />

          <ActionList>
            <ActionList.Item>Sort ascending (123...)</ActionList.Item>
            <ActionList.Item>Sort descending (123...)</ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item>Filter by values</ActionList.Item>
            <ActionList.Item>Group by values</ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item disabled>Hide field</ActionList.Item>
            <ActionList.Item variant="danger">Delete file</ActionList.Item>
          </ActionList>
        </ActionMenu>
      </Box>
    </>
  )
}
MemexTableMenu.storyName = 'Memex Table Menu'
