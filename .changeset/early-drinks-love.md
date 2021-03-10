---
'@primer/components': minor
---

Removes deprecated theme variables in favor of functional theme variables

Primer v24.1 introduces _functional variables_ for styling components that are consistent across multiple themes. This deprecates previous color variables that identified specific colors.

## Migration guide

### Components

Most components don't need to be updated and should work without making changes. But some of the components that use presentational class names now use functional class names.

#### Labels

_note the change in pluralization from 'labels' to 'label'_

| [`v24.0`](https://primer.style/css/components/labels) | `v24.1`                          |
| ----------------------------------------------------- | -------------------------------- |
| `text="labels.grayDarkText"`                          | `text="label.primary.text`       |
| `border="labels.gray"`                                | `border="label.primary.border`   |
| `text="labels.grayText"`                              | `text="label.secondary.text`     |
| `border="labels.gray"`                                | `border="label.secondary.border` |
| `text="labels.blueText"`                              | `text="label.info.text`          |
| `border="labels.blue"`                                | `border="label.info.border`      |
| `text="labels.greenText"`                             | `text="label.success.text`       |
| `border="labels.green"`                               | `border="label.success.border`   |
| `text="labels.yellowText"`                            | `text="label.warning.text`       |
| `border="labels.yellow"`                              | `border="label.warning.border`   |
| `text="labels.redText"`                               | `text="label.danger.text`        |
| `border="labels.red"`                                 | `border="label.danger.border`    |
| `text="labels.orangeText"`                            | `text="label.primary.text`       |
| `border="labels.orange"`                              | `border="label.primary.text`     |
| `text="labels.pinkText"`                              | --                               |
| `border="labels.pink"`                                | --                               |
| `text="labels.purpleText"`                            | --                               |
| `border="labels.purple"`                              | --                               |

#### Counters

| [`v24.0`](https://primer.style/css/components/labels#counters) | `v24.1`              |
| -------------------------------------------------------------- | -------------------- |
| `scheme="gray"`                                                | `scheme="primary"`   |
| `scheme="gray-light"`                                          | `scheme="secondary"` |

#### Timeline

| [`v24.0`](https://primer.style/css/utilities/colors#background-utilities) | `v24.1`                       |
| ------------------------------------------------------------------------- | ----------------------------- |
| `bg="red.5"`                                                              | `bg="prState.closed.bg"`      |
| `bg="green.5"`                                                            | `bg="prState.open.bg"`        |
| `bg="purple.5"`                                                           | `bg="prState.merged.bg"`      |
| `bg="gray.5"`                                                             | `bg="prState.draft.bg"`       |
| `color="white"` [context: closed PR icon]                                 | `color="prState.closed.text"` |
| `color="white"` [context: open PR icon]                                   | `color="prState.open.text"`   |
| `color="white"` [context: merged PR icon]                                 | `color="prState.merged.text"` |
| `color="white"` [context: merged PR icon]                                 | `color="prState.draft.text"`  |

### Utility classes

See [the color utility classes page](/utilities/colors) for a list of all the functional color utility classes.

#### Text

| [`v24.0`](https://primer.style/css/utilities/colors#text-color-utilities) | `v24.1`          |
| ------------------------------------------------------------------------- | ---------------- |
| `text.gray`                                                               | `text.secondary` |
| `text.grayLight`                                                          | `text.tertiary`  |
| `text.grayDark`                                                           | `text.primary`   |
| `text.red`                                                                | `text.danger`    |
| `text.white`                                                              | `text.inverse`   |
| `gray.6`                                                                  | `text.secondary` |
| `gray.5`                                                                  | `text.tertiary`  |
| `gray.9`                                                                  | `text.primary`   |
| `red.6`                                                                   | `text.danger`    |
| `white`                                                                   | `text.inverse`   |
| `blue.5`                                                                  | `text.link`      |
| `gray.4`                                                                  | `text.disabled`  |
| `green.5`                                                                 | `text.success`   |
| `yellow.8`                                                                | `text.warning`   |

#### Icon

| `v24.0`    | `v24.1`          |
| ---------- | ---------------- |
| `gray.9`   | `icon.primary`   |
| `gray.6`   | `icon.secondary` |
| `gray.4`   | `icon.tertiary`  |
| `blue.5`   | `icon.info`      |
| `red.5`    | `icon.danger`    |
| `green.6`  | `icon.success`   |
| `yellow.8` | `icon.warning`   |

#### Border

| [`v24.0`](https://primer.style/css/utilities/borders#border-color-utilities) | `v24.1`           |
| ---------------------------------------------------------------------------- | ----------------- |
| `border.blue`                                                                | `border.info`     |
| `border.blueLight`                                                           | n/a               |
| `border.grayLight`                                                           | `border.primary`  |
| `border.grayDark`                                                            | `border.tertiary` |
| `border.grayDarker`                                                          | n/a               |
| `border.green`                                                               | `border.success`  |
| `border.greenLight`                                                          | n/a               |
| `border.purple`                                                              | n/a               |
| `border.red`                                                                 | `border.danger`   |
| `border.redLight`                                                            | n/a               |
| `border.white`                                                               | `border.inverse`  |
| `border.whiteFace`                                                           | n/a               |
| `border.yellow`                                                              | `border.warning`  |
| `border.blackFade`                                                           | `fade.fg15`       |
| `border.whiteFade`                                                           | `fade.white15`    |
| `blue.5`                                                                     | `border.info`     |
| `gray.2`                                                                     | `border.primary`  |
| `gray.3`                                                                     | `border.tertiary` |
| `green.4`                                                                    | `border.success`  |
| `red.5`                                                                      | `border.danger`   |
| `white`                                                                      | `border.inverse`  |

#### Background

| [`v24.0`](https://primer.style/css/utilities/colors#background-utilities) | `v24.1`             |
| ------------------------------------------------------------------------- | ------------------- |
| `white`                                                                   | `bg.primary`        |
| `bg.grayLight`                                                            | `bg.secondary`      |
| `bg.gray`                                                                 | `bg.tertiary`       |
| `bg.grayDark`                                                             | `bg.canvasInverse`  |
| `blue.0`                                                                  | `bg.info`           |
| `blue.5`                                                                  | `bg.infoInverse`    |
| `red.0`                                                                   | `bg.danger`         |
| `red.5`                                                                   | `bg.dangerInverse`  |
| `green.1`                                                                 | `bg.success`        |
| `green.5`                                                                 | `bg.successInverse` |
