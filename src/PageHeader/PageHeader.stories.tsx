import React from 'react'
import {Meta, Story} from '@storybook/react'
import {Box, Button, IconButton, Breadcrumbs} from '..'
import {EyeClosedIcon, SearchIcon, TriangleDownIcon} from '@primer/octicons-react'

import {PageHeader} from './PageHeader'

const meta: Meta = {
  title: 'Layout/PageHeeader',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true}
  },
  args: {}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Template: Story = args => (
  <PageHeader>
    <PageHeader.ContextNav>
      <PageHeader.ParentLink>Code</PageHeader.ParentLink>
    </PageHeader.ContextNav>
    <PageHeader.TitleArea>Branches</PageHeader.TitleArea>
    <PageHeader.Actions>
      <Box sx={{display: ['none', 'inline']}}>
        <Button variant="primary">New Branch</Button>
      </Box>
      <Box sx={{display: ['inline', 'none']}}>
        <Button variant="primary">New</Button>
      </Box>
      <IconButton aria-label="Search" icon={SearchIcon} />
    </PageHeader.Actions>
  </PageHeader>
)

export const Default = Template.bind({})

export const FilesPage = () => (
  <PageHeader>
    <PageHeader.ContextNav>
      <PageHeader.ParentLink>Files</PageHeader.ParentLink>
      <PageHeader.ContextNavActions>
        <Button variant="outline" leadingIcon={EyeClosedIcon} size="small" trailingIcon={TriangleDownIcon}>
          main
        </Button>
        <IconButton aria-label="Search" icon={SearchIcon} />
      </PageHeader.ContextNavActions>
    </PageHeader.ContextNav>
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
