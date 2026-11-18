import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Tooltip',
  displayName: 'Tooltip',
  status: 'stable',
  keywords: [],
  stories: [
    'components-tooltipv2--default',
    'components-tooltipv2-features--anchor-has-margin',
    'components-tooltipv2-features--label-type',
    'components-tooltipv2-features--description-type',
    'components-tooltipv2-features--icon-button-with-description',
    'components-tooltipv2-features--all-directions',
    'components-tooltipv2-features--multiline-text',
    'components-tooltipv2-features--calculated-direction',
    'components-tooltipv2-features--on-action-menu-anchor',
  ],
  importPath: '@primer/react/next',
  props: [
    {
      name: 'direction',
      type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
      description: 'Sets where the tooltip renders in relation to the target.',
      required: false,
      defaultValue: 's',
    },
    {
      name: 'text',
      type: 'string',
      description: 'The text to be displayed in the tooltip',
      required: true,
    },
    {
      name: 'type',
      type: "'label' | 'description'",
      description:
        'The type of tooltip. `label` is used for labelling the element that triggers tooltip. `description` is used for describing or adding a supplementary information to the element that triggers the tooltip.',
      required: false,
      defaultValue: 'description',
    },
    {
      name: 'keybindingHint',
      type: 'string | string[]',
      description:
        'Optional keybinding hint to indicate the availability of a keyboard shortcut. Pass a string for a single shortcut or an array of strings to show multiple shortcuts joined with "or". Supported syntax is described in the docs for the `KeybindingHint` component.',
      required: false,
    },
    {
      name: 'delay',
      type: "'short' | 'medium' | 'long'",
      description:
        'Sets the delay before showing the tooltip. `short` is 50ms (default), `medium` is 400ms, and `long` is 1200ms.',
      required: false,
      defaultValue: 'short',
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/tooltip/
    description:
      'Show short text for an interactive control when it gets keyboard focus or the pointer hovers over it.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/tooltip/guidelines/#tooltip-as-a-label
        guidance: true,
        description: 'Use `label` to give an icon-only button its accessible name and show that name on screen.',
      },
      {
        // Source: https://primer.style/product/components/tooltip/guidelines/#tooltip-as-a-description
        guidance: true,
        description: 'Use `description` for brief context that adds to the control’s existing label.',
      },
      {
        // Source: https://primer.style/product/components/tooltip/guidelines/#alternatives-to-tooltips
        guidance: false,
        description:
          'Do not make a tooltip the only place to find essential information. Keep that information visible in the interface.',
      },
      {
        // Source: https://primer.style/product/components/tooltip/guidelines/#best-practices
        guidance: false,
        description: 'Do not attach a tooltip to static content.',
      },
    ],
    anatomy: [],
  },
})
