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
import type {SystemStyleObject} from '@styled-system/css'
import React from 'react'
import {ThemeProvider} from 'styled-components'
import {theme} from '..'
import {ActionList as _ActionList} from '../ActionList'
import {Header as _Header} from '../ActionList/private/Header'
import {StyledDiv} from '../ActionList/private/StyledDiv'
import BaseStyles from '../BaseStyles'

const ActionList = Object.assign(_ActionList, {
  Header: _Header
})

const meta: Meta = {
  title: 'Composite components/ActionList',
  component: ActionList,
  decorators: [
    (Story: React.ComponentType): JSX.Element => (
      <ThemeProvider theme={theme}>
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

const ersatzOverlayStyles: SystemStyleObject = {
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0,0,0,.12),0 8px 24px rgba(149,157,165,.2)',
  padding: '8px'
}
function ErsatzOverlay(props: React.ComponentPropsWithoutRef<'div'>): JSX.Element {
  return <StyledDiv sx={ersatzOverlayStyles} {...props} />
}

export function Actions(): JSX.Element {
  return (
    <>
      <h1>Actions</h1>
      <ErsatzOverlay>
        <ActionList
          items={[
            {
              leadingVisual: ServerIcon,
              text: 'Open current Codespace',
              description:
                "Your existing Codespace will be opened to its previous state, and you'll be asked to manually switch to new-branch.",
              descriptionVariant: 'block'
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

export function SimpleList(): JSX.Element {
  return (
    <>
      <h1>Simple List</h1>
      <ErsatzOverlay>
        <ActionList
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

export function ComplexList(): JSX.Element {
  return (
    <>
      <h1>Complex List</h1>
      <ErsatzOverlay>
        <ActionList
          groups={[
            {
              items: [
                {leadingVisual: TypographyIcon, text: 'Rename'},
                {leadingVisual: VersionsIcon, text: 'Duplicate'}
              ]
            },
            {
              header: {
                title: 'Live query',
                variant: 'subtle'
              },
              items: [{leadingVisual: SearchIcon, text: 'repo:github/memex,github/github'}]
            },
            {
              header: {
                title: 'Layout',
                variant: 'subtle'
              },
              items: [
                {
                  leadingVisual: NoteIcon,
                  text: 'Table',
                  description: 'Information-dense table optimized for operations across teams',
                  descriptionVariant: 'block'
                },
                {
                  leadingVisual: ProjectIcon,
                  text: 'Board',
                  description: 'Kanban-style board focused on visual states',
                  descriptionVariant: 'block'
                }
              ]
            },
            {
              items: [
                {leadingVisual: FilterIcon, text: 'Save sort and filters to current view'},
                {leadingVisual: FilterIcon, text: 'Save sort and filters to new view'}
              ]
            },
            {
              items: [{leadingVisual: GearIcon, text: 'View settings'}]
            }
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}

export function Header(): JSX.Element {
  return (
    <>
      <h1>Header</h1>
      <h2>Filled Variant</h2>
      <ActionList.Header title="Layout" variant="filled" />
      <h2>Subtle Variant</h2>
      <ActionList.Header title="Layout" variant="subtle" />
    </>
  )
}
