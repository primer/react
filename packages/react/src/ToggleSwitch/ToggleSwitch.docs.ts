import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'ToggleSwitch',
  displayName: 'ToggleSwitch',
  status: 'stable',
  keywords: [],
  stories: [
    'components-toggleswitch--default',
    'components-toggleswitch-features--small',
    'components-toggleswitch-features--with-caption',
    'components-toggleswitch-features--disabled',
    'components-toggleswitch-features--checked',
    'components-toggleswitch-features--checked-disabled',
    'components-toggleswitch-features--loading',
    'components-toggleswitch-features--label-end',
    'components-toggleswitch-features--controlled',
    'components-toggleswitch-features--with-custom-labels',
  ],
  importPath: '@primer/react',
  props: [
    {
      name: 'aria-describedby',
      type: 'string',
      description: 'References an element that describes the switch.',
      required: false,
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      description: 'References the element that labels the switch.',
      required: true,
    },
    {
      name: 'defaultChecked',
      type: 'boolean',
      description: 'Initial state in uncontrolled mode.',
      required: false,
      defaultValue: 'false',
    },
    {name: 'disabled', type: 'boolean', description: 'Prevents user interaction.', required: false},
    {
      name: 'loading',
      type: 'boolean',
      description: 'Indicates that the state is being calculated and prevents toggling.',
      required: false,
    },
    {
      name: 'checked',
      type: 'boolean',
      description: 'Whether the controlled switch is on.',
      required: false,
    },
    {
      name: 'onChange',
      type: '(checked: boolean) => void',
      description: 'Called with the new state when the switch is toggled.',
      required: false,
    },
    {
      name: 'onClick',
      type: 'React.MouseEventHandler',
      description: 'Called when the switch is clicked.',
      required: false,
    },
    {
      name: 'size',
      type: "'small' | 'medium'",
      description: 'Visual size of the switch.',
      required: false,
      defaultValue: "'medium'",
    },
    {
      name: 'statusLabelPosition',
      type: "'start' | 'end'",
      description: 'Places status text before or after the switch.',
      required: false,
      defaultValue: "'start'",
    },
    {
      name: 'loadingLabelDelay',
      type: 'number',
      description: 'Milliseconds before announcing the loading label.',
      required: false,
      defaultValue: '2000',
    },
    {
      name: 'loadingLabel',
      type: 'string',
      description: 'Text announced while the switch is loading.',
      required: false,
      defaultValue: "'Loading'",
    },
    {
      name: 'buttonType',
      type: "'button' | 'submit' | 'reset'",
      description: 'Sets the underlying button type for use in forms.',
      required: false,
      defaultValue: "'button'",
    },
    {
      name: 'buttonLabelOn',
      type: 'string',
      description: 'Visible status text when on.',
      required: false,
      defaultValue: "'On'",
    },
    {
      name: 'buttonLabelOff',
      type: 'string',
      description: 'Visible status text when off.',
      required: false,
      defaultValue: "'Off'",
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/toggle-switch/
    description: 'Turn a setting on or off immediately.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/toggle-switch/guidelines/
        guidance: true,
        description: 'Use a short label that names the setting or action instead of describing the current state.',
      },
      {
        // Source: https://primer.style/product/components/toggle-switch/guidelines/
        guidance: true,
        description: 'Place content that appears when the switch is turned on after the switch.',
      },
    ],
    anatomy: [
      {
        // Source: https://primer.style/product/components/toggle-switch/guidelines/
        name: 'Track',
        required: true,
        description: 'Clickable area that changes color to reflect state.',
      },
      {
        // Source: https://primer.style/product/components/toggle-switch/guidelines/
        name: 'Knob',
        required: true,
        description: 'Moves within the track to indicate the state.',
      },
      {
        // Source: https://primer.style/product/components/toggle-switch/guidelines/
        name: 'Status',
        required: true,
        description: 'Text that indicates whether the switch is on or off.',
      },
    ],
  },
})
