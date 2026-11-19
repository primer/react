import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'aria-alert',
  name: 'AriaAlert',
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
      defaultValue: 'true',
      required: false,
    },
    {
      name: 'hidden',
      type: 'boolean',
      description: 'Specify if the element is hidden',
      defaultValue: 'false',
      required: false,
    },
  ],
  subcomponents: [],
})
