import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'tooltip_v2',
  name: 'Tooltip',
  docsId: 'tooltip',
  status: 'beta',
  a11yReviewed: '2025-01-08',
  importPath: '@primer/react/next',
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
  props: [
    {
      name: 'direction',
      type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
      defaultValue: 's',
      description: 'Sets where the tooltip renders in relation to the target.',
      required: false,
    },
    {name: 'text', required: true, type: 'string', description: 'The text to be displayed in the tooltip'},
    {
      name: 'type',
      type: "'label' | 'description'",
      defaultValue: 'description',
      description:
        'The type of tooltip. `label` is used for labelling the element that triggers tooltip. `description` is used for describing or adding a supplementary information to the element that triggers the tooltip.',
      required: false,
    },
    {
      name: 'keybindingHint',
      type: 'string | Array<string>',
      description:
        'Optional keybinding hint to indicate the availability of a keyboard shortcut. Pass a string for a single shortcut or an array of strings to show multiple shortcuts joined with "or". Supported syntax is described in the docs for the `KeybindingHint` component.',
      required: false,
    },
    {
      name: 'delay',
      type: "'short' | 'medium' | 'long'",
      defaultValue: 'short',
      description:
        'Sets the delay before showing the tooltip. `short` is 50ms (default), `medium` is 400ms, and `long` is 1200ms.',
      required: false,
    },
  ],
  subcomponents: [],
})
