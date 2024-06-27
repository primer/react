import React from 'react'
import type {Meta} from '@storybook/react'
import {Button, Link, Text, StateLabel, BranchName, Box} from '..'
import {ArrowRightIcon} from '@primer/octicons-react'

import {PageHeader} from '../PageHeader'
import {Hidden} from '.'

export default {
  title: 'Drafts/Components/Hidden/Examples',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
  args: {},
} as Meta<typeof Hidden>

const setViewportParamToNarrow = {
  viewport: {
    defaultViewport: 'small',
  },
}
export const Webhooks = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.ContextArea>
        <PageHeader.ParentLink href="http://github.com">Repository settings</PageHeader.ParentLink>
      </PageHeader.ContextArea>
      <PageHeader.TitleArea>
        <PageHeader.Title as="h2">Webhooks</PageHeader.Title>

        <PageHeader.Actions>
          <Hidden when={['narrow']}>
            <Button variant="primary">New webhook</Button>
          </Hidden>

          <Hidden when={['regular', 'wide']}>
            <Button variant="primary">New</Button>
          </Hidden>
        </PageHeader.Actions>
      </PageHeader.TitleArea>
    </PageHeader>
  </Box>
)

export const WebhooksOnNarrowViewport = () => {
  return <Webhooks />
}

WebhooksOnNarrowViewport.parameters = setViewportParamToNarrow

export const PullRequestPage = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.ContextArea>
        <PageHeader.ParentLink href="http://github.com">Pull requests</PageHeader.ParentLink>
      </PageHeader.ContextArea>
      <PageHeader.TitleArea>
        <PageHeader.Title as="h2">Add Hidden utility component</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.Description>
        <StateLabel status="pullOpened">Open</StateLabel>
        <Hidden when={['narrow']}>
          <Text sx={{fontSize: 1, color: 'fg.muted'}}>
            <Link href="#" muted sx={{fontWeight: 'bold'}}>
              broccolinisoup
            </Link>{' '}
            wants to merge 3 commits into <BranchName href="#">main</BranchName> from{' '}
            <BranchName href="#">broccolinisoup/add-hidden-component</BranchName>
          </Text>
        </Hidden>
        <Hidden when={['regular', 'wide']}>
          <Text sx={{fontSize: 1, color: 'fg.muted'}}>
            <BranchName href="#">main</BranchName>
            <ArrowRightIcon />
            <BranchName href="#">page-header-initial</BranchName>
          </Text>
        </Hidden>
      </PageHeader.Description>
    </PageHeader>
  </Box>
)

export const PullRequestPageOnNarrowViewport = () => {
  return <PullRequestPage />
}

PullRequestPageOnNarrowViewport.parameters = setViewportParamToNarrow
