import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Header',
  displayName: 'Header',
  status: 'experimental',
  keywords: [],
  stories: [],
  importPath: '@primer/react',
  props: [
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element used to render the header.',
      required: false,
      defaultValue: 'header',
    },
    {name: 'children', type: 'ReactNode', description: 'Content of the header.', required: false},
  ],
  subcomponents: [
    {
      name: 'Header.Item',
      displayName: 'Header.Item',
      props: [
        {
          name: 'full',
          type: 'boolean',
          description: 'Stretches the item to fill the available space.',
          required: false,
        },
        {name: 'children', type: 'ReactNode', description: 'Content of the header item.', required: false},
      ],
    },
    {
      name: 'Header.Link',
      displayName: 'Header.Link',
      props: [
        {name: 'href', type: 'string', description: 'Link destination.', required: false},
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Element used to render the link.',
          required: false,
          defaultValue: 'a',
        },
        {
          name: 'to',
          type: 'Location | Pathname',
          description: 'Destination passed to a custom link component.',
          required: false,
        },
        {name: 'children', type: 'ReactNode', description: 'Content of the link.', required: false},
      ],
    },
  ],
  usage: {
    description: '',
    bestPractices: [],
    anatomy: [],
  },
})
