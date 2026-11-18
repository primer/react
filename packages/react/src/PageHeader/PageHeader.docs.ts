import {defineComponent} from '../docs/components'

const className = {name: 'className', type: 'string', description: '', required: false}
const ariaLabel = {name: 'aria-label', type: 'string', description: 'Accessible name.', required: false}
const hidden = {
  name: 'hidden',
  type: 'boolean | ResponsiveValue<boolean>',
  description: 'Hides the area at all or selected viewport widths.',
  required: false,
  defaultValue: 'false',
}
const hiddenOnRegularAndWide = {...hidden, defaultValue: '{narrow: false, regular: true, wide: true}'}
const hiddenOnNarrow = {...hidden, defaultValue: '{narrow: true, regular: false, wide: false}'}

export default defineComponent({
  name: 'PageHeader',
  displayName: 'PageHeader',
  status: 'stable',
  keywords: [],
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
    ariaLabel,
    className,
    // The legacy root `hidden` prop is only supported by the child areas.
    {name: 'role', type: 'AriaRole', description: '', required: false},
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Root element or component.',
      required: false,
      defaultValue: "'div'",
    },
    {name: 'hasBorder', type: 'boolean', description: 'Shows a border below the header.', required: false},
    {name: 'children', type: 'React.ReactNode', description: 'PageHeader parts.', required: false},
  ],
  subcomponents: [
    {name: 'PageHeader.ContextArea', displayName: 'PageHeader.ContextArea', props: [className, hiddenOnRegularAndWide]},
    {
      name: 'PageHeader.ParentLink',
      displayName: 'PageHeader.ParentLink',
      props: [
        ariaLabel,
        className,
        {name: 'href', type: 'string', description: 'Destination URL.', required: false},
        hiddenOnRegularAndWide,
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Element or component used for the parent link.',
          required: false,
          defaultValue: "'a'",
        },
      ],
    },
    {name: 'PageHeader.ContextBar', displayName: 'PageHeader.ContextBar', props: [className, hiddenOnRegularAndWide]},
    {
      name: 'PageHeader.ContextAreaActions',
      displayName: 'PageHeader.ContextAreaActions',
      props: [className, hiddenOnRegularAndWide],
    },
    {
      name: 'PageHeader.TitleArea',
      displayName: 'PageHeader.TitleArea',
      props: [
        className,
        hidden,
        {
          name: 'variant',
          type: "'subtitle' | 'medium' | 'large' | ResponsiveValue<'subtitle' | 'medium' | 'large'>",
          description: 'Title size, optionally by viewport width.',
          required: false,
          defaultValue: "'medium'",
        },
      ],
    },
    {name: 'PageHeader.LeadingAction', displayName: 'PageHeader.LeadingAction', props: [className, hiddenOnNarrow]},
    {name: 'PageHeader.LeadingVisual', displayName: 'PageHeader.LeadingVisual', props: [className, hidden]},
    {
      name: 'PageHeader.Title',
      displayName: 'PageHeader.Title',
      props: [
        className,
        hidden,
        {
          name: 'as',
          type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'",
          description: 'Heading level.',
          required: false,
          defaultValue: "'h2'",
        },
      ],
    },
    {name: 'PageHeader.TrailingVisual', displayName: 'PageHeader.TrailingVisual', props: [className, hidden]},
    {name: 'PageHeader.TrailingAction', displayName: 'PageHeader.TrailingAction', props: [className, hiddenOnNarrow]},
    {name: 'PageHeader.Actions', displayName: 'PageHeader.Actions', props: [className, hidden]},
    {name: 'PageHeader.Breadcrumbs', displayName: 'PageHeader.Breadcrumbs', props: [className, hidden]},
    {name: 'PageHeader.Description', displayName: 'PageHeader.Description', props: [className, hidden]},
    {
      name: 'PageHeader.Navigation',
      displayName: 'PageHeader.Navigation',
      props: [
        {
          name: 'aria-label',
          type: 'string',
          description: 'Names the navigation. Set this or `aria-labelledby` when rendered as `nav`.',
          required: false,
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          description: 'ID of the element naming the navigation.',
          required: false,
        },
        {
          name: 'as',
          type: "'div' | 'nav'",
          description: 'Element used for the navigation area.',
          required: false,
          defaultValue: "'div'",
        },
        className,
        hidden,
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/page-header/
    description: 'Organize the page title, context, and local navigation at the top of a page.',
    bestPractices: [],
    anatomy: [
      {
        // Source: https://primer.style/product/components/page-header/guidelines/
        name: 'Context bar',
        required: false,
        description: 'Provides page context and actions on smaller screens.',
      },
      {
        // Source: https://primer.style/product/components/page-header/guidelines/
        name: 'Title bar',
        required: true,
        description: 'Displays the page title at every viewport width.',
      },
      {
        // Source: https://primer.style/product/components/page-header/guidelines/
        name: 'Description',
        required: false,
        description: 'Adds context about the page.',
      },
      {
        // Source: https://primer.style/product/components/page-header/guidelines/
        name: 'Contextual navigation',
        required: false,
        description: 'Provides navigation for the current page.',
      },
    ],
  },
})
