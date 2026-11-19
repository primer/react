import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'FeatureFlags',
  displayName: 'FeatureFlags',
  status: 'experimental',
  keywords: [],
  stories: [],
  importPath: '@primer/react/experimental',
  props: [
    {
      name: 'flags',
      type: 'Record<string, boolean | undefined>',
      description: 'Feature flag values to layer over those in the parent scope.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content that receives the updated feature flags.',
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
