---
'@primer/components': major
---

Removes deprecated presentational theme variables in favor of _functional variables_ for styling components that are consistent across multiple themes.

## Migration guide

If you don't use any color-related system props (e.g. `color`, `bg`, `borderColor`), all components should work without changes. If you're using color-related system props, you'll need to update them to use the new functional variables. Reference the tables below to see how old variables map to new functional variables.

If you have any quenstions, feel free to reach out in the #design-systems channel.

#### Text

| `v25`                    | `v26`                    |
| ------------------------ | ------------------------ |
| `color="text.gray"`      | `color="text.secondary"` |
| `color="text.grayLight"` | `color="text.tertiary"`  |
| `color="text.grayDark"`  | `color="text.primary"`   |
| `color="text.red"`       | `color="text.danger"`    |
| `color="text.white"`     | `color="text.inverse"`   |
| `color="gray.6"`         | `color="text.secondary"` |
| `color="gray.5"`         | `color="text.tertiary"`  |
| `color="gray.9"`         | `color="text.primary"`   |
| `color="red.6"`          | `color="text.danger"`    |
| `color="white"`          | `color="text.inverse"`   |
| `color="blue.5"`         | `color="text.link"`      |
| `color="gray.4"`         | `color="text.disabled"`  |
| `color="green.5"`        | `color="text.success"`   |
| `color="yellow.8"`       | `color="text.warning"`   |

#### Icon

| `v25`              | `v25`                    |
| ------------------ | ------------------------ |
| `color="gray.9"`   | `color="icon.primary"`   |
| `color="gray.6"`   | `color="icon.secondary"` |
| `color="gray.4"`   | `color="icon.tertiary"`  |
| `color="blue.5"`   | `color="icon.info"`      |
| `color="red.5"`    | `color="icon.danger"`    |
| `color="green.6"`  | `color="icon.success"`   |
| `color="yellow.8"` | `color="icon.warning"`   |

#### Border

| `v25`                             | `v26`                           |
| --------------------------------- | ------------------------------- |
| `borderColor="border.blue"`       | `borderColor="border.info"`     |
| `borderColor="border.blueLight"`  | n/a                             |
| `borderColor="border.grayLight"`  | `borderColor="border.primary"`  |
| `borderColor="border.grayDark"`   | `borderColor="border.tertiary"` |
| `borderColor="border.grayDarker"` | n/a                             |
| `borderColor="border.green"`      | `borderColor="border.success"`  |
| `borderColor="border.greenLight"` | n/a                             |
| `borderColor="border.purple"`     | n/a                             |
| `borderColor="border.red"`        | `borderColor="border.danger"`   |
| `borderColor="border.redLight"`   | n/a                             |
| `borderColor="border.white"`      | `borderColor="border.inverse"`  |
| `borderColor="border.whiteFace"`  | n/a                             |
| `borderColor="border.yellow"`     | `borderColor="border.warning"`  |
| `borderColor="border.blackFade"`  | `borderColor="fade.fg15"`       |
| `borderColor="border.whiteFade"`  | `borderCOlor="fade.white15"`    |
| `borderColor="blue.5"`            | `borderColor="border.info"`     |
| `borderColor="gray.2"`            | `borderColor="border.primary"`  |
| `borderColor="gray.3"`            | `borderColor="border.tertiary"` |
| `borderColor="green.4"`           | `borderColor="border.success"`  |
| `borderColor="red.5"`             | `borderColor="border.danger"`   |
| `borderColor="white"`             | `borderColor="border.inverse"`  |

#### Background

| `v25`               | `v26`                    |
| ------------------- | ------------------------ |
| `bg="white"`        | `bg="bg.primary"`        |
| `bg="bg.grayLight"` | `bg="bg.secondary"`      |
| `bg="bg.gray"`      | `bg="bg.tertiary"`       |
| `bg="bg.grayDark"`  | `bg="bg.canvasInverse"`  |
| `bg="blue.0"`       | `bg="bg.info"`           |
| `bg="blue.5"`       | `bg="bg.infoInverse"`    |
| `bg="red.0"`        | `bg="bg.danger"`         |
| `bg="red.5"`        | `bg="bg.dangerInverse"`  |
| `bg="green.1"`      | `bg="bg.success"`        |
| `bg="green.5"`      | `bg="bg.successInverse"` |

#### Labels

_Note the change in pluralization from 'labels' to 'label'._

| `v25`                         | `v26`                                 |
| ----------------------------- | ------------------------------------- |
| `color="labels.grayDarkText"` | `color="label.primary.text`           |
| `borderColor="labels.gray"`   | `borderColor="label.primary.border`   |
| `color="labels.grayText"`     | `color="label.secondary.text`         |
| `borderColor="labels.gray"`   | `borderColor="label.secondary.border` |
| `color="labels.blueText"`     | `color="label.info.text`              |
| `borderColor="labels.blue"`   | `borderColor="label.info.border`      |
| `color="labels.greenText"`    | `color="label.success.text`           |
| `borderColor="labels.green"`  | `borderColor="label.success.border`   |
| `color="labels.yellowText"`   | `color="label.warning.text`           |
| `borderColor="labels.yellow"` | `borderColor="label.warning.border`   |
| `color="labels.redText"`      | `color="label.danger.text`            |
| `borderColor="labels.red"`    | `borderColor="label.danger.border`    |
| `color="labels.orangeText"`   | `color="label.primary.text`           |
| `borderColor="labels.orange"` | `borderColor="label.primary.text`     |
| `color="labels.pinkText"`     | n/a                                   |
| `borderColor="labels.pink"`   | n/a                                   |
| `color="labels.purpleText"`   | n/a                                   |
| `borderColor="labels.purple"` | n/a                                   |

#### Counters

| `v25`                 | `v26`                |
| --------------------- | -------------------- |
| `scheme="gray"`       | `scheme="primary"`   |
| `scheme="gray-light"` | `scheme="secondary"` |

#### Timeline

| `v25`                                     | `v26`                         |
| ----------------------------------------- | ----------------------------- |
| `bg="red.5"`                              | `bg="prState.closed.bg"`      |
| `bg="green.5"`                            | `bg="prState.open.bg"`        |
| `bg="purple.5"`                           | `bg="prState.merged.bg"`      |
| `bg="gray.5"`                             | `bg="prState.draft.bg"`       |
| `color="white"` (context: closed PR icon) | `color="prState.closed.text"` |
| `color="white"` (context: open PR icon)   | `color="prState.open.text"`   |
| `color="white"` (context: merged PR icon) | `color="prState.merged.text"` |
| `color="white"` (context: merged PR icon) | `color="prState.draft.text"`  |
