import React from 'react'
import {Meta} from '@storybook/react'
import {Button, Link, Text, StateLabel, BranchName, Box} from '..'
import {ArrowRightIcon} from '@primer/octicons-react'

import {PageHeader} from '../PageHeader'
import Hidden from '../Hidden'

const meta: Meta = {
  title: 'Drafts/Components/Hidden/Examples',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
  args: {},
}

// See if there is an interest to take this into global params

const PrimerViewports = {
  xsmall: {
    name: 'Xsmall',
    styles: {
      width: '320px',
      height: '100%',
    },
  },
  small: {
    name: 'Small',
    styles: {
      width: '540px',
      height: '100%',
    },
  },
  medium: {
    name: 'Medium',
    styles: {
      width: '768px',
      height: '100%',
    },
  },
  large: {
    name: 'Large',
    styles: {
      width: '1012px',
      height: '100%',
    },
  },
  xlarge: {
    name: 'Xlarge',
    styles: {
      width: '1280px',
      height: '100%',
    },
  },
  xxlarge: {
    name: 'XXlarge',
    styles: {
      width: '1400px',
      height: '100%',
    },
  },
}

const setViewportParamToNarrow = {
  viewport: {
    viewports: {
      ...PrimerViewports,
    },
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
          <Hidden on={['narrow']}>
            <Button variant="primary">New webhook</Button>
          </Hidden>

          <Hidden on={['regular', 'wide']}>
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
        <Hidden on={['narrow']}>
          <Text sx={{fontSize: 1, color: 'fg.muted'}}>
            <Link href="#" muted sx={{fontWeight: 'bold'}}>
              broccolinisoup
            </Link>{' '}
            wants to merge 3 commits into <BranchName href="#">main</BranchName> from{' '}
            <BranchName href="#">broccolinisoup/add-hidden-component</BranchName>
          </Text>
        </Hidden>
        <Hidden on={['regular', 'wide']}>
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

export default meta
