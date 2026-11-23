import {defineComponent} from './docs/component'

export default defineComponent({
  id: 'side_nav',
  name: 'SideNav',
  status: 'deprecated',
  a11yReviewed: false,
  importPath: '@primer/react',
  stories: [
    'deprecated-components-sidenav-dev--default',
    'deprecated-components-sidenav-dev--full-variant',
    'deprecated-components-sidenav-dev--lightweight-variant',
    'deprecated-components-sidenav-dev--lightweight-nested-variant',
  ],
  props: [
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'The navigation content, typically `SideNav.Link` items. Use `NavList` for new navigation.',
      required: false,
    },
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Render a different element or component instead of the navigation landmark.',
      required: false,
      defaultValue: "'nav'",
    },
    {
      name: 'variant',
      type: "'lightweight' | 'normal'",
      description: 'Choose the visual style of the navigation.',
      required: false,
      defaultValue: "'normal'",
    },
    {
      name: 'bordered',
      type: 'boolean',
      description: 'Show a border around the navigation.',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'An additional class name for the navigation.',
      required: false,
    },
    {
      name: 'aria-label',
      type: 'string',
      description: 'The accessible name of the navigation landmark.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'SideNav.Link',
      displayName: 'Link',
      props: [
        {name: 'children', type: 'React.ReactNode', description: 'The navigation link content.', required: false},
        {
          name: 'href',
          type: 'string',
          description: 'The URL to navigate to when rendering an anchor.',
          required: false,
        },
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Render a different element or component. It should render an anchor or button.',
          required: false,
          defaultValue: "'a'",
        },
        {
          name: 'selected',
          type: 'boolean',
          description: 'Mark this link as the current page unless `aria-current` is supplied.',
          required: false,
        },
        {
          name: 'to',
          type: 'To',
          description:
            'A string marks this link as the current page unless `aria-current` is supplied. This prop is not forwarded.',
          required: false,
        },
        {
          name: 'aria-current',
          type: "boolean | 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false'",
          description: 'Override the current-page state inferred from `selected` or a string `to`.',
          required: false,
        },
        {
          name: 'variant',
          type: "'full' | 'normal'",
          description: 'Use `full` to lay out the link content in a row with space between items.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: 'An additional class name for the link.',
          required: false,
        },
        {
          name: 'muted',
          type: 'boolean',
          description: 'Use the muted link style.',
          required: false,
        },
        {
          name: 'inline',
          type: 'boolean',
          description: 'Apply the link style for use within text.',
          required: false,
        },
        {
          name: 'hoverColor',
          type: 'string',
          description: 'Deprecated. Use CSS modules to style the hover color.',
          required: false,
        },
        {
          name: 'ref',
          type: "SideNavLinkProps['ref']",
          description: 'A ref to the default anchor.',
          required: false,
        },
      ],
      passthrough: {element: 'a', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes'},
    },
  ],
})
