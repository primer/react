import {defineComponent} from '../../docs/component'

export default defineComponent({
  id: 'legacy_underline_nav',
  name: 'UnderlineNav',
  status: 'deprecated',
  a11yReviewed: '2025-01-08',
  stories: [],
  importPath: '@primer/react/deprecated',
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
      name: 'aria-label',
      type: 'string',
      description: 'Used to set the `aria-label` on the top level `<nav>` element.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'UnderlineNav.Link',
      props: [
        {name: 'href', type: 'string', description: 'URL the link navigates to.', required: false},
        {
          name: 'selected',
          type: 'boolean',
          description: 'Whether to show the link in the selected style.',
          required: false,
        },
      ],
      displayName: 'Link',
    },
  ],
})
