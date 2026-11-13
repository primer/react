# ToggleSwitch

`ToggleSwitch` is a form-associated binary switch with small and medium sizes.

Import: `import {ToggleSwitch} from '@primer/react-tailwind/ToggleSwitch'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

`ToggleSwitchProps` forwards Base UI switch props and adds `size`. Use `checked`/`onCheckedChange` or `defaultChecked`, and native form fields such as `name`, `value`, `required`, and `disabled`.

## Import

```tsx
import {ToggleSwitch} from '@primer/react-tailwind/ToggleSwitch'
;<ToggleSwitch aria-label="Enable notifications" defaultChecked />
```

## Accessibility, forms, and validation

Provide a visible, descriptive label for the setting and associate it with the switch. Use `FormControl.Label`, or reference visible text with `aria-labelledby`. The control exposes `role="switch"` and its on/off state through `aria-checked`; its accessible name should describe the setting rather than the current state.

The adjacent on/off status text is visual only and hidden from assistive technology; it does not name the switch. `buttonLabelOn` and `buttonLabelOff` customize that text, which defaults to "On" and "Off". Include any essential context in the associated label. Clicking the status text toggles an available, writable switch.

Disabled and loading switches remain keyboard-focusable and expose `aria-disabled="true"`, so their labels and explanations remain discoverable. Use `aria-describedby` for an unavailable reason. Both states suppress user activation but allow externally controlled `checked` updates; an explicit `tabIndex` overrides the default tab order. Disabled hidden inputs do not submit values, while loading is read-only and retains the existing checked form value.

If loading continues for `loadingLabelDelay` milliseconds (2,000 by default), `loadingLabel` ("Loading" by default) is placed in a visually hidden polite live region and added to the switch's description alongside any existing `aria-describedby`. Choose a concise, contextual label such as "Saving notification settings". If loading finishes before the delay, no loading message is added. Actual announcements depend on the assistive technology.

At a 16px root font size, the visible track is 48 by 24 CSS pixels for `small` and 64 by 32 for `medium`; the expanded target is 44px high on a coarse pointer. The target follows Primer's pointer-size token with a 24px minimum height, so at a 12px root font it is 33px high and the small track is 36 by 18px. The track has a 24px minimum width, but the target is not guaranteed to be 44px wide. It can make compact rows taller, and ancestor clipping, scrollbars, browser touch retargeting, or host styling can affect the final target, so verify it in the layout where the switch is used.

## Keyboard, events, and state

Tab moves focus to the switch; Space or Enter toggles it when it is available and writable. `onCheckedChange` receives the next value and Base UI details. Its hidden checkbox participates in form submission through `name` and `value` and can send a change event to an enclosing form. The root exposes `data-component="ToggleSwitch"`, `data-size`, `data-checked`, and `data-disabled`; its thumb mirrors checked and disabled state.

The on/off status labels share space so switching states does not shift adjacent content. If custom labels wrap, both states reserve the taller label's height.

Forwards unrecognized props to Base UI's [`Switch.Root`](https://base-ui.com/react/components/switch#root), so it also accepts that part's props.

## Props

- `buttonLabelOff`: `string` — Default `'Off'`. Text shown when the switch is off. Only customize it when there is a more specific label for the context.
- `buttonLabelOn`: `string` — Default `'On'`. Text shown when the switch is on. Only customize it when there is a more specific label for the context.
- `className`: `string | ((state: SwitchRootState) => string | undefined)`
- `loading`: `boolean` — Default `false`. Whether the switch's value is being calculated. A loading switch shows a spinner and does not accept input.
- `loadingLabel`: `string` — Default `'Loading'`. Text describing what is loading, announced to assistive technology after `loadingLabelDelay`.
- `loadingLabelDelay`: `number` — Default `2000`. Delay in milliseconds before `loadingLabel` is announced while loading.
- `size`: `"medium" | "small"` — Default `'medium'`. Size of the switch.
- `statusLabelPosition`: `"end" | "start"` — Default `'start'`. Whether the "on" and "off" status labels appear before or after the switch. Only change this when the switch's alignment needs to be adjusted.

## Differences from `@primer/react`

- Replace `onChange(checked)` with `onCheckedChange(checked, details)`; `onChange` is not a switch state callback here. Base UI details contain the native event, not a React change event.
- The accessible control changes from a button with `aria-pressed` to a switch with `aria-checked`. Update role and state queries accordingly.
- A hidden checkbox supplies form values and can emit a change event that bubbles to an enclosing form. Do not rely on the legacy button's `onClick`/`onChange` ordering or propagation; verify any parent event handlers during migration.
- `ref`, `className`, and rest props target the switch control, not the outer status-label wrapper.
- `buttonType` is omitted; the switch submits through its hidden input and `name`/`value`.
- Use a visible associated label. The on/off status text is hidden from assistive technology and does not provide the switch's name.
- On/off status text shares a grid cell so the inactive label does not extend scrollable overflow. Both labels reserve space; multiline labels use the taller state for both switch states.
- Disabled and loading switches expose `aria-disabled="true"` and stay in the tab order, preserving keyboard discovery of their labels and descriptions. Base UI still suppresses activation; disabled hidden inputs remain disabled, while loading uses `readOnly`. An explicit `tabIndex` is preserved. External controlled `checked` updates still apply while unavailable.
- The expanded target follows Primer's pointer-size token with a 24px minimum height: at a 16px root font it is 44px high on coarse pointers, and at 12px it is 33px high. The track has a 24px minimum width; the target follows the track width and is not guaranteed to be 44px wide. Compact rows can be taller than in the legacy implementation; ancestor clipping, scrollbars, browser touch retargeting, and host styles can still affect the target.
- `sx` and styled-system props are unsupported; use `className`.
