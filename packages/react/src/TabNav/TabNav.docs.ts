import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'tab_nav',
  name: 'TabNav',
  status: 'deprecated',
  a11yReviewed: false,
  stories: ['deprecated-components-tabnav--default', 'deprecated-components-tabnav-features--selected'],
  importPath: '@primer/react/deprecated',
  props: [
    {
      name: 'aria-label',
      type: 'string',
      description: 'Used to set the `aria-label` on the top level `<nav>` element.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'TabNav.Link',
      props: [
        {
          name: 'as',
          type: 'React.ElementType',
          defaultValue: "'a'",
          description: 'The element or component to render for the tab.',
          required: false,
        },
        {
          name: 'href',
          type: 'string',
          description: 'The URL the tab links to when rendered as an anchor.',
          required: false,
        },
        {name: 'selected', type: 'boolean', description: 'Whether this is the selected tab.', required: false},
        {
          name: 'to',
          type: 'string | Partial<Path>',
          description:
            "Used when the item is rendered using a component like React Router's `Link`. The path to navigate to.",
          required: false,
        },
      ],
      displayName: 'Link',
    },
  ],
})
