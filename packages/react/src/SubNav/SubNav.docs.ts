import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'sub_nav',
  name: 'SubNav',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: ['components-subnav--default', 'components-subnav-features--selected'],
  importPath: '@primer/react',
  props: [
    {
      name: 'actions',
      type: 'React.ReactNode',
      description: 'Place another element, such as a button, to the opposite side of the navigation items.',
      required: false,
    },
    {
      name: 'align',
      type: "'right'",
      description: 'Use `right` to have navigation items aligned right.',
      required: false,
    },
    {
      name: 'full',
      type: 'boolean',
      description: 'Used to make navigation fill the width of the container.',
      required: false,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Used to set the `aria-label` on the top level `<nav>` element.',
      required: false,
    },
    {
      name: 'aria-label',
      type: 'string',
      description: 'Used to set the `aria-label` on the top level `<nav>` element.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'SubNav.Link',
      props: [
        {name: 'href', type: 'string', description: 'URL the anchor links to.', required: false},
        {
          name: 'selected',
          type: 'boolean',
          description: 'Whether this item represents the current page',
          required: false,
        },
        {
          name: 'to',
          type: 'string | Partial<Path>',
          description: 'Passed through to the native anchor. Use `href` for navigation.',
          required: false,
        },
      ],
      displayName: 'Link',
    },
    {name: 'SubNav.Links', props: [], displayName: 'Links'},
  ],
})
