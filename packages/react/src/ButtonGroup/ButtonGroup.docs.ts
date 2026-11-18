import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'ButtonGroup',
  displayName: 'ButtonGroup',
  status: 'stable',
  keywords: [],
  stories: [
    'components-buttongroup--default',
    'components-buttongroup-features--icon-buttons',
    'components-buttongroup-features--loading-buttons',
    'components-buttongroup-features--dropdown-split',
    'components-buttongroup-features--as-toolbar',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element used to render the group.',
      required: false,
      defaultValue: 'div',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLDivElement>',
      description: 'Ref to the group container.',
      required: false,
    },
    {name: 'children', type: 'ReactNode', description: 'Buttons to group.', required: false},
    {name: 'role', type: 'string', description: 'Role of the group.', required: false},
    {name: 'className', type: 'string', description: 'CSS class for the group.', required: false},
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/button-group/
    description: 'Present a series of buttons as a group.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/button-group/guidelines/
        guidance: true,
        description: 'Group related actions when they need to be distinct from other nearby buttons.',
      },
    ],
    anatomy: [
      {
        // Source: https://primer.style/product/components/button-group/guidelines/
        name: 'Button',
        required: true,
        description: 'Represents one action in the group.',
      },
    ],
  },
})
