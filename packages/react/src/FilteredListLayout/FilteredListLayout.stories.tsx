import type {Meta, StoryFn} from '@storybook/react-vite'
import {Button, IconButton} from '../Button'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {Placeholder} from '../Placeholder'
import {FilteredListLayout} from '../FilteredListLayout'

const meta: Meta = {
  title: 'Components/FilteredListLayout',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
  args: {
    'Render header?': true,
    'Render pane?': true,
    'Render filter bar?': true,
    'Render footer?': false,
    'Pane placeholder height': 400,
    'Filter bar placeholder height': 48,
    'Results placeholder height': 552,
    'Footer placeholder height': 64,
    'Header.title': 'Assigned to you',
    'Header.primaryAction': true,
    'Header.actions': true,
    'Header.padding': 'normal',
    'Header.divider': 'line',
    'Pane.position': 'start',
    'Pane.divider': 'line',
    'Pane.padding': 'normal',
    'Pane.sticky': true,
    'Content.width': 'xlarge',
    'Content.padding': 'normal',
    'Footer.padding': 'normal',
    'Footer.divider': 'line',
  },
  argTypes: {
    'Render header?': {type: 'boolean', table: {category: 'Debug'}},
    'Render pane?': {type: 'boolean', table: {category: 'Debug'}},
    'Render filter bar?': {type: 'boolean', table: {category: 'Debug'}},
    'Render footer?': {type: 'boolean', table: {category: 'Debug'}},
    'Pane placeholder height': {type: 'number', table: {category: 'Debug'}},
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

    'Pane.position': {
      type: {name: 'enum', value: ['start', 'end']},
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.divider': {
      type: {name: 'enum', value: ['none', 'line']},
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.padding': {
      type: {name: 'enum', value: ['none', 'condensed', 'normal']},
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.sticky': {type: 'boolean', table: {category: 'Pane props'}},

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
    {args['Render pane?'] ? (
      <FilteredListLayout.Pane
        position={args['Pane.position']}
        divider={args['Pane.divider']}
        padding={args['Pane.padding']}
        sticky={args['Pane.sticky']}
        aria-label="Sidebar"
      >
        <Placeholder label="Pane" height={args['Pane placeholder height']} />
      </FilteredListLayout.Pane>
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
