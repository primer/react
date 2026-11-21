import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'visually_hidden',
  name: 'VisuallyHidden',
  status: 'stable',
  a11yReviewed: false,
  importPath: '@primer/react',
  stories: ['components-visuallyhidden-dev--default'],
  props: [
    {
      name: 'children',
      type: 'React.ReactNode',
      description:
        'Content hidden visually but available to screen readers. The content becomes visible when the wrapper or one of its descendants has focus.',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'An additional class name for the span.',
      required: false,
    },
  ],
  subcomponents: [],
  passthrough: {element: 'span', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span'},
})
