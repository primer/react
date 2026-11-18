import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Flash',
  displayName: 'Flash',
  status: 'deprecated',
  keywords: [],
  stories: [
    'deprecated-components-flash--default',
    'deprecated-components-flash-features--success',
    'deprecated-components-flash-features--danger',
    'deprecated-components-flash-features--warning',
    'deprecated-components-flash-features--full',
    'deprecated-components-flash-features--with-icon-and-action',
    'deprecated-components-flash-features--with-icon-action-dismiss',
  ],
  importPath: '@primer/react/deprecated',
  props: [
    {name: 'full', type: 'boolean', description: 'Extends the flash to full width.', required: false},
    {
      name: 'variant',
      type: "'default' | 'warning' | 'success' | 'danger'",
      description: 'Sets the background and border colors.',
      required: false,
      defaultValue: "'default'",
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLDivElement>',
      description: 'Ref to the root element. Its type follows the element provided to `as`.',
      required: false,
    },
    {name: 'as', type: 'React.ElementType', description: '', required: false, defaultValue: "'div'"},
    {name: 'className', type: 'string', description: '', required: false},
  ],
  subcomponents: [],
  usage: {description: '', bestPractices: [], anatomy: []},
})
