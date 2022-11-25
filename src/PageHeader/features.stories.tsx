import React from 'react'
import {Meta, Story} from '@storybook/react'
import {Button, IconButton} from '..'
import Label from '../Label'
import {PencilIcon, KebabHorizontalIcon, GitBranchIcon} from '@primer/octicons-react'

import {PageHeader} from './PageHeader'
import Hidden from '../Hidden'

const meta: Meta = {
  title: 'Drafts/Components/PageHeader/Features',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true}
  },
  args: {}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Template: Story = args => (
  <PageHeader sx={{padding: 2}}>
    <PageHeader.ContextArea>
      <PageHeader.ParentLink href="http://github.com">Code</PageHeader.ParentLink>
      <PageHeader.ContextAreaActions>
        <Button size="small" leadingIcon={GitBranchIcon}>
          Main
        </Button>
        <IconButton size="small" aria-label="More" icon={KebabHorizontalIcon} />
      </PageHeader.ContextAreaActions>
    </PageHeader.ContextArea>
    <PageHeader.TitleArea sx={{paddingTop: 3}}>
      <PageHeader.LeadingAction />
      <PageHeader.LeadingVisual>
        <GitBranchIcon />
      </PageHeader.LeadingVisual>
      <PageHeader.Title as="h2">Branches</PageHeader.Title>
      <PageHeader.TrailingVisual>
        <Label>Beta</Label>
      </PageHeader.TrailingVisual>
      <PageHeader.TrailingAction>
        <IconButton icon={PencilIcon} />
      </PageHeader.TrailingAction>
      <PageHeader.Actions>
        <Hidden on={['narrow']}>
          <Button variant="primary">New Branch</Button>
        </Hidden>

        <Hidden on={['regular', 'wide']}>
          <Button variant="primary">New</Button>
        </Hidden>
        <IconButton aria-label="More" icon={KebabHorizontalIcon} />
      </PageHeader.Actions>
    </PageHeader.TitleArea>
  </PageHeader>
)

export const TitleWithLeadingVisual = Template.bind({})
export const TitleWithTrailingVisual = Template.bind({})
export const TitleWithTrailingAction = Template.bind({})

export default meta
