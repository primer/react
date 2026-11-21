import {defineComponent} from '../../docs/component'

export default defineComponent({
  id: 'tabs',
  name: 'Tabs',
  status: 'draft',
  a11yReviewed: false,
  importPath: '@primer/react/experimental',
  stories: [
    'experimental-components-tabs--default',
    'experimental-components-tabs-features--uncontrolled',
    'experimental-components-tabs-features--controlled',
    'experimental-components-tabs-features--manual-activation',
    'experimental-components-tabs-features--vertical',
    'experimental-components-tabs-examples--with-custom-components',
  ],
  props: [
    {
      name: 'children',
      type: 'React.ReactNode',
      description:
        'Content that receives tab state. Use `useTabList`, `useTab`, and `useTabPanel` in descendants to build the tab interface.',
      required: false,
    },
    {
      name: 'id',
      type: 'string',
      description: 'Base ID for the tabs and panels. A unique ID is generated if omitted.',
      required: false,
    },
    {
      name: 'activationMode',
      type: "'automatic' | 'manual'",
      description:
        'In automatic mode, moving focus selects the tab. In manual mode, select the focused tab with Enter or Space, or select it with a pointer.',
      required: false,
      defaultValue: "'automatic'",
    },
    {
      name: 'value',
      type: 'string',
      description:
        'Selected tab value. Required with `onValueChange` in controlled mode; do not combine with `defaultValue`.',
      required: false,
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Initially selected tab value. Required in uncontrolled mode; do not combine with `value`.',
      required: false,
    },
    {
      name: 'onValueChange',
      type: '(selection: {value: string}) => void',
      description: 'Called when the selected tab changes. Required in controlled mode.',
      required: false,
    },
  ],
  subcomponents: [],
  relatedTypes: [
    {
      name: 'TabListProps',
      props: [
        {
          name: 'aria-label',
          type: 'string',
          description: 'Accessible name for the tab list. Provide this or `aria-labelledby`.',
          required: false,
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          description: 'ID of the element that names the tab list. Provide this or `aria-label`.',
          required: false,
        },
        {
          name: 'aria-orientation',
          type: "'horizontal' | 'vertical' | 'undefined'",
          description:
            'Use `vertical` for Up and Down arrow navigation. Otherwise, the list uses Left and Right arrows.',
          required: false,
          defaultValue: "'horizontal'",
        },
      ],
    },
    {
      name: 'TabProps',
      props: [
        {
          name: 'value',
          type: 'string',
          description: 'Unique value for the tab. Use the same value for its panel.',
          required: true,
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Prevents selection and arrow-key navigation to the tab.',
          required: false,
        },
      ],
    },
    {
      name: 'TabPanelProps',
      props: [
        {
          name: 'value',
          type: 'string',
          description: 'Value that links the panel to its corresponding tab.',
          required: true,
        },
      ],
    },
  ],
})
