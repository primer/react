import {defineComponent} from '../../docs/components'

export default defineComponent({
  name: 'UnderlinePanels',
  displayName: 'UnderlinePanels',
  status: 'experimental',
  keywords: [],
  stories: [
    'experimental-components-underlinepanels--default',
    'experimental-components-underlinepanels-features--labelled-by-external-element',
    'experimental-components-underlinepanels-features--selected-tab',
    'experimental-components-underlinepanels-features--with-counters',
    'experimental-components-underlinepanels-features--with-counters-in-loading-state',
    'experimental-components-underlinepanels-features--with-icons',
    'experimental-components-underlinepanels-features--with-icons-hidden-on-narrow-screen',
    'experimental-components-underlinepanels-features--controlled',
    'experimental-components-underlinepanels-features--uncontrolled',
    'experimental-components-underlinepanels-features--manual-activation',
    'experimental-components-underlinepanels-features--in-overlay',
  ],
  importPath: '@primer/react/experimental',
  props: [
    {name: 'aria-label', type: 'string', description: 'Accessible name for the tab list.', required: false},
    {name: 'aria-labelledby', type: 'string', description: 'ID of the element naming the tab list.', required: false},
    {
      name: 'value',
      type: 'string',
      description: 'Selected tab value in controlled mode. Use with `onChange`.',
      required: false,
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Initial tab value in uncontrolled mode. Do not combine with `value`.',
      required: false,
    },
    {
      name: 'onChange',
      type: '({value}: {value: string}) => void',
      description: 'Receives the selected tab value whenever selection changes.',
      required: false,
    },
    {
      name: 'activationMode',
      type: "'automatic' | 'manual'",
      description: 'Selects on focus in automatic mode or when activated in manual mode.',
      required: false,
      defaultValue: "'automatic'",
    },
    {name: 'children', type: 'React.ReactNode', description: 'Tabs and their corresponding panels.', required: true},
    {
      name: 'id',
      type: 'string',
      description: 'Base ID for the tabs and panel labels. An ID is generated when omitted.',
      required: false,
    },
    {
      name: 'loadingCounters',
      type: 'boolean',
      description: 'Shows loading placeholders for the tab counters.',
      required: false,
    },
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element or component used for the tab container.',
      required: false,
      defaultValue: "'div'",
    },
    {name: 'className', type: 'string', description: 'Class name for custom styling.', required: false},
  ],
  subcomponents: [
    {
      name: 'UnderlinePanels.Tab',
      displayName: 'UnderlinePanels.Tab',
      props: [
        {
          name: 'value',
          type: 'string',
          description: 'Matches the associated panel. If omitted, pairing uses DOM order.',
          required: false,
        },
        {
          name: 'aria-selected',
          type: 'boolean',
          description: 'Marks a selected tab. Do not use with the container’s controlled `value`.',
          required: false,
        },
        {
          name: 'onSelect',
          type: '(event: React.KeyboardEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) => void',
          description: 'Called on click, Enter, or Space, not when arrow keys select a tab.',
          required: false,
        },
        {name: 'counter', type: 'number | string', description: 'Counter shown after the label.', required: false},
        {name: 'icon', type: 'React.FC<IconProps>', description: 'Icon shown before the label.', required: false},
      ],
    },
    {
      name: 'UnderlinePanels.Panel',
      displayName: 'UnderlinePanels.Panel',
      props: [
        {
          name: 'value',
          type: 'string',
          description: 'Matches the associated tab. If omitted, pairing uses DOM order.',
          required: false,
        },
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/underline-panels/
    description: 'Let users switch between related panels without changing the URL or leaving the current view.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/underline-panels/
        guidance: false,
        description: 'Do not use these tabs to navigate to a different URL. Use UnderlineNav instead.',
      },
    ],
    anatomy: [],
  },
})
