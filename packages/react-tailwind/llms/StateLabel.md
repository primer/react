# StateLabel

`StateLabel` shows the lifecycle state of an issue or pull request, such as open, closed, or merged. Use `Label` for general-purpose metadata.

Import: `import {StateLabel} from '@primer/react-tailwind/StateLabel'`

## Props

- `status`: `keyof typeof icons`

## Differences from `@primer/react`

- Keep the accessible text explicit rather than depending on color alone.

