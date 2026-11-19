import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'progress_bar',
  name: 'ProgressBar',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
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
      description: 'Whether the filled in area(s) of the progress bar will be animated or not',
      required: false,
    },
    {
      name: 'progress',
      type: 'number',
      defaultValue: '0',
      description: 'Used to set the size of the green bar',
      required: false,
    },
    {
      name: 'barSize',
      type: "| 'small' | 'large' | 'default'",
      defaultValue: "'default'",
      description: 'Controls the height of the progress bar. If omitted, height is set to the default height.',
      required: false,
    },
    {
      name: 'inline',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Styles the progress bar inline',
      required: false,
    },
    {
      name: 'bg',
      type: 'string',
      defaultValue: "'bg.successInverse'",
      description: 'Set the progress bar color',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'ProgressBar.Item',
      props: [
        {
          name: 'aria-label',
          type: 'string',
          description: 'Defines a string value that labels the current element.\n@see aria-labelledby.',
          defaultValue: '',
          required: false,
        },
        {
          name: 'bg',
          type: 'string',
          description: 'Set the progress segment color',
          defaultValue: 'success.emphasis',
          required: false,
        },
        {
          name: 'progress',
          type: 'string | number',
          description: 'Used to set the size of the green bar',
          defaultValue: '0',
          required: false,
        },
      ],
      displayName: 'Item',
    },
  ],
})
