# @primer/components

## 28.0.3

### Patch Changes

- [`c63fa4b5`](https://github.com/primer/components/commit/c63fa4b59bf5fa3e6f985b1d81b040efc8bc896c) [#1215](https://github.com/primer/components/pull/1215) Thanks [@dgreif](https://github.com/dgreif)! - Hide divider before `ActionList.Group`s with filled header

* [`a9260812`](https://github.com/primer/components/commit/a9260812ebaaa07747eb7cca40c6ff1c12892c49) [#1221](https://github.com/primer/components/pull/1221) Thanks [@dgreif](https://github.com/dgreif)! - Improved performance for lists in `ActionMenu` and `DropdownMenu`

- [`c63fa4b5`](https://github.com/primer/components/commit/c63fa4b59bf5fa3e6f985b1d81b040efc8bc896c) [#1215](https://github.com/primer/components/pull/1215) Thanks [@dgreif](https://github.com/dgreif)! - Align `Item` description to when rendered in-line

* [`c63fa4b5`](https://github.com/primer/components/commit/c63fa4b59bf5fa3e6f985b1d81b040efc8bc896c) [#1215](https://github.com/primer/components/pull/1215) Thanks [@dgreif](https://github.com/dgreif)! - Allow `focusZoneSettings` to be passed into `AnchoredOverlay`

- [`c63fa4b5`](https://github.com/primer/components/commit/c63fa4b59bf5fa3e6f985b1d81b040efc8bc896c) [#1215](https://github.com/primer/components/pull/1215) Thanks [@dgreif](https://github.com/dgreif)! - Add `selectionVariant: 'multiple'` for `Item`s. These will use a checkbox input instead of a checkmark icon for selected state

* [`d78af591`](https://github.com/primer/components/commit/d78af591971984a3a2d2707904eb235701d1c749) [#1214](https://github.com/primer/components/pull/1214) Thanks [@VanAnderson](https://github.com/VanAnderson)! - renderMenuItem in ActionMenu checks preventDefault for conditionally calling onClose

- [`4ab3d175`](https://github.com/primer/components/commit/4ab3d1752d14969fff222a4cf7fb2dcc1110d0fb) [#1222](https://github.com/primer/components/pull/1222) Thanks [@dgreif](https://github.com/dgreif)! - Trap focus in `AnchoredOverlay` as soon as it opens, regardless of the event that triggered it to open

* [`ff9ce6f1`](https://github.com/primer/components/commit/ff9ce6f108e29ac061b23e3338cb03e2f168f701) [#1217](https://github.com/primer/components/pull/1217) Thanks [@VanAnderson](https://github.com/VanAnderson)! - overlayProps passthrough from ActionMenu and DropdownMenu to AnchoredOverlay.

## 28.0.2

### Patch Changes

- [`d20a5996`](https://github.com/primer/components/commit/d20a5996aafdbc6446f13aaa7a489394926f083a) [#1209](https://github.com/primer/components/pull/1209) Thanks [@dgreif](https://github.com/dgreif)! - Allow Overlay height and width to be set through AnchoredOverlay
  Allow ActionList Items to supply an `id` instead of `key`
  Performance imporvements when ActionList is not given any groups
  Enable focus zone as soon as AnchoredOverlay opens

* [`d29741ca`](https://github.com/primer/components/commit/d29741cab4bfa4249000e5b2479e99f5aeea3189) [#1196](https://github.com/primer/components/pull/1196) Thanks [@dgreif](https://github.com/dgreif)! - Allow custom `children` in `ActionItem`. `text` and `description` can still be provided as a shortcut, but `children` is now available if you need more control over the rending of the item, without sacrificing benefits from `Item` by using `renderItem`.

- [`4c2e1a2b`](https://github.com/primer/components/commit/4c2e1a2b449d3f762c530f70a5056e581404d3d8) [#1195](https://github.com/primer/components/pull/1195) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Export useConfirm hook and ConfirmationDialog component from index.

* [`3c13d039`](https://github.com/primer/components/commit/3c13d039466370a70ed1e0bf8c3af0860fe26702) [#1201](https://github.com/primer/components/pull/1201) Thanks [@T-Hugs](https://github.com/T-Hugs)! - Fix overlay position when using an AnchoredOverlay

- [`c9b4db79`](https://github.com/primer/components/commit/c9b4db79ec2b4360f23f42d3ab49f265a56e9447) [#1199](https://github.com/primer/components/pull/1199) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Action Menu can have its open state be controlled externally.

* [`3e759e59`](https://github.com/primer/components/commit/3e759e59b5af115e82cca2253c0caca9e400be24) [#1211](https://github.com/primer/components/pull/1211) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use preventDefault on AnchoredOverlay instead of stopPropagation.

- [`84e3c570`](https://github.com/primer/components/commit/84e3c5706fa313eab5605f551256c0dc34a8626d) [#1194](https://github.com/primer/components/pull/1194) Thanks [@dgreif](https://github.com/dgreif)! - Handle `onAction` for `DropdownMenu` Items

* [`7aeb53fe`](https://github.com/primer/components/commit/7aeb53fec23a80414f6c1db8b31c06beb2073dd2) [#1200](https://github.com/primer/components/pull/1200) Thanks [@dgreif](https://github.com/dgreif)! - Perform ActionMenu actions after overlay has closed. This allows the action to move focus if so desired, without the ActionMenu focus trap preventing focus from moving away.

- [`bba66fdd`](https://github.com/primer/components/commit/bba66fddb51be251456711e21e725b1034bae806) [#1206](https://github.com/primer/components/pull/1206) Thanks [@VanAnderson](https://github.com/VanAnderson)! - stopPropagation for mousedown and click in AnchoredOverlay based components

## 28.0.1

### Patch Changes

- [`b319ce43`](https://github.com/primer/components/commit/b319ce4396b11c185faee23f0884632806922303) [#1197](https://github.com/primer/components/pull/1197) Thanks [@dmarcey](https://github.com/dmarcey)! - Typescript declare files will now be published to the lib-esm directory, as well as lib

* [`17957f29`](https://github.com/primer/components/commit/17957f293542d6cbf5f8005698bb352f95d5c8f7) [#1192](https://github.com/primer/components/pull/1192) Thanks [@dgreif](https://github.com/dgreif)! - Add basic docs for `AnchoredOverlay`

## 28.0.0

### Major Changes

- [`5f85394d`](https://github.com/primer/components/commit/5f85394dc16f076080824d8fdb3bda06d01e29da) [#1157](https://github.com/primer/components/pull/1157) Thanks [@dgreif](https://github.com/dgreif)! - Removed `useMouseIntent` in favor of [`:focus-visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible). With the removal of `useMouseIntent`, the `intent-mouse` class will no longer be added to the `<body>`. Since `:focus-visible` is a relatively new psuedo-class, a polyfill is included. Any focused elements that meet the criteria for `:focus-visible` will also have a `focus-visible` class added to them by the polyfill.

### Patch Changes

- [`f7857a06`](https://github.com/primer/components/commit/f7857a06031df339fa61d27f8ca717e4df95d5e5) [#1159](https://github.com/primer/components/pull/1159) Thanks [@hehex9](https://github.com/hehex9)! - Removed unused dependencies

## 27.0.0

### Major Changes

- [`db478205`](https://github.com/primer/components/commit/db478205bf467a118394e0519034bb87116dc85a) [#1147](https://github.com/primer/components/pull/1147) Thanks [@colebemis](https://github.com/colebemis)! - Type definitions are now being generated by TypeScript instead of manually maintained. These new type definitions may differ from the previous type definitions and cause breaking changes. If you experience any new TypeScript errors, feel free to create an [issue](https://github.com/primer/components/issues) or reach out in Slack (#design-systems).

  ### Breaking changes

  - The following types are no longer exported:

    ```
    BaseProps
    UseDetailsProps
    AnchoredPositionHookSettings
    AnchorAlignment
    AnchorSide
    PositionSettings
    PaginationHrefBuilder
    PaginationPageChangeCallback
    PositionComponentProps
    ```

  - Props are now defined with types instead of interfaces which means in some cases you may not be able to create interfaces that `extend` them. To work around this issue, you may need to convert your interfaces to types:

    ```diff
    import {BoxProps} from '@primer/components'

    - interface MyFancyBox extends BoxProps {...}
    + type MyFancyBox = BoxProps & {...}
    ```

  - Some components now expect more specific ref types. For example:

    ```diff
    - const ref = React.useRef<HTMLElement>(null)
    + const ref = React.useRef<HTMLButtonElement>(null)

    return <Button ref={ref}>...</Button>
    ```

## 26.0.0

### Major Changes

- [`016a273f`](https://github.com/primer/components/commit/016a273fde30f0185e23309e1a39c1bc034174f8) [#1115](https://github.com/primer/components/pull/1115) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Removes deprecated presentational theme variables in favor of _functional variables_ for styling components that are consistent across multiple themes.

  ## Migration guide

  If you don't use any color-related system props (e.g. `color`, `bg`, `borderColor`), all components should work without changes. If you're using color-related system props, you'll need to update them to use the new functional variables. Reference the tables below to see how old variables map to new functional variables.

  If you have any questions, feel free to reach out in the #design-systems channel.

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

## 25.0.0

### Major Changes

- [`8799f74a`](https://github.com/primer/components/commit/8799f74ad69911e9840d51a65d08237f3cb1f172) [#1112](https://github.com/primer/components/pull/1112) Thanks [@colebemis](https://github.com/colebemis)! - Primer React now supports color modes! 🎉

  See the new [Theming](https://primer.style/components/theming) documentation for more details.

  #### Breaking changes

  - You'll need to replace the `ThemeProvider` from `styled-components` with the new Primer React `ThemeProvider`:

  ```diff
  - import {ThemeProvider} from 'styled-components'
  - import {theme} from '@primer/components
  + import {ThemeProvider} from '@primer/components'

  function App() {
    return (
  -   <ThemeProvider theme={theme}>
  +   <ThemeProvider>
        <div>your app here...</div>
      </ThemeProvider>
    )
  }
  ```

  - The structure of the theme object has changed to support color schemes:

  ```diff
  const theme = {
  - colors,
  - shadows,
  + colorSchemes: {
  +   light: {
  +     colors,
  +     shadows,
  +   },
  +   dark: {...},
  +   dark_dimmed: {...},
  + },
    space,
    fonts,
    fontSizes,
    fontWeights,
    lineHeights,
    borderWidths,
    radii,
    breakpoints,
    sizes,
  }
  ```

  - The `theme.colors` and `theme.shadows` objects are no longer available from the `theme` export. Use the `useTheme`hook instead:

  ```diff
  - import {theme} from '@primer/components'
  + import {useTheme} from '@primer/components'

  function Example() {
  + const {theme} = useTheme()
    const myColor = theme.colors.text.primary
    ...
  }
  ```

### Patch Changes

- [`360e3595`](https://github.com/primer/components/commit/360e3595a6e133e8caf391e7355f25b856936b12) [#1111](https://github.com/primer/components/pull/1111) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Update color variable used in ProgressBar (`state.success` → `bg.successInverse`)

* [`1b3d87d2`](https://github.com/primer/components/commit/1b3d87d27103b99dd02cbf61f88d93b7df80d5b1) [#1127](https://github.com/primer/components/pull/1127) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Bump @primer/primitives from 0.0.0-20211167520 to 0.0.0-20212178221

## 24.0.0

### Major Changes

- [`b9d9d245`](https://github.com/primer/components/commit/b9d9d2450c3f726fa0e6bc8cb43ba678df0c60ad) [#1068](https://github.com/primer/components/pull/1068) Thanks [@colebemis](https://github.com/colebemis)! - Remove propTypes in favor of TypeScript types

* [`beef075e`](https://github.com/primer/components/commit/beef075e0274396b77887adf0b912583fe564b3f) [#1094](https://github.com/primer/components/pull/1094) Thanks [@colebemis](https://github.com/colebemis)! - Components no longer have a default `theme` prop. To ensure components still render correctly, you'll need pass the Primer theme to a [styled-components](https://styled-components.com/) `<ThemeProvider>` at the root of your application:

  ```jsx
  import {ThemeProvider} from 'styled-components'
  import {theme} from '@primer/components'

  funciton App(props) {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <div>your app here</div>
        </ThemeProvider>
      </div>
    )
  }
  ```

### Patch Changes

- [`397f3360`](https://github.com/primer/components/commit/397f3360f1e6486ae475394b5b4cef968a0cdb21) [#1106](https://github.com/primer/components/pull/1106) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in Pagination

* [`fa106ea9`](https://github.com/primer/components/commit/fa106ea9a43a8451efb648d1e3ec9df87577379c) [#1090](https://github.com/primer/components/pull/1090) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in BaseStyles

- [`fa106ea9`](https://github.com/primer/components/commit/fa106ea9a43a8451efb648d1e3ec9df87577379c) [#1090](https://github.com/primer/components/pull/1090) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in BranchName

* [`e93cf268`](https://github.com/primer/components/commit/e93cf268b9b8b25fee535dc4aa7d31c0b015d420) [#1092](https://github.com/primer/components/pull/1092) Thanks [@bscofield](https://github.com/bscofield)! - Use functional color variables in Caret, CircleBadge, Pagehead, ProgressBar, and Popover

- [`5a042778`](https://github.com/primer/components/commit/5a04277861a78d567b812e7b83c2977c61402247) [#1099](https://github.com/primer/components/pull/1099) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in FilterList

* [`a886bbcf`](https://github.com/primer/components/commit/a886bbcf765659a4742245d37c9f8d1327daca7a) [#1098](https://github.com/primer/components/pull/1098) Thanks [@bscofield](https://github.com/bscofield)! - Update SelectMenu and child components to use functional color variables

- [`f2c57794`](https://github.com/primer/components/commit/f2c57794dc8163eda974d37a4fbb939b631c82cc) [#1085](https://github.com/primer/components/pull/1085) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in SideNav

* [`756191e7`](https://github.com/primer/components/commit/756191e7d20ea46c83a591fd2cf7b2ab9c3ed0fc) [#1100](https://github.com/primer/components/pull/1100) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in ButtonOutline

- [`6b2dc95f`](https://github.com/primer/components/commit/6b2dc95f2b3e250e130ff7e36d18eda3cda94b4a) [#1085](https://github.com/primer/components/pull/1085) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in TabNav

* [`51d180ac`](https://github.com/primer/components/commit/51d180ace3562569910a80557904f138677b3262) [#1089](https://github.com/primer/components/pull/1089) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in Timeline

- [`51d180ac`](https://github.com/primer/components/commit/51d180ace3562569910a80557904f138677b3262) [#1089](https://github.com/primer/components/pull/1089) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in TextInput

* [`8f2b4d2e`](https://github.com/primer/components/commit/8f2b4d2e434d1af2eb6d5d3c7f566fae147033ee) [#1100](https://github.com/primer/components/pull/1100) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in ButtonPrimary

- [`51d180ac`](https://github.com/primer/components/commit/51d180ace3562569910a80557904f138677b3262) [#1089](https://github.com/primer/components/pull/1089) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in Link

* [`fa106ea9`](https://github.com/primer/components/commit/fa106ea9a43a8451efb648d1e3ec9df87577379c) [#1090](https://github.com/primer/components/pull/1090) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in BorderBox

- [`51d180ac`](https://github.com/primer/components/commit/51d180ace3562569910a80557904f138677b3262) [#1089](https://github.com/primer/components/pull/1089) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in Tooltip

* [`1fb750af`](https://github.com/primer/components/commit/1fb750afc9083466eadad76b3387967d466d336a) [#1097](https://github.com/primer/components/pull/1097) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in ButtonTableList

- [`ea21d8eb`](https://github.com/primer/components/commit/ea21d8eb99f710727b31d2c0f8ddc1d5f59d61cf) [#1102](https://github.com/primer/components/pull/1102) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in Flash

* [`51d180ac`](https://github.com/primer/components/commit/51d180ace3562569910a80557904f138677b3262) [#1089](https://github.com/primer/components/pull/1089) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in UnderlineNav

- [`44aa68e2`](https://github.com/primer/components/commit/44aa68e2e725bdb2a3be349d7bec3e18b3f17809) [#1101](https://github.com/primer/components/pull/1101) Thanks [@emplums](https://github.com/emplums)! - Forwards aria-label to correct component

* [`d0f38c3d`](https://github.com/primer/components/commit/d0f38c3d7bbcc7d57a8d459d8c61862102f89b1e) [#1102](https://github.com/primer/components/pull/1102) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in Header

- [`5df7723a`](https://github.com/primer/components/commit/5df7723afabe0d3bdd29e3eab8622586b3ab072a) [#1099](https://github.com/primer/components/pull/1099) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in DropdownStyles

* [`170876e6`](https://github.com/primer/components/commit/170876e6546a435faf7e0401d6fc8060a64b199d) [#1097](https://github.com/primer/components/pull/1097) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in Button

- [`c44ee363`](https://github.com/primer/components/commit/c44ee363e9d663b873ea721e42dac8e5366ebcd1) [#1085](https://github.com/primer/components/pull/1085) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in SubNav

* [`198e24ad`](https://github.com/primer/components/commit/198e24adef084b115441c72b80d3113f411a5fa5) [#1100](https://github.com/primer/components/pull/1100) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in ButtonDanger

- [`39371d98`](https://github.com/primer/components/commit/39371d98be5c7fa1bf2be5542a90d752bc330e2b) [#1099](https://github.com/primer/components/pull/1099) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in CounterLabel

* [`92597504`](https://github.com/primer/components/commit/9259750429913d7977746c55da5a397d591a4f45) [#1100](https://github.com/primer/components/pull/1100) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in ButtonClose

- [`fa106ea9`](https://github.com/primer/components/commit/fa106ea9a43a8451efb648d1e3ec9df87577379c) [#1090](https://github.com/primer/components/pull/1090) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in AvatarPair

* [`fa106ea9`](https://github.com/primer/components/commit/fa106ea9a43a8451efb648d1e3ec9df87577379c) [#1090](https://github.com/primer/components/pull/1090) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in AvatarStack

- [`565f1980`](https://github.com/primer/components/commit/565f19808c528a2d33042c339603ea76d6097d0c) [#1097](https://github.com/primer/components/pull/1097) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in Breadcrumb

* [`4e19045e`](https://github.com/primer/components/commit/4e19045ec1ca46ece0c029a193ed1863a8994030) [#1085](https://github.com/primer/components/pull/1085) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in StateLabel

- [`31025697`](https://github.com/primer/components/commit/31025697b61f80fc35442e66e73311269d0cdc48) [#1099](https://github.com/primer/components/pull/1099) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in Dialog

* [`67cc5b23`](https://github.com/primer/components/commit/67cc5b23fb5b968a7ecbebbca9671e65d4acfee6) [#1097](https://github.com/primer/components/pull/1097) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in ButtonInvisible

## 23.2.1

### Patch Changes

- [`a42162c0`](https://github.com/primer/components/commit/a42162c011fa3718a32124b79aecfe306f358298) [#1087](https://github.com/primer/components/pull/1087) Thanks [@emplums](https://github.com/emplums)! - Fix up styles in TabNav allowing for items positioned on the right end of TabNav

## 23.2.0

### Minor Changes

- [`b273f1f9`](https://github.com/primer/components/commit/b273f1f95fcb3e2224414d6a0be124e29701d439) [#1083](https://github.com/primer/components/pull/1083) Thanks [@emplums](https://github.com/emplums)! - Adds a `contrast` prop to TextInput

### Patch Changes

- [`c50b9f93`](https://github.com/primer/components/commit/c50b9f93402e7898b2a30f6f7fd0159ed40a8e86) [#1059](https://github.com/primer/components/pull/1059) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Dropdown` to TypeScript

* [`681799fd`](https://github.com/primer/components/commit/681799fd996537f56b15169ce8ac801e68aff41b) [#1066](https://github.com/primer/components/pull/1066) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `useMouseIntent` to TypeScript

- [`eaeb2389`](https://github.com/primer/components/commit/eaeb2389738c1c366e41ddb7795b03c865359034) [#1055](https://github.com/primer/components/pull/1055) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `utils` to TypeScript

* [`106eb85e`](https://github.com/primer/components/commit/106eb85e969fa9ece03a789b1175346e8d53cb83) [#1060](https://github.com/primer/components/pull/1060) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `Dialog` to TypeScript

- [`f11e6ac6`](https://github.com/primer/components/commit/f11e6ac67ff675137e672a33d445678fd3b64b3a) [#1048](https://github.com/primer/components/pull/1048) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `SelectMenu` to TypeScript

* [`bb635a50`](https://github.com/primer/components/commit/bb635a5094baf6821e45a7a03c6582989ee86fd5) [#1058](https://github.com/primer/components/pull/1058) Thanks [@colebemis](https://github.com/colebemis)! - Migrate theme to TypeScript

- [`fabca94e`](https://github.com/primer/components/commit/fabca94ebc3b5429b5c541aeaac6eb508fd5f182) [#1047](https://github.com/primer/components/pull/1047) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `Pagination` to TypeScript

* [`c868bc96`](https://github.com/primer/components/commit/c868bc9613cb32d6fc0de009c75abdaa20c1bcdb) [#1074](https://github.com/primer/components/pull/1074) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Add functional color variables from Primer Primitives to theme object

## 23.1.0

### Minor Changes

- [`e0432b35`](https://github.com/primer/components/commit/e0432b35f152031be8e4a0830df5d228d7b14832) [#1041](https://github.com/primer/components/pull/1041) Thanks [@emplums](https://github.com/emplums)! - Adds new `useSafeTimeout` helper Hook

### Patch Changes

- [`eaf57cf5`](https://github.com/primer/components/commit/eaf57cf514da106f9bd1b4de01f5fc037a84fa23) [#1054](https://github.com/primer/components/pull/1054) Thanks [@emplums](https://github.com/emplums)! - Fix border radius on ButtonClose

* [`57eba0da`](https://github.com/primer/components/commit/57eba0da8fea003d00fce781d05ac581616de391) [#1054](https://github.com/primer/components/pull/1054) Thanks [@emplums](https://github.com/emplums)! - Add ButtonInvisible focus styles

- [`e2c90dba`](https://github.com/primer/components/commit/e2c90dba38976c280f44544cd7bf5cbbc8816ee3) [#1049](https://github.com/primer/components/pull/1049) Thanks [@eintxaurtieta](https://github.com/eintxaurtieta)! - Added font-family:inherit to TextInput

* [`be82a500`](https://github.com/primer/components/commit/be82a50033e8392c2dd80f56df9f398397f45379) [#1046](https://github.com/primer/components/pull/1046) Thanks [@emplums](https://github.com/emplums)! - - Fixed Dropdown & Details types.

- [`7c4c726c`](https://github.com/primer/components/commit/7c4c726c822fafc524e9b6928a7f9d413e1a7bc8) [#1046](https://github.com/primer/components/pull/1046) Thanks [@emplums](https://github.com/emplums)! - - Added useDetails behavior back to Dropdown

## 23.0.4

### Patch Changes

- [`8de64e95`](https://github.com/primer/components/commit/8de64e9588dd4c545f7eca3a13d74d5f860e2b0e) [#1029](https://github.com/primer/components/pull/1029) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `TabNav` to TypeScript

* [`16aeca6b`](https://github.com/primer/components/commit/16aeca6bb37f1724037cd83db580eee69c473332) [#1032](https://github.com/primer/components/pull/1032) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `AvatarStack` to TypeScript

- [`4070310a`](https://github.com/primer/components/commit/4070310a334d8d37c5a1277f11298ef675ed1465) [#1026](https://github.com/primer/components/pull/1026) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `Details` to TypeScript

* [`8f483bd9`](https://github.com/primer/components/commit/8f483bd94bb9a09ca88e3f2a116c4396404627c3) [#1042](https://github.com/primer/components/pull/1042) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `PointerBox` to TypeScript

- [`c5d2b657`](https://github.com/primer/components/commit/c5d2b65725c7e584412430fd3156875b8e1714d8) [#1035](https://github.com/primer/components/pull/1035) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `CircleBadge` to TypeScript

* [`3fcdf25f`](https://github.com/primer/components/commit/3fcdf25fc7c2def336dec4f5b34f518b2dbff903) [#1040](https://github.com/primer/components/pull/1040) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `SideNav` to TypeScript

- [`ff02c038`](https://github.com/primer/components/commit/ff02c038cdeef9cbeb8d050b3c5a951ccdbb9574) [#1033](https://github.com/primer/components/pull/1033) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Tooltip` to TypeScript

* [`0d62f260`](https://github.com/primer/components/commit/0d62f260672453a7509173b5b6d02778cf73a3e8) [#1030](https://github.com/primer/components/pull/1030) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Caret` to TypeScript

- [`d1785f4c`](https://github.com/primer/components/commit/d1785f4cd312eff66f4a0b897aaf22aff11441bc) [#1038](https://github.com/primer/components/pull/1038) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `SubNav` to TypeScript

* [`058e7919`](https://github.com/primer/components/commit/058e791936399b1e08c31bfa18c772015da587c7) [#1036](https://github.com/primer/components/pull/1036) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `CircleOcticon` to TypeScript

- [`9b71bf38`](https://github.com/primer/components/commit/9b71bf387aad9f3cd3802594fd3cccc473b46661) [#998](https://github.com/primer/components/pull/998) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Position` to TypeScript

* [`b2ac3010`](https://github.com/primer/components/commit/b2ac301092e37a319ddc10440f929425da066f69) [#1037](https://github.com/primer/components/pull/1037) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Timeline` to TypeScript

- [`ef25d019`](https://github.com/primer/components/commit/ef25d01961d20fd590dd3abcef10c87fd26135be) [#1031](https://github.com/primer/components/pull/1031) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `AvatarPair` to TypeScript

* [`62f45a12`](https://github.com/primer/components/commit/62f45a12fbd87d18adbc611a6410734f9fd16ab9) [#1028](https://github.com/primer/components/pull/1028) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `TextInput` to TypeScript

- [`a4dce5da`](https://github.com/primer/components/commit/a4dce5daecdf65ce2ea8e55f962e5843b2b10e26) [#1017](https://github.com/primer/components/pull/1017) Thanks [@smockle](https://github.com/smockle)! - Migrate button components to TypeScript

* [`cc36e6b4`](https://github.com/primer/components/commit/cc36e6b410600994d46af864cec7b83314a6987c) [#1034](https://github.com/primer/components/pull/1034) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Popover` to TypeScript

- [`11340814`](https://github.com/primer/components/commit/113408140bef3d47a023925aa975273e264959ac) [#1020](https://github.com/primer/components/pull/1020) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `Header` to TypeScript

## 23.0.3

### Patch Changes

- [`3e0110bc`](https://github.com/primer/components/commit/3e0110bc942ba080c8c7bbaf1778b88b3cc25570) [#995](https://github.com/primer/components/pull/995) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Flash` to TypeScript

* [`b0cea82e`](https://github.com/primer/components/commit/b0cea82e27e72f2bd351c14721e0d70343c98ebd) [#1003](https://github.com/primer/components/pull/1003) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Truncate` to TypeScript

- [`f9a7e78a`](https://github.com/primer/components/commit/f9a7e78a0e512be90cc349483ed6fab2010e1765) [#987](https://github.com/primer/components/pull/987) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `ProgressBar` to TypeScript

* [`d848b9e0`](https://github.com/primer/components/commit/d848b9e054a0f96648ddd02b13ac9c19f56ecb42) [#993](https://github.com/primer/components/pull/993) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `StyledOcticon` to TypeScript

- [`73bced4b`](https://github.com/primer/components/commit/73bced4bdf70b71137e1d4c349db232842efcdee) [#1015](https://github.com/primer/components/pull/1015) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `FilterList` to TypeScript

* [`fcd773c4`](https://github.com/primer/components/commit/fcd773c4212062b2957dd3befba90ac034dd3fe5) [#1009](https://github.com/primer/components/pull/1009) Thanks [@emplums](https://github.com/emplums)! - Upgrade Octicons to 11.3.0

- [`b9671ca2`](https://github.com/primer/components/commit/b9671ca28bbcf9521882f9ca2fed986c426a8833) [#1005](https://github.com/primer/components/pull/1005) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `CounterLabel` to TypeScript

* [`1fb77ac3`](https://github.com/primer/components/commit/1fb77ac3b0ed60dee0481bd14f069f913d37cfdd) [#1012](https://github.com/primer/components/pull/1012) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Breadcrumb` to TypeScript

- [`91002078`](https://github.com/primer/components/commit/91002078bc173134e7c94541fe5388fca0baefa5) [#1008](https://github.com/primer/components/pull/1008) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `StateLabel` to TypeScript

* [`3a3c81a4`](https://github.com/primer/components/commit/3a3c81a4e71a88249d08a02d26575c7d00e35fa3) [#984](https://github.com/primer/components/pull/984) Thanks [@bscofield](https://github.com/bscofield)! - Migrate `Avatar` to TypeScript

- [`df2920f5`](https://github.com/primer/components/commit/df2920f5e80e6f73d423f1e1dd468994a5894618) [#1014](https://github.com/primer/components/pull/1014) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `UnderlineNav` to TypeScript

* [`b947aff2`](https://github.com/primer/components/commit/b947aff26f26d46ebe8f7bb4b930863ba1b05eaa) [#1006](https://github.com/primer/components/pull/1006) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `FilteredSearch` to TypeScript

- [`2e71f70f`](https://github.com/primer/components/commit/2e71f70f2113de273b9c41a667f2fc9b539a01de) [#1011](https://github.com/primer/components/pull/1011) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `Link` to TypeScript

## 23.0.2

### Patch Changes

- [`7128403c`](https://github.com/primer/components/commit/7128403c488a2cfefda3743d7f92be8142071bc8) [#979](https://github.com/primer/components/pull/979) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Text` to TypeScript

* [`fe16e21c`](https://github.com/primer/components/commit/fe16e21cb3a67d424cdbb663ea2d13e2397eb42c) [#982](https://github.com/primer/components/pull/982) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `BaseStyles` to TypeScript

- [`ee806857`](https://github.com/primer/components/commit/ee8068579106d34309faa1a0c44e1ed25edafb59) [#975](https://github.com/primer/components/pull/975) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Heading` to TypeScript

* [`25315571`](https://github.com/primer/components/commit/2531557171cd2e39b980a456d42e15880e16256f) [#976](https://github.com/primer/components/pull/976) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Label` to TypeScript

- [`4076bf4e`](https://github.com/primer/components/commit/4076bf4e173d997c46ba1130c5f0f86f04952790) [#986](https://github.com/primer/components/pull/986) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Flex` to TypeScript

* [`397a46fe`](https://github.com/primer/components/commit/397a46fe1edee9c2bb71e6ceedafff8dc4e76cb2) [#976](https://github.com/primer/components/pull/976) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `LabelGroup` to TypeScript

- [`e841e158`](https://github.com/primer/components/commit/e841e158dcc557169fce19c78d5d90af5fef6af6) [#983](https://github.com/primer/components/pull/983) Thanks [@shiftkey](https://github.com/shiftkey)! - Add supported `htmlFor` prop to `FormGroupLabelProps` type definition

* [`dc0df4b2`](https://github.com/primer/components/commit/dc0df4b209d952b121f04fc86d0f2984a6e661cf) [#973](https://github.com/primer/components/pull/973) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `BorderBox` to TypeScript

- [`0cac0042`](https://github.com/primer/components/commit/0cac00426d4d29c51d9f110f091aac06c49ec054) [#974](https://github.com/primer/components/pull/974) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `BranchName` to TypeScript

* [`755a1a5c`](https://github.com/primer/components/commit/755a1a5c19f6d6298f9c6785b50fed71aaea59ad) [#977](https://github.com/primer/components/pull/977) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Pagehead` to TypeScript

- [`34ff4885`](https://github.com/primer/components/commit/34ff4885311686699fbb6d2e3fab0337bad3d016) [#989](https://github.com/primer/components/pull/989) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Grid` to TypeScript
