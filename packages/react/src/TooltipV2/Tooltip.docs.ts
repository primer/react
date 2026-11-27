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
    'components-tooltipv2-features--parts-composition',
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
    {
      name: 'open',
      type: 'boolean',
      description: 'Controlled open state of the tooltip.',
      required: false,
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Initial open state when uncontrolled.',
      required: false,
    },
    {
      name: 'onOpenChange',
      type: '(change: TooltipOpenChange) => void',
      description: 'Called when the tooltip open state changes. Call `change.cancel()` to prevent the transition.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'Tooltip.Root',
      displayName: 'Root',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description:
            'The trigger and popup parts rendered within the tooltip root context. `Tooltip.Root` renders no DOM element (state and context only).',
          required: true,
        },
        {
          name: 'id',
          type: 'string',
          description: 'Optional ID used to link `Tooltip.Trigger` and `Tooltip.Popup` deterministically during SSR.',
          required: false,
        },
        {
          name: 'open',
          type: 'boolean',
          description: 'Controlled open state of the tooltip.',
          required: false,
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Initial open state when uncontrolled.',
          required: false,
        },
        {
          name: 'onOpenChange',
          type: '(change: TooltipOpenChange) => void',
          description: 'Called when the tooltip open state changes. Call `change.cancel()` to prevent the transition.',
          required: false,
        },
        {
          name: 'delay',
          type: "'short' | 'medium' | 'long'",
          defaultValue: 'short',
          description: 'Delay before showing the tooltip on hover (`short` 50ms, `medium` 400ms, `long` 1200ms).',
          required: false,
        },
        {
          name: 'type',
          type: "'label' | 'description'",
          defaultValue: 'description',
          description: 'Whether the tooltip labels or describes its trigger element.',
          required: false,
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Prevents the tooltip from opening and closes it if currently open.',
          required: false,
        },
      ],
    },
    {
      name: 'Tooltip.Trigger',
      displayName: 'Trigger',
      props: [
        {
          name: 'as',
          type: 'React.ElementType',
          description:
            'Render the trigger as a different element or component instead of the default `<button type="button">`. `ref` forwards to the rendered trigger `HTMLElement`, and `data-open` is set while open. Cannot be combined with `render`.',
          required: false,
        },
        {
          name: 'render',
          type: 'React.ReactElement | ((props: TooltipTriggerRenderProps, state: TooltipTriggerState) => React.ReactElement)',
          description:
            'Replace the default `<button type="button">` trigger element with a custom element or render function receiving merged props (including `ref` to the rendered trigger `HTMLElement` and `data-open` when open) and state. Cannot be combined with `as`.',
          required: false,
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description:
            'Content rendered inside the trigger element (defaults to `<button type="button">` with `ref` pointing to the rendered trigger `HTMLElement` and `data-open` when open).',
          required: false,
        },
        {
          name: 'type',
          type: "'button' | 'submit' | 'reset'",
          defaultValue: 'button',
          description: 'Button type attribute used when rendering the default native `<button>` element.',
          required: false,
        },
      ],
    },
    {
      name: 'Tooltip.Popup',
      displayName: 'Popup',
      props: [
        {
          name: 'as',
          type: 'React.ElementType',
          description:
            'Render the popup as a different element or component instead of the default `<span>`. `ref` forwards to the rendered popup `HTMLElement`, with `data-direction` and `data-open` state attributes. Cannot be combined with `render`.',
          required: false,
        },
        {
          name: 'render',
          type: 'React.ReactElement | ((props: TooltipPopupRenderProps, state: TooltipPopupState) => React.ReactElement)',
          description:
            'Replace the default `<span>` popup element with a custom element or render function receiving merged props (including `ref` to the rendered popup `HTMLElement`, `data-direction`, and `data-open`) and state. Cannot be combined with `as`.',
          required: false,
        },
        {
          name: 'direction',
          type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
          defaultValue: 's',
          description:
            'Sets where the tooltip renders in relation to its trigger. Reflected and collision-adjusted via `data-direction` on the rendered popup.',
          required: false,
        },
        {
          name: 'keybindingHint',
          type: 'string | Array<string>',
          description: 'Optional keybinding hint displayed next to the tooltip content.',
          required: false,
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description:
            'Non-interactive content rendered inside the tooltip popup (defaults to `<span>` with `ref` pointing to the rendered popup `HTMLElement` and `data-direction`/`data-open` state attributes).',
          required: false,
        },
      ],
    },
  ],
  relatedTypes: [
    {
      name: 'TooltipOpenChange',
      props: [
        {
          name: 'open',
          type: 'boolean',
          description: 'The proposed next open state.',
          required: true,
        },
        {
          name: 'reason',
          type: "'trigger-hover' | 'trigger-focus' | 'popup-hover' | 'escape-key' | 'touch-end' | 'disabled'",
          description: 'Interaction or state reason that triggered the transition.',
          required: true,
        },
        {
          name: 'event',
          type: 'Event',
          description: 'Underlying DOM event when the transition originated from user interaction.',
          required: false,
        },
        {
          name: 'cancel',
          type: '() => void',
          description: 'Synchronously cancels the proposed open state transition.',
          required: true,
        },
      ],
    },
    {
      name: 'TooltipTriggerRenderProps',
      props: [
        {
          name: 'ref',
          type: 'React.RefCallback<HTMLElement>',
          description: 'Callback ref that attaches the rendered trigger `HTMLElement` to the tooltip root.',
          required: false,
        },
        {
          name: 'type',
          type: "'button' | 'submit' | 'reset'",
          description: 'Optional button type forwarded from `Tooltip.Trigger`.',
          required: false,
        },
        {
          name: 'data-component',
          type: 'string',
          description: 'Optional Primer component identifier attribute.',
          required: false,
        },
        {
          name: 'data-open',
          type: "''",
          description: 'Present (empty string) on the trigger while the tooltip is open.',
          required: false,
        },
      ],
    },
    {
      name: 'TooltipTriggerState',
      props: [
        {
          name: 'open',
          type: 'boolean',
          description: 'Whether the tooltip is currently open.',
          required: true,
        },
      ],
    },
    {
      name: 'TooltipPopupRenderProps',
      props: [
        {
          name: 'ref',
          type: 'React.RefCallback<HTMLElement>',
          description: 'Callback ref that attaches the rendered popup `HTMLElement` to the tooltip root.',
          required: false,
        },
        {
          name: 'data-component',
          type: 'string',
          description: 'Primer component identifier attribute (`Tooltip`).',
          required: false,
        },
        {
          name: 'data-direction',
          type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
          description: 'Effective resolved placement direction after viewport collision adjustment.',
          required: false,
        },
        {
          name: 'data-open',
          type: "''",
          description: 'Present (empty string) on the popup while the tooltip is open.',
          required: false,
        },
      ],
    },
    {
      name: 'TooltipPopupState',
      props: [
        {
          name: 'open',
          type: 'boolean',
          description: 'Whether the tooltip is currently open.',
          required: true,
        },
        {
          name: 'direction',
          type: "'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'",
          description: 'Effective resolved placement direction after viewport collision adjustment.',
          required: true,
        },
      ],
    },
  ],
  builtInBehaviors: [
    {
      id: 'focus-visible-and-hover-activation',
      description:
        'Opens after the hover delay on pointer hover or immediately on keyboard `:focus-visible`, and stays open while moving the pointer between trigger and popup.',
    },
    {
      id: 'aria-hidden-popup-linkage',
      description:
        'Renders the popup in the top layer (`popover="auto"`) with `aria-hidden="true"` and links the trigger via `aria-describedby` (`type="description"`) or `aria-labelledby` (`type="label"`) so screen readers announce text once without duplicate reading.',
    },
    {
      id: 'escape-dismisses-without-stealing-focus',
      description:
        'Pressing `Escape` while open closes the tooltip and stops event propagation to outer overlays while keeping focus on the trigger.',
    },
    {
      id: 'viewport-collision-flip',
      description: 'Automatically flips `data-direction` when the requested side lacks viewport space.',
    },
    {
      id: 'iconbutton-deduplication',
      description:
        'Providing `Tooltip` or `Tooltip.Root` context suppresses `IconButton` built-in tooltip rendering so composing `<Tooltip.Trigger render={<IconButton ... />} />` never renders stacked double tooltips.',
    },
  ],
  defaultBehaviors: [
    {
      id: 'supplementary-description-semantics',
      description:
        'Links tooltip content as a supplementary `aria-describedby` description (`role="tooltip"`) rather than replacing the trigger accessible name.',
      overriddenBy: ['type', 'Tooltip.Root.type'],
    },
    {
      id: 'short-hover-delay',
      description: 'Waits 50ms (`short`) on pointer hover before opening to ignore transient cursor pass-through.',
      overriddenBy: ['delay', 'Tooltip.Root.delay'],
    },
    {
      id: 'south-centered-placement',
      description: "Positions the popup centered below the trigger (`'s'`) before collision adjustment.",
      overriddenBy: ['direction', 'Tooltip.Popup.direction'],
    },
  ],
  usageGuidelines: [
    {
      id: 'prefer-configured-for-inline-text',
      guidance: 'do',
      check: 'review',
      description:
        'Use configured `<Tooltip text="...">` for plain text hints on a single inline interactive element, and switch to `Tooltip.Root` + `Tooltip.Trigger` + `Tooltip.Popup` when extracting custom trigger components, composing multiple triggers with `render`, or observing `onOpenChange`.',
    },
    {
      id: 'use-render-to-share-trigger-element',
      guidance: 'do',
      check: 'review',
      description:
        'Pass custom buttons or composed triggers via `<Tooltip.Trigger render={<Button />} />` so all refs, ARIA attributes, and pointer/focus handlers merge onto a single interactive DOM element.',
    },
    {
      id: 'prefer-iconbutton-built-in-tooltip',
      guidance: 'do',
      check: 'review',
      description:
        'Rely on `IconButton` built-in `aria-label` and `description` tooltip for standalone icon buttons; only compose `Tooltip.Root` when you need `onOpenChange`, custom `delay`, or multi-trigger composition.',
    },
    {
      id: 'no-non-interactive-or-disabled-trigger',
      guidance: 'dont',
      check: 'runtime',
      description:
        'Attach `Tooltip` to a static element (`<span>`, `<div>`) or a native `disabled` button; disabled controls are skipped by keyboard Tab, so use an interactive element (or `inactive` button when keyboard users need the explanation).',
    },
    {
      id: 'no-interactive-popup-content',
      guidance: 'dont',
      check: 'runtime',
      description:
        'Render links, buttons, or focusable inputs inside `Tooltip.Popup`; tooltip popups are `aria-hidden="true"` and close on blur, so use `Popover` or `AnchoredOverlay` for interactive floating content.',
    },
    {
      id: 'no-redundant-aria-label-with-label-type',
      guidance: 'dont',
      check: 'runtime',
      description:
        'Set `type="label"` when the trigger already carries its own `aria-label`; use `type="description"` for supplementary hints so the trigger accessible name is not overwritten.',
    },
    {
      id: 'no-simultaneous-as-and-render',
      guidance: 'dont',
      check: 'runtime',
      description:
        'Pass both `as` and `render` on `Tooltip.Trigger` or `Tooltip.Popup`; choose `as` to swap element tag or `render` to compose an element or render function.',
    },
  ],
})
