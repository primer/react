import type {Meta, StoryFn} from '@storybook/react-vite'
import {Placeholder} from '../Placeholder'
import {PageLayout} from './PageLayout'
import classes from './PageLayout.examples.stories.module.css'

const meta: Meta = {
  title: 'Components/PageLayout/Dev',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
  args: {
    // Debug controls
    'Header placeholder height': 64,
    'Pane placeholder height': 200,
    'Content placeholder height': 400,
    'Footer placeholder height': 64,
    containerWidth: 'xlarge',
    padding: 'normal',
    rowGap: 'normal',
    columnGap: 'normal',
    'Header.divider.regular': 'none',
    'Header.divider.narrow': 'none',
    'Header.divider.wide': 'none',
    'Header.padding': 'none',
    'Header.hidden.regular': false,
    'Header.hidden.narrow': false,
    'Header.hidden.wide': false,
    'Content.width': 'full',
    'Content.padding': 'none',
    'Content.hidden.regular': false,
    'Content.hidden.narrow': false,
    'Content.hidden.wide': false,
    'Pane.position.regular': 'end',
    'Pane.position.narrow': 'end',
    'Pane.position.wide': 'end',
    'Pane.width': 'medium',
    'Pane.sticky': false,
    'Pane.resizable': false,
    'Pane.padding': 'none',
    'Pane.divider.regular': 'none',
    'Pane.divider.narrow': 'none',
    'Pane.divider.wide': 'none',
    'Footer.divider.regular': 'none',
    'Footer.divider.narrow': 'none',
    'Footer.divider.wide': 'none',
    'Footer.padding': 'none',
    'Footer.hidden.regular': false,
    'Footer.hidden.narrow': false,
    'Footer.hidden.wide': false,
  },
  argTypes: {
    // Debug controls
    'Render header?': {
      type: 'boolean',
      table: {category: 'Debug'},
    },
    'Render pane?': {
      type: 'boolean',
      table: {category: 'Debug'},
    },
    'Render footer?': {
      type: 'boolean',
      table: {category: 'Debug'},
    },
    'Header placeholder height': {
      type: 'number',
      table: {category: 'Debug'},
    },
    'Pane placeholder height': {
      type: 'number',
      table: {category: 'Debug'},
    },
    'Content placeholder height': {
      type: 'number',
      table: {category: 'Debug'},
    },
    'Footer placeholder height': {
      type: 'number',
      table: {category: 'Debug'},
    },

    // PageLayout prop controls
    containerWidth: {
      type: {
        name: 'enum',
        value: ['full', 'medium', 'large', 'xlarge'],
      },
      control: {type: 'radio'},
      table: {category: 'PageLayout props'},
    },
    padding: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal'],
      },
      control: {type: 'radio'},
      table: {category: 'PageLayout props'},
    },
    rowGap: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal'],
      },
      control: {type: 'radio'},
      table: {category: 'PageLayout props'},
    },
    columnGap: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal'],
      },
      control: {type: 'radio'},
      table: {category: 'PageLayout props'},
    },

    // Header prop controls
    'Header.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line'],
      },
      control: {
        type: 'radio',
      },
      table: {
        category: 'Header props',
      },
    },
    'Header.divider.narrow': {
      type: {
        name: 'enum',
        value: ['none', 'line', 'filled'],
      },
      control: {
        type: 'radio',
      },
      table: {
        category: 'Header props',
      },
    },
    'Header.divider.wide': {
      type: {
        name: 'enum',
        value: ['none', 'line'],
      },
      control: {
        type: 'radio',
      },
      table: {
        category: 'Header props',
      },
    },
    'Header.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal'],
      },
      control: {type: 'radio'},
      table: {category: 'Header props'},
    },
    'Header.hidden.regular': {
      type: 'boolean',
      table: {category: 'Header props'},
    },
    'Header.hidden.narrow': {
      type: 'boolean',
      table: {category: 'Header props'},
    },
    'Header.hidden.wide': {
      type: 'boolean',
      table: {category: 'Header props'},
    },

    // Content prop controls
    'Content.width': {
      type: {
        name: 'enum',
        value: ['full', 'medium', 'large', 'xlarge'],
      },
      control: {type: 'radio'},
      table: {category: 'Content props'},
    },
    'Content.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal'],
      },
      control: {type: 'radio'},
      table: {category: 'Content props'},
    },
    'Content.hidden.regular': {
      type: 'boolean',
      table: {category: 'Content props'},
    },
    'Content.hidden.narrow': {
      type: 'boolean',
      table: {category: 'Content props'},
    },
    'Content.hidden.wide': {
      type: 'boolean',
      table: {category: 'Content props'},
    },

    // Pane prop controls
    'Pane.position.regular': {
      type: {
        name: 'enum',
        value: ['start', 'end'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.position.narrow': {
      type: {
        name: 'enum',
        value: ['start', 'end'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.position.wide': {
      type: {
        name: 'enum',
        value: ['start', 'end'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.width': {
      type: {
        name: 'enum',
        value: ['small', 'medium', 'large'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.minWidth': {
      type: 'number',
      defaultValue: 256,
      table: {category: 'Pane props'},
    },
    'Pane.sticky': {
      type: 'boolean',
      table: {category: 'Pane props'},
    },
    'Pane.resizable': {
      type: 'boolean',
      table: {category: 'Pane props'},
    },
    'Pane.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.divider.narrow': {
      type: {
        name: 'enum',
        value: ['none', 'line', 'filled'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.divider.wide': {
      type: {
        name: 'enum',
        value: ['none', 'line'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },

    // Footer prop controls
    'Footer.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line'],
      },
      control: {
        type: 'radio',
      },
      table: {
        category: 'Footer props',
      },
    },
    'Footer.divider.narrow': {
      type: {
        name: 'enum',
        value: ['none', 'line', 'filled'],
      },
      control: {
        type: 'radio',
      },
      table: {
        category: 'Footer props',
      },
    },
    'Footer.divider.wide': {
      type: {
        name: 'enum',
        value: ['none', 'line'],
      },
      control: {
        type: 'radio',
      },
      table: {
        category: 'Footer props',
      },
    },
    'Footer.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal'],
      },
      control: {type: 'radio'},
      table: {category: 'Footer props'},
    },
    'Footer.hidden.regular': {
      type: 'boolean',
      table: {category: 'Footer props'},
    },
    'Footer.hidden.narrow': {
      type: 'boolean',
      table: {category: 'Footer props'},
    },
    'Footer.hidden.wide': {
      type: 'boolean',
      table: {category: 'Footer props'},
    },
  },
}

export const Default: StoryFn = args => (
  <PageLayout
    containerWidth={args.containerWidth}
    padding={args.padding}
    rowGap={args.rowGap}
    columnGap={args.columnGap}
    className={classes.PageLayout}
  >
    <PageLayout.Header
      padding={args['Header.padding']}
      divider={{
        narrow: args['Header.divider.narrow'],
        regular: args['Header.divider.regular'],
        wide: args['Header.divider.wide'],
      }}
      hidden={{
        narrow: args['Header.hidden.narrow'],
        regular: args['Header.hidden.regular'],
        wide: args['Header.hidden.wide'],
      }}
    >
      <Placeholder height={args['Header placeholder height']} label="Header" />
    </PageLayout.Header>
    <PageLayout.Content
      width={args['Content.width']}
      padding={args['Content.padding']}
      hidden={{
        narrow: args['Content.hidden.narrow'],
        regular: args['Content.hidden.regular'],
        wide: args['Content.hidden.wide'],
      }}
    >
      <Placeholder height={args['Content placeholder height']} label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane
      position={{
        narrow: args['Pane.position.narrow'],
        regular: args['Pane.position.regular'],
        wide: args['Pane.position.wide'],
      }}
      width={args['Pane.width']}
      minWidth={args['Pane.minWidth']}
      sticky={args['Pane.sticky']}
      resizable={args['Pane.resizable']}
      padding={args['Pane.padding']}
      divider={{
        narrow: args['Pane.divider.narrow'],
        regular: args['Pane.divider.regular'],
        wide: args['Pane.divider.wide'],
      }}
      hidden={{
        narrow: args['Pane.hidden.narrow'],
        regular: args['Pane.hidden.regular'],
        wide: args['Pane.hidden.wide'],
      }}
    >
      <Placeholder height={args['Pane placeholder height']} label="Pane" />
    </PageLayout.Pane>
    <PageLayout.Footer
      padding={args['Footer.padding']}
      divider={{
        narrow: args['Footer.divider.narrow'],
        regular: args['Footer.divider.regular'],
        wide: args['Footer.divider.wide'],
      }}
      hidden={{
        narrow: args['Footer.hidden.narrow'],
        regular: args['Footer.hidden.regular'],
        wide: args['Footer.hidden.wide'],
      }}
    >
      <Placeholder height={args['Footer placeholder height']} label="Footer" />
    </PageLayout.Footer>
  </PageLayout>
)

export default meta
