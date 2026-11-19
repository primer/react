import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'AriaStatus',
  displayName: 'AriaStatus',
  status: 'experimental',
  keywords: [],
  stories: [],
  importPath: '@primer/react',
  props: [
    {
      name: 'announceOnShow',
      type: 'boolean',
      description: 'Announces the content when the status renders and is not hidden.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'hidden',
      type: 'boolean',
      description: 'Hides the status and prevents announcements while hidden.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'delayMs',
      type: 'number',
      description: 'Number of milliseconds to wait before announcing the content.',
      required: false,
    },
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element used to render the status.',
      required: false,
      defaultValue: 'div',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content whose text is announced politely.',
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
