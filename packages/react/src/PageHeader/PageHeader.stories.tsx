import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import {Button, IconButton, Breadcrumbs, Link, Text, StateLabel, BranchName, Box} from '..'
import {UnderlineNav} from '../UnderlineNav'
import Label from '../Label'
import {
  KebabHorizontalIcon,
  GitBranchIcon,
  CodeIcon,
  GitPullRequestIcon,
  PeopleIcon,
  PencilIcon,
  CommentDiscussionIcon,
  CommitIcon,
  ChecklistIcon,
  FileDiffIcon,
  ArrowRightIcon,
  SidebarExpandIcon,
} from '@primer/octicons-react'
import {OcticonArgType} from '../utils/story-helpers'

import {PageHeader} from './PageHeader'
import Hidden from '../Hidden'

const meta: Meta<typeof PageHeader> = {
  title: 'Drafts/Components/PageHeader',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
  args: {
    // @ts-ignore custom type for story
    hasContextArea: false,
    hasParentLink: true,
    ParentLink: 'Previous page',
    hasContextBar: false,
    hasContextAreaAction: true,
    hasLeadingAction: false,
    hasTitle: true,
    Title: 'Branches',
    'Title.as': 'h2',
    'Title.variant': 'medium',
    hasLeadingVisual: false,
    LeadingVisual: GitBranchIcon,
    hasTrailingVisual: false,
    hasTrailingAction: false,
    hasActions: false,
    hasDescription: false,
    hasNavigation: false,
  },
  argTypes: {
    // @ts-ignore custom type for story
    hasContextArea: {
      type: 'boolean',
      table: {
        category: 'ContextArea Slot',
        type: {summary: 'string'},
      },
      description:
        'ContextArea is only visible on narrow viewports by default to provide user context of where they are at their journey.',
    },
    ParentLink: {
      type: 'string',
      if: {arg: 'hasContextArea'},
      table: {
        category: 'ContextArea Slot',
      },
      description: 'The default way to let users navigate up in the hierarchy on Narrow viewports.',
    },
    hasParentLink: {
      type: 'boolean',
      if: {arg: 'hasContextArea'},
      table: {
        category: 'ContextArea Slot',
      },
      description: 'Parent ',
    },
    hasContextBar: {
      type: 'boolean',
      if: {arg: 'hasContextArea'},
      table: {
        category: 'ContextArea Slot',
      },
      description:
        'ContextBar is generic slot for any component above the title region. Use it for custom breadcrumbs and other navigation elements instead of ParentLink.',
    },
    hasContextAreaAction: {
      type: 'boolean',
      if: {arg: 'hasContextArea'},
      table: {
        category: 'ContextArea Slot',
      },
    },
    hasLeadingAction: {
      type: 'boolean',
      table: {
        category: 'TitleArea Slot',
      },
      description:
        'A back button can be used as a leading action for local navigation. On Narrow viewports, use parentLink instead.',
    },
    hasTitle: {
      type: 'boolean',
      table: {
        category: 'TitleArea Slot',
      },
      description:
        'ContextBar is generic slot for any component above the title region. Use it for custom breadcrumbs and other navigation elements instead of ParentLink.',
    },
    Title: {
      type: 'string',
      table: {
        category: 'TitleArea Slot',
      },
    },
    'Title.as': {
      control: {
        type: 'select',
      },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      table: {
        category: 'TitleArea Slot',
      },
    },
    'Title.variant': {
      control: {
        type: 'radio',
      },
      options: ['large', 'medium', 'subtitle'],
      table: {
        category: 'TitleArea Slot',
      },
      description:
        '`medium` is the most common page title size. Use for static titles in most situations. `large` for for user-generated content such as issues, pull requests, or discussions. `subtitle` when a PageHeader.Title is already present in the page, such as in a SplitPageLayout.',
    },
    hasLeadingVisual: {
      type: 'boolean',
      table: {
        category: 'TitleArea Slot',
      },
    },
    LeadingVisual: {
      ...OcticonArgType([CodeIcon, GitPullRequestIcon, PeopleIcon]),
      table: {
        category: 'TitleArea Slot',
      },
      description:
        'Leading visualLeading visuals are optional and appear at the start of the title. They can be octicons, avatars, and other custom visuals that fit a small area.',
    },
    hasTrailingVisual: {
      type: 'boolean',
      table: {
        category: 'TitleArea Slot',
      },
      description:
        'Trailing visualTrailing visual and trailing text can display auxiliary information. They are placed at the right of the item, and can denote status, privacy details, etc.',
    },
    hasTrailingAction: {
      type: 'boolean',
      table: {
        category: 'TitleArea Slot',
      },
    },
    hasActions: {
      type: 'boolean',
      table: {
        category: 'TitleArea Slot',
      },
      description: 'Description region/slot',
    },
    hasDescription: {
      type: 'boolean',
      table: {
        category: 'Other Slots',
      },
      description: 'Description region/slot',
    },
    hasNavigation: {
      type: 'boolean',
      table: {
        category: 'Other Slots',
      },
      description: 'Description region/slot',
    },
  },
}

