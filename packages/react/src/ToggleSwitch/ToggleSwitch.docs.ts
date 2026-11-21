import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'toggle_switch',
  name: 'ToggleSwitch',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
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
      description: 'The id of the DOM node that describes the switch',
      required: false,
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      required: true,
      description: 'The id of the DOM node that labels the switch',
    },
    {
      name: 'defaultChecked',
      type: 'boolean',
      defaultValue: '',
      description: 'Uncontrolled - whether the switch is turned on',
      required: false,
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Whether the switch is ready for user input',
      required: false,
    },
    {
      name: 'loading',
      type: 'boolean',
      description: "Whether the switch's value is being calculated",
      required: false,
    },
    {
      name: 'checked',
      type: 'boolean',
      description: 'Whether the switch is turned on',
      required: false,
    },
    {
      name: 'onChange',
      type: '(on: boolean) => void',
      description: 'The callback that is called when the switch is toggled on or off',
      required: false,
    },
    {
      name: 'onClick',
      type: '(e: MouseEvent) => void',
      description: 'The callback that is called when the switch is clicked',
      required: false,
    },
    {
      name: 'size',
      type: "'small' | 'medium'",
      defaultValue: "'medium'",
      description: 'Size of the switch',
      required: false,
    },
    {
      name: 'statusLabelPosition',
      type: "'start' | 'end'",
      defaultValue: "'start'",
      description:
        'Whether the "on" and "off" labels should appear before or after the switch.\n\n**This should only be changed when the switch\'s alignment needs to be adjusted.** For example: It needs to be left-aligned because the label appears above it and the caption appears below it.',
      required: false,
    },
    {
      name: 'loadingLabelDelay',
      type: 'number',
      defaultValue: '2000',
      description:
        'When the switch is in the loading state, this value controls the amount of delay in milliseconds before the word "Loading" is announced to screen readers.',
      required: false,
    },
    {
      name: 'loadingLabel',
      type: 'string',
      defaultValue: "'Loading'",
      description: 'The text that is announced to AT such as screen readers when the switch is in a loading state.',
      required: false,
    },
    {
      name: 'buttonType',
      type: "'button' | 'submit' | 'reset'",
      defaultValue: "'button'",
      description:
        'As it’s part of form behavior, this controls whether the button is of type `button`, `submit`, or `reset`.',
      required: false,
    },
    {
      name: 'buttonLabelOn',
      type: 'string',
      defaultValue: "'On'",
      description:
        "The text to display when the toggle switch is turned on. Only customize this label if there is a more specific label for the context. For example, you might use 'Show' if the setting is 'Show images'.",
      required: false,
    },
    {
      name: 'buttonLabelOff',
      type: 'string',
      defaultValue: "'Off'",
      description:
        "The text to display when the toggle switch is turned off. Only customize this label if there is a more specific label for the context. For example, you might use 'Hide' if the setting is 'Show images'.",
      required: false,
    },
  ],
  subcomponents: [],
})
