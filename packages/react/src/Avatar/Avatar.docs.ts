import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Avatar',
  displayName: 'Avatar',
  status: 'stable',
  keywords: [],
  stories: [
    'components-avatar--default',
    'components-avatar-features--square',
    'components-avatar-features--size',
    'components-avatar-features--size-responsive',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'alt',
      type: 'string',
      description: 'Provide alternative text when the avatar is not next to the user’s name.',
      required: false,
      defaultValue: '""',
    },
    {
      name: 'size',
      type: 'number | ResponsiveValue<number>',
      description: 'Width and height in pixels.',
      required: false,
      defaultValue: '20',
    },
    {
      name: 'square',
      type: 'boolean',
      description: 'Shows a rounded square instead of a circle.',
      required: false,
      defaultValue: 'false',
    },
    {name: 'src', type: 'string', description: 'URL of the avatar image.', required: true},
    {name: 'className', type: 'string', description: 'Additional class name.', required: false},
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/avatar/
    description: 'Represent a user, organization, bot, or team with an image.',
    bestPractices: [],
    anatomy: [],
  },
})
