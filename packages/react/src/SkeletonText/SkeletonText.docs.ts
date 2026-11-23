import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'skeleton_text',
  name: 'SkeletonText',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
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
      defaultValue: "'bodyMedium'",
      type: "'display' | 'titleLarge' | 'titleMedium' | 'titleSmall' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'subtitle'",
      description: 'Size of the text that the skeleton is replacing.',
      required: false,
    },
    {
      name: 'lines',
      defaultValue: '1',
      type: 'number',
      description: 'Number of lines of skeleton text to render.',
      required: false,
    },
    {
      name: 'maxWidth',
      type: 'string',
      description:
        'Maximum width that the line(s) of skeleton text can take up.  Accepts any valid CSS `max-width` value.',
      required: false,
    },
    {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
  ],
  subcomponents: [],
})
