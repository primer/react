# Radio

`Radio` is a styled radio primitive for use in a `RadioGroup`.

Import: `import {Radio} from '@primer/react-tailwind/Radio'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

`RadioProps` forwards Base UI radio props, including `value`, disabled state, and form fields. Selection is owned by the surrounding `RadioGroup`; the component owns its indicator and `data-component`.

## Import and composition

```tsx
import {Radio} from '@primer/react-tailwind/Radio'
import {FormControl} from '@primer/react-tailwind/FormControl'
;<FormControl layout="horizontal">
  <Radio name="shipping" value="standard" />
  <FormControl.Label>Standard shipping</FormControl.Label>
</FormControl>
import {RadioGroup} from '@primer/react-tailwind/RadioGroup'
```

Place radios in a `RadioGroup` and associate each with visible label text.

## Accessibility, forms, and validation

Use an associated label or `aria-label`; a radio's `value` is submitted through its group `name`. Group-level captions and validation belong in `FormControl`. A disabled radio is unavailable to mouse and keyboard input.

## Keyboard, events, and state

Radio-group arrow-key navigation selects and focuses choices. `RadioGroup.onValueChange` receives the next value and Base UI details. The primitive exposes `data-component="Radio"` plus `data-checked` and `data-disabled`; its state-aware `className` can tailor styles.

Forwards unrecognized props to Base UI's [`Radio.Root`](https://base-ui.com/react/components/radio#root), so it also accepts that part's props.

## Props

- `className`: `string | ((state: RadioRootState) => string | undefined)`

## Differences from `@primer/react`

- Use a visible label or associated FormControl label for every radio.
- For a group of choices, prefer RadioGroup so roving focus and a shared value are managed consistently.
- Keep avatar visuals in consumer composition; Radio does not import an Avatar dependency.
- Use `className`, not `sx` or styled-system props.
