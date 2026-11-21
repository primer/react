import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'button_group',
  name: 'ButtonGroup',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'components-buttongroup--default',
    'components-buttongroup-features--icon-buttons',
    'components-buttongroup-features--loading-buttons',
    'components-buttongroup-features--dropdown-split',
    'components-buttongroup-features--as-toolbar',
  ],
  importPath: '@primer/react',
  props: [
    {name: 'ref', type: 'React.RefObject<HTMLDivElement>', required: false, description: 'Ref to the default <div>.'},
  ],
  subcomponents: [],
})
