import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Portal',
  displayName: 'Portal',
  status: 'experimental',
  keywords: [],
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
      type: '() => void',
      description: 'Called when the portal is added to the DOM.',
      required: false,
    },
    {
      name: 'containerName',
      type: 'string',
      description:
        'Name of a container registered with `registerPortalRoot`. If omitted, uses the portal context or the default root.',
      required: false,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content rendered in the portal root.',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {
    description: '',
    bestPractices: [],
    anatomy: [],
  },
})
