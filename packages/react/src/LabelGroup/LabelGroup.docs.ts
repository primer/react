import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'label_group',
  name: 'LabelGroup',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-labelgroup--default',
    'components-labelgroup-features--truncate-auto',
    'components-labelgroup-features--truncate-auto-with-interactive-tokens',
    'components-labelgroup-features--truncate-after-five',
    'components-labelgroup-features--truncate-auto-expand-inline',
    'components-labelgroup-features--truncate-auto-expand-inline-with-interactive-tokens',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'overflowStyle',
      description:
        "How hidden tokens should be shown. `'inline'` shows the hidden tokens after the visible tokens. `'overlay'` shows all tokens in an overlay that appears on top of the visible tokens.",
      defaultValue: '',
      type: "'inline' | 'overlay'",
      required: false,
    },
    {
      name: 'visibleChildCount',
      description:
        "How many tokens to show. `'auto'` truncates the tokens to fit in the parent container. Passing a number will truncate after that number tokens. If this is undefined, tokens will never be truncated.",
      defaultValue: '',
      type: "'auto' | number",
      required: false,
    },
    {
      name: 'as',
      description: 'Customize the element type of the rendered container.',
      defaultValue: 'ul',
      type: 'React.ElementType',
      required: false,
    },
  ],
  subcomponents: [],
})
