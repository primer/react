import {defineComponent} from '../../docs/component'

export default defineComponent({
  id: 'underline_panels',
  name: 'UnderlinePanels',
  status: 'draft',
  a11yReviewed: '2025-01-08',
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
    {
      name: 'aria-label',
      type: 'string',
      description: 'Accessible name for the tab list',
      required: false,
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      description: 'ID of the element containing the name for the tab list',
      required: false,
    },
    {
      name: 'value',
      type: 'string',
      description:
        'The value of the selected tab, keyed to each `UnderlinePanels.Tab`/`UnderlinePanels.Panel` `value`. Provide this (with `onChange`) for a controlled component where the selected tab is the single source of truth.',
      required: false,
    },
    {
      name: 'defaultValue',
      type: 'string',
      defaultValue: '',
      description:
        'The value of the tab selected by default, for an uncontrolled component. Cannot be combined with `value`.',
      required: false,
    },
    {
      name: 'onChange',
      type: '({value}: {value: string}) => void',
      description:
        "Callback fired whenever the selected tab changes, for every selection method — pointer, Enter/Space, and Arrow/Home/End keys. Unlike `UnderlinePanels.Tab`'s `onSelect` (which only fires on click and Enter/Space), this makes the selected value usable as a single source of truth for data-driven tabs.",
      required: false,
    },
    {
      name: 'activationMode',
      type: "'automatic' | 'manual'",
      defaultValue: "'automatic'",
      description:
        "Controls how tabs are activated with the keyboard. `'automatic'` selects on focus (Arrow/Home/End select immediately); `'manual'` moves focus only and commits selection on Enter, Space, or click. Prefer `'manual'` when displaying a panel is not instant (e.g. it triggers a network request).",
      required: false,
    },
    {
      name: 'children',
      type: 'Array<UnderlinePanels.Tab | UnderlinePanels.Panel>',
      required: true,
      description: 'Tabs (UnderlinePanels.Tab) and panels (UnderlinePanels.Panel) to render',
    },
    {
      name: 'id',
      type: 'string',
      description: 'Custom string to use when generating the IDs of tabs and `aria-labelledby` for the panels',
      required: false,
    },
    {
      name: 'loadingCounters',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Loading state for all counters. It displays loading animation for individual counters until all are resolved. It is needed to prevent multiple layout shift.',
      required: false,
    },
    {
      name: 'as',
      type: 'React.ElementType',
      defaultValue: "'div'",
      description: 'The HTML element or React component used to render the outermost element.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'UnderlinePanels.Tab',
      props: [
        {
          name: 'value',
          type: 'string',
          defaultValue: '',
          description:
            "A value that uniquely identifies this tab, paired with the `UnderlinePanels.Panel` of the same `value`. Provide this to use domain values (e.g. `'branch'`) with the container's controlled `value`/`onChange` API. When omitted, tabs and panels are paired by DOM order.",
          required: false,
        },
        {
          name: 'aria-selected',
          type: "| boolean | 'true' | 'false'",
          defaultValue: 'false',
          description:
            'Whether this is the selected tab. For more information about `aria-selected`, see [MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-selected).',
          required: false,
        },
        {
          name: 'onSelect',
          type: '(event) => void',
          description:
            "The handler that gets called when the tab is selected. Note: this fires only on click and Enter/Space — not on arrow-key navigation. For a callback that fires for every selection method, use the container's `onChange` prop instead.",
          required: false,
        },
        {
          name: 'counter',
          type: 'number | string',
          description: 'Content of CounterLabel rendered after tab text label',
          required: false,
        },
        {
          name: 'icon',
          type: 'Component',
          description: 'Icon rendered before the tab text label',
          required: false,
        },
      ],
      displayName: 'Tab',
    },
    {
      name: 'UnderlinePanels.Panel',
      props: [
        {
          name: 'value',
          type: 'string',
          defaultValue: '',
          description:
            'A value that uniquely identifies this panel, paired with the `UnderlinePanels.Tab` of the same `value`. When omitted, tabs and panels are paired by DOM order.',
          required: false,
        },
      ],
      passthrough: {element: 'div', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#Attributes'},
      displayName: 'Panel',
    },
  ],
})
