import {
  ServerIcon,
  PlusCircleIcon,
  TypographyIcon,
  VersionsIcon,
  SearchIcon,
  NoteIcon,
  ProjectIcon,
  FilterIcon,
  GearIcon
} from '@primer/octicons-react'
import {Meta} from '@storybook/react'
import React from 'react'
import styled from 'styled-components'
import {ThemeProvider} from '..'
import {ActionMenu} from '../ActionMenu'
import Link from '../Link'
import {ActionList} from '../ActionList'
import BaseStyles from '../BaseStyles'
import {registerPortalRoot} from '../Portal'

const meta: Meta = {
  title: 'Composite components/ActionMenu',
  component: ActionMenu,
  decorators: [
    (Story: React.ComponentType): JSX.Element => {
      registerPortalRoot(undefined)
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  parameters: {
    controls: {
      disabled: true
    }
  }
}
export default meta

const ErsatzOverlay = styled.div`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(149, 157, 165, 0.2);
  padding: 8px;
`

export function ActionsStory(): JSX.Element {
  return (
    <>
      <h1>Actions</h1>
      <ErsatzOverlay>
        <ActionMenu
          buttonContent={<ServerIcon />}
          items={[
            {
              leadingVisual: ServerIcon,
              text: 'Open current Codespace',
              description:
                "Your existing Codespace will be opened to its previous state, and you'll be asked to manually switch to new-branch.",
              descriptionVariant: 'block',
              onClick: () => console.log('Item 1')
            },
            {
              leadingVisual: PlusCircleIcon,
              text: 'Create new Codespace',
              description: 'Create a brand new Codespace with a fresh image and checkout this branch.',
              descriptionVariant: 'block'
            }
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
ActionsStory.storyName = 'Actions'

export function SimpleListStory(): JSX.Element {
  return (
    <>
      <h1>Simple List</h1>
      <ErsatzOverlay>
        <ActionMenu
          buttonContent="Menu"
          items={[
            {text: 'New file'},
            ActionList.Divider,
            {text: 'Copy link'},
            {text: 'Edit file'},
            {text: 'Delete file', variant: 'danger'}
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
SimpleListStory.storyName = 'Simple List'

export function ComplexListStory(): JSX.Element {
  return (
    <>
      <h1>Complex List</h1>
      <ErsatzOverlay>
        <ActionMenu
          buttonContent="Menu"
          groupMetadata={[
            {groupId: '0'},
            {groupId: '1', header: {title: 'Live query', variant: 'subtle'}},
            {groupId: '2', header: {title: 'Layout', variant: 'subtle'}},
            {groupId: '3', renderItem: props => <ActionList.Item style={{fontWeight: 'bold'}} {...props} />},
            {groupId: '4'}
          ]}
          items={[
            {leadingVisual: TypographyIcon, text: 'Rename', groupId: '0'},
            {leadingVisual: VersionsIcon, text: 'Duplicate', groupId: '0'},
            {
              leadingVisual: SearchIcon,
              text: 'repo:github/memex,github/github',
              groupId: '1',
              renderItem: props => <ActionList.Item style={{color: 'rebeccapurple'}} {...props} />,
              onClick: () => console.log('Item 1')
            },
            {
              leadingVisual: NoteIcon,
              text: 'Table',
              description: 'Information-dense table optimized for operations across teams',
              descriptionVariant: 'block',
              groupId: '2',
              onClick: () => console.log('Item 2')
            },
            {
              leadingVisual: ProjectIcon,
              text: 'Board',
              description: 'Kanban-style board focused on visual states',
              descriptionVariant: 'block',
              groupId: '2',
              onClick: () => console.log('Item 3')
            },
            {
              leadingVisual: FilterIcon,
              text: 'Save sort and filters to current view',
              groupId: '3'
            },
            {leadingVisual: FilterIcon, text: 'Save sort and filters to new view', groupId: '3'},
            {leadingVisual: GearIcon, text: 'View settings', groupId: '4'}
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
ComplexListStory.storyName = 'Complex List'

export function CustomTrigger(): JSX.Element {
  const customAnchor = (props: any) => <Link {...props} />
  return (
    <>
      <h1>Custom Trigger</h1>
      <ErsatzOverlay>
        <ActionMenu
          buttonContent="Menu"
          renderAnchor={customAnchor}
          items={[
            {text: 'New file'},
            ActionList.Divider,
            {text: 'Copy link'},
            {text: 'Edit file'},
            {text: 'Delete file', variant: 'danger'}
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
CustomTrigger.storyName = 'Custom Trigger'
