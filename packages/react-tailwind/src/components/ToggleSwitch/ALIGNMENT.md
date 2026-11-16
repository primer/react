# Alignment

## From: `@primer/react`

Legacy ToggleSwitch renders a wrapper with on/off status text, a loading spinner with a delayed loading announcement, and a `button` with `aria-pressed`. It exposes `onChange(checked)`, `buttonType`, `statusLabelPosition`, `buttonLabelOn`, `buttonLabelOff`, `loading`, `loadingLabel`, and `loadingLabelDelay`.

## To: `@primer/react-tailwind`

ToggleSwitch keeps the Primer status label, `statusLabelPosition`, custom on/off labels, size, and loading props (`loading`, `loadingLabel`, `loadingLabelDelay`). The control itself is a Base UI `Switch.Root` with `role="switch"`, a hidden form input, and the normalized `checked`, `defaultChecked`, and `onCheckedChange` state contract. Loading maps to Base UI `readOnly`, so the switch stays focusable but does not toggle. The status label is derived from Base UI's `data-checked` state with CSS, so there is no second React state source.

## Migration notes

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
