import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'page_header',
  name: 'PageHeader',
  status: 'beta',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-pageheader--default',
    'components-pageheader-features--has-title-only',
    'components-pageheader-features--has-large-title',
    'components-pageheader-features--with-leading-and-trailing-visuals',
    'components-pageheader-features--with-leading-visual-hidden-on-regular-viewport',
    'components-pageheader-features--with-actions',
    'components-pageheader-features--with-description-slot',
    'components-pageheader-features--with-navigation-slot',
    'components-pageheader-features--with-custom-navigation',
    'components-pageheader-features--with-leading-and-trailing-actions',
    'components-pageheader-features--with-parent-link-and-actions-of-context-area',
    'components-pageheader-features--with-context-bar-and-actions-of-context-area',
    'components-pageheader-features--with-actions-that-have-responsive-content',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'aria-label',
      type: 'string | undefined',
      defaultValue: '',
      description: 'A unique label for the rendered landmark',
      required: false,
    },
    {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
    {
      name: 'role',
      type: 'AriaRole',
      description: 'The ARIA role to assign to the top-level node of this component.',
      required: false,
    },
    {
      name: 'as',
      type: 'React.ElementType',
      defaultValue: '"div"',
      required: false,
      description: 'Element or component to render instead of the default <div>.',
    },
    {
      name: 'hasBorder',
      type: 'boolean',
      description:
        'Whether to render a border below the PageHeader. This border will NOT be rendered if the PageHeader has a `PageHeader.Navigation` child that is not hidden at the current breakpoint.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'PageHeader.ContextArea',
      props: [
        {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
        {
          name: 'hidden',
          type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
          defaultValue: 'false',
          description: 'Whether the content is hidden.',
          required: false,
        },
      ],
      displayName: 'ContextArea',
    },
    {
      name: 'PageHeader.ParentLink',
      props: [
        {
          name: 'aria-label',
          type: 'string | undefined',
          defaultValue: '',
          description: 'A unique label for the rendered landmark',
          required: false,
        },
        {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
        {name: 'href', type: 'string', defaultValue: '', description: 'The URL to link to.', required: false},
        {
          name: 'hidden',
          type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
          defaultValue: '`{ narrow: false regular: true wide: true }`',
          description: 'Whether the parent link is hidden.',
          required: false,
        },
      ],
      displayName: 'ParentLink',
    },
    {
      name: 'PageHeader.ContextBar',
      props: [
        {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
        {
          name: 'hidden',
          type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
          defaultValue: 'false',
          description: 'Whether the content is hidden.',
          required: false,
        },
      ],
      displayName: 'ContextBar',
    },
    {
      name: 'PageHeader.ContextAreaActions',
      props: [
        {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
        {
          name: 'hidden',
          type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
          defaultValue: 'false',
          description: 'Whether the content is hidden.',
          required: false,
        },
      ],
      displayName: 'ContextAreaActions',
    },
    {
      name: 'PageHeader.TitleArea',
      props: [
        {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
        {
          name: 'hidden',
          type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
          defaultValue: 'false',
          description: 'Whether the content is hidden.',
          required: false,
        },
        {
          name: 'variant',
          type: "| 'subtitle' | 'medium' | 'large' | { narrow?: | 'subtitle' | 'medium' | 'large' regular?: | 'subtitle' | 'medium' | 'large' wide?: | 'subtitle' | 'medium' | 'large' }",
          defaultValue: 'medium',
          description:
            'Default title (medium) is the most common page title size. Use for static titles in most situations.\nLarge variant should be used for user-generated content such as issues, pull requests, or discussions.\nSubtitle variant can be used when a PageHeader.Title is already present in the page, such as in a SplitPageLayout.',
          required: false,
        },
      ],
      displayName: 'TitleArea',
    },
    {
      name: 'PageHeader.LeadingAction',
      props: [
        {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
        {
          name: 'hidden',
          type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
          defaultValue: 'false',
          description: 'Whether the content is hidden.',
          required: false,
        },
      ],
      displayName: 'LeadingAction',
    },
    {
      name: 'PageHeader.LeadingVisual',
      props: [
        {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
        {
          name: 'hidden',
          type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
          defaultValue: 'false',
          description: 'Whether the content is hidden.',
          required: false,
        },
      ],
      displayName: 'LeadingVisual',
    },
    {
      name: 'PageHeader.Title',
      props: [
        {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
        {
          name: 'hidden',
          type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
          defaultValue: 'false',
          description: 'Whether the content is hidden.',
          required: false,
        },
        {
          name: 'as',
          type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'",
          defaultValue: '"h2"',
          description: 'Heading level to render. Standard heading attributes are forwarded to the rendered heading.',
          required: false,
        },
      ],
      displayName: 'Title',
    },
    {
      name: 'PageHeader.TrailingVisual',
      props: [
        {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
        {
          name: 'hidden',
          type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
          defaultValue: 'false',
          description: 'Whether the content is hidden.',
          required: false,
        },
      ],
      displayName: 'TrailingVisual',
    },
    {
      name: 'PageHeader.TrailingAction',
      props: [
        {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
        {
          name: 'hidden',
          type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
          defaultValue: 'false',
          description: 'Whether the content is hidden.',
          required: false,
        },
      ],
      displayName: 'TrailingAction',
    },
    {
      name: 'PageHeader.Actions',
      props: [
        {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
        {
          name: 'hidden',
          type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
          defaultValue: 'false',
          description: 'Whether the content is hidden.',
          required: false,
        },
      ],
      displayName: 'Actions',
    },
    {
      name: 'PageHeader.Breadcrumbs',
      props: [
        {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
        {
          name: 'hidden',
          type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
          defaultValue: 'false',
          description: 'Whether the content is hidden.',
          required: false,
        },
      ],
      displayName: 'Breadcrumbs',
    },
    {
      name: 'PageHeader.Description',
      props: [
        {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
        {
          name: 'hidden',
          type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
          defaultValue: 'false',
          description: 'Whether the content is hidden.',
          required: false,
        },
      ],
      displayName: 'Description',
    },
    {
      name: 'PageHeader.Navigation',
      props: [
        {
          name: 'aria-label',
          type: 'string',
          description: 'The aria-label attribute for the navigaton component when it is rendered as a "nav" element.',
          required: false,
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          description:
            'The aria-labelledby attribute for the navigaton component when it is rendered as a "nav" element.',
          required: false,
        },
        {
          name: 'as',
          type: 'div | nav',
          defaultValue: '"div"',
          description: 'The HTML element used to render the navigation.',
          required: false,
        },
        {name: 'className', type: 'string | undefined', defaultValue: '', description: 'CSS string', required: false},
        {
          name: 'hidden',
          type: '| boolean | { narrow?: boolean regular?: boolean wide?: boolean }',
          defaultValue: 'false',
          description: 'Whether the content is hidden.',
          required: false,
        },
      ],
      displayName: 'Navigation',
    },
  ],
})
