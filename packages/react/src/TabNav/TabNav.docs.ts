import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'TabNav',
  displayName: 'TabNav',
  status: 'deprecated',
  keywords: [],
  stories: ['deprecated-components-tabnav--default', 'deprecated-components-tabnav-features--selected'],
  importPath: '@primer/react/deprecated',
  props: [
    {
      name: 'aria-label',
      type: 'string',
      description: 'Accessible name of the navigation landmark.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'TabNav.Link',
      displayName: 'TabNav.Link',
      props: [
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Element or component to render.',
          required: false,
          defaultValue: "'a'",
        },
        {name: 'href', type: 'string', description: 'Destination of an anchor link.', required: false},
        {name: 'selected', type: 'boolean', description: 'Marks the active tab.', required: false},
        {
          name: 'to',
          type: 'string | Partial<Path>',
          description: 'Destination for a custom link component that supports `to`.',
          required: false,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Class name for custom styling.',
          required: false,
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Forwarded to the rendered element or component.',
          required: false,
        },
      ],
    },
  ],
  usage: {
    description: '',
    bestPractices: [],
    anatomy: [],
  },
})
