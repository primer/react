import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'SubNav',
  displayName: 'SubNav',
  status: 'experimental',
  keywords: [],
  stories: ['components-subnav--default', 'components-subnav-features--selected'],
  importPath: '@primer/react',
  props: [
    {
      name: 'actions',
      type: 'ReactNode',
      description: 'Content to display opposite the navigation links.',
      required: false,
    },
    {name: 'align', type: "'right'", description: '', required: false},
    {name: 'full', type: 'boolean', description: '', required: false},
    {
      name: 'label',
      type: 'string',
      description: 'Accessible name for the navigation landmark. An explicit `aria-label` takes precedence.',
      required: false,
    },
    {
      name: 'aria-label',
      type: 'string',
      description: 'Explicit accessible name for the navigation landmark.',
      required: false,
    },
    {name: 'children', type: 'ReactNode', description: 'Navigation content.', required: false},
  ],
  subcomponents: [
    {
      name: 'SubNav.Link',
      displayName: 'SubNav.Link',
      props: [
        {name: 'href', type: 'string', description: 'Link destination.', required: false},
        {
          name: 'selected',
          type: 'boolean',
          description: 'Indicates that the link represents the current page.',
          required: false,
        },
        {name: 'to', type: 'To', description: '', required: false},
        {name: 'children', type: 'ReactNode', description: 'Content of the link.', required: false},
      ],
    },
    {
      name: 'SubNav.Links',
      displayName: 'SubNav.Links',
      props: [{name: 'children', type: 'ReactNode', description: 'Links to group.', required: false}],
    },
  ],
  usage: {
    description: '',
    bestPractices: [],
    anatomy: [],
  },
})
