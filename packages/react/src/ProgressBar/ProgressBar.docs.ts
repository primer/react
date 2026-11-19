import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'ProgressBar',
  displayName: 'ProgressBar',
  status: 'stable',
  keywords: [],
  stories: [
    'components-progressbar--default',
    'components-progressbar-features--progress-zero',
    'components-progressbar-features--progress-half',
    'components-progressbar-features--progress-done',
    'components-progressbar-features--size-small',
    'components-progressbar-features--size-large',
    'components-progressbar-features--inline',
    'components-progressbar-features--all-colors',
    'components-progressbar-features--multiple-items',
    'components-progressbar-features--animated',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'animated',
      type: 'boolean',
      description: 'Animates the single progress segment.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'progress',
      type: 'string | number',
      description: 'Percentage to fill. Use either `progress` or children for segments.',
      required: false,
      defaultValue: '0',
    },
    {
      name: 'barSize',
      type: "'small' | 'default' | 'large'",
      description: 'Height preset for the bar.',
      required: false,
      defaultValue: "'default'",
    },
    {
      name: 'inline',
      type: 'boolean',
      description: 'Displays the bar inline instead of as a block.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'bg',
      type: 'string',
      description: 'Primer background color for the single progress segment.',
      required: false,
      defaultValue: "'success.emphasis'",
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'ProgressBar.Item segments to display in place of a single progress value.',
      required: false,
    },
    {name: 'className', type: 'string', description: 'Class name for the bar container.', required: false},
    {
      name: 'aria-label',
      type: 'string',
      description: 'Accessible name for the single segment.',
      required: false,
    },
    {
      name: 'aria-valuenow',
      type: 'number',
      description: 'Overrides the accessible numeric value of the single segment.',
      required: false,
    },
    {
      name: 'aria-valuetext',
      type: 'string',
      description: 'Accessible text describing the current progress.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'ProgressBar.Item',
      displayName: 'ProgressBar.Item',
      props: [
        {
          name: 'aria-label',
          type: 'string',
          description: 'Accessible name for the segment.',
          required: false,
        },
        {
          name: 'bg',
          type: 'string',
          description: 'Primer background color for the segment.',
          required: false,
          defaultValue: "'success.emphasis'",
        },
        {
          name: 'progress',
          type: 'string | number',
          description: 'Percentage filled by the segment.',
          required: false,
          defaultValue: '0',
        },
        {name: 'className', type: 'string', description: 'Class name for the segment.', required: false},
        {
          name: 'aria-valuenow',
          type: 'number',
          description: 'Overrides the accessible numeric value of the segment.',
          required: false,
        },
        {
          name: 'aria-valuetext',
          type: 'string',
          description: 'Accessible text describing this segment’s value.',
          required: false,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/progress-bar/
    description: 'Show completion or how individual values make up a whole.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/progress-bar/
        guidance: true,
        description:
          'Pair the bar with visible values for its filled segments unless the progress is intentionally approximate.',
      },
    ],
    anatomy: [],
  },
})
