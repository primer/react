# Radio

`Radio` is a styled radio primitive for use in a `RadioGroup`.

Import: `import {Radio} from '@primer/react-tailwind/Radio'`

Forwards unrecognized props to Base UI's [`Radio.Root`](https://base-ui.com/react/components/radio#root), so it also accepts that part's props.

## Props

- `className`: `string | ((state: RadioRootState) => string | undefined)`

## Differences from `@primer/react`

- Use a visible label or associated FormControl label for every radio.
- For a group of choices, prefer RadioGroup so roving focus and a shared value are managed consistently.
- Keep avatar visuals in consumer composition; Radio does not import an Avatar dependency.
- Use `className`, not `sx` or styled-system props.
