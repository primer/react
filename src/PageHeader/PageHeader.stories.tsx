import React from 'react'
import {Meta, Story} from '@storybook/react'
import {Button, IconButton, Breadcrumbs, Link, Text, StateLabel, BranchName} from '..'
import {UnderlineNav} from '../UnderlineNav2'
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
  ArrowRightIcon
} from '@primer/octicons-react'
import {OcticonArgType} from '../utils/story-helpers'

import {PageHeader} from './PageHeader'
import Hidden from '../Hidden'

const meta: Meta = {
  title: 'Drafts/Components/PageHeader',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true}
  },
  args: {
    'ContextArea.hidden': false,
    ParentLink: 'Previous Page',
    'ParentLink.hidden': false,
    'ContextBar.hidden': true,
    'ContextAreaAction.hidden': true,
    'BackButton.hidden': false,
    Title: 'Branches',
    'Title.as': 'h2',
    'Title.variant': 'medium',
    LeadingVisual: GitBranchIcon,
    'LeadingVisual.hidden': false,
    'TrailingVisual.hidden': false,
    'TrailingAction.hidden': false,
    'Actions.hidden': false,
    'Description.hidden': false,
    'Navigation.hidden': false
  },
  argTypes: {
    'ContextArea.hidden': {
      type: 'boolean',
      table: {
        category: 'ContextArea Slot',
        type: {summary: 'string'},
        defaultValue: {
          summary: `
        {
          narrow: false,
          regular: true,
          wide: true
        }
        `
        }
      },
      description:
        'ContextArea is only visible on narrow viewports by default to provide user context of where they are at their journey.',
      defaultValue: {summary: 'hidden', detail: 'narrow', another: 'false'}
    },
    ParentLink: {
      type: 'string',
      if: {arg: 'ContextArea.hidden', truthy: false},
      table: {
        category: 'ContextArea Slot'
      },
      description: 'The default way to let users navigate up in the hierarchy on Narrow viewports.'
    },
    'ParentLink.hidden': {
      type: 'boolean',
      if: {arg: 'ContextArea.hidden', truthy: false},
      table: {
        category: 'ContextArea Slot',
        defaultValue: {
          summary: `
        {
          narrow: false,
          regular: true,
          wide: true
        }
        `
        }
      },
      description: 'Parent '
    },
    'ContextBar.hidden': {
      type: 'boolean',
      if: {arg: 'ContextArea.hidden', truthy: false},
      table: {
        category: 'ContextArea Slot',
        defaultValue: {
          summary: `
        {
          narrow: false,
          regular: true,
          wide: true
        }
        `
        }
      },
      description:
        'ContextBar is generic slot for any component above the title region. Use it for custom breadcrumbs and other navigation elements instead of ParentLink.'
    },
    'ContextAreaAction.hidden': {
      type: 'boolean',
      if: {arg: 'ContextArea.hidden', truthy: false},
      table: {
        category: 'ContextArea Slot',
        defaultValue: {
          summary: `
        {
          narrow: false,
          regular: true,
          wide: true
        }
        `
        }
      }
    },
    'BackButton.hidden': {
      type: 'boolean',
      table: {
        category: 'TitleArea Slot',
        defaultValue: {
          summary: `
        {
          narrow: true,
          regular: false,
          wide: false
        }
        `
        }
      },
      description:
        'A back button can be used as a leading action for local navigation. On Narrow viewports, use parentLink instead.'
    },
    Title: {
      type: 'string',
      table: {
        category: 'TitleArea Slot'
      }
    },
    'Title.as': {
      control: {
        type: 'select'
      },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      table: {
        category: 'TitleArea Slot'
      }
    },
    'Title.variant': {
      control: {
        type: 'radio'
      },
      options: ['large', 'medium', 'subtitle'],
      table: {
        category: 'TitleArea Slot',
        defaultValue: {
          summary: `
          {
            narrow: 'medium',
            regular: 'large',
            wide: 'large'
          } `
        }
      },
      description:
        '`medium` is the most common page title size. Use for static titles in most situations. `large` for for user-generated content such as issues, pull requests, or discussions. `subtitle` when a PageHeader.Title is already present in the page, such as in a SplitPageLayout.'
    },
    LeadingVisual: {
      ...OcticonArgType([CodeIcon, GitPullRequestIcon, PeopleIcon]),
      table: {
        category: 'TitleArea Slot'
      },
      description:
        'Leading visualLeading visuals are optional and appear at the start of the title. They can be octicons, avatars, and other custom visuals that fit a small area.'
    },
    'LeadingVisual.hidden': {
      type: 'boolean',
      table: {
        category: 'TitleArea Slot',
        defaultValue: {
          summary: `
      {
        narrow: false,
        regular: false,
        wide: false
      }
      `
        }
      }
    },
    'TrailingVisual.hidden': {
      type: 'boolean',
      table: {
        category: 'TitleArea Slot',
        defaultValue: {
          summary: `
      {
        narrow: false,
        regular: false,
        wide: false
      }
      `
        }
      },
      description:
        'Trailing visualTrailing visual and trailing text can display auxiliary information. They are placed at the right of the item, and can denote status, privacy details, etc.'
    },
    'TrailingAction.hidden': {
      type: 'boolean',
      table: {
        category: 'TitleArea Slot',
        defaultValue: {
          summary: `
      {
        narrow: true,
        regular: false,
        wide: false
      }
      `
        }
      }
    },
    'Actions.hidden': {
      type: 'boolean',
      table: {
        category: 'TitleArea Slot'
      },
      description: 'Description region/slot'
    },
    Description: {
      table: {
        category: 'Other Slots'
      },
      description: 'Description Slots'
    },
    'Description.hidden': {
      type: 'boolean',
      table: {
        category: 'Other Slots'
      },
      description: 'Description region/slot'
    },
    Navigation: {
      table: {
        category: 'Other Slots'
      },
      description: 'Navigation Slots'
    },
    'Navigation.hidden': {
      type: 'boolean',
      table: {
        category: 'Other Slots'
      },
      description: 'Description region/slot'
    }
  }
}

