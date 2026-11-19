import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'link',
  name: 'Link',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: ['components-link--default', 'components-link-features--muted', 'components-link-features--inline'],
  importPath: '@primer/react',
  props: [
    {
      name: 'href',
      type: 'string',
      defaultValue: '',
      description:
        'URL to be used for the Link. (The `href` is passed to the underlying `<a>` element. If `as` is specified, the link behavior may need different props).',
      required: false,
    },
    {
      name: 'muted',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Uses a less prominent shade for Link color, and the default link shade on hover.',
      required: false,
    },
    {
      name: 'inline',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Set to true for links adjacent to text, underlining them for clear visibility and improved accessibility.',
      required: false,
    },
    {
      name: 'hoverColor',
      type: 'string',
      defaultValue: '',
      description: 'Use CSS modules to style hover color.',
      deprecated: true,
      required: false,
    },
    {
      name: 'ref',
      type: 'React.RefObject<HTMLAnchorElement>',
      description: 'Ref to the rendered anchor or button.',
      required: false,
    },
    {
      name: 'as',
      type: 'React.ElementType',
      defaultValue: '"a"',
      description: 'Element or component to render instead of the default anchor. It must render an anchor or button.',
      required: false,
    },
  ],
  subcomponents: [],
})
