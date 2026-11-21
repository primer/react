import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'underline_nav',
  name: 'UnderlineNav',
  status: 'beta',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-underlinenav--default',
    'components-underlinenav-features--default',
    'components-underlinenav-features--with-icons',
    'components-underlinenav-features--with-counter-labels',
    'components-underlinenav-features--overflow-template',
    'components-underlinenav-features--overflow-on-narrow-screen',
    'components-underlinenav-features--counters-loading-state',
    'components-underlinenav-features--variant-flush',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'aria-label',
      type: 'string',
      description:
        "A unique name for the rendered nav landmark. It will also be used to label the arrow\nbuttons that control the scroll behaviour on coarse pointer devices. (I.e.\n'Scroll _aria-label_ left/right')\n",
      required: false,
    },
    {name: 'children', type: 'Array<UnderlineNav.Item>', required: true, description: ''},
    {
      name: 'loadingCounters',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Whether the navigation items are in loading state. Component waits for all the counters to finish loading to prevent multiple layout shifts.',
      required: false,
    },
    {
      name: 'hideIconsBreakpoint',
      type: "'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | null",
      defaultValue: "'medium'",
      description:
        'Controls the container width below which icons are hidden to save space. To keep icons visible in a narrow container, use a smaller breakpoint such as `xsmall`, or set to `null` to always show icons.',
      required: false,
    },
    {
      name: 'variant',
      type: "'inset' | 'flush'",
      defaultValue: "'inset'",
      description:
        '`inset` children are offset horizontally from container edges. `flush` children are flush horizontally with container edges',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'UnderlineNav.Item',
      props: [
        {
          name: 'aria-current',
          type: "| 'page' | 'step' | 'location' | 'date' | 'time' | true | false",
          defaultValue: 'false',
          description:
            'Set `aria-current` to `"page"` to indicate that the item represents the current page. Set `aria-current` to `"location"` to indicate that the item represents the current location on a page. For more information about `aria-current`, see [MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current).',
          required: false,
        },
        {
          name: 'counter',
          type: 'number | string',
          description: 'The number to display in the counter label.',
          required: false,
        },
        {
          name: 'href',
          type: 'string',
          defaultValue: '',
          description:
            'The URL that the item navigates to. Native anchor items default to `href="#"`. When a custom component is supplied with `as`, no default `href` is added; provide the navigation props required by that component, such as `to` for React Router.',
          required: false,
        },
        {
          name: 'icon',
          type: 'Component',
          description: 'The leading icon comes before item label',
          deprecated: true,
          required: false,
        },
        {
          name: 'leadingVisual',
          type: 'React.ReactElement',
          description: 'The leading visual comes before item label',
          required: false,
        },
        {
          name: 'onSelect',
          type: '(event) => void',
          description:
            "The handler that gets called when a nav link is selected. For example, a manual route binding can be done here(I.e. 'navigate(href)' for the react router.)",
          required: false,
        },
        {
          name: 'as',
          type: 'React.ElementType',
          defaultValue: '"a"',
          required: false,
          description: "Renders `UnderlineNav.Item` as given component i.e. react-router's Link",
        },
      ],
      passthrough: {element: 'a', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Attributes'},
      displayName: 'Item',
    },
  ],
})
