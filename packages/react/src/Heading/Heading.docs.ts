import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'heading',
  name: 'Heading',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [],
  importPath: '@primer/react',
  props: [
    {
      name: 'as',
      type: 'React.ElementType',
      defaultValue: '"h2"',
      description: 'HTML heading level to render.',
      required: false,
    },
    {
      name: 'variant',
      type: "'large' | 'medium' | 'small'",
      description: 'Visual size of the heading, independent of its heading level.',
      required: false,
    },
  ],
  subcomponents: [],
})
