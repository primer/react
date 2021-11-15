import React from 'react'
import {Meta} from '@storybook/react'
import {ThemeProvider} from '..'
import BaseStyles from '../BaseStyles'
import {ActionMenu} from '../ActionMenu2'
import {ActionList} from '../ActionList2'
import {ServerIcon, PlusCircleIcon} from '@primer/octicons-react'

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
      <h1>Simple List</h1>
      <h2>Last option activated: {actionFired}</h2>
      <ActionMenu anchorContent="Menu">
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
SimpleListStory.storyName = 'Simple List'

export function ActionsStory(): JSX.Element {
  return (
    <>
      <h1>Actions</h1>

      <ActionMenu overlayProps={{width: 'medium'}}>
        <ActionMenu.Anchor>
          <ServerIcon />
        </ActionMenu.Anchor>
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
