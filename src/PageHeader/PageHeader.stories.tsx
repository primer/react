import React from 'react'
import {Meta, Story} from '@storybook/react'
import {Button, IconButton, Breadcrumbs} from '..'
import {EyeClosedIcon, SearchIcon, TriangleDownIcon, KebabHorizontalIcon, GitBranchIcon} from '@primer/octicons-react'

import {PageHeader} from './PageHeader'
import Hidden from '../Hidden'

const meta: Meta = {
  title: 'Drafts/Components/PageHeader',
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
    <PageHeader.TitleArea>
      <PageHeader.BackButton />
      <PageHeader.Title variant="large">Branches</PageHeader.Title>
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

export const Playground = Template.bind({})

export const FilesPage = () => (
  <PageHeader>
    <PageHeader.ContextArea>
      <PageHeader.ParentLink>Files</PageHeader.ParentLink>
      <PageHeader.ContextAreaActions>
        <Button variant="outline" leadingIcon={EyeClosedIcon} size="small" trailingIcon={TriangleDownIcon}>
          main
        </Button>
        <IconButton aria-label="Search" icon={SearchIcon} />
      </PageHeader.ContextAreaActions>
    </PageHeader.ContextArea>
    <PageHeader.TitleArea>
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">...</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/about">primer</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/about">react</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/about">PageHeader</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/about/team" selected>
          index.ts
        </Breadcrumbs.Item>
      </Breadcrumbs>
    </PageHeader.TitleArea>
  </PageHeader>
)

export default meta
