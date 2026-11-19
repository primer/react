import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Details',
  displayName: 'Details',
  status: 'stable',
  keywords: [],
  stories: ['components-details--default'],
  importPath: '@primer/react',
  props: [],
  subcomponents: [
    {
      name: 'Details.Summary',
      displayName: 'Details.Summary',
      props: [
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Element or component that renders the summary.',
          required: false,
          defaultValue: "'summary'",
        },
        {name: 'children', type: 'React.ReactNode', description: '', required: false},
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/details/
    description: 'Use a styled native disclosure to show or hide additional information.',
    bestPractices: [],
    anatomy: [],
  },
})
