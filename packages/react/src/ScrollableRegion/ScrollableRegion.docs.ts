import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'scrollable_region',
  name: 'ScrollableRegion',
  status: 'draft',
  a11yReviewed: false,
  importPath: '@primer/react/experimental',
  stories: [
    'experimental-components-scrollableregion--default',
    'experimental-components-scrollableregion--playground',
  ],
  props: [
    {
      name: 'aria-label',
      type: 'string',
      description:
        'Accessible name for the region when its content overflows. Provide either this prop or `aria-labelledby`, not both.',
      required: false,
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      description:
        'ID of the element that names the region when its content overflows. Provide either this prop or `aria-label`, not both.',
      required: false,
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description:
        'Content to render inside the scrollable region. When it overflows, the region can receive keyboard focus.',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS class for the scrollable region.',
      required: false,
    },
  ],
  subcomponents: [],
  passthrough: {
    element: 'div',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div',
  },
})
