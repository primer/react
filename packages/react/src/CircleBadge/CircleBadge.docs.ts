import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'CircleBadge',
  displayName: 'CircleBadge',
  status: 'deprecated',
  keywords: [],
  stories: [],
  importPath: '@primer/react',
  props: [
    {
      name: 'variant',
      type: "'small' | 'medium' | 'large'",
      description: 'Size preset used when no explicit size is provided.',
      required: false,
      defaultValue: "'medium'",
    },
    {
      name: 'size',
      type: 'number',
      description: 'Width and height in pixels. Overrides the size preset.',
      required: false,
    },
    {name: 'inline', type: 'boolean', description: 'Renders the badge inline.', required: false, defaultValue: 'false'},
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element or component to render.',
      required: false,
      defaultValue: "'div'",
    },
    {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
  ],
  subcomponents: [
    {
      name: 'CircleBadge.Icon',
      displayName: 'CircleBadge.Icon',
      props: [
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Forwarded to the supplied icon component.',
          required: false,
        },
        {
          name: 'icon',
          type: 'React.ElementType',
          description: 'Icon component to render inside the badge.',
          required: true,
        },
        {
          name: 'aria-label',
          type: 'string',
          description: 'Accessible name for the icon.',
          required: false,
        },
        {
          name: 'size',
          type: "number | 'small' | 'medium' | 'large'",
          description: 'Size forwarded to the icon.',
          required: false,
        },
        {
          name: 'verticalAlign',
          type: "'middle' | 'text-bottom' | 'text-top' | 'top' | 'unset'",
          description: 'Vertical alignment forwarded to the icon.',
          required: false,
        },
        {name: 'fill', type: 'string', description: 'Fill color forwarded to the icon.', required: false},
        {
          name: 'className',
          type: 'string',
          description: 'Class name for custom styling.',
          required: false,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/circle-badge/
    description: 'Display third-party service logos in circular badges, such as in a marketplace listing.',
    bestPractices: [],
    anatomy: [],
  },
})
