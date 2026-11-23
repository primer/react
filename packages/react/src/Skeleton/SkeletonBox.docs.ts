import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'skeleton_box',
  name: 'SkeletonBox',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-skeleton-skeletonbox--default',
    'components-skeleton-skeletonbox-features--custom-height',
    'components-skeleton-skeletonbox-features--custom-width',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'delay',
      type: "'short' | 'long' | number",
      description:
        "Controls whether and how long to delay rendering the SkeletonBox. Set to 'short' to delay by 300ms, 'long' to delay by 1000ms, or provide a custom number of milliseconds.",
      defaultValue: 'false',
      required: false,
    },
    {
      name: 'width',
      type: 'string',
      description: 'Width of the skeleton box. Accepts any valid CSS `width` value.',
      required: false,
    },
    {
      name: 'height',
      defaultValue: '1rem',
      type: 'string',
      description: 'Height of the skeleton box. Accepts any valid CSS `height` value.',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'The className of the skeleton box',
      required: false,
    },
  ],
  subcomponents: [],
})
