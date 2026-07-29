# ToggleSwitch

`ToggleSwitch` is a form-associated binary switch with small and medium sizes.

Import: `import {ToggleSwitch} from '@primer/react-tailwind/ToggleSwitch'`

## Props

- `className`: `string | ((state: SwitchRootState) => string | undefined)`
- `size`: `"medium" | "small"` — Default `'medium'`. Size of the switch.

## Differences from `@primer/react`

- Use the checked-state contract; do not mirror Base UI state in a second React state source.
