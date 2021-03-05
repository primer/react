import {
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
import {
  ActionList,
  ActionListItem,
  ActionListSection,
  ActionListSectionDivider,
  ActionListSectionHeader
} from '../ActionList'
import {StyledDiv} from '../ActionList/StyledDiv'
import BaseStyles from '../BaseStyles'

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
  ]
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

export function SimpleList(): JSX.Element {
  return (
    <>
      <h1>Simple List</h1>
      <ErsatzOverlay>
        <ActionList>
          <ActionListItem text="New file" />
          <ActionListSectionDivider />
          <ActionListItem text="Copy link" />
          <ActionListItem text="Edit file" />
          <ActionListItem text="Delete file" variant="danger" />
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}

export function ComplexList(): JSX.Element {
  return (
    <>
      <h1>Complex List</h1>
      <ErsatzOverlay>
        <ActionList>
          <ActionListSection>
            <ActionListItem leadingVisual={TypographyIcon} text="Rename" />
            <ActionListItem leadingVisual={VersionsIcon} text="Duplicate" />
          </ActionListSection>
          <ActionListSectionDivider />
          <ActionListSection>
            <ActionListSectionHeader title="Live query" variant="subtle" />
            <ActionListItem leadingVisual={SearchIcon} text="repo:github/memex,github/github">
              <div>repo:github/memex,github/github</div>
              <div>labels:Flux,Q2</div>
            </ActionListItem>
          </ActionListSection>
          <ActionListSectionDivider />
          <ActionListSection>
            <ActionListSectionHeader title="Layout" variant="subtle" />
            <ActionListItem
              leadingVisual={NoteIcon}
              text="Table"
              description="Information-dense table optimized for operations across items"
              descriptionVariant="block"
            />
            <ActionListItem
              leadingVisual={ProjectIcon}
              text="Board"
              description="Kanban-style board focused on visual states"
              descriptionVariant="block"
            />
          </ActionListSection>
          <ActionListSectionDivider />
          <ActionListSection>
            <ActionListItem leadingVisual={FilterIcon} text="Save sort and filters to current view" />
            <ActionListItem leadingVisual={FilterIcon} text="Save sort and filters to new view" />
          </ActionListSection>
          <ActionListSectionDivider />
          <ActionListSection>
            <ActionListItem leadingVisual={GearIcon} text="View settings" />
          </ActionListSection>
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}

export function Header(): JSX.Element {
  return (
    <>
      <h1>Header</h1>
      <h2>Filled Variant</h2>
      <ActionListSectionHeader title="View layout" variant="filled" />
      <h2>Subtle Variant</h2>
      <ActionListSectionHeader title="View layout" variant="subtle" />
    </>
  )
}
