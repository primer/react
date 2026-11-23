import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'skeleton_avatar',
  name: 'SkeletonAvatar',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
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
      type: 'number | { narrow?: number; regular?: number; wide?: number; }',
      defaultValue: '20',
      description: 'The size of the avatar in pixels.',
      required: false,
    },
    {
      name: 'square',
      type: 'boolean',
      defaultValue: 'false',
      description: 'If true, the avatar will be square instead of circular.',
      required: false,
    },
    {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
  ],
  subcomponents: [],
})
