import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'avatar_stack',
  name: 'AvatarStack',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
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
    {
      name: 'children',
      type: 'ReactNode',
      description: 'A set of Avatar components to stack',
      required: true,
    },
    {
      name: 'alignRight',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Align the avatars to the right',
      required: false,
    },
    {
      name: 'disableExpand',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Do not spread the avatars on hover',
      required: false,
    },
    {
      name: 'variant',
      type: "'cascade' | 'stack'",
      defaultValue: "'cascade'",
      description:
        "The style of overlapping avatars. 'cascade' increases the overlap for 3rd+ avatars, while 'stack' uses a uniform overlap.",
      required: false,
    },
    {
      name: 'shape',
      type: "'circle' | 'square'",
      defaultValue: "'circle'",
      description: 'The shape of the avatars.',
      required: false,
    },
    {
      name: 'size',
      type: 'number | { narrow?: number; regular?: number; wide?: number; }',
      defaultValue: '20',
      description: 'The size of the avatar children in pixels.',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Class name for custom styling.',
      required: false,
    },
  ],
  subcomponents: [],
})
