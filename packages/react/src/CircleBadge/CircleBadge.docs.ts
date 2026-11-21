import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'circle_badge',
  name: 'CircleBadge',
  status: 'deprecated',
  a11yReviewed: '2025-01-08',
  stories: [],
  importPath: '@primer/react',
  props: [
    {
      name: 'variant',
      type: "'small' | 'medium' | 'large'",
      defaultValue: "'medium'",
      description: 'Creates a smaller or larger badge. Has no effect if the `size` prop is set',
      required: false,
    },
    {
      name: 'size',
      type: 'number',
      description: 'Sets the size of the badge in pixels. Overrides the `variant` prop when set',
      required: false,
    },
    {
      name: 'inline',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Styles the badge to `display: inline`',
      required: false,
    },
    {
      name: 'ref',
      type: 'React.RefObject<HTMLDivElement>',
      required: false,
      description:
        "Ref to the badge element in React 19. For the default div, pass an explicit `'div'` type argument to `CircleBadge`.",
    },
    {
      name: 'as',
      type: 'React.ElementType',
      defaultValue: '"div"',
      required: false,
      description: 'HTML element or React component to render instead of the default div.',
    },
  ],
  subcomponents: [
    {
      name: 'CircleBadge.Icon',
      props: [
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Element override passed to the icon component, if it supports `as`.',
          required: false,
        },
      ],
      passthrough: {element: 'Octicon', url: '/Octicon'},
      displayName: 'Icon',
    },
  ],
})
