# ToggleSwitch

`ToggleSwitch` is a form-associated binary switch with small and medium sizes.

Import: `import {ToggleSwitch} from '@primer/react-tailwind/ToggleSwitch'`

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

- Replace `onChange(checked)` with `onCheckedChange(checked, details)`.
