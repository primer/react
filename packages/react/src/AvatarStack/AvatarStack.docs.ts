import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'AvatarStack',
  displayName: 'AvatarStack',
  status: 'stable',
  keywords: [],
  stories: [
    'components-avatarstack--default',
    'components-avatarstack-features--align-left',
    'components-avatarstack-features--align-right',
    'components-avatarstack-features--disable-expand-on-hover',
    'components-avatarstack-features--custom-size-on-parent',
    'components-avatarstack-features--custom-size-on-parent-responsive',
    'components-avatarstack-features--custom-size-on-children',
    'components-avatarstack-features--custom-size-on-children-responsive',
    'components-avatarstack-features--with-single-avatar',
  ],
  importPath: '@primer/react',
  props: [
    {name: 'children', type: 'React.ReactNode', description: 'Avatars to stack.', required: true},
    {name: 'alignRight', type: 'boolean', description: 'Aligns avatars to the right.', required: false},
    {
      name: 'disableExpand',
      type: 'boolean',
      description: 'Prevents avatars from spreading apart on hover.',
      required: false,
    },
    {
      name: 'variant',
      type: "'cascade' | 'stack'",
      description: 'Controls whether overlap increases from the third avatar onward or stays uniform.',
      required: false,
      defaultValue: "'cascade'",
    },
    {
      name: 'shape',
      type: "'circle' | 'square'",
      description: 'Shape of the avatars.',
      required: false,
      defaultValue: "'circle'",
    },
    {
      name: 'size',
      type: 'number | ResponsiveValue<number>',
      description: 'Overrides the size of child avatars. When omitted, the stack uses the child sizes.',
      required: false,
    },
    {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
    {name: 'style', type: 'React.CSSProperties', description: '', required: false},
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/avatar-stack/
    description: 'Show several collaborators or participants in one row of overlapping avatars.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/avatar-stack/
        guidance: true,
        description: 'Use a stack when space is limited. Show up to four avatars in the stack.',
      },
      {
        // Source: https://primer.style/product/components/avatar-stack/
        guidance: false,
        description: 'Avoid stacking when there is enough space to show four or fewer avatars side by side.',
      },
    ],
    anatomy: [],
  },
})
