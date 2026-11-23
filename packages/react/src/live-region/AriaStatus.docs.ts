import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'aria-status',
  name: 'AriaStatus',
  status: 'alpha',
  a11yReviewed: false,
  importPath: '@primer/react',
  stories: [],
  props: [
    {
      name: 'announceOnShow',
      type: 'boolean',
      description:
        'Specify if the content of the element should be announced when this component is rendered and is not hidden',
      defaultValue: 'false',
      required: false,
    },
    {
      name: 'hidden',
      type: 'boolean',
      description: 'Specify if the element is hidden',
      defaultValue: 'false',
      required: false,
    },
    {
      name: 'delayMs',
      type: 'number',
      description: 'Provide a delay in milliseconds before the announcement is made',
      required: false,
    },
  ],
  subcomponents: [],
})