// TODO: THink about it after lunch.
// context bar action visiblity doesn't work because the context bar has upper layer visibility.
// You might want to set conditional visibility on the context bar itself.

const Template: Story = args => (
  <PageHeader sx={{padding: 2}}>
    <PageHeader.ContextArea
      hidden={{
        narrow: args['ContextArea.hidden'],
        regular: args['ContextArea.hidden'],
        wide: args['ContextArea.hidden']
      }}
    >
      <PageHeader.ParentLink
        href="http://github.com"
        hidden={{
          narrow: args['ParentLink.hidden'],
          regular: args['ParentLink.hidden'],
          wide: args['ParentLink.hidden']
        }}
      >
        {args.ParentLink}
      </PageHeader.ParentLink>

      <PageHeader.ContextBar hidden={args['ContextBar.hidden']}>
        <Breadcrumbs>
          <Breadcrumbs.Item href="#">...</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">primer</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">react</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">src</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">PageHeader</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">PageHeader.tsx</Breadcrumbs.Item>
        </Breadcrumbs>
      </PageHeader.ContextBar>

      <PageHeader.ContextAreaActions
        hidden={{
          narrow: args['ContextAreaAction.hidden'],
          regular: args['ContextAreaAction.hidden'],
          wide: args['ContextAreaAction.hidden']
        }}
      >
        <Button size="small" leadingIcon={GitBranchIcon}>
          Main
        </Button>
        <IconButton size="small" aria-label="More" icon={KebabHorizontalIcon} />
      </PageHeader.ContextAreaActions>
    </PageHeader.ContextArea>
    <PageHeader.TitleArea sx={{paddingTop: 3}}>
      <PageHeader.BackButton
        hidden={{
          narrow: args['BackButton.hidden'],
          regular: args['BackButton.hidden'],
          wide: args['BackButton.hidden']
        }}
      />
      <PageHeader.LeadingVisual
        hidden={{
          narrow: args['LeadingVisual.hidden'],
          regular: args['LeadingVisual.hidden'],
          wide: args['LeadingVisual.hidden']
        }}
      >
        {<args.LeadingVisual />}
      </PageHeader.LeadingVisual>
      <PageHeader.Title
        as={args['Title.as']}
        variant={{
          narrow: args['Title.variant'],
          regular: args['Title.variant'],
          wide: args['Title.variant']
        }}
      >
        {args.Title}
      </PageHeader.Title>
      <PageHeader.TrailingVisual
        hidden={{
          narrow: args['TrailingVisual.hidden'],
          regular: args['TrailingVisual.hidden'],
          wide: args['TrailingVisual.hidden']
        }}
      >
        <Label>Beta</Label>
      </PageHeader.TrailingVisual>
      <PageHeader.TrailingAction
        hidden={{
          narrow: args['TrailingAction.hidden'],
          regular: args['TrailingAction.hidden'],
          wide: args['TrailingAction.hidden']
        }}
      >
        <IconButton icon={PencilIcon} variant="invisible" />
      </PageHeader.TrailingAction>
      <PageHeader.Actions hidden={args['Actions.hidden']}>
        <Hidden on={['narrow']}>
          <Button variant="primary">New Branch</Button>
        </Hidden>

        <Hidden on={['regular', 'wide']}>
          <Button variant="primary">New</Button>
        </Hidden>
        <IconButton aria-label="More" icon={KebabHorizontalIcon} />
      </PageHeader.Actions>
    </PageHeader.TitleArea>
    <PageHeader.Description sx={{padding: 2}} hidden={args['Description.hidden']}>
      <StateLabel status="pullOpened">Open</StateLabel>
      <Hidden on={['narrow']}>
        <Text sx={{fontSize: 1, color: 'fg.muted'}}>
          <Link href="#" muted sx={{fontWeight: 'bold'}}>
            broccolinisoup
          </Link>{' '}
          wants to merge 3 commits into <BranchName href="#">main</BranchName> from{' '}
          <BranchName href="#">broccolinisoup/switch-to-new-underlineNav</BranchName>
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
    <PageHeader.Navigation sx={{paddingTop: 2}} hidden={args['Navigation.hidden']}>
      <UnderlineNav aria-label="Pull Request">
        <UnderlineNav.Item icon={CommentDiscussionIcon} counter="12" selected>
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
)

export const Playground = Template.bind({})

export default meta
