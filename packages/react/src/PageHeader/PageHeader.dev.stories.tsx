import type {Meta} from '@storybook/react-vite'
import {Button, IconButton} from '..'
import Label from '../Label'
import {GitBranchIcon, PencilIcon, SidebarExpandIcon} from '@primer/octicons-react'
import classes from './PageHeader.dev.stories.module.css'

import {PageHeader} from './PageHeader'

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader/Dev',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
}

export default meta

export const LargeVariantWithMultilineTitle = () => (
  <div className={classes.Container}>
    <PageHeader
      role="banner"
      aria-label="Title long title some extra loooong looong words here some extra loooong looong words here some extra loooong
          looong words here some extra loooong looong words here some extra loooong looong words here"
    >
      <PageHeader.LeadingAction>
        <IconButton aria-label="Edit" icon={PencilIcon} variant="invisible" />
      </PageHeader.LeadingAction>
      <PageHeader.TitleArea variant="large">
        <PageHeader.LeadingVisual>
          <GitBranchIcon />
        </PageHeader.LeadingVisual>
        <PageHeader.Title>
          Title long title some extra loooong looong words here some extra loooong looong words here some extra loooong
          looong words here some extra loooong looong words here some extra loooong looong words here
        </PageHeader.Title>
        <PageHeader.TrailingVisual>
          <Label>Beta</Label>
        </PageHeader.TrailingVisual>
      </PageHeader.TitleArea>
      <PageHeader.TrailingAction>
        <IconButton aria-label="Expand sidebar" icon={SidebarExpandIcon} variant="invisible" />
      </PageHeader.TrailingAction>
      <PageHeader.Actions>
        <Button variant="primary">Add Item</Button>
      </PageHeader.Actions>
    </PageHeader>
  </div>
)

export const ArrayTypeFontSizeOnTitle = () => (
  <div className={classes.Container}>
    <PageHeader role="banner" aria-label="Issue Title">
      <PageHeader.TitleArea>
        <PageHeader.Title
          sx={{
            lineHeight: '1.25',
            fontWeight: 'normal',
            fontSize: ['26px', '26px', 'var(--text-title-size-large, 32px)', 'var(--text-title-size-large, 32px)'], // it doesn't support this format right now.
          }}
        >
          Issue Title
        </PageHeader.Title>
      </PageHeader.TitleArea>
    </PageHeader>
  </div>
)

export const ThemeBaseFontSizeOnTitle = () => (
  <div className={classes.Container}>
    <PageHeader role="banner" aria-label="Issue Title">
      <PageHeader.TitleArea>
        <PageHeader.Title
          sx={{
            fontSize: 8,
          }}
        >
          Issue Title
        </PageHeader.Title>
      </PageHeader.TitleArea>
    </PageHeader>
  </div>
)

export const StringTypeFontSizeOnTitle = () => (
  <div className={classes.Container}>
    <PageHeader role="banner" aria-label="Issue Title">
      <PageHeader.TitleArea>
        <PageHeader.Title
          sx={{
            fontSize: '56px',
          }}
        >
          Issue Title
        </PageHeader.Title>
      </PageHeader.TitleArea>
    </PageHeader>
  </div>
)
