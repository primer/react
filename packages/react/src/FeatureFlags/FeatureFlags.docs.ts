import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'feature_flags',
  name: 'FeatureFlags',
  status: 'draft',
  a11yReviewed: false,
  stories: [],
  importPath: '@primer/react/experimental',
  props: [
    {
      name: 'flags',
      type: 'FeatureFlags',
      required: true,
      description: 'Object where keys are feature flag names and values are boolean',
    },
  ],
  subcomponents: [],
})
