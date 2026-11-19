import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'SkeletonAvatar',
  displayName: 'SkeletonAvatar',
  status: 'experimental',
  keywords: [],
  stories: [
    'components-skeleton-skeletonavatar--default',
    'components-skeleton-skeletonavatar-features--square',
    'components-skeleton-skeletonavatar-features--size',
    'components-skeleton-skeletonavatar-features--size-responsive',
    'components-skeleton-skeletonavatar-features--in-a-stack',
  ],
  importPath: '@primer/react/experimental',
  props: [
    {
      name: 'size',
      type: 'number | {narrow?: number; regular?: number; wide?: number}',
      description: 'Size in pixels, optionally set per viewport.',
      required: false,
      defaultValue: '20',
    },
    {
      name: 'square',
      type: 'boolean',
      description: 'Renders a square placeholder instead of a circular one.',
      required: false,
      defaultValue: 'false',
    },
    {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/skeleton-avatar/
    description: 'Show a placeholder while an Avatar loads.',
    bestPractices: [],
    anatomy: [],
  },
})
