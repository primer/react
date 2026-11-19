import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'AriaAlert',
  displayName: 'AriaAlert',
  status: 'experimental',
  keywords: [],
  stories: [],
  importPath: '@primer/react',
  props: [
    {
      name: 'announceOnShow',
      type: 'boolean',
      description: 'Announces the content when the alert renders and is not hidden.',
      required: false,
      defaultValue: 'true',
    },
    {
      name: 'hidden',
      type: 'boolean',
      description: 'Hides the alert and prevents announcements while hidden.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element used to render the alert.',
      required: false,
      defaultValue: 'div',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content whose text is announced assertively.',
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
