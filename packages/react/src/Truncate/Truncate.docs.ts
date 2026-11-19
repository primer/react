import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'truncate',
  name: 'Truncate',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-truncate--default',
    'components-truncate-features--expandable',
    'components-truncate-features--inline',
    'components-truncate-features--max-width',
    'components-truncate-features--as-link',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'maxWidth',
      type: 'number',
      defaultValue: '125',
      description: 'Sets the max-width of the text.',
      required: false,
    },
    {
      name: 'inline',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Displays text as inline block and vertical aligns to the top.',
      required: false,
    },
    {
      name: 'expandable',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Allows the truncated text to be displayed on hover.',
      required: false,
    },
    {
      name: 'as',
      type: 'React.ElementType',
      defaultValue: "'div'",
      description: 'The HTML element or React component to render as the root element.',
      required: false,
    },
  ],
  subcomponents: [],
})
