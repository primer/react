import {defineComponent} from '../../docs/components'

export default defineComponent({
  name: 'UnderlineNav',
  displayName: 'UnderlineNav',
  status: 'deprecated',
  keywords: [],
  stories: [],
  importPath: '@primer/react/deprecated',
  props: [
    {name: 'actions', type: 'React.ReactNode', description: 'Content in the actions area.', required: false},
    {name: 'align', type: "'right'", description: 'Aligns links to the right.', required: false},
    {name: 'full', type: 'boolean', description: 'Uses the full-width variant.', required: false},
    {name: 'aria-label', type: 'string', description: 'Accessible name for the navigation.', required: false},
    {
      name: 'label',
      type: 'string',
      description: 'Accessible name for the navigation when `aria-label` is not supplied.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'UnderlineNav.Link',
      displayName: 'UnderlineNav.Link',
      props: [
        // This legacy implementation always renders an anchor and does not accept `as`.
        {name: 'href', type: 'string', description: 'Destination URL.', required: false},
        {name: 'selected', type: 'boolean', description: 'Applies selected styling.', required: false},
        {name: 'to', type: 'To', description: 'Forwarded to the anchor; use `href` for navigation.', required: false},
      ],
    },
  ],
  usage: {description: '', bestPractices: [], anatomy: []},
})
