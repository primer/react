import type {Meta} from '@storybook/react-vite'
import {Button, Link, StateLabel, BranchName} from '..'
import {ArrowRightIcon} from '@primer/octicons-react'

import {PageHeader} from '../PageHeader'
import {Hidden} from '.'
import classes from './Hidden.examples.stories.module.css'

export default {
  title: 'Experimental/Components/Hidden/Examples',
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
  <div className={classes.Container}>
    <PageHeader role="banner" aria-label="Webhooks">
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
  </div>
)

export const WebhooksOnNarrowViewport = () => {
  return <Webhooks />
}

WebhooksOnNarrowViewport.parameters = setViewportParamToNarrow

export const PullRequestPage = () => (
  <div className={classes.Container}>
    <PageHeader role="banner" aria-label="Add Hidden utility component">
      <PageHeader.ContextArea>
        <PageHeader.ParentLink href="http://github.com">Pull requests</PageHeader.ParentLink>
      </PageHeader.ContextArea>
      <PageHeader.TitleArea>
        <PageHeader.Title as="h2">Add Hidden utility component</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.Description>
        <StateLabel status="pullOpened">Open</StateLabel>
        <Hidden when={['narrow']}>
          <span className={classes.DescriptionText}>
            <Link href="#" muted className={classes.BoldLink}>
              broccolinisoup
            </Link>{' '}
            wants to merge 3 commits into
            <BranchName href="#" style={{textDecoration: 'underline'}}>
              main
            </BranchName>
            from
            <BranchName href="#" style={{textDecoration: 'underline'}}>
              broccolinisoup/add-hidden-component
            </BranchName>
          </span>
        </Hidden>
        <Hidden when={['regular', 'wide']}>
          <span className={classes.DescriptionText}>
            <BranchName href="#">main</BranchName>
            <ArrowRightIcon />
            <BranchName href="#">page-header-initial</BranchName>
          </span>
        </Hidden>
      </PageHeader.Description>
    </PageHeader>
  </div>
)

export const PullRequestPageOnNarrowViewport = () => {
  return <PullRequestPage />
}

PullRequestPageOnNarrowViewport.parameters = setViewportParamToNarrow
