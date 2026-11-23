import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'details',
  name: 'Details',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: ['components-details--default'],
  importPath: '@primer/react',
  props: [],
  subcomponents: [
    {
      name: 'Details.Summary',
      props: [
        {
          name: 'as',
          type: 'React.ElementType<React.PropsWithChildren<any>>',
          defaultValue: 'summary',
          required: false,
          description: 'HTML element to render summary as.',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Content of the summary that toggles the details panel.',
          required: false,
        },
      ],
      displayName: 'Summary',
    },
  ],
})
