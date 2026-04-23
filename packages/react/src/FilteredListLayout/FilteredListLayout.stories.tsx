import type {Meta, StoryFn} from '@storybook/react-vite'
import {Button, IconButton} from '../Button'
import {
  CheckIcon,
  CommentIcon,
  EyeIcon,
  IssueOpenedIcon,
  KebabHorizontalIcon,
  MentionIcon,
  PersonIcon,
  TagIcon,
} from '@primer/octicons-react'
import {NavList} from '../NavList'
import {Placeholder} from '../Placeholder'
import {FilteredListLayout} from '../FilteredListLayout'

const sidebarViews = [
  {key: 'open', label: 'Open issues', icon: IssueOpenedIcon, count: 142, selected: true},
  {key: 'assigned', label: 'Assigned to you', icon: PersonIcon, count: 8},
  {key: 'created', label: 'Created by you', icon: CheckIcon, count: 23},
  {key: 'mentioned', label: 'Mentions you', icon: MentionIcon, count: 4},
  {key: 'commented', label: 'Recently commented', icon: CommentIcon, count: 12},
  {key: 'subscribed', label: 'Subscribed', icon: EyeIcon, count: 31},
  {key: 'labeled', label: 'Labeled bug', icon: TagIcon, count: 17},
]

const meta: Meta = {
  title: 'Components/FilteredListLayout',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
  args: {
    'Render header?': true,
    'Render sidebar?': true,
    'Render filter bar?': true,
    'Render footer?': false,
    'Sidebar placeholder height': 400,
    'Filter bar placeholder height': 48,
    'Results placeholder height': 552,
    'Footer placeholder height': 64,
    'Header.title': 'Assigned to you',
    'Header.primaryAction': true,
    'Header.actions': true,
    'Header.padding': 'normal',
    'Header.divider': 'line',
    'Sidebar.position': 'start',
    'Sidebar.divider': 'line',
    'Sidebar.padding': 'condensed',
    'Sidebar.sticky': true,
    'Content.width': 'xlarge',
    'Content.padding': 'normal',
    'Footer.padding': 'normal',
    'Footer.divider': 'line',
  },
  argTypes: {
    'Render header?': {type: 'boolean', table: {category: 'Debug'}},
    'Render sidebar?': {type: 'boolean', table: {category: 'Debug'}},
    'Render filter bar?': {type: 'boolean', table: {category: 'Debug'}},
    'Render footer?': {type: 'boolean', table: {category: 'Debug'}},
    'Sidebar placeholder height': {type: 'number', table: {category: 'Debug'}},
    'Filter bar placeholder height': {type: 'number', table: {category: 'Debug'}},
    'Results placeholder height': {type: 'number', table: {category: 'Debug'}},
    'Footer placeholder height': {type: 'number', table: {category: 'Debug'}},

    'Header.title': {
      type: 'string',
      control: {type: 'text'},
      table: {category: 'Header props'},
    },
    'Header.primaryAction': {
      type: 'boolean',
      table: {category: 'Header props'},
    },
    'Header.actions': {
      type: 'boolean',
      table: {category: 'Header props'},
    },
    'Header.padding': {
      type: {name: 'enum', value: ['none', 'condensed', 'normal']},
      control: {type: 'radio'},
      table: {category: 'Header props'},
    },
    'Header.divider': {
      type: {name: 'enum', value: ['none', 'line']},
      control: {type: 'radio'},
      table: {category: 'Header props'},
    },

    'Sidebar.position': {
      type: {name: 'enum', value: ['start', 'end']},
      control: {type: 'radio'},
      table: {category: 'Sidebar props'},
    },
    'Sidebar.divider': {
      type: {name: 'enum', value: ['none', 'line']},
      control: {type: 'radio'},
      table: {category: 'Sidebar props'},
    },
    'Sidebar.padding': {
      type: {name: 'enum', value: ['none', 'condensed', 'normal']},
      control: {type: 'radio'},
      table: {category: 'Sidebar props'},
    },
    'Sidebar.sticky': {type: 'boolean', table: {category: 'Sidebar props'}},

    'Content.width': {
      type: {name: 'enum', value: ['full', 'medium', 'large', 'xlarge']},
      control: {type: 'radio'},
      table: {category: 'Content props'},
    },
    'Content.padding': {
      type: {name: 'enum', value: ['none', 'condensed', 'normal']},
      control: {type: 'radio'},
      table: {category: 'Content props'},
    },

    'Footer.padding': {
      type: {name: 'enum', value: ['none', 'condensed', 'normal']},
      control: {type: 'radio'},
      table: {category: 'Footer props'},
    },
    'Footer.divider': {
      type: {name: 'enum', value: ['none', 'line']},
      control: {type: 'radio'},
      table: {category: 'Footer props'},
    },
  },
}

export const Default: StoryFn = args => (
  <FilteredListLayout>
    {args['Render header?'] ? (
      <FilteredListLayout.Header
        padding={args['Header.padding']}
        divider={args['Header.divider']}
        title={args['Header.title']}
        primaryAction={args['Header.primaryAction'] ? <Button variant="primary">New issue</Button> : undefined}
        actions={
          args['Header.actions'] ? <IconButton icon={KebabHorizontalIcon} aria-label="More options" /> : undefined
        }
      />
    ) : null}
    {args['Render sidebar?'] ? (
      <FilteredListLayout.Sidebar
        position={args['Sidebar.position']}
        divider={args['Sidebar.divider']}
        padding={args['Sidebar.padding']}
        sticky={args['Sidebar.sticky']}
        aria-label="Sidebar"
      >
        <NavList aria-label="Issue views">
          {sidebarViews.map(view => {
            const Icon = view.icon
            return (
              <NavList.Item key={view.key} href={`#${view.key}`} aria-current={view.selected ? 'page' : undefined}>
                <NavList.LeadingVisual>
                  <Icon />
                </NavList.LeadingVisual>
                {view.label}
                <NavList.TrailingVisual>{view.count}</NavList.TrailingVisual>
              </NavList.Item>
            )
          })}
        </NavList>
      </FilteredListLayout.Sidebar>
    ) : null}
    <FilteredListLayout.Content width={args['Content.width']} padding={args['Content.padding']}>
      {args['Render filter bar?'] ? (
        <FilteredListLayout.FilterBar aria-label="Filters">
          <Placeholder label="Filter bar" height={args['Filter bar placeholder height']} />
        </FilteredListLayout.FilterBar>
      ) : null}
      <FilteredListLayout.Results aria-label="Results">
        <Placeholder label="Content" height={args['Results placeholder height']} />
      </FilteredListLayout.Results>
    </FilteredListLayout.Content>
    {args['Render footer?'] ? (
      <FilteredListLayout.Footer padding={args['Footer.padding']} divider={args['Footer.divider']}>
        <Placeholder label="Footer" height={args['Footer placeholder height']} />
      </FilteredListLayout.Footer>
    ) : null}
  </FilteredListLayout>
)

export default meta
