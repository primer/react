import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'SkeletonText',
  displayName: 'SkeletonText',
  status: 'experimental',
  keywords: [],
  stories: [
    'components-skeleton-skeletontext--default',
    'components-skeleton-skeletontext-features--with-max-width',
    'components-skeleton-skeletontext-features--with-multiple-lines',
    'components-skeleton-skeletontext-features--display',
    'components-skeleton-skeletontext-features--subtitle',
    'components-skeleton-skeletontext-features--title-large',
    'components-skeleton-skeletontext-features--title-medium',
    'components-skeleton-skeletontext-features--title-small',
    'components-skeleton-skeletontext-features--body-large',
    'components-skeleton-skeletontext-features--body-medium',
    'components-skeleton-skeletontext-features--body-small',
  ],
  importPath: '@primer/react/experimental',
  props: [
    {
      name: 'size',
      type: "'display' | 'titleLarge' | 'titleMedium' | 'titleSmall' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'subtitle'",
      description: 'Typography size of the text this placeholder replaces.',
      required: false,
      defaultValue: "'bodyMedium'",
    },
    {name: 'lines', type: 'number', description: 'Number of placeholder lines.', required: false, defaultValue: '1'},
    {
      name: 'maxWidth',
      type: "React.CSSProperties['maxWidth']",
      description: 'Maximum width of the placeholder.',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Class name for custom styling of each line.',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/skeleton-text/
    description: 'Reserve space for text while it loads.',
    bestPractices: [],
    anatomy: [],
  },
})
