import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Truncate',
  displayName: 'Truncate',
  status: 'stable',
  keywords: [],
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
      type: 'number | string',
      description: 'Maximum width. Numbers are interpreted as pixels; strings are CSS widths.',
      required: false,
      defaultValue: '125',
    },
    {
      name: 'inline',
      type: 'boolean',
      description: 'Displays the truncated text inline.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'expandable',
      type: 'boolean',
      description: 'Allows the text to expand on hover.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element or component used to render the text.',
      required: false,
      defaultValue: 'div',
    },
    {
      name: 'title',
      type: 'string',
      description: 'Full text to expose in the native title tooltip.',
      required: true,
    },
    {name: 'children', type: 'ReactNode', description: 'Text to truncate.', required: false},
    {name: 'className', type: 'string', description: '', required: false},
    {name: 'style', type: 'React.CSSProperties', description: '', required: false},
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/truncate/
    description: 'End overflowing text with an ellipsis when it does not fit.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/truncate/accessibility/
        guidance: false,
        description:
          'Do not rely on the native title tooltip as the only way to read the full text. It cannot be opened with a keyboard.',
      },
    ],
    anatomy: [],
  },
})
