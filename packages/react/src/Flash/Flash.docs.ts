import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'flash',
  name: 'Flash',
  status: 'deprecated',
  a11yReviewed: '2025-01-08',
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
    {
      name: 'full',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Creates a full width Flash component',
      required: false,
    },
    {
      name: 'variant',
      type: "'default' | 'success' | 'warning' | 'danger'",
      defaultValue: "'default'",
      description: 'Sets the background color and border',
      required: false,
    },
    {name: 'ref', type: 'React.RefObject<HTMLDivElement>', required: false, description: 'Ref to the default <div>.'},
    {
      name: 'as',
      type: 'React.ElementType',
      defaultValue: '"div"',
      required: false,
      description: 'Element or component to render instead of the default <div>.',
    },
  ],
  subcomponents: [],
})