export default meta

export const Playground: StoryFn = args => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.TitleArea
        variant={{
          narrow: args['Title.variant'],
          regular: args['Title.variant'],
          wide: args['Title.variant'],
        }}
      >
        <PageHeader.LeadingVisual hidden={!args.hasLeadingVisual}>{<args.LeadingVisual />}</PageHeader.LeadingVisual>
        <PageHeader.Title as={args['Title.as']} hidden={!args.hasTitle}>
          {args.Title}
        </PageHeader.Title>
        <PageHeader.TrailingVisual hidden={!args.hasTrailingVisual}>
          <Label>Beta</Label>
        </PageHeader.TrailingVisual>
      </PageHeader.TitleArea>
      <PageHeader.ContextArea hidden={!args.hasContextArea}>
        <PageHeader.ParentLink href="http://github.com" hidden={!args.hasParentLink}>
          {args.ParentLink}
        </PageHeader.ParentLink>

        <PageHeader.ContextBar hidden={!args.hasContextBar}>
          <Breadcrumbs>
            <Breadcrumbs.Item href="https://github.com/primer/react/tree/main">react</Breadcrumbs.Item>
            <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/src">src</Breadcrumbs.Item>
            <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/src/PageHeader">
              PageHeader
            </Breadcrumbs.Item>
            <Breadcrumbs.Item href="https://github.com/primer/react/blob/main/src/PageHeader/PageHeader.tsx">
              PageHeader.tsx
            </Breadcrumbs.Item>
          </Breadcrumbs>
        </PageHeader.ContextBar>

        <PageHeader.ContextAreaActions hidden={!args.hasContextAreaAction}>
          <Button size="small" leadingVisual={GitBranchIcon}>
            Main
          </Button>
          <IconButton size="small" aria-label="More" icon={KebabHorizontalIcon} />
        </PageHeader.ContextAreaActions>
      </PageHeader.ContextArea>
      <PageHeader.LeadingAction hidden={!args.hasLeadingAction}>
        <IconButton aria-label="Expand" icon={SidebarExpandIcon} variant="invisible" />{' '}
      </PageHeader.LeadingAction>
      <PageHeader.TrailingAction hidden={!args.hasTrailingAction}>
        <IconButton aria-label="Edit" icon={PencilIcon} variant="invisible" />
      </PageHeader.TrailingAction>
      <PageHeader.Actions hidden={!args.hasActions}>
        <Hidden when={['narrow']}>
          <Button variant="primary">New Branch</Button>
        </Hidden>

        <Hidden when={['regular', 'wide', 'narrow']}>
          <Button variant="primary">New</Button>
        </Hidden>
        <IconButton aria-label="More" icon={KebabHorizontalIcon} />
      </PageHeader.Actions>
      <PageHeader.Description hidden={!args.hasDescription}>
        <StateLabel status="pullOpened">Open</StateLabel>
        <Hidden when={['narrow']}>
          <Text sx={{fontSize: 1, color: 'fg.muted'}}>
            <Link href="https://github.com/broccolinisoup" sx={{fontWeight: 'bold'}}>
              broccolinisoup
            </Link>{' '}
            wants to merge 3 commits into <BranchName href="https://github.com/primer/react">main</BranchName> from{' '}
            <BranchName href="https://github.com/primer/react">broccolinisoup/switch-to-new-underlineNav</BranchName>
          </Text>
        </Hidden>
        <Hidden when={['regular', 'wide']}>
          <Text sx={{fontSize: 1, color: 'fg.muted'}}>
            <BranchName href="https://github.com/primer/react">main</BranchName>
            <ArrowRightIcon />
            <BranchName href="https://github.com/primer/react">page-header-initial</BranchName>
          </Text>
        </Hidden>
      </PageHeader.Description>
      <PageHeader.Navigation hidden={!args.hasNavigation}>
        <UnderlineNav aria-label="Pull Request">
          <UnderlineNav.Item icon={CommentDiscussionIcon} counter="12" aria-current="page">
            Conversation
          </UnderlineNav.Item>
          <UnderlineNav.Item counter={3} icon={CommitIcon}>
            Commits
          </UnderlineNav.Item>
          <UnderlineNav.Item counter={7} icon={ChecklistIcon}>
            Checks
          </UnderlineNav.Item>
          <UnderlineNav.Item counter={4} icon={FileDiffIcon}>
            Files Changes
          </UnderlineNav.Item>
        </UnderlineNav>
      </PageHeader.Navigation>
    </PageHeader>
  </Box>
)

export const Default = () => (
  <Box sx={{padding: 3}}>
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.Title>Title</PageHeader.Title>
      </PageHeader.TitleArea>
    </PageHeader>
  </Box>
)
