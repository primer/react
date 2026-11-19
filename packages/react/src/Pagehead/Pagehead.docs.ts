import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Pagehead',
  displayName: 'Pagehead',
  status: 'deprecated',
  keywords: [],
  stories: [],
  importPath: '@primer/react/deprecated',
  props: [
    {
      name: 'as',
      type: 'string',
      defaultValue: 'div',
      description: 'Sets the underlying HTML tag for the component',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {
    description: 'Wraps a heading in a legacy page header.',
    bestPractices: [],
    anatomy: [],
  },
})
