import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'NavList',
  displayName: 'NavList',
  status: 'stable',
  keywords: [],
  stories: [
    'components-navlist--default',
    'components-navlist-features--expand-with-custom-items',
    'components-navlist-features--expand-with-pages',
    'components-navlist-features--group-with-expand-and-custom-items',
    'components-navlist-features--with-description',
    'components-navlist-features--with-expand',
    'components-navlist-features--with-expand-and-icons',
    'components-navlist-features--with-group',
    'components-navlist-features--with-group-expand',
    'components-navlist-features--with-group-heading-links',
    'components-navlist-features--with-inactive-items',
    'components-navlist-features--with-nested-sub-items',
    'components-navlist-features--with-next-js-link',
    'components-navlist-features--with-react-router-link',
    'components-navlist-features--with-reloads',
    'components-navlist-features--with-sub-items',
    'components-navlist-features--with-trailing-action',
    'components-navlist-features--with-trailing-action-in-sub-item',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'aria-label',
      type: 'string',
      description: 'Names the navigation landmark directly.',
      required: false,
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      description:
        'ID of the element that names the landmark. The list heading supplies the name if neither naming prop is provided.',
      required: false,
    },
    {
      name: 'disableItemGap',
      type: 'boolean',
      description: 'Disables the gap when the item gap feature is enabled.',
      required: false,
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLElement>',
      description: 'Ref to the rendered element.',
      required: false,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Navigation links, groups, and an optional heading.',
      required: true,
    },
  ],
  subcomponents: [
    {
      name: 'NavList.Heading',
      displayName: 'NavList.Heading',
      props: [
        {
          name: 'as',
          type: "'h2' | 'h3'",
          description: 'Heading level. Group headings default to one level deeper.',
          required: false,
          defaultValue: 'h2',
        },
        {
          name: 'visuallyHidden',
          type: 'boolean',
          description: 'Keeps the heading available to assistive technology while hiding it visually.',
          required: false,
          defaultValue: 'false',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Text for the navigation heading.',
          required: false,
        },
        {
          name: 'id',
          type: 'string',
          description: 'ID of the heading.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
        {
          name: 'style',
          type: 'React.CSSProperties',
          description: '',
          required: false,
        },
      ],
    },
    {
      name: 'NavList.Item',
      displayName: 'NavList.Item',
      props: [
        {
          name: 'href',
          type: 'string',
          description: 'Destination of the link.',
          required: false,
        },
        {
          name: 'aria-current',
          type: "'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean",
          description: 'Indicates that this link represents the current destination.',
          required: false,
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          description: 'Opens the nested navigation on first render. Use only with `NavList.SubNav`.',
          required: false,
        },
        {
          name: 'inactiveText',
          type: 'string',
          description: 'Explains why the item’s usual action is unavailable.',
          required: false,
        },
        {
          name: 'ref',
          type: 'React.Ref<HTMLAnchorElement>',
          description: 'Ref to the rendered element.',
          required: false,
        },
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Element or component used to render the item.',
          required: false,
          defaultValue: 'a',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Navigation label and optional nested items.',
          required: true,
        },
        {
          name: 'tooltipText',
          type: 'string',
          description: 'Text for the item’s tooltip.',
          required: false,
        },
      ],
    },
    {
      name: 'NavList.Description',
      displayName: 'NavList.Description',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Secondary text for the item.',
          required: false,
        },
        {
          name: 'variant',
          type: "'inline' | 'block'",
          description: 'Renders the description on the same line or below the label.',
          required: false,
          defaultValue: 'inline',
        },
        {
          name: 'truncate',
          type: 'boolean',
          description: 'Truncates overflowing text in the `inline` variant only.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
        {
          name: 'style',
          type: 'React.CSSProperties',
          description: '',
          required: false,
        },
      ],
    },
    {
      name: 'NavList.LeadingVisual',
      displayName: 'NavList.LeadingVisual',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Visual placed before the item label.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
      ],
    },
    {
      name: 'NavList.TrailingVisual',
      displayName: 'NavList.TrailingVisual',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Visual placed after the item label.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
      ],
    },
    {
      name: 'NavList.SubNav',
      displayName: 'NavList.SubNav',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Nested navigation links.',
          required: true,
        },
        {
          name: 'ref',
          type: 'React.Ref<HTMLUListElement>',
          description: 'Ref to the rendered element.',
          required: false,
        },
      ],
    },
    {
      name: 'NavList.Group',
      displayName: 'NavList.Group',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Navigation links and an optional group heading.',
          required: true,
        },
        {
          name: 'title',
          type: 'string',
          description: 'Title to use when no group heading is supplied.',
          required: false,
        },
        {
          name: 'hideDivider',
          type: 'boolean',
          description: 'Hides the group divider.',
          required: false,
        },
      ],
    },
    {
      name: 'NavList.GroupHeading',
      displayName: 'NavList.GroupHeading',
      props: [
        {
          name: 'auxiliaryText',
          type: 'string',
          description: 'Supplementary text for the group heading.',
          required: false,
        },
        {
          name: 'variant',
          type: "'filled' | 'subtle'",
          description: 'Visual treatment for the group heading.',
          required: false,
          defaultValue: 'subtle',
        },
        {
          name: 'visuallyHidden',
          type: 'boolean',
          description: 'Keeps the heading available to assistive technology while hiding it visually.',
          required: false,
        },
        {
          name: 'as',
          type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'",
          description:
            'Overrides the heading level. Defaults to one level deeper than the navigation heading, or `h3` if there is no heading.',
          required: false,
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Text for the group heading.',
          required: false,
        },
        {
          name: 'size',
          type: "'large' | 'medium' | 'small'",
          description: 'Visual size of the heading.',
          required: false,
        },
        {
          name: 'headingWrapElement',
          type: "'div' | 'li'",
          description: 'Element used to wrap the heading.',
          required: false,
          defaultValue: "'li'",
        },
        {
          name: 'id',
          type: 'string',
          description: 'ID used to label the group.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
        {
          name: 'style',
          type: 'React.CSSProperties',
          description: '',
          required: false,
        },
      ],
    },
    {
      name: 'NavList.Divider',
      displayName: 'NavList.Divider',
      props: [
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
        {
          name: 'style',
          type: 'React.CSSProperties',
          description: '',
          required: false,
        },
      ],
    },
    {
      name: 'NavList.TrailingAction',
      displayName: 'NavList.TrailingAction',
      props: [
        {
          name: 'as',
          type: "'a' | 'button'",
          description: 'Renders a link or a button.',
          required: false,
          defaultValue: 'button',
        },
        {
          name: 'label',
          type: 'string',
          description: 'Text or accessible name for the action.',
          required: true,
        },
        {
          name: 'icon',
          type: 'React.ElementType',
          description: 'Icon for the action. Omit to render the visible label.',
          required: false,
        },
        {
          name: 'href',
          type: 'string',
          description: 'Link destination. Required when `as` is `a`; omit for a button.',
          required: false,
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Shows the loading state for a button. Omit for a link.',
          required: false,
        },
        {
          name: 'tooltipDirection',
          type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
          description: 'Tooltip placement for an icon action.',
          required: false,
          defaultValue: 'w',
        },
        {
          name: 'className',
          type: 'string',
          description: '',
          required: false,
        },
        {
          name: 'style',
          type: 'React.CSSProperties',
          description: '',
          required: false,
        },
        {
          name: 'ref',
          type: 'React.Ref<HTMLAnchorElement | HTMLButtonElement>',
          description: 'Ref to the rendered element.',
          required: false,
        },
      ],
    },
    {
      name: 'NavList.GroupExpand',
      displayName: 'NavList.GroupExpand',
      props: [
        {
          name: 'label',
          type: 'string',
          description: 'Label for the button that reveals more items.',
          required: false,
          defaultValue: 'Show more',
        },
        {
          name: 'pages',
          type: 'number',
          description: 'Number of batches to reveal. Set to `0` to reveal all items at once.',
          required: false,
          defaultValue: '0',
        },
        {
          name: 'items',
          type: 'Array<GroupItem>',
          description: 'Items to reveal.',
          required: true,
        },
        {
          name: 'renderItem',
          type: '(item: GroupItem) => ReactNode',
          description: 'Overrides how an item is rendered.',
          required: false,
        },
        {
          name: 'ref',
          type: 'React.Ref<HTMLButtonElement>',
          description: 'Ref to the rendered element.',
          required: false,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/nav-list/
    description: 'Present navigation links for the current context and identify the current view.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/nav-list/
        guidance: true,
        description: 'Use a sidebar NavList when choosing a link changes the main content area.',
      },
    ],
    anatomy: [],
  },
})
