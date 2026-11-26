import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'SkeletonBox',
  displayName: 'SkeletonBox',
  status: 'stable',
  keywords: [],
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
        'Delays rendering by 300 ms for `short`, 1000 ms for `long`, or a custom number of milliseconds. Omit to render immediately.',
      required: false,
    },
    {
      name: 'width',
      type: "React.CSSProperties['width']",
      description: 'Width of the placeholder.',
      required: false,
    },
    {
      name: 'height',
      type: "React.CSSProperties['height']",
      description: 'Height of the placeholder.',
      required: false,
      defaultValue: '1rem',
    },
    {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/skeleton-box/
    description: 'Reserve space for loading UI such as an image, rather than text or an avatar.',
    bestPractices: [],
    anatomy: [],
  },
})
