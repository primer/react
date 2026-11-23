import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'pagehead',
  name: 'Pagehead',
  status: 'deprecated',
  a11yReviewed: false,
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
})
