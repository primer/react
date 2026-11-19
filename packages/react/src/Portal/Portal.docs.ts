import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'portal',
  name: 'Portal',
  status: 'alpha',
  a11yReviewed: false,
  stories: [
    'behaviors-portal--default',
    'behaviors-portal-features--custom-portal-root-by-id',
    'behaviors-portal-features--custom-portal-root-by-registration',
    'behaviors-portal-features--multiple-portal-roots',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'onMount',
      type: 'function',
      defaultValue: '',
      description: 'Called when this portal is added to the DOM',
      required: false,
    },
    {
      name: 'containerName',
      type: 'string',
      defaultValue: '',
      description:
        'Renders the portal children into the container registered with the given name. If omitted, children are rendered into the default portal root.',
      required: false,
    },
  ],
  subcomponents: [],
})
