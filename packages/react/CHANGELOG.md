# @primer/react

## 38.1.0

### Minor Changes

- [#7065](https://github.com/primer/react/pull/7065) [`9090053`](https://github.com/primer/react/commit/90900532e7566da2d12ff74685678463d5c7f247) Thanks [@TylerJDev](https://github.com/TylerJDev)! - ActionBar: Add `ActionBar.Menu` subcomponent

- [#7056](https://github.com/primer/react/pull/7056) [`6ff2797`](https://github.com/primer/react/commit/6ff2797662bf7ab8cf8575d13ad061923bf0d9c1) Thanks [@adierkens](https://github.com/adierkens)! - Update active indicators for ActionList & FilteredActionList to follow content height

- [#7063](https://github.com/primer/react/pull/7063) [`247c66a`](https://github.com/primer/react/commit/247c66a3c297afba73c6e9e3842cc15ff8a845c1) Thanks [@francinelucca](https://github.com/francinelucca)! - Feat: popover implement click outside

- [#7123](https://github.com/primer/react/pull/7123) [`01b16db`](https://github.com/primer/react/commit/01b16dbe6bf7984bcd282ba5d640d2f6b19b887f) Thanks [@adierkens](https://github.com/adierkens)! - Adds an experimental `Tabs` utility component & associated hooks

- [#7109](https://github.com/primer/react/pull/7109) [`34e7108`](https://github.com/primer/react/commit/34e71089ea7668d7b0ab4572f125d13b998e8754) Thanks [@adierkens](https://github.com/adierkens)! - Add support to ActionList for 'tablist' and 'tab' roles

- [#7112](https://github.com/primer/react/pull/7112) [`7160709`](https://github.com/primer/react/commit/71607096f1ed60455313d3e1e26ce803f985307c) Thanks [@hectahertz](https://github.com/hectahertz)! - PageHeader: Remove useResponsiveValue hook from TitleArea variant prop

  Migrates PageHeader.TitleArea's `variant` prop to use `getResponsiveAttributes` following ADR-018 for SSR-safe responsive values. This prevents layout shift during hydration when using responsive variants.

### Patch Changes

- [#7114](https://github.com/primer/react/pull/7114) [`15a13c6`](https://github.com/primer/react/commit/15a13c64917676d47e4ce899ce1f96939cc754d6) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - ActionList: Fix trailing action button to take full height.

- [#7124](https://github.com/primer/react/pull/7124) [`a746a83`](https://github.com/primer/react/commit/a746a83e68da54a7f66161b0f1d68bfbdc071ce6) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - Fixed Timeline.Break when followed by a condensed item and clip sidebar for condensed items.

- [#7060](https://github.com/primer/react/pull/7060) [`3468793`](https://github.com/primer/react/commit/3468793e15269d6d9f226ee7844921e44bfc4622) Thanks [@francinelucca](https://github.com/francinelucca)! - @primer/react: chore(Dialog): allow direct children

- [#7115](https://github.com/primer/react/pull/7115) [`21cefb9`](https://github.com/primer/react/commit/21cefb96c1ed7d00d6b16f29ea5d358c6502d160) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionBar: IconButton no longer adds it's own `data-testid`

- [#7061](https://github.com/primer/react/pull/7061) [`e58e102`](https://github.com/primer/react/commit/e58e1027d7f3cdae5223c08d83f7b86918db370b) Thanks [@francinelucca](https://github.com/francinelucca)! - PageLayout: update wrapper dimensions to match PageLayout's root element

- [#7130](https://github.com/primer/react/pull/7130) [`57ffdbc`](https://github.com/primer/react/commit/57ffdbce7fa2bedd762b7e4d6dcea1d916e0da9c) Thanks [@joshblack](https://github.com/joshblack)! - Update the `AnchoredOverlay` component so that the `ref` value is not overridden when spreading props

- [#7097](https://github.com/primer/react/pull/7097) [`12fad7a`](https://github.com/primer/react/commit/12fad7af4d9d31898dfff5d3419987100b398d9e) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: fix UnderlineWrapper html structure

- [#7101](https://github.com/primer/react/pull/7101) [`9382e52`](https://github.com/primer/react/commit/9382e529a8a4a0204ce0c412a0c8840cfbfe9f2c) Thanks [@hectahertz](https://github.com/hectahertz)! - Remove use of useResponsiveValue hook - PageLayout

- [#7128](https://github.com/primer/react/pull/7128) [`4d0f08a`](https://github.com/primer/react/commit/4d0f08a24750704374655c3dc0450012f905bca0) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Link: Remove deprecated underline prop. (Not used in github-ui)

## 38.0.0

### Major Changes

- [#6944](https://github.com/primer/react/pull/6944) [`446956d`](https://github.com/primer/react/commit/446956d3466ca11b95adf720d7cf07a1bb6bad92) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx from deprecated ActionList component.

- [#6965](https://github.com/primer/react/pull/6965) [`f61238c`](https://github.com/primer/react/commit/f61238c295377f59a5d3c5b0c782e98c238fa639) Thanks [@francinelucca](https://github.com/francinelucca)! - Chore/remove styled. components: deprecated UnderlineNav, ValidationAnimation, LabelGroup, Tooltip

- [#6921](https://github.com/primer/react/pull/6921) [`c58f171`](https://github.com/primer/react/commit/c58f171be98dfec354eeb85c870368e84796fe6e) Thanks [@llastflowers](https://github.com/llastflowers)! - Update ActionList component and related components to no longer support sx/styled-components

- [#6902](https://github.com/primer/react/pull/6902) [`c395547`](https://github.com/primer/react/commit/c395547ae30bb51ea40388183f384848a397dc80) Thanks [@iansan5653](https://github.com/iansan5653)! - Support nested children in ActionBar.

- [#6930](https://github.com/primer/react/pull/6930) [`260c74c`](https://github.com/primer/react/commit/260c74c4e9f780a891157c9a2bc1450a12f8593a) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes `sx` prop from DataTable.Container

- [#6942](https://github.com/primer/react/pull/6942) [`3ced917`](https://github.com/primer/react/commit/3ced917f595667e1f68a6b9110bd034e0d88bf2a) Thanks [@francinelucca](https://github.com/francinelucca)! - Removes sx prop from PageLayout and subcomponents

- [#6951](https://github.com/primer/react/pull/6951) [`2703bc9`](https://github.com/primer/react/commit/2703bc9cad2d3f16552b748f3799949a35464a1a) Thanks [@francinelucca](https://github.com/francinelucca)! - Update FormControl component to no longer support sx

- [#7027](https://github.com/primer/react/pull/7027) [`415fafc`](https://github.com/primer/react/commit/415fafc23bb2060cc856cda8de432a4447a47bfd) Thanks [@francinelucca](https://github.com/francinelucca)! - Remove styled-components and styled-system from dependencies

- [#7032](https://github.com/primer/react/pull/7032) [`9fce541`](https://github.com/primer/react/commit/9fce5419ce76c94837f2bd4b013f007837a97182) Thanks [@francinelucca](https://github.com/francinelucca)! - - remove sx, SxProp, exports

- [#6897](https://github.com/primer/react/pull/6897) [`c1448cc`](https://github.com/primer/react/commit/c1448cc6546b0e58b1ceb54fa2989a1fd7cbfe30) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Replaces `useTheme` usage with `theme`. If an application uses a custom theme that modifies one of the following 5 tokens, they will be reset to the default theme values. (`space.2, colors.success.fg, colors.border.default, colors.border.muted, animation.easeOutCubic`)

- [#7015](https://github.com/primer/react/pull/7015) [`0889246`](https://github.com/primer/react/commit/0889246fda736fe7dd967a295fe8467109d06bc9) Thanks [@francinelucca](https://github.com/francinelucca)! - @primer/react: chore: remove Box, BoxProps export

- [#6945](https://github.com/primer/react/pull/6945) [`1c84c0f`](https://github.com/primer/react/commit/1c84c0ff2b261a02d81c11fb16c7d3fb05294506) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(Octicon): remove sx

- [#6904](https://github.com/primer/react/pull/6904) [`62df166`](https://github.com/primer/react/commit/62df166574d6248b3405c224a2f63f1e53a75ece) Thanks [@pksjce](https://github.com/pksjce)! - Remove sx property from Button

- [#6874](https://github.com/primer/react/pull/6874) [`15824db`](https://github.com/primer/react/commit/15824db141ef32b3e090bcf1880f03bd9684392a) Thanks [@pksjce](https://github.com/pksjce)! - Remove sx from UnderlinePanels

- [#6690](https://github.com/primer/react/pull/6690) [`c5c2053`](https://github.com/primer/react/commit/c5c2053caf38da76a4310098e805b2edb05e2552) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx support from the Token component.

- [#6673](https://github.com/primer/react/pull/6673) [`19befd6`](https://github.com/primer/react/commit/19befd66b801532bb0ef85e60296c73d8c747fc5) Thanks [@llastflowers](https://github.com/llastflowers)! - Update CircleBadge component to no longer support sx

- [#6868](https://github.com/primer/react/pull/6868) [`2053cb3`](https://github.com/primer/react/commit/2053cb3f7ee15fe1e4c3cc9be3c09c82dd5aed93) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes Box usage and sx prop from NavList and ActionList

- [#6631](https://github.com/primer/react/pull/6631) [`86b3e60`](https://github.com/primer/react/commit/86b3e6063855615675c87df6eccad41d83db3762) Thanks [@joshblack](https://github.com/joshblack)! - Remove the sx prop from Label

- [#6865](https://github.com/primer/react/pull/6865) [`eaf7e58`](https://github.com/primer/react/commit/eaf7e5840e4fbe4042c80711f983a0df05e2b68d) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: remove sx from Overlay

- [#6825](https://github.com/primer/react/pull/6825) [`4196e0e`](https://github.com/primer/react/commit/4196e0eed6894d020a83b9f382f5cb6817f9a725) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes `Box` component usage and `sx` prop from the `Link` component, Storybook stories, and a .figma.tsx file

- [#6864](https://github.com/primer/react/pull/6864) [`b0abd78`](https://github.com/primer/react/commit/b0abd785713d9f95ca9d5e41394e00153176077d) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove support for `sx` from the `TabNav` component

- [#6923](https://github.com/primer/react/pull/6923) [`e5753f0`](https://github.com/primer/react/commit/e5753f0560fc57d426e795c012ffcb0b7fb0d290) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: remove sx from deprecated Dialog

- [#6729](https://github.com/primer/react/pull/6729) [`7ae5db2`](https://github.com/primer/react/commit/7ae5db229837fdd75dd73ce1779c7faa18734f89) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Update Text component to no longer support sx.

- [#6667](https://github.com/primer/react/pull/6667) [`d122122`](https://github.com/primer/react/commit/d12212225884b17cf6236af9feb8b098caaeea35) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Update Tooltip component to no longer support sx.

- [#6611](https://github.com/primer/react/pull/6611) [`15c1eb7`](https://github.com/primer/react/commit/15c1eb734210938182323bb15200d69ae4a3a300) Thanks [@joshblack](https://github.com/joshblack)! - Update Avatar component to no longer support sx, add sx wrapper to @primer/styled-react

- [#6844](https://github.com/primer/react/pull/6844) [`1f9f582`](https://github.com/primer/react/commit/1f9f582f29e623a33401061832d8b6ab778c47b3) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Update `Breadcrumbs` to no longer support sx

- [#6812](https://github.com/primer/react/pull/6812) [`0834e9e`](https://github.com/primer/react/commit/0834e9ebe910c363f413723a254e0f2bd947a4b6) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` from the Dialog component and sub-components

- [#6928](https://github.com/primer/react/pull/6928) [`2eeff36`](https://github.com/primer/react/commit/2eeff368832b6fc122aef70302f681b1f14ad71f) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes `sx` prop from VisuallyHidden component, and as a result also removes `sx` prop from CheckboxGroup.Label and RadioGroup.Label

- [#6860](https://github.com/primer/react/pull/6860) [`628e601`](https://github.com/primer/react/commit/628e60172343fdf1c94734c39480991b0591e267) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` from the `Heading` component

- [#6805](https://github.com/primer/react/pull/6805) [`0f075d1`](https://github.com/primer/react/commit/0f075d1a679f0733ad984eeb2a677989ceca8ad0) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes usage of Box component from other components.

- [#6857](https://github.com/primer/react/pull/6857) [`b9b558e`](https://github.com/primer/react/commit/b9b558efe1033150b05adc88d28234db5dc82f95) Thanks [@pksjce](https://github.com/pksjce)! - Remove PointerBox from @primer-react

- [#6708](https://github.com/primer/react/pull/6708) [`b7b8a36`](https://github.com/primer/react/commit/b7b8a36d14b3c5b6f9c289423691fe9285eae786) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx prop support from the Spinner component.

- [#6833](https://github.com/primer/react/pull/6833) [`5ad1e93`](https://github.com/primer/react/commit/5ad1e939c1ef494f7680b0753a4d7c6296e088d6) Thanks [@joshblack](https://github.com/joshblack)! - Remove sx support from Radio

- [#6841](https://github.com/primer/react/pull/6841) [`3e02e2c`](https://github.com/primer/react/commit/3e02e2c235a3633b646b8f2a493f3a23e17187bf) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` from `deprecated/Pagehead`

- [#6692](https://github.com/primer/react/pull/6692) [`bb8d648`](https://github.com/primer/react/commit/bb8d648a42ec84e9baefae00fa87ede2be449e64) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx Props and BoxWithFallBack from Timeline component.

- [#6668](https://github.com/primer/react/pull/6668) [`acb6233`](https://github.com/primer/react/commit/acb6233fa0cf715d660ae222ebca9853115cb707) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Update UnderlineNav component to no longer support sx and remove Box usage from it.

- [#6835](https://github.com/primer/react/pull/6835) [`961c1c4`](https://github.com/primer/react/commit/961c1c48d942b9d8d81289a5d09d78f4d985f5da) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` from `ButtonGroup`

- [#6834](https://github.com/primer/react/pull/6834) [`fa70b5e`](https://github.com/primer/react/commit/fa70b5eaae4c68ccac2bbfa44546ee85594a054a) Thanks [@joshblack](https://github.com/joshblack)! - Remove the `sx` prop from `Flash`

- [#6876](https://github.com/primer/react/pull/6876) [`2102252`](https://github.com/primer/react/commit/2102252ef34899bb37c52ca4df193ba5cca41a94) Thanks [@llastflowers](https://github.com/llastflowers)! - Update FilteredActionList and FilteredActionListLoaders components to no longer support sx

- [#6840](https://github.com/primer/react/pull/6840) [`aba8050`](https://github.com/primer/react/commit/aba8050ee9d324fa53a7b81d30b4f8dc7186c70a) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` prop from `deprecated/FilteredSearch`

- [#6685](https://github.com/primer/react/pull/6685) [`00261c9`](https://github.com/primer/react/commit/00261c934fe88a74ef310c3134fe202226156b4b) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove the sx prop from RadioGroup and Truncate.

- [#6878](https://github.com/primer/react/pull/6878) [`7081dd3`](https://github.com/primer/react/commit/7081dd3b45f7dae08f7a39038be95dbf20dd8a27) Thanks [@llastflowers](https://github.com/llastflowers)! - Update BaseStyles component to no longer support sx

- [#6679](https://github.com/primer/react/pull/6679) [`6158135`](https://github.com/primer/react/commit/6158135e42be9486bb7de35fbedf96e412b8a1d7) Thanks [@llastflowers](https://github.com/llastflowers)! - Update CounterLabel component to no longer support sx

- [#6827](https://github.com/primer/react/pull/6827) [`6843040`](https://github.com/primer/react/commit/6843040ad9b9810cb14f6186e53b01e83bed60f8) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for the sx prop from RelativeTime

- [#6813](https://github.com/primer/react/pull/6813) [`a1a4ad0`](https://github.com/primer/react/commit/a1a4ad00b87b489f6341aa818a9b8b8662fe2a82) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` prop for `InlineMessage`

- [#6866](https://github.com/primer/react/pull/6866) [`3237a4e`](https://github.com/primer/react/commit/3237a4e549779a2b3144b1f48974e533d28cca2a) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(LinkButton): remove sx from LinkButton

- [#6655](https://github.com/primer/react/pull/6655) [`092185f`](https://github.com/primer/react/commit/092185f7b9d6c70296e629e03790676502b701e5) Thanks [@llastflowers](https://github.com/llastflowers)! - Update CheckboxGroup component to no longer support sx

- [#6654](https://github.com/primer/react/pull/6654) [`513cc3f`](https://github.com/primer/react/commit/513cc3feed5723632e54f07cae9d4397e3783fdc) Thanks [@llastflowers](https://github.com/llastflowers)! - Update Checkbox component to no longer support sx

- [#6837](https://github.com/primer/react/pull/6837) [`134f96e`](https://github.com/primer/react/commit/134f96e81476f829f2b0f0b44fa73cc1604983d5) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Update ProgressBar to no longer support sx

- [#6839](https://github.com/primer/react/pull/6839) [`32febac`](https://github.com/primer/react/commit/32febac10a887cce418abf6f4419cfb100a8f292) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` from `Header`

- [#6871](https://github.com/primer/react/pull/6871) [`44b3d73`](https://github.com/primer/react/commit/44b3d732157048059681f3fdcb86c5d77a59aec5) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` from `PageHeader`

- [#6863](https://github.com/primer/react/pull/6863) [`9614c0e`](https://github.com/primer/react/commit/9614c0eae7d77bdf879df474c44d613b673e6d4e) Thanks [@pksjce](https://github.com/pksjce)! - Remove Banner from experimental

- [#6754](https://github.com/primer/react/pull/6754) [`4d080aa`](https://github.com/primer/react/commit/4d080aa4c8718d2f4ab42c841cf2c8d252cdd19f) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Update Popover to no longer support sx

- [#6666](https://github.com/primer/react/pull/6666) [`71382dc`](https://github.com/primer/react/commit/71382dc5c0726f46a9da7823a9543334b7d0fcca) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes styled-system usage from TextInputWrapper and related components and Storybook stories.

- [#6425](https://github.com/primer/react/pull/6425) [`e23d965`](https://github.com/primer/react/commit/e23d96524783863d92fc770a36c564b14098242b) Thanks [@joshblack](https://github.com/joshblack)! - Update @primer/react to only export ESM bundles

- [#6806](https://github.com/primer/react/pull/6806) [`9d13904`](https://github.com/primer/react/commit/9d13904037541d8f4f68d5d833f632304cace06e) Thanks [@joshblack](https://github.com/joshblack)! - Remove the `sx` prop from `Announce`, `AriaAlert`, and `AriaStatus`

- [#6741](https://github.com/primer/react/pull/6741) [`4896ef1`](https://github.com/primer/react/commit/4896ef1b541e47e5f6364c5eb0f7ab357594e456) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx prop support from the SegmentedControl component.

- [#6634](https://github.com/primer/react/pull/6634) [`d883432`](https://github.com/primer/react/commit/d883432010274cf87691a9affb0e012764b2cdae) Thanks [@TylerJDev](https://github.com/TylerJDev)! - CircleOcticon: Remove component `CircleOcticon`

- [#6713](https://github.com/primer/react/pull/6713) [`7d7b797`](https://github.com/primer/react/commit/7d7b797b7696af8dd9533e501f62f3666982307d) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Deprecate TextInputWithTokens component. The component has been moved to the deprecated entrypoint due to low usage and accessibility implications. Import from `@primer/react/deprecated` instead of `@primer/react`.

- [#6272](https://github.com/primer/react/pull/6272) [`d74d73e`](https://github.com/primer/react/commit/d74d73e413a9941cdc74c6f5a2cf6b1be9e7e8db) Thanks [@llastflowers](https://github.com/llastflowers)! - remove unused `contrast` from Select component

- [#6652](https://github.com/primer/react/pull/6652) [`c6d923f`](https://github.com/primer/react/commit/c6d923f93c0cb40453f1a9dab9209a9caeb87bce) Thanks [@llastflowers](https://github.com/llastflowers)! - Update AvatarStack component to no longer support sx

- [#6716](https://github.com/primer/react/pull/6716) [`e177d55`](https://github.com/primer/react/commit/e177d551730a30a0f3cddf97fb55ee1ca54c784a) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx prop support from the SelectPanel component.

- [#6737](https://github.com/primer/react/pull/6737) [`2d01fc4`](https://github.com/primer/react/commit/2d01fc4116ea5bf77dcaae4674aa80930ebe4917) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx prop support from the Select component.

- [#6706](https://github.com/primer/react/pull/6706) [`e3f26cc`](https://github.com/primer/react/commit/e3f26ccbcf40b38cea75f32970ddb23865d7b827) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Deprecate CircleBadge component

- [#6676](https://github.com/primer/react/pull/6676) [`ab5ffb0`](https://github.com/primer/react/commit/ab5ffb00d6e54224542ee60bcc23915b0bb65b15) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes styled-system and related utilities from Caret.tsx, IssueLabelToken.tsx, StateLabel.tsx, ToggleSwitch.tsx, and deprecated/ActionList/List.tsx

  Removes WidthProps from ProgressBar.tsx

- [#6735](https://github.com/primer/react/pull/6735) [`45a52c1`](https://github.com/primer/react/commit/45a52c17cc72af52d123d7104b2d395cd2ca61c8) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Update SideNav component to no longer support sx.

- [#6682](https://github.com/primer/react/pull/6682) [`5bbaae7`](https://github.com/primer/react/commit/5bbaae78f732df2470c1ea7933863ef8a3f9681c) Thanks [@llastflowers](https://github.com/llastflowers)! - Update LabelGroup component to no longer support sx

- [#6680](https://github.com/primer/react/pull/6680) [`5c30443`](https://github.com/primer/react/commit/5c3044342cd2214bbd9d1d50a704d8789ca019d4) Thanks [@llastflowers](https://github.com/llastflowers)! - Update Details component to no longer support sx

- [#6625](https://github.com/primer/react/pull/6625) [`65ae375`](https://github.com/primer/react/commit/65ae3757c1828bb5db5b5dd24d4ce743c679cf28) Thanks [@llastflowers](https://github.com/llastflowers)! - Update BranchName component to no longer support sx

- [#6627](https://github.com/primer/react/pull/6627) [`6111046`](https://github.com/primer/react/commit/61110467f759c6680797c56d72deb9f86bba4dcd) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Update ToggleSwitch component to no longer support sx, add sx wrapper to @primer/styled-react.

- [#6607](https://github.com/primer/react/pull/6607) [`133d5a5`](https://github.com/primer/react/commit/133d5a5e74b85811d2bb8b536836d5c16680efe1) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove sx prop support from the VisuallyHidden component

- [#6622](https://github.com/primer/react/pull/6622) [`247b3f7`](https://github.com/primer/react/commit/247b3f75c49e16b883e8f0528a036fc62d274ee6) Thanks [@francinelucca](https://github.com/francinelucca)! - BREAKING CHANGE: remove AvatarToken
  BREAKING CHANGE: make Caret component internal only

- [#6595](https://github.com/primer/react/pull/6595) [`de5a4b7`](https://github.com/primer/react/commit/de5a4b7297a44d0dd1ad175ea8d740f570bc27e6) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Remove AvatarPair component from codebase

- [#6656](https://github.com/primer/react/pull/6656) [`3a778b9`](https://github.com/primer/react/commit/3a778b97b93a0fe2c54f585d668cd70d30c0ca56) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Update StateLabel component to no longer support sx.

- [#6610](https://github.com/primer/react/pull/6610) [`65fc87d`](https://github.com/primer/react/commit/65fc87dc35652c5b228fc7e22d7644645ede2c89) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove sx prop support from the Stack component

- [#6613](https://github.com/primer/react/pull/6613) [`3ab94c5`](https://github.com/primer/react/commit/3ab94c5e8853855c8533c8403fd0d0203ab087d6) Thanks [@llastflowers](https://github.com/llastflowers)! - Update SplitPageLayout component to no longer support sx

- [#6602](https://github.com/primer/react/pull/6602) [`d6d25dc`](https://github.com/primer/react/commit/d6d25dc9263119103138156158f74b408d300dd2) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove sx support from SubNav component

### Minor Changes

- [#6979](https://github.com/primer/react/pull/6979) [`8b2632b`](https://github.com/primer/react/commit/8b2632ba63ef0fbd67d43e50df4a7ec6ea640e8e) Thanks [@TylerJDev](https://github.com/TylerJDev)! - ActionBar: Adds `ActionBar.Group` sub component

- [#7066](https://github.com/primer/react/pull/7066) [`c32f726`](https://github.com/primer/react/commit/c32f7260838e850df5efd839c23cf74bc519e3b7) Thanks [@adierkens](https://github.com/adierkens)! - Exports useAnchoredPosition utility

- [#7045](https://github.com/primer/react/pull/7045) [`7595b8d`](https://github.com/primer/react/commit/7595b8d0d534043aeca69f0862a8ffd5c911c50c) Thanks [@langermank](https://github.com/langermank)! - Add new `Banner` `actionsLayout` prop to handle actions layout edge cases

- [#7033](https://github.com/primer/react/pull/7033) [`4c4c4cd`](https://github.com/primer/react/commit/4c4c4cd4bfd7d75066df199f47a23deb86a588f2) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Deprecate `leadingIcon` in favor of `leadingVisual` for `SegmentedControl.Button`.

- [#6976](https://github.com/primer/react/pull/6976) [`2ec5bf2`](https://github.com/primer/react/commit/2ec5bf2898a6966161a076f5896910bf1b1f4018) Thanks [@francinelucca](https://github.com/francinelucca)! - feat: support custom slots

- [#6919](https://github.com/primer/react/pull/6919) [`32e12c6`](https://github.com/primer/react/commit/32e12c690a53aef918e765d128f381c8f57bfd02) Thanks [@TylerJDev](https://github.com/TylerJDev)! - TreeView: Add `count` and `className` support for trailing actions

- [#6889](https://github.com/primer/react/pull/6889) [`9201d93`](https://github.com/primer/react/commit/9201d939056333945375c454999d853e0bbabf8f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltip: Add delay functionality to tooltips with the options of `instant` (default), `medium`, `long`

- [#6937](https://github.com/primer/react/pull/6937) [`09ee0ea`](https://github.com/primer/react/commit/09ee0ea580ba6901d6e80cb35f7cc846db17197e) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: add styles to formcontrol and subcomponents

- [#6456](https://github.com/primer/react/pull/6456) [`fbd3ac7`](https://github.com/primer/react/commit/fbd3ac75a67b89635dcd28879a1b4a93cef70289) Thanks [@TylerJDev](https://github.com/TylerJDev)! - TreeView: Add trailing actions prop `secondaryActions`

- [#6855](https://github.com/primer/react/pull/6855) [`356a129`](https://github.com/primer/react/commit/356a129d2a1a0c02d9ca59280e7711e501c0d20d) Thanks [@cheshire137](https://github.com/cheshire137)! - Add buttonLabelOn and buttonLabelOff to ToggleSwitch

- [#6815](https://github.com/primer/react/pull/6815) [`2024709`](https://github.com/primer/react/commit/2024709eca73533c74ee042cb1524e78e495fba2) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: add PortalContext

- [#6709](https://github.com/primer/react/pull/6709) [`78784b3`](https://github.com/primer/react/commit/78784b3127acb844ec8a60d4a36141addb75d43d) Thanks [@pksjce](https://github.com/pksjce)! - Remove overflow property from popover (It has no usage)

- [#6721](https://github.com/primer/react/pull/6721) [`d6378c2`](https://github.com/primer/react/commit/d6378c246748403275ca17bc8aa7f713157ab1b7) Thanks [@cheshire137](https://github.com/cheshire137)! - Add count to SegmentedControlButton

- [#6843](https://github.com/primer/react/pull/6843) [`f082c77`](https://github.com/primer/react/commit/f082c77768526d9f97566a793e80a386cc0bc699) Thanks [@camchenry](https://github.com/camchenry)! - Allow changing initially focused button in ConfirmationDialog

- [#6726](https://github.com/primer/react/pull/6726) [`50c230f`](https://github.com/primer/react/commit/50c230f01b7e4b7c4664a676381737f995bf644e) Thanks [@joshblack](https://github.com/joshblack)! - Add ProgressBarItemProps and ProgressBarItemProps type exports to @primer/react

- [#6726](https://github.com/primer/react/pull/6726) [`50c230f`](https://github.com/primer/react/commit/50c230f01b7e4b7c4664a676381737f995bf644e) Thanks [@joshblack](https://github.com/joshblack)! - Add ToggleSwitchProps type to package exports

- [#6542](https://github.com/primer/react/pull/6542) [`f4ded58`](https://github.com/primer/react/commit/f4ded585c4f6188390cdc3243018fe63af310633) Thanks [@TylerJDev](https://github.com/TylerJDev)! - CircleOcticon: Deprecate component

- [#6535](https://github.com/primer/react/pull/6535) [`e6c7614`](https://github.com/primer/react/commit/e6c7614d7aaa420ce8518ad54af62e6409fea9dd) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - fix(Label): Add missing ref for Label without sx prop

- [#6468](https://github.com/primer/react/pull/6468) [`1f531cb`](https://github.com/primer/react/commit/1f531cb5c0fb87fc20ab8ce4321367d3f24ab734) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Deprecate AvatarPair component - move to @primer/react/deprecated

### Patch Changes

- [#6994](https://github.com/primer/react/pull/6994) [`701a9d0`](https://github.com/primer/react/commit/701a9d02cc5958bdeb12d63bbc169c5d40bd26e6) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: prevent slot rewrite on CheckboxOrRadioGroup subcomponents

- [#6984](https://github.com/primer/react/pull/6984) [`a3765c2`](https://github.com/primer/react/commit/a3765c2e6c7d23972cdeeb8e206d802678f0d832) Thanks [@mperrotti](https://github.com/mperrotti)! - Fixes vertical alignment of prev/next pagination chevrons

- [#7014](https://github.com/primer/react/pull/7014) [`a108ab9`](https://github.com/primer/react/commit/a108ab92fa71af83f7da1ee9a311bc272568cfb3) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: remove useTheme from IssueLabel

- [#7020](https://github.com/primer/react/pull/7020) [`aaa2e1f`](https://github.com/primer/react/commit/aaa2e1f5589a862557b6f7d5194e0579bc952c84) Thanks [@hectahertz](https://github.com/hectahertz)! - Fixes `Details` flickering, prevents re-renders

- [#6981](https://github.com/primer/react/pull/6981) [`3099210`](https://github.com/primer/react/commit/30992106820dee75cb2f6f0594e66acfd8b56f3c) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes unwanted box-shadow on buttons with 'inactive' prop passed.

- [#7008](https://github.com/primer/react/pull/7008) [`ca6d60d`](https://github.com/primer/react/commit/ca6d60d37dcdaec354bbdd097fd8c656971e752b) Thanks [@langermank](https://github.com/langermank)! - Use primitives for Button line-height

- [#6877](https://github.com/primer/react/pull/6877) [`860ac93`](https://github.com/primer/react/commit/860ac93dcdff0ba6f05cac1b5137721a9b34dfcb) Thanks [@mperrotti](https://github.com/mperrotti)! - In `ActionBar`, `aria-label` now gets added to the `role="toolbar"` element.

- [#7017](https://github.com/primer/react/pull/7017) [`2fd6c82`](https://github.com/primer/react/commit/2fd6c82e327db24b63cf604465b4192b0d29d8a9) Thanks [@langermank](https://github.com/langermank)! - update token close button sizing

- [#7000](https://github.com/primer/react/pull/7000) [`34e7fa8`](https://github.com/primer/react/commit/34e7fa8cd88684c16d17e997aa7ef69d40b50340) Thanks [@pksjce](https://github.com/pksjce)! - Add gap prop to ActionBar for customizable spacing between items

- [#6959](https://github.com/primer/react/pull/6959) [`76f1ca3`](https://github.com/primer/react/commit/76f1ca32a9303b18a2084c4e11c4699963b88e4e) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(AvatarStack, CheckboxOrRadioGroup, UnstyledTextInput): cleanup remaining sx props

- [#6973](https://github.com/primer/react/pull/6973) [`a3f7ea9`](https://github.com/primer/react/commit/a3f7ea96514d4ba0a2d28aeb26e49eaafb8bf474) Thanks [@jonrohan](https://github.com/jonrohan)! - fix(AnchoredOverlay): Omit aria-label and aria-labelledby from renderAnchor props

- [#7046](https://github.com/primer/react/pull/7046) [`4ffe66d`](https://github.com/primer/react/commit/4ffe66d0d87c5ab8a3c0d9ef4e9ba571e6d57393) Thanks [@pksjce](https://github.com/pksjce)! - Fix: ActionMenu with overflow contains scrollbars within its rounded border

- [#6996](https://github.com/primer/react/pull/6996) [`173f76d`](https://github.com/primer/react/commit/173f76d917a688515ae36f2240bf5461db5eda0c) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: add missing slot checks to CheckboxOrRadioGroup, SelectPanel, ActionMenu, Treeview, SegmentedControl and PageHeader

- [#6954](https://github.com/primer/react/pull/6954) [`7dd483f`](https://github.com/primer/react/commit/7dd483f74e2a75e5c0a44f46a860afc2bdf0da9a) Thanks [@langermank](https://github.com/langermank)! - Adjust ConfirmationDialog heading styling

- [#7007](https://github.com/primer/react/pull/7007) [`96968a2`](https://github.com/primer/react/commit/96968a28c1ddb2c31cb3e2f0e2e6297c1ee8df97) Thanks [@mperrotti](https://github.com/mperrotti)! - Corrects bg color of disabled indeterminate checkbox

- [#7019](https://github.com/primer/react/pull/7019) [`4308179`](https://github.com/primer/react/commit/43081799465d5e4d66a0d761406a2ab64fb27d91) Thanks [@francinelucca](https://github.com/francinelucca)! - add missing isSlot checks

- [#6982](https://github.com/primer/react/pull/6982) [`3c32e7e`](https://github.com/primer/react/commit/3c32e7e162ae9a5f66c068639934cc55c01cca72) Thanks [@mperrotti](https://github.com/mperrotti)! - Uses correct bg color for disabled ToggleSwitch knob

- [#6935](https://github.com/primer/react/pull/6935) [`8641c7a`](https://github.com/primer/react/commit/8641c7a778f88c9f65fa1f3d2c40994468651ae7) Thanks [@JelloBagel](https://github.com/JelloBagel)! - Fix overflow calculations of more menu button in action bar

- [#6925](https://github.com/primer/react/pull/6925) [`ecc81b5`](https://github.com/primer/react/commit/ecc81b569b421a4181b0a2f4cdff9cfe60fe28fd) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(TextInput): remove sx

- [#7030](https://github.com/primer/react/pull/7030) [`52d6cf7`](https://github.com/primer/react/commit/52d6cf7e7cc2a0f4ea3186ee61412a2a2549b530) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SelectPanel): remove hidden attribute from selection Radio

- [#6958](https://github.com/primer/react/pull/6958) [`3032026`](https://github.com/primer/react/commit/30320263482baf9d2c634ec27122c9a42ece308a) Thanks [@siddharthkp](https://github.com/siddharthkp)! - @primer/react: Export `useId` and `useSyncedState`

- [#6980](https://github.com/primer/react/pull/6980) [`4b84948`](https://github.com/primer/react/commit/4b849489b123636209d6dd71b0fe66fbe7963bdb) Thanks [@TylerJDev](https://github.com/TylerJDev)! - ActionBar: Supplies `aria-label` to toolbar inside of `ActionBar`

- [#7048](https://github.com/primer/react/pull/7048) [`f4a92f6`](https://github.com/primer/react/commit/f4a92f6d5fab8aee0bebb0b3bd8a400d55dc6cc7) Thanks [@langermank](https://github.com/langermank)! - Adjust Breadcrumb item focus outline

- [`4378ee8`](https://github.com/primer/react/commit/4378ee84442de8d75fbb34fcce48e28c09429c5c) Thanks [@langermank](https://github.com/langermank)! - Add missing CSS for `KeybindingHint`

- [#6900](https://github.com/primer/react/pull/6900) [`e3e601c`](https://github.com/primer/react/commit/e3e601c545967eb79fb7bc752c8895b93fda620e) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SelectPanel): do not bubble up keyboard events

- [#6673](https://github.com/primer/react/pull/6673) [`19befd6`](https://github.com/primer/react/commit/19befd66b801532bb0ef85e60296c73d8c747fc5) Thanks [@llastflowers](https://github.com/llastflowers)! - Remove support for `sx` from `CircleBadge` component

- [#6908](https://github.com/primer/react/pull/6908) [`af288e6`](https://github.com/primer/react/commit/af288e632c042c5e82aae6ee2bd5107e8be2b9ec) Thanks [@llastflowers](https://github.com/llastflowers)! - update FormControl ValidationIcon position

- [#6931](https://github.com/primer/react/pull/6931) [`d5c5ecf`](https://github.com/primer/react/commit/d5c5ecf17a40571976d7974d3b57158455afec38) Thanks [@francinelucca](https://github.com/francinelucca)! - use UnderlinePanels.Tab, UnderlinePanels.Panel from @primer/react

- [#6905](https://github.com/primer/react/pull/6905) [`1cb348f`](https://github.com/primer/react/commit/1cb348f079dffcf10bdf422b1e14e0a29fa4662d) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - Replace StateLabel color with new draft token

- [#6927](https://github.com/primer/react/pull/6927) [`913739d`](https://github.com/primer/react/commit/913739dfe4b7d8f4f5829157e200bd538e509e74) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - Link: Adjust text-decoration-offset

- [#6829](https://github.com/primer/react/pull/6829) [`b568765`](https://github.com/primer/react/commit/b568765159a22fefbb2e521947a6c99109cb6f19) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: fix ActionBar gap issue

- [#6879](https://github.com/primer/react/pull/6879) [`c8fc6b8`](https://github.com/primer/react/commit/c8fc6b81d61834ab143a578b379d7dcc49e17d62) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(FilteredActionList): fix className override

- [#6896](https://github.com/primer/react/pull/6896) [`5c29b01`](https://github.com/primer/react/commit/5c29b010db51e85c387963aee45ee97f12aae7ef) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Fix typing issues in PageHeader exports.

- [#6881](https://github.com/primer/react/pull/6881) [`8d52362`](https://github.com/primer/react/commit/8d523624366dda9cbb5c200560ffcf9b91f57655) Thanks [@langermank](https://github.com/langermank)! - Implement forced colors for progress bar

- [#6854](https://github.com/primer/react/pull/6854) [`dd8eeed`](https://github.com/primer/react/commit/dd8eeeddb39a7afbdd38d3df8f0568f176e5d4de) Thanks [@pksjce](https://github.com/pksjce)! - Breadcrumbs: Fix esc button not being able to focus on the menubuttonRef

- [#6669](https://github.com/primer/react/pull/6669) [`627cc4b`](https://github.com/primer/react/commit/627cc4bc2663cc50a6b21cf6ec8b8e99b7b260bb) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: use Banner instead of custom implementation for SelectPanel notice

- [#6664](https://github.com/primer/react/pull/6664) [`2910207`](https://github.com/primer/react/commit/2910207766bf6d7168ce356f401d99d26538c496) Thanks [@pksjce](https://github.com/pksjce)! - Breadcrumbs : Add overflow menu for responsive behavior

- [#6664](https://github.com/primer/react/pull/6664) [`2910207`](https://github.com/primer/react/commit/2910207766bf6d7168ce356f401d99d26538c496) Thanks [@pksjce](https://github.com/pksjce)! - Breadcrumb overflow styling

- [#6846](https://github.com/primer/react/pull/6846) [`37ce4aa`](https://github.com/primer/react/commit/37ce4aaf2830fbe0423e0d7546dfdad6e21ac398) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds `sx` prop back to TextInput

- [#6701](https://github.com/primer/react/pull/6701) [`1aa7404`](https://github.com/primer/react/commit/1aa7404f4070244083b9b05394921cda4dfe31c6) Thanks [@pksjce](https://github.com/pksjce)! - Banner: Should prefer aria-labelled-by over aria-label

- [#6715](https://github.com/primer/react/pull/6715) [`6def61e`](https://github.com/primer/react/commit/6def61e2286df882b5f15e329c801acd5bd29595) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx from the SkeletonBox component.

- [#6750](https://github.com/primer/react/pull/6750) [`0077b96`](https://github.com/primer/react/commit/0077b968f45fad50cb7abe52bd0cb442504279c2) Thanks [@pksjce](https://github.com/pksjce)! - v38: Make sure Banner is exported from main and experimental

- [#6751](https://github.com/primer/react/pull/6751) [`c8f3879`](https://github.com/primer/react/commit/c8f3879b0ce184c785573bfccd84aef0b8ef54ef) Thanks [@pksjce](https://github.com/pksjce)! - v38: Move pointerbox to deprecated still maintaining the main export

- [#6592](https://github.com/primer/react/pull/6592) [`bdac258`](https://github.com/primer/react/commit/bdac258a6f610da974ef4b8c25ccef876946fc79) Thanks [@langermank](https://github.com/langermank)! - Add support for `loading` footer buttons in ConfirmationDialog

- [#6509](https://github.com/primer/react/pull/6509) [`3b3cf52`](https://github.com/primer/react/commit/3b3cf52f267da4f44123032bf388dc5ff9f61cf8) Thanks [@joshblack](https://github.com/joshblack)! - Update layout for Banner to address extra spacing below description when no actions are included

- [#6431](https://github.com/primer/react/pull/6431) [`0c21301`](https://github.com/primer/react/commit/0c21301ba0c7b1d0272258f8fe59026beab83c95) Thanks [@langermank](https://github.com/langermank)! - Add `border` and `background-color` tokens to `ProgressBar` CSS, which increases contrast for high contrast themes

- [#6603](https://github.com/primer/react/pull/6603) [`f781f7f`](https://github.com/primer/react/commit/f781f7f5434be4c482a8f7819c73c258b93604ce) Thanks [@langermank](https://github.com/langermank)! - Only show focus outline for `Radio` if `focus-visible`

- [#6604](https://github.com/primer/react/pull/6604) [`77a60e7`](https://github.com/primer/react/commit/77a60e7775987ee05b07cd8235ff4a26230b12e2) Thanks [@joshblack](https://github.com/joshblack)! - Add @github/mini-throttle as dependency to project to help with bundle output

- [#6478](https://github.com/primer/react/pull/6478) [`77c8739`](https://github.com/primer/react/commit/77c873936b195915c3f364d01a5b1bb15b0ac1a0) Thanks [@llastflowers](https://github.com/llastflowers)! - Update Select component to correctly pass className to TextInputWraper for styling purposes

- [#6429](https://github.com/primer/react/pull/6429) [`661eae0`](https://github.com/primer/react/commit/661eae0a28ee99228400e6c99a483af0523beeb8) Thanks [@devinmcinnis](https://github.com/devinmcinnis)! - Anchor elements render as interactive elements in TokenBase

## 38.0.0-rc.9

### Major Changes

- [#7032](https://github.com/primer/react/pull/7032) [`9fce541`](https://github.com/primer/react/commit/9fce5419ce76c94837f2bd4b013f007837a97182) Thanks [@francinelucca](https://github.com/francinelucca)! - - remove sx, SxProp, exports
  - add type ThemeColorPaths, type ThemeShadowPaths

### Minor Changes

- [#7045](https://github.com/primer/react/pull/7045) [`7595b8d`](https://github.com/primer/react/commit/7595b8d0d534043aeca69f0862a8ffd5c911c50c) Thanks [@langermank](https://github.com/langermank)! - Add new `Banner` `actionsLayout` prop to handle actions layout edge cases

### Patch Changes

- [#7020](https://github.com/primer/react/pull/7020) [`aaa2e1f`](https://github.com/primer/react/commit/aaa2e1f5589a862557b6f7d5194e0579bc952c84) Thanks [@hectahertz](https://github.com/hectahertz)! - Fixes `Details` flickering, prevents re-renders

- [#7008](https://github.com/primer/react/pull/7008) [`ca6d60d`](https://github.com/primer/react/commit/ca6d60d37dcdaec354bbdd097fd8c656971e752b) Thanks [@langermank](https://github.com/langermank)! - Use primitives for Button line-height

- [#7046](https://github.com/primer/react/pull/7046) [`4ffe66d`](https://github.com/primer/react/commit/4ffe66d0d87c5ab8a3c0d9ef4e9ba571e6d57393) Thanks [@pksjce](https://github.com/pksjce)! - Fix: ActionMenu with overflow contains scrollbars within its rounded border

- [#7030](https://github.com/primer/react/pull/7030) [`52d6cf7`](https://github.com/primer/react/commit/52d6cf7e7cc2a0f4ea3186ee61412a2a2549b530) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SelectPanel): remove hidden attribute from selection Radio

- [#7048](https://github.com/primer/react/pull/7048) [`f4a92f6`](https://github.com/primer/react/commit/f4a92f6d5fab8aee0bebb0b3bd8a400d55dc6cc7) Thanks [@langermank](https://github.com/langermank)! - Adjust Breadcrumb item focus outline

## 38.0.0-rc.8

### Major Changes

- [#7015](https://github.com/primer/react/pull/7015) [`0889246`](https://github.com/primer/react/commit/0889246fda736fe7dd967a295fe8467109d06bc9) Thanks [@francinelucca](https://github.com/francinelucca)! - @primer/react: chore: remove Box, BoxProps export
  @primer/styled-react: add Box component

### Patch Changes

- [#6984](https://github.com/primer/react/pull/6984) [`a3765c2`](https://github.com/primer/react/commit/a3765c2e6c7d23972cdeeb8e206d802678f0d832) Thanks [@mperrotti](https://github.com/mperrotti)! - Fixes vertical alignment of prev/next pagination chevrons

- [#7014](https://github.com/primer/react/pull/7014) [`a108ab9`](https://github.com/primer/react/commit/a108ab92fa71af83f7da1ee9a311bc272568cfb3) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: remove useTheme from IssueLabel

- [#6981](https://github.com/primer/react/pull/6981) [`3099210`](https://github.com/primer/react/commit/30992106820dee75cb2f6f0594e66acfd8b56f3c) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes unwanted box-shadow on buttons with 'inactive' prop passed.

- [#6877](https://github.com/primer/react/pull/6877) [`860ac93`](https://github.com/primer/react/commit/860ac93dcdff0ba6f05cac1b5137721a9b34dfcb) Thanks [@mperrotti](https://github.com/mperrotti)! - In `ActionBar`, `aria-label` now gets added to the `role="toolbar"` element.

- [#7017](https://github.com/primer/react/pull/7017) [`2fd6c82`](https://github.com/primer/react/commit/2fd6c82e327db24b63cf604465b4192b0d29d8a9) Thanks [@langermank](https://github.com/langermank)! - update token close button sizing

- [#7000](https://github.com/primer/react/pull/7000) [`34e7fa8`](https://github.com/primer/react/commit/34e7fa8cd88684c16d17e997aa7ef69d40b50340) Thanks [@pksjce](https://github.com/pksjce)! - Add gap prop to ActionBar for customizable spacing between items

- [#6973](https://github.com/primer/react/pull/6973) [`a3f7ea9`](https://github.com/primer/react/commit/a3f7ea96514d4ba0a2d28aeb26e49eaafb8bf474) Thanks [@jonrohan](https://github.com/jonrohan)! - fix(AnchoredOverlay): Omit aria-label and aria-labelledby from renderAnchor props

- [#7007](https://github.com/primer/react/pull/7007) [`96968a2`](https://github.com/primer/react/commit/96968a28c1ddb2c31cb3e2f0e2e6297c1ee8df97) Thanks [@mperrotti](https://github.com/mperrotti)! - Corrects bg color of disabled indeterminate checkbox

- [#7019](https://github.com/primer/react/pull/7019) [`4308179`](https://github.com/primer/react/commit/43081799465d5e4d66a0d761406a2ab64fb27d91) Thanks [@francinelucca](https://github.com/francinelucca)! - @primer/styled-react: chore(navlist): remove unneeded exports
  @primer/react: add missing isSlot checks

- [#6982](https://github.com/primer/react/pull/6982) [`3c32e7e`](https://github.com/primer/react/commit/3c32e7e162ae9a5f66c068639934cc55c01cca72) Thanks [@mperrotti](https://github.com/mperrotti)! - Uses correct bg color for disabled ToggleSwitch knob

- [#6980](https://github.com/primer/react/pull/6980) [`4b84948`](https://github.com/primer/react/commit/4b849489b123636209d6dd71b0fe66fbe7963bdb) Thanks [@TylerJDev](https://github.com/TylerJDev)! - ActionBar: Supplies `aria-label` to toolbar inside of `ActionBar`

## 38.0.0-rc.7

### Major Changes

- [#6944](https://github.com/primer/react/pull/6944) [`446956d`](https://github.com/primer/react/commit/446956d3466ca11b95adf720d7cf07a1bb6bad92) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx from deprecated ActionList component.

- [#6965](https://github.com/primer/react/pull/6965) [`f61238c`](https://github.com/primer/react/commit/f61238c295377f59a5d3c5b0c782e98c238fa639) Thanks [@francinelucca](https://github.com/francinelucca)! - Chore/remove styled. components: deprecated UnderlineNav, ValidationAnimation, LabelGroup, Tooltip

- [#6921](https://github.com/primer/react/pull/6921) [`c58f171`](https://github.com/primer/react/commit/c58f171be98dfec354eeb85c870368e84796fe6e) Thanks [@llastflowers](https://github.com/llastflowers)! - Update ActionList component and related components to no longer support sx/styled-components

- [#6902](https://github.com/primer/react/pull/6902) [`c395547`](https://github.com/primer/react/commit/c395547ae30bb51ea40388183f384848a397dc80) Thanks [@iansan5653](https://github.com/iansan5653)! - Support nested children in ActionBar.

- [#6930](https://github.com/primer/react/pull/6930) [`260c74c`](https://github.com/primer/react/commit/260c74c4e9f780a891157c9a2bc1450a12f8593a) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes `sx` prop from DataTable.Container

- [#6942](https://github.com/primer/react/pull/6942) [`3ced917`](https://github.com/primer/react/commit/3ced917f595667e1f68a6b9110bd034e0d88bf2a) Thanks [@francinelucca](https://github.com/francinelucca)! - Removes sx prop from PageLayout and subcomponents

- [#6951](https://github.com/primer/react/pull/6951) [`2703bc9`](https://github.com/primer/react/commit/2703bc9cad2d3f16552b748f3799949a35464a1a) Thanks [@francinelucca](https://github.com/francinelucca)! - Update FormControl component to no longer support sx

- [#6897](https://github.com/primer/react/pull/6897) [`c1448cc`](https://github.com/primer/react/commit/c1448cc6546b0e58b1ceb54fa2989a1fd7cbfe30) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Replaces `useTheme` usage with `theme`. If an application uses a custom theme that modifies one of the following 5 tokens, they will be reset to the default theme values. (`space.2, colors.success.fg, colors.border.default, colors.border.muted, animation.easeOutCubic`)

- [#6945](https://github.com/primer/react/pull/6945) [`1c84c0f`](https://github.com/primer/react/commit/1c84c0ff2b261a02d81c11fb16c7d3fb05294506) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(Octicon): remove sx

- [#6904](https://github.com/primer/react/pull/6904) [`62df166`](https://github.com/primer/react/commit/62df166574d6248b3405c224a2f63f1e53a75ece) Thanks [@pksjce](https://github.com/pksjce)! - Remove sx property from Button

### Minor Changes

- [#6976](https://github.com/primer/react/pull/6976) [`2ec5bf2`](https://github.com/primer/react/commit/2ec5bf2898a6966161a076f5896910bf1b1f4018) Thanks [@francinelucca](https://github.com/francinelucca)! - feat: support custom slots

- [#6919](https://github.com/primer/react/pull/6919) [`32e12c6`](https://github.com/primer/react/commit/32e12c690a53aef918e765d128f381c8f57bfd02) Thanks [@TylerJDev](https://github.com/TylerJDev)! - TreeView: Add `count` and `className` support for trailing actions

### Patch Changes

- [#6994](https://github.com/primer/react/pull/6994) [`701a9d0`](https://github.com/primer/react/commit/701a9d02cc5958bdeb12d63bbc169c5d40bd26e6) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: prevent slot rewrite on CheckboxOrRadioGroup subcomponents

- [#6959](https://github.com/primer/react/pull/6959) [`76f1ca3`](https://github.com/primer/react/commit/76f1ca32a9303b18a2084c4e11c4699963b88e4e) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(AvatarStack, CheckboxOrRadioGroup, UnstyledTextInput): cleanup remaining sx props

- [#6996](https://github.com/primer/react/pull/6996) [`173f76d`](https://github.com/primer/react/commit/173f76d917a688515ae36f2240bf5461db5eda0c) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: add missing slot checks to CheckboxOrRadioGroup, SelectPanel, ActionMenu, Treeview, SegmentedControl and PageHeader

- [#6954](https://github.com/primer/react/pull/6954) [`7dd483f`](https://github.com/primer/react/commit/7dd483f74e2a75e5c0a44f46a860afc2bdf0da9a) Thanks [@langermank](https://github.com/langermank)! - Adjust ConfirmationDialog heading styling

- [#6935](https://github.com/primer/react/pull/6935) [`8641c7a`](https://github.com/primer/react/commit/8641c7a778f88c9f65fa1f3d2c40994468651ae7) Thanks [@JelloBagel](https://github.com/JelloBagel)! - Fix overflow calculations of more menu button in action bar

- [#6925](https://github.com/primer/react/pull/6925) [`ecc81b5`](https://github.com/primer/react/commit/ecc81b569b421a4181b0a2f4cdff9cfe60fe28fd) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(TextInput): remove sx

- [#6958](https://github.com/primer/react/pull/6958) [`3032026`](https://github.com/primer/react/commit/30320263482baf9d2c634ec27122c9a42ece308a) Thanks [@siddharthkp](https://github.com/siddharthkp)! - @primer/react: Export `useId` and `useSyncedState`
  @primer/styled-react: Add `ThemeProvider` and `BaseStyles`

## 38.0.0-rc.6

### Patch Changes

- [`4378ee8`](https://github.com/primer/react/commit/4378ee84442de8d75fbb34fcce48e28c09429c5c) Thanks [@langermank](https://github.com/langermank)! - Add missing CSS for `KeybindingHint`

## 38.0.0-rc.5

### Major Changes

- [#6874](https://github.com/primer/react/pull/6874) [`15824db`](https://github.com/primer/react/commit/15824db141ef32b3e090bcf1880f03bd9684392a) Thanks [@pksjce](https://github.com/pksjce)! - Remove sx from UnderlinePanels

- [#6690](https://github.com/primer/react/pull/6690) [`c5c2053`](https://github.com/primer/react/commit/c5c2053caf38da76a4310098e805b2edb05e2552) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx support from the Token component.

- [#6673](https://github.com/primer/react/pull/6673) [`19befd6`](https://github.com/primer/react/commit/19befd66b801532bb0ef85e60296c73d8c747fc5) Thanks [@llastflowers](https://github.com/llastflowers)! - Update CircleBadge component to no longer support sx

- [#6868](https://github.com/primer/react/pull/6868) [`2053cb3`](https://github.com/primer/react/commit/2053cb3f7ee15fe1e4c3cc9be3c09c82dd5aed93) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes Box usage and sx prop from NavList and ActionList

- [#6631](https://github.com/primer/react/pull/6631) [`86b3e60`](https://github.com/primer/react/commit/86b3e6063855615675c87df6eccad41d83db3762) Thanks [@joshblack](https://github.com/joshblack)! - Remove the sx prop from Label

- [#6865](https://github.com/primer/react/pull/6865) [`eaf7e58`](https://github.com/primer/react/commit/eaf7e5840e4fbe4042c80711f983a0df05e2b68d) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: remove sx from Overlay

- [#6825](https://github.com/primer/react/pull/6825) [`4196e0e`](https://github.com/primer/react/commit/4196e0eed6894d020a83b9f382f5cb6817f9a725) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes `Box` component usage and `sx` prop from the `Link` component, Storybook stories, and a .figma.tsx file

- [#6864](https://github.com/primer/react/pull/6864) [`b0abd78`](https://github.com/primer/react/commit/b0abd785713d9f95ca9d5e41394e00153176077d) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove support for `sx` from the `TabNav` component

- [#6923](https://github.com/primer/react/pull/6923) [`e5753f0`](https://github.com/primer/react/commit/e5753f0560fc57d426e795c012ffcb0b7fb0d290) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: remove sx from deprecated Dialog

- [#6729](https://github.com/primer/react/pull/6729) [`7ae5db2`](https://github.com/primer/react/commit/7ae5db229837fdd75dd73ce1779c7faa18734f89) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Update Text component to no longer support sx.

- [#6667](https://github.com/primer/react/pull/6667) [`d122122`](https://github.com/primer/react/commit/d12212225884b17cf6236af9feb8b098caaeea35) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Update Tooltip component to no longer support sx.

- [#6611](https://github.com/primer/react/pull/6611) [`15c1eb7`](https://github.com/primer/react/commit/15c1eb734210938182323bb15200d69ae4a3a300) Thanks [@joshblack](https://github.com/joshblack)! - Update Avatar component to no longer support sx, add sx wrapper to @primer/styled-react

- [#6844](https://github.com/primer/react/pull/6844) [`1f9f582`](https://github.com/primer/react/commit/1f9f582f29e623a33401061832d8b6ab778c47b3) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Update `Breadcrumbs` to no longer support sx

- [#6812](https://github.com/primer/react/pull/6812) [`0834e9e`](https://github.com/primer/react/commit/0834e9ebe910c363f413723a254e0f2bd947a4b6) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` from the Dialog component and sub-components

- [#6928](https://github.com/primer/react/pull/6928) [`2eeff36`](https://github.com/primer/react/commit/2eeff368832b6fc122aef70302f681b1f14ad71f) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes `sx` prop from VisuallyHidden component, and as a result also removes `sx` prop from CheckboxGroup.Label and RadioGroup.Label

- [#6860](https://github.com/primer/react/pull/6860) [`628e601`](https://github.com/primer/react/commit/628e60172343fdf1c94734c39480991b0591e267) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` from the `Heading` component

- [#6805](https://github.com/primer/react/pull/6805) [`0f075d1`](https://github.com/primer/react/commit/0f075d1a679f0733ad984eeb2a677989ceca8ad0) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes usage of Box component from other components.

### Minor Changes

- [#6889](https://github.com/primer/react/pull/6889) [`9201d93`](https://github.com/primer/react/commit/9201d939056333945375c454999d853e0bbabf8f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltip: Add delay functionality to tooltips with the options of `instant` (default), `medium`, `long`

- [#6937](https://github.com/primer/react/pull/6937) [`09ee0ea`](https://github.com/primer/react/commit/09ee0ea580ba6901d6e80cb35f7cc846db17197e) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: add styles to formcontrol and subcomponents

### Patch Changes

- [#6900](https://github.com/primer/react/pull/6900) [`e3e601c`](https://github.com/primer/react/commit/e3e601c545967eb79fb7bc752c8895b93fda620e) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SelectPanel): do not bubble up keyboard events

- [#6673](https://github.com/primer/react/pull/6673) [`19befd6`](https://github.com/primer/react/commit/19befd66b801532bb0ef85e60296c73d8c747fc5) Thanks [@llastflowers](https://github.com/llastflowers)! - Remove support for `sx` from `CircleBadge` component

- [#6908](https://github.com/primer/react/pull/6908) [`af288e6`](https://github.com/primer/react/commit/af288e632c042c5e82aae6ee2bd5107e8be2b9ec) Thanks [@llastflowers](https://github.com/llastflowers)! - update FormControl ValidationIcon position

- [#6931](https://github.com/primer/react/pull/6931) [`d5c5ecf`](https://github.com/primer/react/commit/d5c5ecf17a40571976d7974d3b57158455afec38) Thanks [@francinelucca](https://github.com/francinelucca)! - use UnderlinePanels.Tab, UnderlinePanels.Panel from @primer/react

- [#6905](https://github.com/primer/react/pull/6905) [`1cb348f`](https://github.com/primer/react/commit/1cb348f079dffcf10bdf422b1e14e0a29fa4662d) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - Replace StateLabel color with new draft token

- [#6927](https://github.com/primer/react/pull/6927) [`913739d`](https://github.com/primer/react/commit/913739dfe4b7d8f4f5829157e200bd538e509e74) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - Link: Adjust text-decoration-offset

## 38.0.0-rc.4

### Major Changes

- [#6857](https://github.com/primer/react/pull/6857) [`b9b558e`](https://github.com/primer/react/commit/b9b558efe1033150b05adc88d28234db5dc82f95) Thanks [@pksjce](https://github.com/pksjce)! - Remove PointerBox from @primer-react

- [#6708](https://github.com/primer/react/pull/6708) [`b7b8a36`](https://github.com/primer/react/commit/b7b8a36d14b3c5b6f9c289423691fe9285eae786) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx prop support from the Spinner component.

- [#6833](https://github.com/primer/react/pull/6833) [`5ad1e93`](https://github.com/primer/react/commit/5ad1e939c1ef494f7680b0753a4d7c6296e088d6) Thanks [@joshblack](https://github.com/joshblack)! - Remove sx support from Radio

- [#6841](https://github.com/primer/react/pull/6841) [`3e02e2c`](https://github.com/primer/react/commit/3e02e2c235a3633b646b8f2a493f3a23e17187bf) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` from `deprecated/Pagehead`

- [#6692](https://github.com/primer/react/pull/6692) [`bb8d648`](https://github.com/primer/react/commit/bb8d648a42ec84e9baefae00fa87ede2be449e64) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx Props and BoxWithFallBack from Timeline component.

- [#6668](https://github.com/primer/react/pull/6668) [`acb6233`](https://github.com/primer/react/commit/acb6233fa0cf715d660ae222ebca9853115cb707) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Update UnderlineNav component to no longer support sx and remove Box usage from it.

- [#6835](https://github.com/primer/react/pull/6835) [`961c1c4`](https://github.com/primer/react/commit/961c1c48d942b9d8d81289a5d09d78f4d985f5da) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` from `ButtonGroup`

- [#6834](https://github.com/primer/react/pull/6834) [`fa70b5e`](https://github.com/primer/react/commit/fa70b5eaae4c68ccac2bbfa44546ee85594a054a) Thanks [@joshblack](https://github.com/joshblack)! - Remove the `sx` prop from `Flash`

- [#6876](https://github.com/primer/react/pull/6876) [`2102252`](https://github.com/primer/react/commit/2102252ef34899bb37c52ca4df193ba5cca41a94) Thanks [@llastflowers](https://github.com/llastflowers)! - Update FilteredActionList and FilteredActionListLoaders components to no longer support sx

- [#6840](https://github.com/primer/react/pull/6840) [`aba8050`](https://github.com/primer/react/commit/aba8050ee9d324fa53a7b81d30b4f8dc7186c70a) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` prop from `deprecated/FilteredSearch`

- [#6685](https://github.com/primer/react/pull/6685) [`00261c9`](https://github.com/primer/react/commit/00261c934fe88a74ef310c3134fe202226156b4b) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove the sx prop from RadioGroup and Truncate.

- [#6878](https://github.com/primer/react/pull/6878) [`7081dd3`](https://github.com/primer/react/commit/7081dd3b45f7dae08f7a39038be95dbf20dd8a27) Thanks [@llastflowers](https://github.com/llastflowers)! - Update BaseStyles component to no longer support sx

- [#6679](https://github.com/primer/react/pull/6679) [`6158135`](https://github.com/primer/react/commit/6158135e42be9486bb7de35fbedf96e412b8a1d7) Thanks [@llastflowers](https://github.com/llastflowers)! - Update CounterLabel component to no longer support sx

- [#6827](https://github.com/primer/react/pull/6827) [`6843040`](https://github.com/primer/react/commit/6843040ad9b9810cb14f6186e53b01e83bed60f8) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for the sx prop from RelativeTime

- [#6813](https://github.com/primer/react/pull/6813) [`a1a4ad0`](https://github.com/primer/react/commit/a1a4ad00b87b489f6341aa818a9b8b8662fe2a82) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` prop for `InlineMessage`

- [#6866](https://github.com/primer/react/pull/6866) [`3237a4e`](https://github.com/primer/react/commit/3237a4e549779a2b3144b1f48974e533d28cca2a) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(LinkButton): remove sx from LinkButton

- [#6655](https://github.com/primer/react/pull/6655) [`092185f`](https://github.com/primer/react/commit/092185f7b9d6c70296e629e03790676502b701e5) Thanks [@llastflowers](https://github.com/llastflowers)! - Update CheckboxGroup component to no longer support sx

- [#6654](https://github.com/primer/react/pull/6654) [`513cc3f`](https://github.com/primer/react/commit/513cc3feed5723632e54f07cae9d4397e3783fdc) Thanks [@llastflowers](https://github.com/llastflowers)! - Update Checkbox component to no longer support sx

- [#6837](https://github.com/primer/react/pull/6837) [`134f96e`](https://github.com/primer/react/commit/134f96e81476f829f2b0f0b44fa73cc1604983d5) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Update ProgressBar to no longer support sx

- [#6839](https://github.com/primer/react/pull/6839) [`32febac`](https://github.com/primer/react/commit/32febac10a887cce418abf6f4419cfb100a8f292) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` from `Header`

- [#6871](https://github.com/primer/react/pull/6871) [`44b3d73`](https://github.com/primer/react/commit/44b3d732157048059681f3fdcb86c5d77a59aec5) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `sx` from `PageHeader`

- [#6863](https://github.com/primer/react/pull/6863) [`9614c0e`](https://github.com/primer/react/commit/9614c0eae7d77bdf879df474c44d613b673e6d4e) Thanks [@pksjce](https://github.com/pksjce)! - Remove Banner from experimental

### Minor Changes

- [#6456](https://github.com/primer/react/pull/6456) [`fbd3ac7`](https://github.com/primer/react/commit/fbd3ac75a67b89635dcd28879a1b4a93cef70289) Thanks [@TylerJDev](https://github.com/TylerJDev)! - TreeView: Add trailing actions prop `secondaryActions`

- [#6855](https://github.com/primer/react/pull/6855) [`356a129`](https://github.com/primer/react/commit/356a129d2a1a0c02d9ca59280e7711e501c0d20d) Thanks [@cheshire137](https://github.com/cheshire137)! - Add buttonLabelOn and buttonLabelOff to ToggleSwitch

### Patch Changes

- [#6829](https://github.com/primer/react/pull/6829) [`b568765`](https://github.com/primer/react/commit/b568765159a22fefbb2e521947a6c99109cb6f19) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: fix ActionBar gap issue

- [#6879](https://github.com/primer/react/pull/6879) [`c8fc6b8`](https://github.com/primer/react/commit/c8fc6b81d61834ab143a578b379d7dcc49e17d62) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(FilteredActionList): fix className override

- [#6896](https://github.com/primer/react/pull/6896) [`5c29b01`](https://github.com/primer/react/commit/5c29b010db51e85c387963aee45ee97f12aae7ef) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Fix typing issues in PageHeader exports.

- [#6881](https://github.com/primer/react/pull/6881) [`8d52362`](https://github.com/primer/react/commit/8d523624366dda9cbb5c200560ffcf9b91f57655) Thanks [@langermank](https://github.com/langermank)! - Implement forced colors for progress bar

- [#6854](https://github.com/primer/react/pull/6854) [`dd8eeed`](https://github.com/primer/react/commit/dd8eeeddb39a7afbdd38d3df8f0568f176e5d4de) Thanks [@pksjce](https://github.com/pksjce)! - Breadcrumbs: Fix esc button not being able to focus on the menubuttonRef

## 38.0.0-rc.3

### Major Changes

- [#6754](https://github.com/primer/react/pull/6754) [`4d080aa`](https://github.com/primer/react/commit/4d080aa4c8718d2f4ab42c841cf2c8d252cdd19f) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Update Popover to no longer support sx

- [#6666](https://github.com/primer/react/pull/6666) [`71382dc`](https://github.com/primer/react/commit/71382dc5c0726f46a9da7823a9543334b7d0fcca) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes styled-system usage from TextInputWrapper and related components and Storybook stories.

- [#6425](https://github.com/primer/react/pull/6425) [`e23d965`](https://github.com/primer/react/commit/e23d96524783863d92fc770a36c564b14098242b) Thanks [@joshblack](https://github.com/joshblack)! - Update @primer/react to only export ESM bundles

- [#6806](https://github.com/primer/react/pull/6806) [`9d13904`](https://github.com/primer/react/commit/9d13904037541d8f4f68d5d833f632304cace06e) Thanks [@joshblack](https://github.com/joshblack)! - Remove the `sx` prop from `Announce`, `AriaAlert`, and `AriaStatus`

- [#6741](https://github.com/primer/react/pull/6741) [`4896ef1`](https://github.com/primer/react/commit/4896ef1b541e47e5f6364c5eb0f7ab357594e456) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx prop support from the SegmentedControl component.

### Minor Changes

- [#6815](https://github.com/primer/react/pull/6815) [`2024709`](https://github.com/primer/react/commit/2024709eca73533c74ee042cb1524e78e495fba2) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: add PortalContext

- [#6709](https://github.com/primer/react/pull/6709) [`78784b3`](https://github.com/primer/react/commit/78784b3127acb844ec8a60d4a36141addb75d43d) Thanks [@pksjce](https://github.com/pksjce)! - Remove overflow property from popover (It has no usage)

- [#6721](https://github.com/primer/react/pull/6721) [`d6378c2`](https://github.com/primer/react/commit/d6378c246748403275ca17bc8aa7f713157ab1b7) Thanks [@cheshire137](https://github.com/cheshire137)! - Add count to SegmentedControlButton

- [#6843](https://github.com/primer/react/pull/6843) [`f082c77`](https://github.com/primer/react/commit/f082c77768526d9f97566a793e80a386cc0bc699) Thanks [@camchenry](https://github.com/camchenry)! - Allow changing initially focused button in ConfirmationDialog

### Patch Changes

- [#6669](https://github.com/primer/react/pull/6669) [`627cc4b`](https://github.com/primer/react/commit/627cc4bc2663cc50a6b21cf6ec8b8e99b7b260bb) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: use Banner instead of custom implementation for SelectPanel notice

- [#6664](https://github.com/primer/react/pull/6664) [`2910207`](https://github.com/primer/react/commit/2910207766bf6d7168ce356f401d99d26538c496) Thanks [@pksjce](https://github.com/pksjce)! - Breadcrumbs : Add overflow menu for responsive behavior

- [#6664](https://github.com/primer/react/pull/6664) [`2910207`](https://github.com/primer/react/commit/2910207766bf6d7168ce356f401d99d26538c496) Thanks [@pksjce](https://github.com/pksjce)! - Breadcrumb overflow styling

- [#6846](https://github.com/primer/react/pull/6846) [`37ce4aa`](https://github.com/primer/react/commit/37ce4aaf2830fbe0423e0d7546dfdad6e21ac398) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds `sx` prop back to TextInput

## 38.0.0-rc.2

### Major Changes

- [#6634](https://github.com/primer/react/pull/6634) [`d883432`](https://github.com/primer/react/commit/d883432010274cf87691a9affb0e012764b2cdae) Thanks [@TylerJDev](https://github.com/TylerJDev)! - CircleOcticon: Remove component `CircleOcticon`

- [#6713](https://github.com/primer/react/pull/6713) [`7d7b797`](https://github.com/primer/react/commit/7d7b797b7696af8dd9533e501f62f3666982307d) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Deprecate TextInputWithTokens component. The component has been moved to the deprecated entrypoint due to low usage and accessibility implications. Import from `@primer/react/deprecated` instead of `@primer/react`.

- [#6272](https://github.com/primer/react/pull/6272) [`d74d73e`](https://github.com/primer/react/commit/d74d73e413a9941cdc74c6f5a2cf6b1be9e7e8db) Thanks [@llastflowers](https://github.com/llastflowers)! - remove unused `contrast` from Select component

- [#6652](https://github.com/primer/react/pull/6652) [`c6d923f`](https://github.com/primer/react/commit/c6d923f93c0cb40453f1a9dab9209a9caeb87bce) Thanks [@llastflowers](https://github.com/llastflowers)! - Update AvatarStack component to no longer support sx

- [#6716](https://github.com/primer/react/pull/6716) [`e177d55`](https://github.com/primer/react/commit/e177d551730a30a0f3cddf97fb55ee1ca54c784a) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx prop support from the SelectPanel component.

- [#6737](https://github.com/primer/react/pull/6737) [`2d01fc4`](https://github.com/primer/react/commit/2d01fc4116ea5bf77dcaae4674aa80930ebe4917) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx prop support from the Select component.

- [#6706](https://github.com/primer/react/pull/6706) [`e3f26cc`](https://github.com/primer/react/commit/e3f26ccbcf40b38cea75f32970ddb23865d7b827) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Deprecate CircleBadge component

- [#6676](https://github.com/primer/react/pull/6676) [`ab5ffb0`](https://github.com/primer/react/commit/ab5ffb00d6e54224542ee60bcc23915b0bb65b15) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes styled-system and related utilities from Caret.tsx, IssueLabelToken.tsx, StateLabel.tsx, ToggleSwitch.tsx, and deprecated/ActionList/List.tsx

  Removes WidthProps from ProgressBar.tsx

- [#6735](https://github.com/primer/react/pull/6735) [`45a52c1`](https://github.com/primer/react/commit/45a52c17cc72af52d123d7104b2d395cd2ca61c8) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Update SideNav component to no longer support sx.

- [#6682](https://github.com/primer/react/pull/6682) [`5bbaae7`](https://github.com/primer/react/commit/5bbaae78f732df2470c1ea7933863ef8a3f9681c) Thanks [@llastflowers](https://github.com/llastflowers)! - Update LabelGroup component to no longer support sx

- [#6680](https://github.com/primer/react/pull/6680) [`5c30443`](https://github.com/primer/react/commit/5c3044342cd2214bbd9d1d50a704d8789ca019d4) Thanks [@llastflowers](https://github.com/llastflowers)! - Update Details component to no longer support sx

- [#6625](https://github.com/primer/react/pull/6625) [`65ae375`](https://github.com/primer/react/commit/65ae3757c1828bb5db5b5dd24d4ce743c679cf28) Thanks [@llastflowers](https://github.com/llastflowers)! - Update BranchName component to no longer support sx

### Minor Changes

- [#6726](https://github.com/primer/react/pull/6726) [`50c230f`](https://github.com/primer/react/commit/50c230f01b7e4b7c4664a676381737f995bf644e) Thanks [@joshblack](https://github.com/joshblack)! - Add ProgressBarItemProps and ProgressBarItemProps type exports to @primer/react

- [#6726](https://github.com/primer/react/pull/6726) [`50c230f`](https://github.com/primer/react/commit/50c230f01b7e4b7c4664a676381737f995bf644e) Thanks [@joshblack](https://github.com/joshblack)! - Add ToggleSwitchProps type to package exports

### Patch Changes

- [#6701](https://github.com/primer/react/pull/6701) [`1aa7404`](https://github.com/primer/react/commit/1aa7404f4070244083b9b05394921cda4dfe31c6) Thanks [@pksjce](https://github.com/pksjce)! - Banner: Should prefer aria-labelled-by over aria-label

- [#6715](https://github.com/primer/react/pull/6715) [`6def61e`](https://github.com/primer/react/commit/6def61e2286df882b5f15e329c801acd5bd29595) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Remove sx from the SkeletonBox component.

- [#6750](https://github.com/primer/react/pull/6750) [`0077b96`](https://github.com/primer/react/commit/0077b968f45fad50cb7abe52bd0cb442504279c2) Thanks [@pksjce](https://github.com/pksjce)! - v38: Make sure Banner is exported from main and experimental

- [#6751](https://github.com/primer/react/pull/6751) [`c8f3879`](https://github.com/primer/react/commit/c8f3879b0ce184c785573bfccd84aef0b8ef54ef) Thanks [@pksjce](https://github.com/pksjce)! - v38: Move pointerbox to deprecated still maintaining the main export

## 38.0.0-rc.1

### Major Changes

- [#6627](https://github.com/primer/react/pull/6627) [`6111046`](https://github.com/primer/react/commit/61110467f759c6680797c56d72deb9f86bba4dcd) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Update ToggleSwitch component to no longer support sx, add sx wrapper to @primer/styled-react.

- [#6607](https://github.com/primer/react/pull/6607) [`133d5a5`](https://github.com/primer/react/commit/133d5a5e74b85811d2bb8b536836d5c16680efe1) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove sx prop support from the VisuallyHidden component

- [#6622](https://github.com/primer/react/pull/6622) [`247b3f7`](https://github.com/primer/react/commit/247b3f75c49e16b883e8f0528a036fc62d274ee6) Thanks [@francinelucca](https://github.com/francinelucca)! - BREAKING CHANGE: remove AvatarToken
  BREAKING CHANGE: make Caret component internal only

- [#6595](https://github.com/primer/react/pull/6595) [`de5a4b7`](https://github.com/primer/react/commit/de5a4b7297a44d0dd1ad175ea8d740f570bc27e6) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Remove AvatarPair component from codebase

- [#6656](https://github.com/primer/react/pull/6656) [`3a778b9`](https://github.com/primer/react/commit/3a778b97b93a0fe2c54f585d668cd70d30c0ca56) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Update StateLabel component to no longer support sx.

- [#6610](https://github.com/primer/react/pull/6610) [`65fc87d`](https://github.com/primer/react/commit/65fc87dc35652c5b228fc7e22d7644645ede2c89) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove sx prop support from the Stack component

- [#6613](https://github.com/primer/react/pull/6613) [`3ab94c5`](https://github.com/primer/react/commit/3ab94c5e8853855c8533c8403fd0d0203ab087d6) Thanks [@llastflowers](https://github.com/llastflowers)! - Update SplitPageLayout component to no longer support sx

## 38.0.0-rc.0

### Major Changes

- [#6602](https://github.com/primer/react/pull/6602) [`d6d25dc`](https://github.com/primer/react/commit/d6d25dc9263119103138156158f74b408d300dd2) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove sx support from SubNav component

### Minor Changes

- [#6542](https://github.com/primer/react/pull/6542) [`f4ded58`](https://github.com/primer/react/commit/f4ded585c4f6188390cdc3243018fe63af310633) Thanks [@TylerJDev](https://github.com/TylerJDev)! - CircleOcticon: Deprecate component

- [#6535](https://github.com/primer/react/pull/6535) [`e6c7614`](https://github.com/primer/react/commit/e6c7614d7aaa420ce8518ad54af62e6409fea9dd) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - fix(Label): Add missing ref for Label without sx prop

- [#6468](https://github.com/primer/react/pull/6468) [`1f531cb`](https://github.com/primer/react/commit/1f531cb5c0fb87fc20ab8ce4321367d3f24ab734) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Deprecate AvatarPair component - move to @primer/react/deprecated

### Patch Changes

- [#6592](https://github.com/primer/react/pull/6592) [`bdac258`](https://github.com/primer/react/commit/bdac258a6f610da974ef4b8c25ccef876946fc79) Thanks [@langermank](https://github.com/langermank)! - Add support for `loading` footer buttons in ConfirmationDialog

- [#6509](https://github.com/primer/react/pull/6509) [`3b3cf52`](https://github.com/primer/react/commit/3b3cf52f267da4f44123032bf388dc5ff9f61cf8) Thanks [@joshblack](https://github.com/joshblack)! - Update layout for Banner to address extra spacing below description when no actions are included

- [#6431](https://github.com/primer/react/pull/6431) [`0c21301`](https://github.com/primer/react/commit/0c21301ba0c7b1d0272258f8fe59026beab83c95) Thanks [@langermank](https://github.com/langermank)! - Add `border` and `background-color` tokens to `ProgressBar` CSS, which increases contrast for high contrast themes

- [#6603](https://github.com/primer/react/pull/6603) [`f781f7f`](https://github.com/primer/react/commit/f781f7f5434be4c482a8f7819c73c258b93604ce) Thanks [@langermank](https://github.com/langermank)! - Only show focus outline for `Radio` if `focus-visible`

- [#6604](https://github.com/primer/react/pull/6604) [`77a60e7`](https://github.com/primer/react/commit/77a60e7775987ee05b07cd8235ff4a26230b12e2) Thanks [@joshblack](https://github.com/joshblack)! - Add @github/mini-throttle as dependency to project to help with bundle output

- [#6478](https://github.com/primer/react/pull/6478) [`77c8739`](https://github.com/primer/react/commit/77c873936b195915c3f364d01a5b1bb15b0ac1a0) Thanks [@llastflowers](https://github.com/llastflowers)! - Update Select component to correctly pass className to TextInputWraper for styling purposes

- [#6429](https://github.com/primer/react/pull/6429) [`661eae0`](https://github.com/primer/react/commit/661eae0a28ee99228400e6c99a483af0523beeb8) Thanks [@devinmcinnis](https://github.com/devinmcinnis)! - Anchor elements render as interactive elements in TokenBase

## 37.31.0

### Minor Changes

- [#6470](https://github.com/primer/react/pull/6470) [`e53228c`](https://github.com/primer/react/commit/e53228cca73e6ab09eb6e626f8747f01ff7241c9) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Add `size` prop to ActionList.LinkItem component. The `size` prop accepts `'medium'` (default) or `'large'` values and provides the same styling options as ActionList.Item for consistent sizing across ActionList components.

- [#6265](https://github.com/primer/react/pull/6265) [`829a933`](https://github.com/primer/react/commit/829a9332200247c6fc72a32c6f42dd0e51e7daf3) Thanks [@joshblack](https://github.com/joshblack)! - Update IssueLabel component types to support custom content through `children` and support the `as` prop

- [#6420](https://github.com/primer/react/pull/6420) [`024b82a`](https://github.com/primer/react/commit/024b82a9dc545cc3a243d0fc910f0b05bfa67653) Thanks [@chanakyav](https://github.com/chanakyav)! - Adds `variant` and `shape` props to `AvatarStack` component. The `variant` prop will allow the component to render in a cascade view (by default) or a new stacked view which will evenly space the avatars and remove opacity. The `shape` prop will allow the avatars to be rendered as circles (by default) or squares.

- [#4744](https://github.com/primer/react/pull/4744) [`3c9e322`](https://github.com/primer/react/commit/3c9e322c58b83dfb4773dfc309bc022842b51225) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Address additional ToggleSwitch a11y feedback

- [#6182](https://github.com/primer/react/pull/6182) [`9e49abd`](https://github.com/primer/react/commit/9e49abd7724add92fee605a3361e6b8719b680eb) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Textarea: Adds `minHeight` and `maxHeight` as props

### Patch Changes

- [#6330](https://github.com/primer/react/pull/6330) [`fbdcac4`](https://github.com/primer/react/commit/fbdcac4709d919b6719dcb2a679b4684dfded419) Thanks [@francinelucca](https://github.com/francinelucca)! - feat(SelectPanel): remove aria activedescendant and add a roving tab index

- [#6365](https://github.com/primer/react/pull/6365) [`ae4dd07`](https://github.com/primer/react/commit/ae4dd07046aa9c32e8f7f0e43c40446ce7c706a4) Thanks [@langermank](https://github.com/langermank)! - Add `width: 100%` to `Portal`

## 37.30.0

### Minor Changes

- [#6350](https://github.com/primer/react/pull/6350) [`8731f43`](https://github.com/primer/react/commit/8731f439e5982cdb085f87612bb8d1cd72d61da9) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Adds `icon` and `action` props to `SelectPanelMessage` to improve UX and accessibility.

- [#6378](https://github.com/primer/react/pull/6378) [`3f68aa7`](https://github.com/primer/react/commit/3f68aa7ca2af4e458d0bd4faa3dcc6b2f2c48d08) Thanks [@langermank](https://github.com/langermank)! - Add `size` prop to `ActionList.Item`

### Patch Changes

- [#6339](https://github.com/primer/react/pull/6339) [`3d19045`](https://github.com/primer/react/commit/3d19045484946d751e50e9ce8d09ac2cab28efee) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(FilteredActionList): remove modern action list FF

- [#6349](https://github.com/primer/react/pull/6349) [`b831e20`](https://github.com/primer/react/commit/b831e207f9d18740d106e94fc1afe516d06f9e56) Thanks [@langermank](https://github.com/langermank)! - Align `font` with PVC for Tooltip

- [#6341](https://github.com/primer/react/pull/6341) [`744102b`](https://github.com/primer/react/commit/744102b05275077116c4c31392f6ebe5d5af89f0) Thanks [@ompharate](https://github.com/ompharate)! - Update TextInput TypeScript types to make shared props optional

- [#6404](https://github.com/primer/react/pull/6404) [`c6bda10`](https://github.com/primer/react/commit/c6bda108fc2e118ad2ee3fb90b7b95eab7e2eb4a) Thanks [@hectahertz](https://github.com/hectahertz)! - SelectPanel announces loading prop changes

## 37.29.1

### Patch Changes

- [#6370](https://github.com/primer/react/pull/6370) [`56e4638`](https://github.com/primer/react/commit/56e4638f3142a4c322b352215587fc2214f273ad) Thanks [@francinelucca](https://github.com/francinelucca)! - chore: update typescript-plugin-css-modules to v5.2.0

- [#6373](https://github.com/primer/react/pull/6373) [`95c23ac`](https://github.com/primer/react/commit/95c23acc3ffa10c0cc70e55efad7caf12852993c) Thanks [@llastflowers](https://github.com/llastflowers)! - update SelectPanel default empty state message to be more generic

- [#6321](https://github.com/primer/react/pull/6321) [`8cced18`](https://github.com/primer/react/commit/8cced18ca5686d80298192535c68a3e912642007) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SelectPanel): prioritize message over loading status

- [#6346](https://github.com/primer/react/pull/6346) [`271630f`](https://github.com/primer/react/commit/271630f02e656084a494720051e3d358f3011811) Thanks [@TylerJDev](https://github.com/TylerJDev)! - SelectPanel: Ensure empty message live region reads from provided or default message

- [#6323](https://github.com/primer/react/pull/6323) [`c65abcb`](https://github.com/primer/react/commit/c65abcb28c25d23d2c8318d34410fc653f537f4f) Thanks [@adierkens](https://github.com/adierkens)! - Add support for prefers-reduced-motion animations on TooltipV2 & Overlay

- [#6331](https://github.com/primer/react/pull/6331) [`86a7af6`](https://github.com/primer/react/commit/86a7af639d5785ac2e41fe14c3e3222e5ead1563) Thanks [@joshblack](https://github.com/joshblack)! - Update icon color in Blankslate to use --fgColor-muted

- [#6329](https://github.com/primer/react/pull/6329) [`14d6afd`](https://github.com/primer/react/commit/14d6afde15caafbb5f2cea66777c0a2d38333ca6) Thanks [@llastflowers](https://github.com/llastflowers)! - Add new SelectPanel `Select all` feature

- [#6374](https://github.com/primer/react/pull/6374) [`ad76aa8`](https://github.com/primer/react/commit/ad76aa8059c4197fa6df7fe0607a1b9d16eba54c) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SelectPanel): add loading state to stories

- [#6327](https://github.com/primer/react/pull/6327) [`61130b8`](https://github.com/primer/react/commit/61130b8736adfb6d1bd279b4eb186a1315a43201) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Fix SelectPanel close button alignment in narrow viewports.

- [#6262](https://github.com/primer/react/pull/6262) [`82e9237`](https://github.com/primer/react/commit/82e923747f7385466358a67e46284bb6c556d99f) Thanks [@langermank](https://github.com/langermank)! - Adjust ActionList label font-weight if a list has both items with descriptions AND without

- [#6371](https://github.com/primer/react/pull/6371) [`73ce4b4`](https://github.com/primer/react/commit/73ce4b4a1e8451a958b9c1bb98ecfab1b73cca33) Thanks [@mattcosta7](https://github.com/mattcosta7)! - corrects peer dependencies around react-is and types

## 37.29.0

### Minor Changes

- [#6260](https://github.com/primer/react/pull/6260) [`8210573`](https://github.com/primer/react/commit/82105733b6c1df53d37ef2aa03d245a4d22ffb5a) Thanks [@adierkens](https://github.com/adierkens)! - Stack.Item: add support for `shrink` prop

- [#6303](https://github.com/primer/react/pull/6303) [`c77acc4`](https://github.com/primer/react/commit/c77acc4d398eb70119990b18901c5c0c8f17cd5b) Thanks [@pksjce](https://github.com/pksjce)! - Add height, width and overflow to Popover component

- [#6273](https://github.com/primer/react/pull/6273) [`0cb9a5d`](https://github.com/primer/react/commit/0cb9a5d40093aeccd9c846858d4d5dc413ee78bf) Thanks [@jonrohan](https://github.com/jonrohan)! - chore(DataTable.Pagination): Convert DataTable.Pagination to CSS modules

- [#6083](https://github.com/primer/react/pull/6083) [`26232b3`](https://github.com/primer/react/commit/26232b3f488864403ff8b69a278f8024ae52c05f) Thanks [@jonrohan](https://github.com/jonrohan)! - Convert `_VisuallyHidden` internal component to CSS modules

### Patch Changes

- [#6311](https://github.com/primer/react/pull/6311) [`db0b27a`](https://github.com/primer/react/commit/db0b27a193942d3270c740c11dbe4d7435b2592c) Thanks [@jonrohan](https://github.com/jonrohan)! - chore: Migrate from toggleSxComponent to BoxWithFallback helper

- [#6277](https://github.com/primer/react/pull/6277) [`b384225`](https://github.com/primer/react/commit/b384225cc6c0b4b784f53c472cf358863b6bf504) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Fix Button styles while dragging inactive variants

- [#6302](https://github.com/primer/react/pull/6302) [`4c9aa4b`](https://github.com/primer/react/commit/4c9aa4b555767de56da4f5d19f61fe1593805f2b) Thanks [@llastflowers](https://github.com/llastflowers)! - Change padding in TextInput before leading visual and after trailing visual from 12px to 8px.

- [#5960](https://github.com/primer/react/pull/5960) [`e88782a`](https://github.com/primer/react/commit/e88782a40cc244a7672e6094e926fac2bdc09b18) Thanks [@joshblack](https://github.com/joshblack)! - Advances remaining Skeleton components to 'alpha' status

- [#6326](https://github.com/primer/react/pull/6326) [`3b6d68a`](https://github.com/primer/react/commit/3b6d68a23b8cc62b0c9f3b75e51d10b3126610d5) Thanks [@adierkens](https://github.com/adierkens)! - Fix alignment styles for Banner component with hidden titles

- [#6314](https://github.com/primer/react/pull/6314) [`a5a0afe`](https://github.com/primer/react/commit/a5a0afecc8ff5d439526d235a61602d5f3ec5653) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Add basic link styles to BaseStyles.

## 37.28.1

### Patch Changes

- [`1d3aba0`](https://github.com/primer/react/commit/1d3aba0b1f93a880cc274e53d025ea2287b9fcd9) Thanks [@jonrohan](https://github.com/jonrohan)! - Fixing an issue where hovering the TabNav will give the tabs outlines.

## 37.28.0

### Minor Changes

- [#6239](https://github.com/primer/react/pull/6239) [`ccd5bab`](https://github.com/primer/react/commit/ccd5bab27506c504941acd535487fca4b456d447) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Add loading support to ActionList.TrailingAction component.

- [#6211](https://github.com/primer/react/pull/6211) [`c99d42e`](https://github.com/primer/react/commit/c99d42e04e0f773ce4a43a98459393ac2780ab13) Thanks [@joshblack](https://github.com/joshblack)! - Add partial support for React Compiler to components

- [#6257](https://github.com/primer/react/pull/6257) [`2fe33bf`](https://github.com/primer/react/commit/2fe33bfa1dcb45d8a0aec0cad74abd99acce2194) Thanks [@joshblack](https://github.com/joshblack)! - Update Truncate to use CSS Modules

- [#6176](https://github.com/primer/react/pull/6176) [`507da36`](https://github.com/primer/react/commit/507da36838d5721bd33c48eb89ae36bd33a56920) Thanks [@jonrohan](https://github.com/jonrohan)! - Migrate the TabNav component to use CSS modules

### Patch Changes

- [#6256](https://github.com/primer/react/pull/6256) [`0318b4b`](https://github.com/primer/react/commit/0318b4bfde5920a3542ef278f00e1ef646ed8af4) Thanks [@langermank](https://github.com/langermank)! - Fix PageHeader context bar `font-weight`

- [#6223](https://github.com/primer/react/pull/6223) [`4d85c34`](https://github.com/primer/react/commit/4d85c342e89aee344e2b87dba4dd13e59d5d3e4c) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Fix ActionList.Description title attribute for non-string children with truncate

- [#6266](https://github.com/primer/react/pull/6266) [`ac5a9c1`](https://github.com/primer/react/commit/ac5a9c13da8f93e964f9a7f1281809979972bbaa) Thanks [@jonrohan](https://github.com/jonrohan)! - Bug fix: Fixing issue where page shifts when Dialog is open

- [#6270](https://github.com/primer/react/pull/6270) [`b2a44c3`](https://github.com/primer/react/commit/b2a44c3e69749e06e6fb89cc5221effdf5724edd) Thanks [@langermank](https://github.com/langermank)! - Add CSS variable to `contrast` `TextInput`

- [#6267](https://github.com/primer/react/pull/6267) [`196fbf5`](https://github.com/primer/react/commit/196fbf5497c0afb24bdd328fd9aa0eb1d299a202) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - Fixed position of leadingVisual

- [#6295](https://github.com/primer/react/pull/6295) [`12468d8`](https://github.com/primer/react/commit/12468d860dbba68409afb46a69e7fa0453f6c971) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(FormControl): remove sx props

- [#6259](https://github.com/primer/react/pull/6259) [`ad6a52c`](https://github.com/primer/react/commit/ad6a52caa5aad2b3e47f39d5e3cb0cb7b13364d5) Thanks [@TylerJDev](https://github.com/TylerJDev)! - SelectPanel: Adds focus indicator to disabled items

- [#6284](https://github.com/primer/react/pull/6284) [`ff6bf5c`](https://github.com/primer/react/commit/ff6bf5cbe1b012b87b5b35af45b3e08b32d1df22) Thanks [@pksjce](https://github.com/pksjce)! - Fix the disappearance of overflow property in the Overlay component

- [#6275](https://github.com/primer/react/pull/6275) [`c50d530`](https://github.com/primer/react/commit/c50d5307596ad6b354bf27d5b0a3398a55416bb7) Thanks [@langermank](https://github.com/langermank)! - Set `color` on SegmentedControl icons

- [#6177](https://github.com/primer/react/pull/6177) [`5e1ed83`](https://github.com/primer/react/commit/5e1ed83af8464296287f132a4b5584b257c4b37e) Thanks [@langermank](https://github.com/langermank)! - Add gap between ActionList label and `trailingVisual`

- [#6278](https://github.com/primer/react/pull/6278) [`29facae`](https://github.com/primer/react/commit/29facaed800cd858c2db91e071c5814630a1e735) Thanks [@jonrohan](https://github.com/jonrohan)! - chore: Refactor components to use BoxWithFallback instead of custom Box if statements and remove defaultSxProp references

- [#6225](https://github.com/primer/react/pull/6225) [`669c338`](https://github.com/primer/react/commit/669c338e1a14622603fc44dced42aea23833a2e4) Thanks [@KirankumarAmbati](https://github.com/KirankumarAmbati)! - fix: remove min height calc logic for SelectPanel

- [#6235](https://github.com/primer/react/pull/6235) [`5446544`](https://github.com/primer/react/commit/5446544dee32f9d2a24d24bd5f3fe01846d5cf37) Thanks [@liuliu-dev](https://github.com/liuliu-dev)! - Prevent ActionList crash when selected prop is true without selectionVariant.

## 37.27.0

### Minor Changes

- [#6116](https://github.com/primer/react/pull/6116) [`4cca0e9`](https://github.com/primer/react/commit/4cca0e9394281134a5bd558c24a50a16d48f4a5b) Thanks [@TylerJDev](https://github.com/TylerJDev)! - ActionList: Add new prop `disableFocusZone` to disable the default focus zone provided

- [#6090](https://github.com/primer/react/pull/6090) [`7bbdcab`](https://github.com/primer/react/commit/7bbdcabef99a10055788ff0dbfca5cef2628acbb) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the ActionList and related components

- [#6183](https://github.com/primer/react/pull/6183) [`a5f7928`](https://github.com/primer/react/commit/a5f792882af0220b8a16e7ef17545c206d67cb00) Thanks [@TylerJDev](https://github.com/TylerJDev)! - SelectPanel: Add `align` prop to `SelectPanel` which determines the alignment of the panel relative to the anchor

- [#6169](https://github.com/primer/react/pull/6169) [`15f942d`](https://github.com/primer/react/commit/15f942df38dfd938112cb69dbd22a98aa4028b21) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - fix(ProgressBar): pass-through style props

### Patch Changes

- [#6190](https://github.com/primer/react/pull/6190) [`613a362`](https://github.com/primer/react/commit/613a362e59dce28b7d771f668e0150a20d9076c0) Thanks [@llastflowers](https://github.com/llastflowers)! - fix Banner spacing / vertical alignment issue

- [#6170](https://github.com/primer/react/pull/6170) [`e4f0fc6`](https://github.com/primer/react/commit/e4f0fc6b1eba68ab703119cee479000a97c88e0d) Thanks [@llastflowers](https://github.com/llastflowers)! - Update SelectPanel so that content isn't hidden behind mobile keyboard

- [#5829](https://github.com/primer/react/pull/5829) [`72ae1e2`](https://github.com/primer/react/commit/72ae1e2caebadbdf87deda1f80b16cc99b2e2b4c) Thanks [@maraisr](https://github.com/maraisr)! - feat(UnderlineNav): Now supports variant 'inset' and 'flush' that allow for contextual horizontally aligned spacing

- [#6108](https://github.com/primer/react/pull/6108) [`df60cb0`](https://github.com/primer/react/commit/df60cb0e1b6e9a586be5b804176e42a1b2af9170) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(ActionMenu): Add fullscreen sample story and variant prop

- [#6210](https://github.com/primer/react/pull/6210) [`a8b871b`](https://github.com/primer/react/commit/a8b871b0c5b24e39ea7258b06159e6e11d8e753f) Thanks [@kelsey-myers](https://github.com/kelsey-myers)! - Adds notice announcements to SelectPanel

- [#6200](https://github.com/primer/react/pull/6200) [`2317ca8`](https://github.com/primer/react/commit/2317ca8ebf7cf87bbc7f3da6b91d0a3912ea33f2) Thanks [@owenniblock](https://github.com/owenniblock)! - Fixes issue with Tooltip description id overriding existing description ids

## 37.26.0

### Minor Changes

- [#6138](https://github.com/primer/react/pull/6138) [`3325ad6`](https://github.com/primer/react/commit/3325ad6d6b4624f6318d064bef589c4e82c47deb) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Add disableFullscreenOnNarrow prop to SelectPanel for opt-out of fullscreen behavior

### Patch Changes

- [#6113](https://github.com/primer/react/pull/6113) [`96c4b48`](https://github.com/primer/react/commit/96c4b488d6ba59640690102c40abfc289e1eb854) Thanks [@llastflowers](https://github.com/llastflowers)! - add new line of CSS to separate underline from hover event

- [#6146](https://github.com/primer/react/pull/6146) [`6588cf2`](https://github.com/primer/react/commit/6588cf2a0379fa81f134562709e6b351ce190db3) Thanks [@TylerJDev](https://github.com/TylerJDev)! - ActionList: Ensures `aria-describedby` is applied to `ActionList.Item` when description is present

- [#6111](https://github.com/primer/react/pull/6111) [`33b6bf1`](https://github.com/primer/react/commit/33b6bf19503d41efeff7654ca04873699a0f43c8) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(Stack): correctly forward a Ref

- [#6139](https://github.com/primer/react/pull/6139) [`091165f`](https://github.com/primer/react/commit/091165f1a3341372a8402177374e50e32ec34c71) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SelectPanel): update input fontSize to 16 on small viewports on iOS

- [#6124](https://github.com/primer/react/pull/6124) [`ad5e73b`](https://github.com/primer/react/commit/ad5e73b8655e1a5673bac96b091a57d954643599) Thanks [@joshblack](https://github.com/joshblack)! - Update Select to correctly merge classes when className is provided

- [#5897](https://github.com/primer/react/pull/5897) [`6df6cbf`](https://github.com/primer/react/commit/6df6cbf0a7a3db59f0c8b469b778ee91c0e74434) Thanks [@mperrotti](https://github.com/mperrotti)! - Updates Dialog to only show border between body and footer when the body scrolls.

- [#6129](https://github.com/primer/react/pull/6129) [`1a15bac`](https://github.com/primer/react/commit/1a15bac413e56cd075a6a10f777b6350f938757b) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - UnderlineNav.Item accepts className prop without overriding existing styling

- [#6125](https://github.com/primer/react/pull/6125) [`91b3c71`](https://github.com/primer/react/commit/91b3c7177e2e5a7d7a9b37d62680d0cf3f1a12f9) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(DataTable): fix incorrect page numbers rendered bug

## 37.25.0

### Minor Changes

- [#6107](https://github.com/primer/react/pull/6107) [`694dd95`](https://github.com/primer/react/commit/694dd95fce74dac25f2f9eb100057b010e065e3f) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - feat(ConfirmationDialog): add className, width and height

- [#5899](https://github.com/primer/react/pull/5899) [`7cf029d`](https://github.com/primer/react/commit/7cf029daa57c83d7dc5902b9a3e9aebc0c0f03cd) Thanks [@joshblack](https://github.com/joshblack)! - Add support for different sizes to Blankslate

- [#6051](https://github.com/primer/react/pull/6051) [`a007808`](https://github.com/primer/react/commit/a00780835e483776b6fc0ff025d830fe0411f190) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the css modules feature flag from the SelectPanel2 experimental component

- [#6052](https://github.com/primer/react/pull/6052) [`06361d1`](https://github.com/primer/react/commit/06361d11efbe2f88e1acb22aa89b642880e88ca9) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS module feature flag from the AvatarStack component

- [#5899](https://github.com/primer/react/pull/5899) [`7cf029d`](https://github.com/primer/react/commit/7cf029daa57c83d7dc5902b9a3e9aebc0c0f03cd) Thanks [@joshblack](https://github.com/joshblack)! - Add support for HTML attributes being passed to Blankslate components

- [#6050](https://github.com/primer/react/pull/6050) [`53ef8ea`](https://github.com/primer/react/commit/53ef8ea973c6ff76b1cf91afe377fbdf041d414a) Thanks [@hectahertz](https://github.com/hectahertz)! - Switch to a CSS based solution for the PageLayout sticky pane

### Patch Changes

- [#6109](https://github.com/primer/react/pull/6109) [`f7471f8`](https://github.com/primer/react/commit/f7471f8d4a3b381c1d41d259a2751a21a8e62eeb) Thanks [@TylerJDev](https://github.com/TylerJDev)! - DataTable: Add visually hidden text to sortable DataTable column buttons

- [#6055](https://github.com/primer/react/pull/6055) [`3b6b1d1`](https://github.com/primer/react/commit/3b6b1d16d071fcb2dc23a36e77d99a42bc566d1d) Thanks [@TylerJDev](https://github.com/TylerJDev)! - DataTable: Adds outline-offset to focus indicator on pagination buttons

- [#6077](https://github.com/primer/react/pull/6077) [`cf97cb5`](https://github.com/primer/react/commit/cf97cb530bbe5c78f07f16884dfce21be4744ce6) Thanks [@langermank](https://github.com/langermank)! - Fix `Skeleton` background color

- [#6054](https://github.com/primer/react/pull/6054) [`3fc7741`](https://github.com/primer/react/commit/3fc7741d59fa4b1586bd78d668d52b86c4099e83) Thanks [@khiga8](https://github.com/khiga8)! - Add support for aria-label on ActionList.Group

- [#6095](https://github.com/primer/react/pull/6095) [`3beba5b`](https://github.com/primer/react/commit/3beba5b20fbd01fec08219e038056b9194783b90) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(Button): correct loading alignment

- [#6049](https://github.com/primer/react/pull/6049) [`776e05e`](https://github.com/primer/react/commit/776e05e7867d06b0b8dd855b2750e5510befe6ac) Thanks [@TylerJDev](https://github.com/TylerJDev)! - ActionList: Ensure `role="option"` is added when `role="listbox"` is used; allow disabled items to remain focusable

- [#6100](https://github.com/primer/react/pull/6100) [`a7e99f8`](https://github.com/primer/react/commit/a7e99f87bb73470a1469ec3fc30ac09552962996) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove unused getBreakpointDeclarations function and any related code.

## 37.24.0

### Minor Changes

- [#5933](https://github.com/primer/react/pull/5933) [`ed6e947`](https://github.com/primer/react/commit/ed6e947e571873f5680b6c1a5d9ed2b137e12b9b) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the SegmentedControl component

- [#6022](https://github.com/primer/react/pull/6022) [`1f53127`](https://github.com/primer/react/commit/1f53127e8990bebea4330451c5eaaa687105a0d1) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the ActionList.Divider component

- [#6023](https://github.com/primer/react/pull/6023) [`5e514f3`](https://github.com/primer/react/commit/5e514f3d6d1f16a1dab1304c0481f1d929c94534) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the ActionList.Group component

- [#5827](https://github.com/primer/react/pull/5827) [`e76835c`](https://github.com/primer/react/commit/e76835c9d94fdd5aa2c8cdc947b69268297d8628) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag for Popover

- [#5997](https://github.com/primer/react/pull/5997) [`882d923`](https://github.com/primer/react/commit/882d9238b0028abbabff55cfa848ec9222bb2758) Thanks [@jamieshark](https://github.com/jamieshark)! - Remove CSS modules flag from Pagination.

- [#5910](https://github.com/primer/react/pull/5910) [`cdd4253`](https://github.com/primer/react/commit/cdd4253fccc62198dc270181541047d45b6806f1) Thanks [@TylerJDev](https://github.com/TylerJDev)! - ActionMenu: Adds new prop `onPositionChange` that is called when the position of the overlay is changed

- [#6021](https://github.com/primer/react/pull/6021) [`a37d544`](https://github.com/primer/react/commit/a37d54472d3e691778b20c05c3dc9846d52e2f7e) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the ActionList.TrailingAction component

- [#6019](https://github.com/primer/react/pull/6019) [`6c2c999`](https://github.com/primer/react/commit/6c2c9994d199344224c1d50f1796957a2785ea85) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the ActionList/List component

- [#6014](https://github.com/primer/react/pull/6014) [`2fc9327`](https://github.com/primer/react/commit/2fc93275167ab3b5ce328e3f8dfcfbc9a9a4c802) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the Token component

### Patch Changes

- [#6036](https://github.com/primer/react/pull/6036) [`21a3529`](https://github.com/primer/react/commit/21a3529f480f4ca5e7e7f0a0c7d4a4bae8d86281) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(Overlay): reset maxheight and maxwidth values when on fullscreen

- [#6009](https://github.com/primer/react/pull/6009) [`261732e`](https://github.com/primer/react/commit/261732e045d8621d2d712ee7160c04a3ffbf0233) Thanks [@francinelucca](https://github.com/francinelucca)! - Fix extra padding on SelectPanel with groups

- [#6032](https://github.com/primer/react/pull/6032) [`e0ef7e1`](https://github.com/primer/react/commit/e0ef7e1a06cee694418dc41b7657e5bbb443b070) Thanks [@joshblack](https://github.com/joshblack)! - Update the `Table.Container` component to place `className` on outermost element

## 37.23.0

### Minor Changes

- [#6013](https://github.com/primer/react/pull/6013) [`2b2b541`](https://github.com/primer/react/commit/2b2b541eed1905751f1ade2e20ad632df8fa636c) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the CheckboxOrRadioGroup component

- [#6007](https://github.com/primer/react/pull/6007) [`6e03bf9`](https://github.com/primer/react/commit/6e03bf9993fdf27b6b6efc2f0eee4b298032eedc) Thanks [@joshblack](https://github.com/joshblack)! - Update Flash from sx to CSS Modules

- [#6015](https://github.com/primer/react/pull/6015) [`237186a`](https://github.com/primer/react/commit/237186ac490ca00edd025917bff35161513c212e) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the Select component

- [#5991](https://github.com/primer/react/pull/5991) [`f1fedf3`](https://github.com/primer/react/commit/f1fedf3dca46444c044ee565b375f8daa7215b82) Thanks [@veryfancy](https://github.com/veryfancy)! - Add support for the `onToggleSort` prop to `DataTable`

- [#5907](https://github.com/primer/react/pull/5907) [`dbeca84`](https://github.com/primer/react/commit/dbeca840e48eff3fe24babec7a9eb85f42be43db) Thanks [@bibektamang7](https://github.com/bibektamang7)! - feat(Datatable): add optional getRowId prop to support custom row identifiers

- [#5971](https://github.com/primer/react/pull/5971) [`56248f7`](https://github.com/primer/react/commit/56248f716bf2580c2d2199ae1ed5171034600fcf) Thanks [@francinelucca](https://github.com/francinelucca)! - feat(SelectPanel): display selected items at the top under FF

### Patch Changes

- [#6024](https://github.com/primer/react/pull/6024) [`a470e14`](https://github.com/primer/react/commit/a470e14bf143f5be50047f6c43c7853980d6e952) Thanks [@francinelucca](https://github.com/francinelucca)! - turn off primer_react_select_panel_order_selected_at_top by default

- [#5914](https://github.com/primer/react/pull/5914) [`159d124`](https://github.com/primer/react/commit/159d12426d723fd5fe949a559cd4ef7d1ce5b1ab) Thanks [@langermank](https://github.com/langermank)! - Bump `primer/primitives` v10 or v11 to prep for next major

- [#5996](https://github.com/primer/react/pull/5996) [`49fa2c8`](https://github.com/primer/react/commit/49fa2c809bcf1f9e23016859c36d0445b10b2036) Thanks [@francinelucca](https://github.com/francinelucca)! - Fix(Dialog): set height limit of 35% to DialogHeader

- [#5995](https://github.com/primer/react/pull/5995) [`48909e4`](https://github.com/primer/react/commit/48909e4aa1a340e529aed8c17de3e6f069e49d80) Thanks [@joshblack](https://github.com/joshblack)! - fix(TextArea): only add class name to outermost element

## 37.22.0

### Minor Changes

- [#5981](https://github.com/primer/react/pull/5981) [`b03f78f`](https://github.com/primer/react/commit/b03f78fa0d208f932ce056d8a5b64b81da812048) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the BaseStyles component

- [#5970](https://github.com/primer/react/pull/5970) [`02ed196`](https://github.com/primer/react/commit/02ed196d510e757907e2acf780d471dad4a68e37) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the TextInput component

- [#5984](https://github.com/primer/react/pull/5984) [`103c3bf`](https://github.com/primer/react/commit/103c3bf9a7385bf6f274fe5abadc3f5cb200b026) Thanks [@joshblack](https://github.com/joshblack)! - Add support for the `className` prop to `FormControl.Validation`

- [#5982](https://github.com/primer/react/pull/5982) [`36f1007`](https://github.com/primer/react/commit/36f100706a32d369d1f464caeaa60ff38b576d30) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the Overlay component

- [#5969](https://github.com/primer/react/pull/5969) [`1066419`](https://github.com/primer/react/commit/1066419cd7de84174bd53bdde0e4c0c866d20e45) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the Dialog component

- [#5872](https://github.com/primer/react/pull/5872) [`2b98c2c`](https://github.com/primer/react/commit/2b98c2cc09dea0097b0cfb0b32bc1393b8cd5521) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the TooltipV2 component

- [#5934](https://github.com/primer/react/pull/5934) [`c1ea6cf`](https://github.com/primer/react/commit/c1ea6cf6ff4a1ecca7861da242ab9a6935a8139f) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the TreeView component

- [#5983](https://github.com/primer/react/pull/5983) [`8a22d86`](https://github.com/primer/react/commit/8a22d86693bd98c7993730f87706f01564d06a89) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the ProgressBar component

- [#5973](https://github.com/primer/react/pull/5973) [`6d3fc05`](https://github.com/primer/react/commit/6d3fc0553da65631ecbb049e763adda01776c276) Thanks [@joshblack](https://github.com/joshblack)! - Update components to use jsx from react/jsx-runtime instead of createElement

### Patch Changes

- [#5986](https://github.com/primer/react/pull/5986) [`308fe82`](https://github.com/primer/react/commit/308fe82909f3d922be0a6582f83e96798678ec78) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SelectPanel): do not depend on id for selection comparison

- [#5968](https://github.com/primer/react/pull/5968) [`0ea045a`](https://github.com/primer/react/commit/0ea045aa05c2555cd54b8c76394a0c5c8f3dab1d) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the primer_react_css_modules_staff feature flag. Also needed to rework the feature flag logic for the NavList component.

- [#5963](https://github.com/primer/react/pull/5963) [`7562cbb`](https://github.com/primer/react/commit/7562cbb68cdbfa11dcc7f08f802da10591af8abe) Thanks [@joshblack](https://github.com/joshblack)! - Update Avatar component to correctly merge style when style prop is provided

## 37.21.0

### Minor Changes

- [#5841](https://github.com/primer/react/pull/5841) [`fe429d7`](https://github.com/primer/react/commit/fe429d75e759b195ccacab80ef56e793a764e0ec) Thanks [@dwsosa](https://github.com/dwsosa)! - added default button type to switch button to prevent submit when included in form

- [#5929](https://github.com/primer/react/pull/5929) [`294dac3`](https://github.com/primer/react/commit/294dac335a955b22f73c1427eef183bf4672a01b) Thanks [@hectahertz](https://github.com/hectahertz)! - Add the framework required to run component stress tests

- [#5939](https://github.com/primer/react/pull/5939) [`633fd39`](https://github.com/primer/react/commit/633fd39cd7fe55542782e3c4ad492e1ad2b435ab) Thanks [@hectahertz](https://github.com/hectahertz)! - Implement the secondaryAction prop and deprecate footer

- [#5935](https://github.com/primer/react/pull/5935) [`4f9aae7`](https://github.com/primer/react/commit/4f9aae7a22736dc46928920ad17cf4919bca0ea1) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag for the PageLayout component

### Patch Changes

- [#5942](https://github.com/primer/react/pull/5942) [`596388d`](https://github.com/primer/react/commit/596388dd4f0dd5899d5fde88fcd6adf879a16f39) Thanks [@hectahertz](https://github.com/hectahertz)! - Improve PageLayout performance

- [#5962](https://github.com/primer/react/pull/5962) [`196de0f`](https://github.com/primer/react/commit/196de0f290808bfa38c9f77d5ebfa473f17173f1) Thanks [@emilybrick](https://github.com/emilybrick)! - Fix spacing for SelectPanel header on modal to better align with x button

- [#5958](https://github.com/primer/react/pull/5958) [`9110f71`](https://github.com/primer/react/commit/9110f71b0fbc3e127e0e59418ac6e9800f274a8e) Thanks [@joshblack](https://github.com/joshblack)! - Update ActionList.LinkItem to pass through the `variant` prop when the CSS Modules flag is disabled

- [#5956](https://github.com/primer/react/pull/5956) [`5cb35f3`](https://github.com/primer/react/commit/5cb35f3f9050d3db5e101f799365f64e1cd2721c) Thanks [@hectahertz](https://github.com/hectahertz)! - Introduce Save and close on SelectPanel

## 37.20.0

### Minor Changes

- [#5788](https://github.com/primer/react/pull/5788) [`cd9987d`](https://github.com/primer/react/commit/cd9987d9b8620355e438048eef4a4186626a6a95) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from Table

- [#5875](https://github.com/primer/react/pull/5875) [`3014334`](https://github.com/primer/react/commit/301433464a6da7814d3e923aa9e4129b0c118148) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the BranchName component

- [#5874](https://github.com/primer/react/pull/5874) [`365d53d`](https://github.com/primer/react/commit/365d53d860c51684453235e313c25ec9dd68f5ea) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the Breadcrumbs component

- [#5868](https://github.com/primer/react/pull/5868) [`7e6475d`](https://github.com/primer/react/commit/7e6475dc1ee3bbaa445741d4f7dc826284017c26) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from Text

- [#5883](https://github.com/primer/react/pull/5883) [`703b69d`](https://github.com/primer/react/commit/703b69dc06db5701a0b09dd51f46b6ceb9ec2e25) Thanks [@hectahertz](https://github.com/hectahertz)! - SelectPanel: Add variant="modal"

- [#5870](https://github.com/primer/react/pull/5870) [`7373295`](https://github.com/primer/react/commit/737329511320e7adac8092f03250960138ffee32) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the Stack component

- [#5877](https://github.com/primer/react/pull/5877) [`8a7d583`](https://github.com/primer/react/commit/8a7d5835e01fe4f1c073ba5c33bc73d0cfe148b9) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the PageHeader component

- [#5931](https://github.com/primer/react/pull/5931) [`96af0aa`](https://github.com/primer/react/commit/96af0aac9d55b00bb1d27003fe01e5ce32791b15) Thanks [@jamieshark](https://github.com/jamieshark)! - Adds className prop to UnderlineNav component.

### Patch Changes

- [#5902](https://github.com/primer/react/pull/5902) [`c9659fd`](https://github.com/primer/react/commit/c9659fdd4c917ce6d91900e229ecb70d78ba954b) Thanks [@hectahertz](https://github.com/hectahertz)! - Fix DialogV1 story broken link

- [#5930](https://github.com/primer/react/pull/5930) [`876b822`](https://github.com/primer/react/commit/876b822f8bb8b28fbe084b16849bd1b9e5f8a8ab) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SelectPanel): use dvh units for full screen when available

## 37.19.1

### Patch Changes

- Update data table pagination pageEnd to handle zero based index

- [`b926c08`](https://github.com/primer/react/commit/b926c08f8e3a2c6578014edd6bf0ee0d095065c7) Thanks [@AAugustine](https://github.com/AAugustine)! - Update data table pagination pageEnd to handle zero based index

## 37.19.0

### Minor Changes

- [#5900](https://github.com/primer/react/pull/5900) [`ebc6813`](https://github.com/primer/react/commit/ebc68133edd927072bca65e34147df2017e95a86) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the ActionList.Heading component

- [#5830](https://github.com/primer/react/pull/5830) [`f8760fe`](https://github.com/primer/react/commit/f8760fecf9433e548e90ad7e6cf30d216122091d) Thanks [@iansan5653](https://github.com/iansan5653)! - Hide `TooltipV2` tooltips on `touchend` event

- [#5873](https://github.com/primer/react/pull/5873) [`0a2e3f0`](https://github.com/primer/react/commit/0a2e3f071fed8ff1109751c56faf4a92f8cf0542) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag for the TextArea component

- [#5693](https://github.com/primer/react/pull/5693) [`da85192`](https://github.com/primer/react/commit/da851921e7e4cddba577d08da44ffbe32936c15b) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(SkeletonBox): promote to Alpha

- [#5876](https://github.com/primer/react/pull/5876) [`a78c820`](https://github.com/primer/react/commit/a78c820d9c5ac5c29fdccfd30e8dd1944653f1f4) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the SideNav component

- [#5882](https://github.com/primer/react/pull/5882) [`6eecde6`](https://github.com/primer/react/commit/6eecde60f93407dcc1d32fe81fb86229c04ad595) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(SelectPanel): remove css modules feature flag

- [#5851](https://github.com/primer/react/pull/5851) [`a812a86`](https://github.com/primer/react/commit/a812a868c8eb98c3a1ad6540806b7db2bb75aa0d) Thanks [@jamieshark](https://github.com/jamieshark)! - Removes feature flag for FormControl

- [#5861](https://github.com/primer/react/pull/5861) [`ecb449f`](https://github.com/primer/react/commit/ecb449f41f8e2a16f3c547877f53208f6eef92eb) Thanks [@jamieshark](https://github.com/jamieshark)! - Changes argument signature for toggleSxComponent to simplify

- [#5836](https://github.com/primer/react/pull/5836) [`c177e5e`](https://github.com/primer/react/commit/c177e5e5b89ef7039dde039b5b2f4a925a3bdc24) Thanks [@jamieshark](https://github.com/jamieshark)! - Removes css module flag for UnderlinePanels and associated components.

### Patch Changes

- [#5866](https://github.com/primer/react/pull/5866) [`f978534`](https://github.com/primer/react/commit/f9785343716435f43e3d82482b057a17bd345c25) Thanks [@mperrotti](https://github.com/mperrotti)! - Improves how we detect context for inactive item messaging by checking the `role` on `ActionList` instead of relying on parent components, making the logic more robust and consistent. It also fixes incorrect behavior in `NavList` and `SelectPanel`, and improves accessibility by correcting `aria` relationships on tooltip buttons.

- [#5912](https://github.com/primer/react/pull/5912) [`81821db`](https://github.com/primer/react/commit/81821db70b054c5d2f932b4fbb8642dfea9625f8) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SelectPanel): always show x button on single select

- [#5908](https://github.com/primer/react/pull/5908) [`8e7bc0e`](https://github.com/primer/react/commit/8e7bc0e4299b3c43ef128a9482bef4bb7f539a71) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SelectPanel): differentiate onCancel gesture from escape

- [#5904](https://github.com/primer/react/pull/5904) [`a522fdb`](https://github.com/primer/react/commit/a522fdb14562b6dff2f2382f20fc9aefc01a26bc) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SelectPanel): disable body scroll on full screen

- [#5906](https://github.com/primer/react/pull/5906) [`8fa12ea`](https://github.com/primer/react/commit/8fa12ead9ec467293e6e6edb38c2ccc90da9fe5e) Thanks [@TylerJDev](https://github.com/TylerJDev)! - SelectPanelV2: Add `deprecated` status to SelectPanelV2 docs and stories

- [#5881](https://github.com/primer/react/pull/5881) [`ea1fb50`](https://github.com/primer/react/commit/ea1fb509f2b0f143a0f18be1882a4de665313679) Thanks [@emilybrick](https://github.com/emilybrick)! - fix(SelectPanel): Add margin around notice styles

## 37.18.0

### Minor Changes

- [#5820](https://github.com/primer/react/pull/5820) [`bd9225d`](https://github.com/primer/react/commit/bd9225df84b1636c6db17217d3304bbdc026d998) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - feat(Pagination): add renderPage prop to Pagination

- [#5546](https://github.com/primer/react/pull/5546) [`2aef81a`](https://github.com/primer/react/commit/2aef81a1252598c21b3e615590b468a5774ab74e) Thanks [@joshblack](https://github.com/joshblack)! - Add support for importing `@primer/react/generated/components.json` to npm package

- [#5826](https://github.com/primer/react/pull/5826) [`5f40e43`](https://github.com/primer/react/commit/5f40e43cb3d70f049b23de005849f543cdeaa9d6) Thanks [@francinelucca](https://github.com/francinelucca)! - SelectPanel: Implement empty state (behind ff)

- [#5803](https://github.com/primer/react/pull/5803) [`9c135c4`](https://github.com/primer/react/commit/9c135c40170cddf7b4308b97134578df87f7141f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - StateLabel: Add open and closed states for no icon cases

### Patch Changes

- [#5853](https://github.com/primer/react/pull/5853) [`ba415bb`](https://github.com/primer/react/commit/ba415bb6f95f1be39ac14265b5707aa91265150a) Thanks [@iansan5653](https://github.com/iansan5653)! - Add workaround for Chrome bug where `KeybindingHint` in combination with `aria-labelledby` results in incorrect label

- [#5835](https://github.com/primer/react/pull/5835) [`2cb629a`](https://github.com/primer/react/commit/2cb629a17c6adcac536c3424d99880f58468e0f3) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Overlay: Fix position for fullscreen overlay on narrow screens

- [#5629](https://github.com/primer/react/pull/5629) [`b7346b2`](https://github.com/primer/react/commit/b7346b296b831efa9e2c3db24c6460623c0efae5) Thanks [@hectahertz](https://github.com/hectahertz)! - Make Dialog footer scrollable on very short viewports

- [#5852](https://github.com/primer/react/pull/5852) [`5d66a4c`](https://github.com/primer/react/commit/5d66a4c07f9d0c45e9cb6e119b4e41ee95e15edd) Thanks [@jonrohan](https://github.com/jonrohan)! - bugfix(PageHeader): Use font-weight initial to match the styled component styling

- [#5629](https://github.com/primer/react/pull/5629) [`b7346b2`](https://github.com/primer/react/commit/b7346b296b831efa9e2c3db24c6460623c0efae5) Thanks [@hectahertz](https://github.com/hectahertz)! - Update the Dialog stress test story to go fullscreen on narrow screens

## 37.17.0

### Minor Changes

- [#5804](https://github.com/primer/react/pull/5804) [`687343c`](https://github.com/primer/react/commit/687343c6c0b57c80862b898ecd7ed51cc4c2fec8) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove CSS modules feature flag from the InlineMessage component

- [#5786](https://github.com/primer/react/pull/5786) [`0f165d4`](https://github.com/primer/react/commit/0f165d443586a9bf34931b944bc00e031b7c81ab) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the Timeline component

- [#5793](https://github.com/primer/react/pull/5793) [`4213a86`](https://github.com/primer/react/commit/4213a86c64d938d787c022d0a61b6379d3ff9418) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the Autocomplete component.

- [#5741](https://github.com/primer/react/pull/5741) [`d32dd27`](https://github.com/primer/react/commit/d32dd272771dee777bc31d67713b87f189bc8661) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds `hasBorder` prop to PageHeader to allow a bottom border

- [#5810](https://github.com/primer/react/pull/5810) [`2411aa9`](https://github.com/primer/react/commit/2411aa98388a695fc3246725f74503a44a4b97fe) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - ActionList.Group + ActionList.TrailingAction: add missing className prop
  LabelGroup: add missing className prop

- [#5792](https://github.com/primer/react/pull/5792) [`4e85438`](https://github.com/primer/react/commit/4e85438a878f80ccb3ffc8167b31afe93d81d752) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the KeybindingHint Component.

- [#5790](https://github.com/primer/react/pull/5790) [`acc5d27`](https://github.com/primer/react/commit/acc5d27fc43d08b6a2efca9c86aba5dec88fe3dc) Thanks [@hectahertz](https://github.com/hectahertz)! - Add Notice to SelectPanel

- [#5821](https://github.com/primer/react/pull/5821) [`3a102a7`](https://github.com/primer/react/commit/3a102a7ed43b84eea5d708fbe0855c272c239371) Thanks [@jamieshark](https://github.com/jamieshark)! - Adds util function to swap out SX enabled components.

- [#5795](https://github.com/primer/react/pull/5795) [`1555b1b`](https://github.com/primer/react/commit/1555b1b5f1c900c303c49eb2c7898460a7db1de2) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the ConfirmationDialog component

- [#5787](https://github.com/primer/react/pull/5787) [`9272a8c`](https://github.com/primer/react/commit/9272a8c4311dbcbd909490e79a185e29e18d15d5) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS module feature flag from SkeletonAvatar SkeletonBox and SkeletonText

### Patch Changes

- [#5811](https://github.com/primer/react/pull/5811) [`91b52f7`](https://github.com/primer/react/commit/91b52f70da11c1f2d6f666483ea28fd43676b5bb) Thanks [@TylerJDev](https://github.com/TylerJDev)! - DialogV2: Fix CSS issue where `flex-grow` wasn't getting applied via classname

- [#5436](https://github.com/primer/react/pull/5436) [`11b8d4c`](https://github.com/primer/react/commit/11b8d4c418d4de21d3ff86a7031a4eca844bc34b) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Show `Tooltip` on close button in `Dialog`

- [#5832](https://github.com/primer/react/pull/5832) [`b6c7690`](https://github.com/primer/react/commit/b6c769004b6ce02b6377c91766714cbe16478778) Thanks [@francinelucca](https://github.com/francinelucca)! - chore(SelectPanel): put fullscreen functionality behind FF

- [#5816](https://github.com/primer/react/pull/5816) [`59e62c1`](https://github.com/primer/react/commit/59e62c1b190a5bccf30ffa1ba355b0ed5368bf89) Thanks [@langermank](https://github.com/langermank)! - Bug fix: `className` passed to PageLayout twice

- [#5761](https://github.com/primer/react/pull/5761) [`94bc6e4`](https://github.com/primer/react/commit/94bc6e41319a711650957fa2e728f75c72a36772) Thanks [@siddharthkp](https://github.com/siddharthkp)! - SelectPanel: Make SelectPanel full screen on narrow devices with a Save button

- [#5797](https://github.com/primer/react/pull/5797) [`fbc6f97`](https://github.com/primer/react/commit/fbc6f97aae024917b56cfbc98244030d40f3ea00) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - SubNav: Update selected styles to only apply to `data-selected='true'`

## 37.16.0

### Minor Changes

- [#5763](https://github.com/primer/react/pull/5763) [`d3926d1`](https://github.com/primer/react/commit/d3926d183c690f4c3ca80c6f5de92a869688ead7) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - chore(Box): Mark Box and its props as deprecated

- [#5772](https://github.com/primer/react/pull/5772) [`0970415`](https://github.com/primer/react/commit/09704159839484eaa709f8db2261b38d713a8f1b) Thanks [@jonrohan](https://github.com/jonrohan)! - Removing the CSS modules feature flag from the SubNav component.

- [#5785](https://github.com/primer/react/pull/5785) [`fbd7fc9`](https://github.com/primer/react/commit/fbd7fc9dbad337e6558d9628a9c21ff2a74200b1) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove CSS modules feature flag from VisuallyHidden

- [#5760](https://github.com/primer/react/pull/5760) [`8b492cf`](https://github.com/primer/react/commit/8b492cfef0a086d95803e85c3fc63b4c07b58aa5) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Radio: Removes `aria-invalid` and `aria-required` from `Radio`, as they are not supported on the element's role.

- [#5759](https://github.com/primer/react/pull/5759) [`76bf60d`](https://github.com/primer/react/commit/76bf60d6772d39322def284d43d711480bcc5c81) Thanks [@siddharthkp](https://github.com/siddharthkp)! - AnchoredOverlay: Add prop to set responsive variant. Example: `variant: {regular: 'anchored', narrow: 'anchored'}`

- [#5725](https://github.com/primer/react/pull/5725) [`d3b48b1`](https://github.com/primer/react/commit/d3b48b1cc2d4d5e23fbcdc4052e0db3bf03397ce) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - Allow button count prop to accept a number or a string, to allow for human format, like 3.2k

### Patch Changes

- [#5768](https://github.com/primer/react/pull/5768) [`7b2eb4e`](https://github.com/primer/react/commit/7b2eb4e71966321eed9f5b779bb5bbf997ca9191) Thanks [@joshblack](https://github.com/joshblack)! - Update CSS Custom Property used in skeletons to fix animation behind feature flag.

- [#5773](https://github.com/primer/react/pull/5773) [`9e18567`](https://github.com/primer/react/commit/9e1856799e8d6f54262fec020635ba1ee0ed5ad0) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - Update icon color for Blankslate to `--fgColor-muted` to align with Figma and Primer ViewComponents

- [#5764](https://github.com/primer/react/pull/5764) [`c63e805`](https://github.com/primer/react/commit/c63e80540f9be6debeb2bbab13979ab12099414c) Thanks [@joshblack](https://github.com/joshblack)! - Update base component for Checkbox and Radio to pass along correct prop type in React 19

- [#5765](https://github.com/primer/react/pull/5765) [`86a6211`](https://github.com/primer/react/commit/86a6211656e991fbd1d202253636296351cc11d8) Thanks [@joshblack](https://github.com/joshblack)! - Update ordering of selectors to improve rendering of checked Radio options

- [#5649](https://github.com/primer/react/pull/5649) [`63ca6f2`](https://github.com/primer/react/commit/63ca6f2796688d5777edf1dd568c8bd1bb337f11) Thanks [@joshblack](https://github.com/joshblack)! - Update BaseStyles to set data-color-mode to auto when colorMode in ThemeProvider is auto

- [#5767](https://github.com/primer/react/pull/5767) [`e0c34d0`](https://github.com/primer/react/commit/e0c34d06b83d22776e22472fd9d9ee821ff14f44) Thanks [@mperrotti](https://github.com/mperrotti)! - Upgrades tab-container-element

## 37.15.0

### Minor Changes

- [#4686](https://github.com/primer/react/pull/4686) [`6b137a4`](https://github.com/primer/react/commit/6b137a4c5358c776d67de63798056444ca66c136) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Add `NavList.ShowMoreItem` component to support showing more content within a `NavList`.

- [#5726](https://github.com/primer/react/pull/5726) [`2646c12`](https://github.com/primer/react/commit/2646c126d6050de8a1a947a91aa97cae38edaef3) Thanks [@smockle](https://github.com/smockle)! - feat: Support `className` prop in `FormControl.Caption` component

- [#5716](https://github.com/primer/react/pull/5716) [`d62a494`](https://github.com/primer/react/commit/d62a4942d65d32a7ea6ad4f6916c2120f685dad3) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - chore: Ensure class names conform to PascalCase

- [#5666](https://github.com/primer/react/pull/5666) [`7400549`](https://github.com/primer/react/commit/740054915ad1f51ab16f9e68addb17716f068437) Thanks [@TylerJDev](https://github.com/TylerJDev)! - ActionBar: Improves `disabled` state on `ActionBar.IconButton`; includes `disabled` state in overflow menu

- [#5737](https://github.com/primer/react/pull/5737) [`454ff20`](https://github.com/primer/react/commit/454ff20b34565bdeaa43ebcc161d105a41a7536e) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - fix(SplitPageLayout): add className prop

### Patch Changes

- [#5738](https://github.com/primer/react/pull/5738) [`a4137bc`](https://github.com/primer/react/commit/a4137bcf8c2b62b51ec8dfb26ab0bc2f35f83988) Thanks [@jamieshark](https://github.com/jamieshark)! - Update FormControl to use CSS Modules GA feature flag.

- [#5742](https://github.com/primer/react/pull/5742) [`86cd9f0`](https://github.com/primer/react/commit/86cd9f0ee6bb912acc7caf78918613f3b82aec5c) Thanks [@francinelucca](https://github.com/francinelucca)! - fix: user red focus state for inputs when in error state

- [#5705](https://github.com/primer/react/pull/5705) [`2857a8e`](https://github.com/primer/react/commit/2857a8e9b4e4ae619a664f7b452df302da7e3e89) Thanks [@iansan5653](https://github.com/iansan5653)! - Fix `AvatarStack` stacking `z-index` bugs by creating a new stacking context around the component

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving AvatarStack to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving PageLayout to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving Pagination to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving SegmentedControl to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving SelectPanel to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving SubNav to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving Token to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving Tooltip to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving BaseStyles to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving SideNav to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving ConfirmationDialog to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving DataTable to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving UnderlinePanels to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving InlineMessage to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving KeybindingHint to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving NavList to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving Overlay to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving PageHeader to `primer_react_css_modules_ga` feature flag

- [#5710](https://github.com/primer/react/pull/5710) [`b1cdc63`](https://github.com/primer/react/commit/b1cdc6337d0b83eefe33446f2f212090acb5a61d) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving Autocomplete to `primer_react_css_modules_ga` feature flag

- [#5743](https://github.com/primer/react/pull/5743) [`9d78410`](https://github.com/primer/react/commit/9d78410bb4542972cd8f371e134c8ffc6d5ca235) Thanks [@langermank](https://github.com/langermank)! - Move `ActionList` feature flag to GA

- [#5733](https://github.com/primer/react/pull/5733) [`7849c95`](https://github.com/primer/react/commit/7849c953377fa1d9e5b3c9db7af64468aab903d5) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(TextInput): use cursor text on wrapper

- [#5714](https://github.com/primer/react/pull/5714) [`0cfafe8`](https://github.com/primer/react/commit/0cfafe8a3ecad29238f88ab86201764364446ce3) Thanks [@mperrotti](https://github.com/mperrotti)! - Fixes AvatarStack styling bugs. Primarily, preventing avatars from appearing above overlays such as dialog modals.

## 37.14.0

### Minor Changes

- [#5687](https://github.com/primer/react/pull/5687) [`2bbc5a0`](https://github.com/primer/react/commit/2bbc5a036bc5e57d25aa559e88b16a6063e27646) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Blankslate: Add support for button in `Blankslate.PrimaryAction`

- [#5510](https://github.com/primer/react/pull/5510) [`37a91b5`](https://github.com/primer/react/commit/37a91b51569bc4be92c6994ec6fe433584328911) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove CSS modules feature flag from Header

### Patch Changes

- [#5712](https://github.com/primer/react/pull/5712) [`22508b7`](https://github.com/primer/react/commit/22508b7ceb10638d983c68a800d691aed812d724) Thanks [@jonrohan](https://github.com/jonrohan)! - bugfix(SelectPanel): Set border-top-color on selectpanel footer

- [#5686](https://github.com/primer/react/pull/5686) [`64f183b`](https://github.com/primer/react/commit/64f183bb028cd1072af2c7e2892ad21bdadf882c) Thanks [@jonrohan](https://github.com/jonrohan)! - The `UnderlinePanels` component wasn't supporting passing in `className`. Adding to the prop list

- [#5661](https://github.com/primer/react/pull/5661) [`1262f5a`](https://github.com/primer/react/commit/1262f5affa84330c917b964fa0cd8d907b398afc) Thanks [@TylerJDev](https://github.com/TylerJDev)! - SubNav: Adds `aria-current` to selected links

- [#5562](https://github.com/primer/react/pull/5562) [`947b59d`](https://github.com/primer/react/commit/947b59d43079003f5be6eea60b7dc2025fb21a4e) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SelectPanel): Correctly recalculate position on overflow

- [#5655](https://github.com/primer/react/pull/5655) [`56baa0a`](https://github.com/primer/react/commit/56baa0a791ba8a714fec28e3794e471358ddfde3) Thanks [@hectahertz](https://github.com/hectahertz)! - Fix LinkButton types and stories

## 37.13.0

### Minor Changes

- [#5679](https://github.com/primer/react/pull/5679) [`dbcb8f7`](https://github.com/primer/react/commit/dbcb8f7bba145e6463e14823a352e829ffcb4c9d) Thanks [@khiga8](https://github.com/khiga8)! - feat: Introduce Tooltip to SegmentedControlIconButton

### Patch Changes

- [#5636](https://github.com/primer/react/pull/5636) [`c2165af`](https://github.com/primer/react/commit/c2165af0786e416d0893482fa2ad2b4dbb0dce61) Thanks [@ktravers](https://github.com/ktravers)! - Update useOpenAndCloseFocus hook to apply return focus when preventFocusOnOpen prop is given

- [#5662](https://github.com/primer/react/pull/5662) [`613cf0c`](https://github.com/primer/react/commit/613cf0cc81ee5d65a3045d04f197e2a1921a8745) Thanks [@kendallgassner](https://github.com/kendallgassner)! - Autocomplete: Use aria-live to announce "no selectable options".

- [#5669](https://github.com/primer/react/pull/5669) [`b2bc006`](https://github.com/primer/react/commit/b2bc0069f4c25ca87ffa140ffbcc985c500129a0) Thanks [@jonrohan](https://github.com/jonrohan)! - Move FormControl css modules feature flag from team to staff

- [#5628](https://github.com/primer/react/pull/5628) [`621c878`](https://github.com/primer/react/commit/621c878a3f4dd15e9336041c48be330e74738030) Thanks [@hectahertz](https://github.com/hectahertz)! - Update the Dialog stress test story to go fullscreen on narrow screens

- [#5667](https://github.com/primer/react/pull/5667) [`10436f5`](https://github.com/primer/react/commit/10436f55cce2797c07b09ed6fe96845c6cb8eda5) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - Replaced raw values for duration and easing with primitives

- [#4481](https://github.com/primer/react/pull/4481) [`6e7da1e`](https://github.com/primer/react/commit/6e7da1eaa48420bdf32ed20eccda041991a533ea) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Allows `ActionMenu` and `SelectPanel` items to remain focusable when `disabled`

- [#5683](https://github.com/primer/react/pull/5683) [`8bb78e1`](https://github.com/primer/react/commit/8bb78e18ce18badfe1c2e285b123dfbf96c8c5c3) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the Hidden component

## 37.12.0

### Minor Changes

- [#5466](https://github.com/primer/react/pull/5466) [`eb0857d`](https://github.com/primer/react/commit/eb0857d33c77ab76c15d01ee9db6a6a718eeab4e) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove CSS modules feature flag from Spinner

- [#5492](https://github.com/primer/react/pull/5492) [`469f703`](https://github.com/primer/react/commit/469f7033ae4f7508542379ec5dceb44199cc4e67) Thanks [@joshblack](https://github.com/joshblack)! - Update dependency range for React dependencies to include 19.x

- [#5608](https://github.com/primer/react/pull/5608) [`3a41430`](https://github.com/primer/react/commit/3a41430356bd336afc9855149eb34ecfbf016d57) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - feat(AvatarStack): add style prop

- [#5139](https://github.com/primer/react/pull/5139) [`59e0efa`](https://github.com/primer/react/commit/59e0efa015201b73b54aeda0b666a3e3116ec47b) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - [SelectPanel] Implement loading states

- [#5174](https://github.com/primer/react/pull/5174) [`cf80bf2`](https://github.com/primer/react/commit/cf80bf29769c0e672ebfcd06041e322735e822f3) Thanks [@TylerJDev](https://github.com/TylerJDev)! - TreeView: Adds `aria-label` prop to `TreeView.Subtree`

### Patch Changes

- [#5606](https://github.com/primer/react/pull/5606) [`f291e81`](https://github.com/primer/react/commit/f291e81c78a4d3ac954940374e0f8e6c09517271) Thanks [@joshblack](https://github.com/joshblack)! - Update BaseStyles to no longer pass system props when feature flag is enabled

- [#5595](https://github.com/primer/react/pull/5595) [`2db6c92`](https://github.com/primer/react/commit/2db6c9206cc44991eb27ce4abcd6d7c33772c134) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(useResizeObserver): undefined variable alternative

- [#5593](https://github.com/primer/react/pull/5593) [`2b05aad`](https://github.com/primer/react/commit/2b05aad5416512096ceead2d9cd28f34a8211cf8) Thanks [@camertron](https://github.com/camertron)! - Fix experimental SelectPanel anchoring behavior

- [#5657](https://github.com/primer/react/pull/5657) [`de4fc48`](https://github.com/primer/react/commit/de4fc48ed87b08b132be27c0f73e7161f6b73a40) Thanks [@langermank](https://github.com/langermank)! - Remove style from sx

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for Autocomplete from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for Overlay from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for PageHeader from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for PageLayout from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for Pagination from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for SegmentedControl from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for SelectPanel from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for SideNav from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for SubNav from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for Token from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for TooltipV2 from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for AvatarStack from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for UnderlinePanels from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for UnderlineTabbedInterface from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for BaseStyles from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for ConfirmationDialog from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for DataTable from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for Hidden from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for InlineMessage from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for KeybindingHint from `team` to `staff`

- [#5610](https://github.com/primer/react/pull/5610) [`32b1f2f`](https://github.com/primer/react/commit/32b1f2f2372b217e31cbefc8fd14553153704389) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving CSS component feature flag for NavList from `team` to `staff`

- [#5605](https://github.com/primer/react/pull/5605) [`d14c48c`](https://github.com/primer/react/commit/d14c48cc3be737d85fb79485b70fd08acd47a7b3) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(Button): do not render main spinner if there is a count when loading

- [#5590](https://github.com/primer/react/pull/5590) [`d045ae4`](https://github.com/primer/react/commit/d045ae40cd19319eac9ddbc3da9e3687531b8926) Thanks [@hectahertz](https://github.com/hectahertz)! - Pagination: Optimize the page rendering algorithm and prevent layout shifts.

## 37.11.2

N/A, re-release of v37.11.1

## 37.11.1

### Patch Changes

- [`a12ab59`](https://github.com/primer/react/commit/a12ab599565651cf30233a2cd97357f07cf39cb8) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - fix(FormControl): fix spacing in vertical layouts"

## 37.11.0

### Minor Changes

- [#5583](https://github.com/primer/react/pull/5583) [`db6c360`](https://github.com/primer/react/commit/db6c3607c43ba288d4df1a68e1590bbb5f5aedb6) Thanks [@brphelps](https://github.com/brphelps)! - Banner now supports onDismiss used when using variant critical.

- [#5578](https://github.com/primer/react/pull/5578) [`88b8533`](https://github.com/primer/react/commit/88b8533e6656f81c6351f25c2afab7f01e0acedc) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Update FormControl to use CSS Modules behind feature flag

- [#5540](https://github.com/primer/react/pull/5540) [`20788da`](https://github.com/primer/react/commit/20788daa3b80c3a332946abac8ab4c57cc9e3f35) Thanks [@langermank](https://github.com/langermank)! - - Convert ActionBar to CSS Modules

  - Add new padding prop for container padding

- [#5527](https://github.com/primer/react/pull/5527) [`ccc3c99`](https://github.com/primer/react/commit/ccc3c9926b0b3ff0b02fd2520883ea4a14f4046d) Thanks [@ddoyle2017](https://github.com/ddoyle2017)! - Add an onSelect callback for UnderlinePanels.Tab

### Patch Changes

- [#5568](https://github.com/primer/react/pull/5568) [`42c20dd`](https://github.com/primer/react/commit/42c20ddc6b850d548e263f6d76bdda1895a97bfe) Thanks [@khiga8](https://github.com/khiga8)! - bug: ensure Announce components work without pre-existing text node

- [#5591](https://github.com/primer/react/pull/5591) [`12f1af7`](https://github.com/primer/react/commit/12f1af7bd8e19a077646c25a5c8cbddd9f69aca7) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Popover CSS modules feature flag from staff to ga

- [#5591](https://github.com/primer/react/pull/5591) [`12f1af7`](https://github.com/primer/react/commit/12f1af7bd8e19a077646c25a5c8cbddd9f69aca7) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Textarea CSS modules feature flag from staff to ga

- [#5591](https://github.com/primer/react/pull/5591) [`12f1af7`](https://github.com/primer/react/commit/12f1af7bd8e19a077646c25a5c8cbddd9f69aca7) Thanks [@jonrohan](https://github.com/jonrohan)! - Move UnstyledTextInput CSS modules feature flag from staff to ga

- [#5591](https://github.com/primer/react/pull/5591) [`12f1af7`](https://github.com/primer/react/commit/12f1af7bd8e19a077646c25a5c8cbddd9f69aca7) Thanks [@jonrohan](https://github.com/jonrohan)! - Move SelectPanel2 CSS modules feature flag from staff to ga

- [#5551](https://github.com/primer/react/pull/5551) [`c0360db`](https://github.com/primer/react/commit/c0360db263e046f7d756bb157fb520167353be91) Thanks [@camertron](https://github.com/camertron)! - Fix an issue in useAnnouncements.tsx causing a TypeError in production. The activeItem variable may be null.

- [#5591](https://github.com/primer/react/pull/5591) [`12f1af7`](https://github.com/primer/react/commit/12f1af7bd8e19a077646c25a5c8cbddd9f69aca7) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Breadcrumbs CSS modules feature flag from staff to ga

- [#5591](https://github.com/primer/react/pull/5591) [`12f1af7`](https://github.com/primer/react/commit/12f1af7bd8e19a077646c25a5c8cbddd9f69aca7) Thanks [@jonrohan](https://github.com/jonrohan)! - Move ProgressBar CSS modules feature flag from staff to ga

- [#5552](https://github.com/primer/react/pull/5552) [`c87e80c`](https://github.com/primer/react/commit/c87e80c129fd293610bdc7df902c0df2b08f3220) Thanks [@camertron](https://github.com/camertron)! - Avoid accessing properties of potentially null document.body in PageLayout

- [#5591](https://github.com/primer/react/pull/5591) [`12f1af7`](https://github.com/primer/react/commit/12f1af7bd8e19a077646c25a5c8cbddd9f69aca7) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Dialog CSS modules feature flag from staff to ga

- [#5591](https://github.com/primer/react/pull/5591) [`12f1af7`](https://github.com/primer/react/commit/12f1af7bd8e19a077646c25a5c8cbddd9f69aca7) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Timeline CSS modules feature flag from staff to ga

- [#5585](https://github.com/primer/react/pull/5585) [`d76cd26`](https://github.com/primer/react/commit/d76cd26f3accdcf06b993d3962fbea2f90f9a426) Thanks [@langermank](https://github.com/langermank)! - Promote ActionList to staff

- [#5467](https://github.com/primer/react/pull/5467) [`c7b109d`](https://github.com/primer/react/commit/c7b109d5c8532dbdc90461df36d148de3c471181) Thanks [@langermank](https://github.com/langermank)! - Add `flex-shrink` to IconButton

- [#5584](https://github.com/primer/react/pull/5584) [`b661959`](https://github.com/primer/react/commit/b66195900793006af301fd1bfb5c82849eac05f1) Thanks [@joshblack](https://github.com/joshblack)! - Update specificity for ButtonBase to be at least 0,1,0

- [#5567](https://github.com/primer/react/pull/5567) [`8bdff77`](https://github.com/primer/react/commit/8bdff77820a3ba9735e794f2cc0eb0e702c67bc0) Thanks [@langermank](https://github.com/langermank)! - Hide NavList sub items if collapsed

- [#5591](https://github.com/primer/react/pull/5591) [`12f1af7`](https://github.com/primer/react/commit/12f1af7bd8e19a077646c25a5c8cbddd9f69aca7) Thanks [@jonrohan](https://github.com/jonrohan)! - Move DialogV1 CSS modules feature flag from staff to ga

- [#5591](https://github.com/primer/react/pull/5591) [`12f1af7`](https://github.com/primer/react/commit/12f1af7bd8e19a077646c25a5c8cbddd9f69aca7) Thanks [@jonrohan](https://github.com/jonrohan)! - Move TreeView CSS modules feature flag from staff to ga

- [#5549](https://github.com/primer/react/pull/5549) [`16c572e`](https://github.com/primer/react/commit/16c572e47475eb402c100a219049cbfc1141a597) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SelectPanel): pass anchorId to AnchoredOverlay

- [#5591](https://github.com/primer/react/pull/5591) [`12f1af7`](https://github.com/primer/react/commit/12f1af7bd8e19a077646c25a5c8cbddd9f69aca7) Thanks [@jonrohan](https://github.com/jonrohan)! - Move CheckboxOrRadioGroup CSS modules feature flag from staff to ga

## 37.10.0

### Minor Changes

- [#5457](https://github.com/primer/react/pull/5457) [`b1e5699`](https://github.com/primer/react/commit/b1e56994d460ee088508445d28150abc902781a8) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove CSS modules feature flag from ButtonGroup

- [#5458](https://github.com/primer/react/pull/5458) [`b763ecd`](https://github.com/primer/react/commit/b763ecd69c8f024feaaabdc31d8805dd50007736) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove CSS modules feature flag from Details

- [#5463](https://github.com/primer/react/pull/5463) [`b55025c`](https://github.com/primer/react/commit/b55025cf2bf7f349cecb856449508bf822507c6d) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove CSS modules feature flag from Radio

- [#5462](https://github.com/primer/react/pull/5462) [`8b8ec3c`](https://github.com/primer/react/commit/8b8ec3c64fce6f113b81f4169fe9460d1cef1967) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS module feature flag from Pagehead

### Patch Changes

- [#5488](https://github.com/primer/react/pull/5488) [`e352e19`](https://github.com/primer/react/commit/e352e192dae7ae7b24420f4afae08871536c0484) Thanks [@hectahertz](https://github.com/hectahertz)! - Pagination: Hides the `Pagination` Previous and Next buttons from the accessibility tree when they are disabled.

## 37.9.1

### Patch Changes

- [`8c1cff4`](https://github.com/primer/react/commit/8c1cff46f206b0c51feeb32ed1ab85c7db18acd1) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(ActionList): remove className from menuItemProps to prevent duplicate className bug

## 37.9.0

### Minor Changes

- [#5448](https://github.com/primer/react/pull/5448) [`00600f7`](https://github.com/primer/react/commit/00600f783e4ce807cd1e33f2bb183ced9cf66291) Thanks [@mperrotti](https://github.com/mperrotti)! - Corrects horizontal padding of `<Button>` when the button only contains an icon and a counter label (no button text label).

- [#5398](https://github.com/primer/react/pull/5398) [`215d8e6`](https://github.com/primer/react/commit/215d8e643629b918b581daddf9d1ce9beabac74e) Thanks [@langermank](https://github.com/langermank)! - Convert ActionList, ActionList sub components and NavList to CSS Modules

- [#5453](https://github.com/primer/react/pull/5453) [`b07f806`](https://github.com/primer/react/commit/b07f8063371073551741356f0523d7b8ae733322) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Convert Autocomplete to CSS modules behind feature flag

- [#5443](https://github.com/primer/react/pull/5443) [`f03ae58`](https://github.com/primer/react/commit/f03ae58b1546289096a725c357c735cb4c41bc91) Thanks [@jonrohan](https://github.com/jonrohan)! - Deprecate use of sx prop by deprecating the `SxProp` type definition

- [#5484](https://github.com/primer/react/pull/5484) [`efb1659`](https://github.com/primer/react/commit/efb16598f77eabc3afbbdf2ae12856b97317b81d) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Fix responsive width of PageLayout

- [#5456](https://github.com/primer/react/pull/5456) [`e990fdb`](https://github.com/primer/react/commit/e990fdbcb64c97c5808d6e1649d020a923956270) Thanks [@langermank](https://github.com/langermank)! - chore(deps): update @primer/octicons-react to 19.13.0

- [#5451](https://github.com/primer/react/pull/5451) [`59a1346`](https://github.com/primer/react/commit/59a1346b54581170b70ae60ad673eeec085c379f) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Convert Box usage in Autocomplete to CSS modules behind feature flag

- [#5435](https://github.com/primer/react/pull/5435) [`5cba52a`](https://github.com/primer/react/commit/5cba52a445c45b56b54163922fb59ba1059351ec) Thanks [@joshblack](https://github.com/joshblack)! - Update Table to use CSS Modules behind feature flag

### Patch Changes

- [#5123](https://github.com/primer/react/pull/5123) [`becad7d`](https://github.com/primer/react/commit/becad7dfa2522c1b211ebeeacba0d0cedc16dd85) Thanks [@langermank](https://github.com/langermank)! - Bug fix: ButtonGroup with Tooltip border-radius is incorrect

- [#5382](https://github.com/primer/react/pull/5382) [`83607df`](https://github.com/primer/react/commit/83607dfeff055b651eeeeb79bc9bb651def081a8) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Skeleton component css module feature flag to ga

- [#5441](https://github.com/primer/react/pull/5441) [`30e8c31`](https://github.com/primer/react/commit/30e8c31a9497a96e77fccbc8f33519dcfdf23abf) Thanks [@joshblack](https://github.com/joshblack)! - test: add check for story ids in generated docs

- [#5386](https://github.com/primer/react/pull/5386) [`177eadc`](https://github.com/primer/react/commit/177eadcfa217ed196bf97ad894fe483dd2d63edb) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Select component css module feature flag to ga

- [#5388](https://github.com/primer/react/pull/5388) [`e3856ba`](https://github.com/primer/react/commit/e3856ba959c8ec43b9bd19da1239a828524bcb82) Thanks [@jonrohan](https://github.com/jonrohan)! - Move TreeView component css module feature flag to staff

- [#5384](https://github.com/primer/react/pull/5384) [`eedbdbd`](https://github.com/primer/react/commit/eedbdbd6569e5faf18486dd8935f9af46ac17e31) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Stack component css module feature flag to ga

- [#5444](https://github.com/primer/react/pull/5444) [`8e481ca`](https://github.com/primer/react/commit/8e481cadd1fc45119f28428f97b75817179473d5) Thanks [@JelloBagel](https://github.com/JelloBagel)! - Fix Typography and Common props for BaseStyles when CSS modules feature flag is enabled

- [#5387](https://github.com/primer/react/pull/5387) [`e29c40c`](https://github.com/primer/react/commit/e29c40c31d0630873de5a03f501f5b1f86b511ef) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Breadcrumbs component css module feature flag to ga

- [#5380](https://github.com/primer/react/pull/5380) [`fcc041d`](https://github.com/primer/react/commit/fcc041dbcc8915eff7cd419269faaff8a408b180) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Header component css module feature flag to ga

- [#5476](https://github.com/primer/react/pull/5476) [`578a33d`](https://github.com/primer/react/commit/578a33d77e68695edd285cd03435d3190d025dfc) Thanks [@TylerJDev](https://github.com/TylerJDev)! - ActionBar: Fixes issue where `ActionBar` overflow menu would persist even if it was no longer needed; allows overflow menu to appear on initial render if there is no space for all items.

## 37.8.0

### Minor Changes

- [#5414](https://github.com/primer/react/pull/5414) [`d44a4cf`](https://github.com/primer/react/commit/d44a4cf2c7fcc9ab66568120a26e8223dede01ee) Thanks [@iansan5653](https://github.com/iansan5653)! - Add `onPrimary` `variant` to `KeybindingHint`

- [#5310](https://github.com/primer/react/pull/5310) [`13ce9a3`](https://github.com/primer/react/commit/13ce9a3f4bd8efdea2669ef9400528922688ea72) Thanks [@francinelucca](https://github.com/francinelucca)! - feat(Overlay): Convert Overlay to CSS modules behind team feature flag

- [#5413](https://github.com/primer/react/pull/5413) [`9f5a9ac`](https://github.com/primer/react/commit/9f5a9acc065326b7c56ff3868d2a72cad25ca0f7) Thanks [@JelloBagel](https://github.com/JelloBagel)! - Convert SideNav component to CSS Modules behind team feature flag

- [#5403](https://github.com/primer/react/pull/5403) [`877497c`](https://github.com/primer/react/commit/877497cabb7cd348328efa99d5c812d8f02601fb) Thanks [@JelloBagel](https://github.com/JelloBagel)! - Convert `Hidden` to CSS modules behind team feature flag

- [#5357](https://github.com/primer/react/pull/5357) [`161e3fd`](https://github.com/primer/react/commit/161e3fd7c7ee64f07853405980b35b44eae61c9f) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Convert UnderlinePanels to CSS modules behind feature flags

- [#5331](https://github.com/primer/react/pull/5331) [`e39dddb`](https://github.com/primer/react/commit/e39dddb32beea3e583aa1cf9f42ae8ba521dbaed) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Convert ConfirmationDialog to CSS modules behind feature flag

### Patch Changes

- [#5419](https://github.com/primer/react/pull/5419) [`73da985`](https://github.com/primer/react/commit/73da985f4303af60daf788c2dceba096ffc34cb0) Thanks [@jonrohan](https://github.com/jonrohan)! - bugfix(Stack): Fix typo in custom media variable used in Stack component

- [#5415](https://github.com/primer/react/pull/5415) [`67fc8f5`](https://github.com/primer/react/commit/67fc8f5cd5369d4a9dfcf1a04612fca8d49855bc) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Fix display bug for `PageHeader` component title.

- [#5378](https://github.com/primer/react/pull/5378) [`5a8138a`](https://github.com/primer/react/commit/5a8138ac6bad67d0b573f98713c2063160d4eae8) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Pagehead component css module feature flag to ga

- [#5416](https://github.com/primer/react/pull/5416) [`1dcc534`](https://github.com/primer/react/commit/1dcc534c01b94a7568b472176612d5b8ea262e8d) Thanks [@langermank](https://github.com/langermank)! - ActionList color bug fixes

- [#5381](https://github.com/primer/react/pull/5381) [`18692e5`](https://github.com/primer/react/commit/18692e58e2badc3e227da26712964f63594180bd) Thanks [@jonrohan](https://github.com/jonrohan)! - Move BranchName component css module feature flag to ga

- [#5350](https://github.com/primer/react/pull/5350) [`4bcf78b`](https://github.com/primer/react/commit/4bcf78b137bd12344b9cde6baac7802d067a13d8) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(TooltipV2): delay tooltip opening time by ms

- [#5434](https://github.com/primer/react/pull/5434) [`da7debd`](https://github.com/primer/react/commit/da7debd89e796353963da4b6a86e432c328411b4) Thanks [@francinelucca](https://github.com/francinelucca)! - Revert "refactor(FormControl): update to CSS Modules behind feature flag" & "refactor(Table): update to CSS Modules"

- [#5428](https://github.com/primer/react/pull/5428) [`d544f64`](https://github.com/primer/react/commit/d544f64afbaf77f64648da8d9aeb4b1e4d4e47e2) Thanks [@joshblack](https://github.com/joshblack)! - Update Pagination CSS syntax to help with parsing downstream

- [#5409](https://github.com/primer/react/pull/5409) [`d48afbc`](https://github.com/primer/react/commit/d48afbc5daae5a194e65f67a63698d2030aeb60a) Thanks [@langermank](https://github.com/langermank)! - Fix `border-color` on ActionList Group header

- [#5411](https://github.com/primer/react/pull/5411) [`74d3de4`](https://github.com/primer/react/commit/74d3de44f140949c63b335d130708e1895176fa5) Thanks [@langermank](https://github.com/langermank)! - Remove `min-width` on leading visuals in ActionList

- [#5432](https://github.com/primer/react/pull/5432) [`60a2f47`](https://github.com/primer/react/commit/60a2f471c9b6bdbaecc3972d1c02a738dd99daa5) Thanks [@langermank](https://github.com/langermank)! - Add `headingWrapElement` prop to `ActionList.GroupHeading` to support `div` or `li` elements for proper list markup

## 37.7.2

### Patch Changes

- [`f2d188f`](https://github.com/primer/react/commit/f2d188f24c7c0a5697956b97a98431eb8d087f1f) Thanks [@TylerDixon](https://github.com/TylerDixon)! - Add className back to TokenBase

## 37.7.1

### Patch Changes

- [#5412](https://github.com/primer/react/pull/5412) [`7d195fc`](https://github.com/primer/react/commit/7d195fc7c60e5d480e28e71928ce72e152703a48) Thanks [@jonrohan](https://github.com/jonrohan)! - Revert changes to ButtonGroup component

## 37.7.0

### Minor Changes

- [#5324](https://github.com/primer/react/pull/5324) [`bd5f0d4`](https://github.com/primer/react/commit/bd5f0d4cd78d2fb557f2a7bb3ba7157d5ca5c3b9) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Convert SelectPanel to CSS modules behind feature flag

- [#5336](https://github.com/primer/react/pull/5336) [`59a6654`](https://github.com/primer/react/commit/59a6654b34430d4469e94c5b56881558e599bccd) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Convert SegmentedControl to use CSS modules behind feature flag

- [#5339](https://github.com/primer/react/pull/5339) [`dc2f083`](https://github.com/primer/react/commit/dc2f083eb3c07a4bcb9adcf9d2e8395d4daef1a9) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from ButtonGroup

- [#5332](https://github.com/primer/react/pull/5332) [`3fcfba8`](https://github.com/primer/react/commit/3fcfba8a2c85a4d4f58eb66f7567b96adfcb2f20) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Convert PageHeader to CSS modules behind feature flag

- [#5326](https://github.com/primer/react/pull/5326) [`1d79cc5`](https://github.com/primer/react/commit/1d79cc5c2ee19b0d957e68d783ac644728fae6ba) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Convert KeybindingHint to CSS modules behind feature flag

- [#5361](https://github.com/primer/react/pull/5361) [`2fbdd3b`](https://github.com/primer/react/commit/2fbdd3b9c6a4acb3b3356191c79a7d38fdd4163f) Thanks [@JelloBagel](https://github.com/JelloBagel)! - Convert BaseStyles to CSS modules behind team feature flag

- [#5299](https://github.com/primer/react/pull/5299) [`8673664`](https://github.com/primer/react/commit/867366474d67360d74b771ffbf5b58789535dad2) Thanks [@jonrohan](https://github.com/jonrohan)! - Update `AvatarStack` component to use CSS modules behind the feature flag primer_react_css_modules_team

- [#5376](https://github.com/primer/react/pull/5376) [`167c8d4`](https://github.com/primer/react/commit/167c8d493fdf75227b4a8987323ca9a555d3799a) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - fix(useFormControlForwardedProps): do not pass through validationStatus

- [#5337](https://github.com/primer/react/pull/5337) [`7d9bb0c`](https://github.com/primer/react/commit/7d9bb0cad33fc4bcb1121f3437466924190952de) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from Checkbox

- [#5282](https://github.com/primer/react/pull/5282) [`d6fe52e`](https://github.com/primer/react/commit/d6fe52e69edb123ee67321c818d94bf00082fae9) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from Banner

- [#5367](https://github.com/primer/react/pull/5367) [`844e41f`](https://github.com/primer/react/commit/844e41f440d933b9a55d245bef6ff4ff3b7de325) Thanks [@langermank](https://github.com/langermank)! - Convert ActionList.Heading to CSS Modules

- [#5302](https://github.com/primer/react/pull/5302) [`82bf850`](https://github.com/primer/react/commit/82bf85030b8f728b8a7845b0a523cff1b0704e05) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Convert `Pagination` component to use CSS modules

- [#5271](https://github.com/primer/react/pull/5271) [`05db651`](https://github.com/primer/react/commit/05db651698af5a713cf0a5624016a2f86ab13a90) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Update `Token`, `IssueLabelToken`, `AvatarToken` components to use CSS Modules

- [#5342](https://github.com/primer/react/pull/5342) [`39df71e`](https://github.com/primer/react/commit/39df71e0c8724de6d26dcb35b8eb1bc85b36281e) Thanks [@joshblack](https://github.com/joshblack)! - Update FormControl sub-components to use new styled components format for migration

- [#5338](https://github.com/primer/react/pull/5338) [`4c7056b`](https://github.com/primer/react/commit/4c7056bd979b605691d07fcb35cd2d8bd1780964) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from Checkbox

- [#5222](https://github.com/primer/react/pull/5222) [`b5ff840`](https://github.com/primer/react/commit/b5ff84017842987388baae8e7950b8faf49bcfd4) Thanks [@jonrohan](https://github.com/jonrohan)! - feat(ButtonBase): Remove css modules feature flag from ButtonBase

- [#5375](https://github.com/primer/react/pull/5375) [`ba0a6c0`](https://github.com/primer/react/commit/ba0a6c0446882bf2087f7c7e42576aa4a0a2cbab) Thanks [@langermank](https://github.com/langermank)! - Convert ActionList (wrapper) and ActionList.Divider to CSS Modules

### Patch Changes

- [#5343](https://github.com/primer/react/pull/5343) [`70005b8`](https://github.com/primer/react/commit/70005b8043ed8845ccc8d675f9bf4735a5da94c8) Thanks [@jonrohan](https://github.com/jonrohan)! - BugFix: Fix issue in ButtonGroup Overlay screenshots by updating the selector to use `:is(button, a)` and `:first-of-type` and `:last-of-type` pseudo-classes.

- [#5402](https://github.com/primer/react/pull/5402) [`6978865`](https://github.com/primer/react/commit/6978865ab17cb31412a84180485fa3dab1da168d) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(PageHeader): use display block insteaf of flex when FF off

- [#5383](https://github.com/primer/react/pull/5383) [`efc5c47`](https://github.com/primer/react/commit/efc5c47a8eda691ded260b2cbc1247683c36fba1) Thanks [@jonrohan](https://github.com/jonrohan)! - Move VisuallyHidden component css module feature flag to ga

- [#5394](https://github.com/primer/react/pull/5394) [`1a51288`](https://github.com/primer/react/commit/1a51288ee2d759a16c69f98823d227a9db9fe5d9) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Dialog component css module feature flag to staff

- [#5397](https://github.com/primer/react/pull/5397) [`3dd1e5e`](https://github.com/primer/react/commit/3dd1e5e14c1721ee1332c48a1f8e1ec1802c7098) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Textarea component css module feature flag to staff

- [#5358](https://github.com/primer/react/pull/5358) [`b08f770`](https://github.com/primer/react/commit/b08f7705eb56e5190279c45d8da45d99d353c2f1) Thanks [@langermank](https://github.com/langermank)! - ActionList UI bug fixes

- [#5363](https://github.com/primer/react/pull/5363) [`3e0fc7c`](https://github.com/primer/react/commit/3e0fc7c883e80ce12652883b0d7e2fc728abba55) Thanks [@joshblack](https://github.com/joshblack)! - Update line-height value for Table to be a valid calc() expression

- [#5377](https://github.com/primer/react/pull/5377) [`6bf3e9e`](https://github.com/primer/react/commit/6bf3e9efbc14edbdfc844b6edf9c6299d5b29895) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Radio component css module feature flag to ga

- [#5345](https://github.com/primer/react/pull/5345) [`e231b5f`](https://github.com/primer/react/commit/e231b5f1f70d789fa65f28e768f8675ba2d8cad5) Thanks [@francinelucca](https://github.com/francinelucca)! - docs: fix \*.docs.json story ids

- [#5379](https://github.com/primer/react/pull/5379) [`2ced9a3`](https://github.com/primer/react/commit/2ced9a363d5998992719a43c5c79b9a2f52243bc) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Details component css module feature flag to ga

- [#5385](https://github.com/primer/react/pull/5385) [`2afdd5d`](https://github.com/primer/react/commit/2afdd5dc69d98e5e1ffe1504ad144cb755f70bde) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Spinner component css module feature flag to ga

- [#5391](https://github.com/primer/react/pull/5391) [`f0a530b`](https://github.com/primer/react/commit/f0a530b31b45840c3690ae80a2390e9b628d8e53) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Popover component css module feature flag to staff

- [#5396](https://github.com/primer/react/pull/5396) [`64bb31b`](https://github.com/primer/react/commit/64bb31bf9067a351619d245e3b7bab7a8abfef1a) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Textarea component css module feature flag to staff

- [#5389](https://github.com/primer/react/pull/5389) [`2129f9d`](https://github.com/primer/react/commit/2129f9db86f936f7e863ead00a5373663fb7ad44) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Timeline component css module feature flag to staff

- [#5395](https://github.com/primer/react/pull/5395) [`a90da75`](https://github.com/primer/react/commit/a90da75c552677f62cb6d2e4629b76fcd9d5d59e) Thanks [@jonrohan](https://github.com/jonrohan)! - Move DialogV1 component css module feature flag to staff

- [#5390](https://github.com/primer/react/pull/5390) [`20957b4`](https://github.com/primer/react/commit/20957b48bce649bfa8fa0f403fe4a3ecb58ad4dc) Thanks [@jonrohan](https://github.com/jonrohan)! - Move ProgressBar component css module feature flag to staff

- [#5392](https://github.com/primer/react/pull/5392) [`184e292`](https://github.com/primer/react/commit/184e2920d8377a5b60be0664370a74961e767827) Thanks [@jonrohan](https://github.com/jonrohan)! - Move CheckboxOrRadioGroup component css module feature flag to staff

- [#5393](https://github.com/primer/react/pull/5393) [`eec92da`](https://github.com/primer/react/commit/eec92dac3c77cdbf36b0f239dd8a5cb4c32b1901) Thanks [@jonrohan](https://github.com/jonrohan)! - Move UnstyledTextInput component css module feature flag to staff

## 37.6.0

### Minor Changes

- [#5325](https://github.com/primer/react/pull/5325) [`cdc4da1`](https://github.com/primer/react/commit/cdc4da128895f4f63a526748fd4df63c9f27d055) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Convert SelectPanel2 to CSS modules

- [#5252](https://github.com/primer/react/pull/5252) [`bb0cd90`](https://github.com/primer/react/commit/bb0cd90cab27012ad8bcb33a23f67951d6e213b4) Thanks [@iansan5653](https://github.com/iansan5653)! - Adds `keybindingHint` prop to `TooltipV2` and `IconButton`, updates `onEmphasis` design variant for `KeybindingHint`, and adds `size` prop with `small` option to `KeybindingHint`.

- [#5294](https://github.com/primer/react/pull/5294) [`912a0d7`](https://github.com/primer/react/commit/912a0d7102cb65d2b9c31a68a244795586d1ee3b) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Update `Textarea` component to use CSS module

- [#5227](https://github.com/primer/react/pull/5227) [`1cfbf63`](https://github.com/primer/react/commit/1cfbf633c6ccc01595a19b2e1d8714d59e56a007) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Convert TextInput to CSS module behind feature flag

- [#5150](https://github.com/primer/react/pull/5150) [`e89edbc`](https://github.com/primer/react/commit/e89edbc6c8892e324eeb1af381a70f2ac0e75a3c) Thanks [@jonrohan](https://github.com/jonrohan)! - Convert Breadcrumbs to css module behind feature flag

- [#5298](https://github.com/primer/react/pull/5298) [`3935811`](https://github.com/primer/react/commit/393581160180ccb87da126e441439748909f138d) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Convert Dialog v2 to CSS Modules behind feature flag

- [#5267](https://github.com/primer/react/pull/5267) [`ffc8f91`](https://github.com/primer/react/commit/ffc8f91e9c96033abad523cb4440a144ace30db9) Thanks [@ktravers](https://github.com/ktravers)! - Update `TreeView` component to use CSS Modules

- [#5320](https://github.com/primer/react/pull/5320) [`e9e4d1c`](https://github.com/primer/react/commit/e9e4d1c2781f6d45a3a001f89b352abb1a265c26) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Add forward ref to Popover

- [#5306](https://github.com/primer/react/pull/5306) [`84c3e62`](https://github.com/primer/react/commit/84c3e62b317e5cd3d65ef31c11ccc3071f373b35) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Convert PageLayout to CSS modules behind feature flags

- [#5319](https://github.com/primer/react/pull/5319) [`37c4e97`](https://github.com/primer/react/commit/37c4e9731af622be2b19fed82a1c9235517b918e) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Do not pass through hoverColor prop into DOM element

- [#5257](https://github.com/primer/react/pull/5257) [`4aa40c9`](https://github.com/primer/react/commit/4aa40c9acd90f432c505abba6ca9213dbd971f5c) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Convert TextInput to use data attributes

- [#5329](https://github.com/primer/react/pull/5329) [`e7547e8`](https://github.com/primer/react/commit/e7547e8304fa2a6ea06d0f12a9a3ecd8cbdc429b) Thanks [@francinelucca](https://github.com/francinelucca)! - Update `Timeline` component to use CSS modules behind the feature flag primer_react_css_modules_team

- [#5304](https://github.com/primer/react/pull/5304) [`a3fc488`](https://github.com/primer/react/commit/a3fc4881b8e3916a054900fa2a2b252056350bc9) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Convert ProgressBar to CSS modules behind feature flag

- [#5276](https://github.com/primer/react/pull/5276) [`d91dc54`](https://github.com/primer/react/commit/d91dc541ece37c4a9681ded10b220f511aa34b2f) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Migrate TextInputAction & TextInputInnerVisualSlot to CSS Modules behind feature flag

- [#5300](https://github.com/primer/react/pull/5300) [`65802fc`](https://github.com/primer/react/commit/65802fcbe2e882a53fef85a4b0efb6c326012ad6) Thanks [@francinelucca](https://github.com/francinelucca)! - Update `Popover` component to use CSS modules behind the feature flag primer_react_css_modules_team

### Patch Changes

- [#5285](https://github.com/primer/react/pull/5285) [`057d868`](https://github.com/primer/react/commit/057d868d657e88aeba6eea930bd4fdd50027f62c) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Select component from team to staff flag

- [#5279](https://github.com/primer/react/pull/5279) [`aac10fa`](https://github.com/primer/react/commit/aac10fa1c134444791a01fe7c71d508f94ab5ca5) Thanks [@jonrohan](https://github.com/jonrohan)! - Move CounterLabel CSS module feature flag from staff to ga

- [#5286](https://github.com/primer/react/pull/5286) [`d4cb322`](https://github.com/primer/react/commit/d4cb322ef030bb4bbf379a4a962fc39659779297) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Spinner component from team to staff flag

- [#5288](https://github.com/primer/react/pull/5288) [`9d004d0`](https://github.com/primer/react/commit/9d004d037bbd740d30424e919383ba32a5f04eda) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Radio component from team to staff flag

- [#5291](https://github.com/primer/react/pull/5291) [`8fd0035`](https://github.com/primer/react/commit/8fd003505d91a92c1ea9dc73c4b4efd926c2b6c0) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Pagehead component from team to staff flag

- [#5190](https://github.com/primer/react/pull/5190) [`32c4fe1`](https://github.com/primer/react/commit/32c4fe1441e2f0d4f71ba5c6c75fe0c654908063) Thanks [@mperrotti](https://github.com/mperrotti)! - Changes `<label>` wrapper of `FormControl` to put padding directly on the `label` so the entire row is clickable

- [#5290](https://github.com/primer/react/pull/5290) [`7c94916`](https://github.com/primer/react/commit/7c9491628a2905c806a4d2758152f93331755ffc) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Details component from team to staff flag

- [#5284](https://github.com/primer/react/pull/5284) [`8853f5f`](https://github.com/primer/react/commit/8853f5f9daa6e4f4c284d432e7ce6747709afc27) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Header component from team to staff flag

- [#5275](https://github.com/primer/react/pull/5275) [`d1b7bce`](https://github.com/primer/react/commit/d1b7bceb9ca9211a1d12dbf83c973ddbe7cde973) Thanks [@jonrohan](https://github.com/jonrohan)! - Convert CheckBoxOrRadioGroup to CSS modules behind feature flag

- [#5287](https://github.com/primer/react/pull/5287) [`41ae5aa`](https://github.com/primer/react/commit/41ae5aa7b38707072310354d89721b677bfa4d23) Thanks [@jonrohan](https://github.com/jonrohan)! - Move BranchName component from team to staff flag

- [#5289](https://github.com/primer/react/pull/5289) [`cc876d9`](https://github.com/primer/react/commit/cc876d9ecbf7f4e2d1a7af94605c6be2d7b6fe45) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Skeleton component from team to staff flag

- [#5281](https://github.com/primer/react/pull/5281) [`b8e138e`](https://github.com/primer/react/commit/b8e138e76721003240cf813257e717d607cbb467) Thanks [@jonrohan](https://github.com/jonrohan)! - chore(ButtonGroup): Move ButtonGroup CSS module feature flag from staff to ga

- [#5333](https://github.com/primer/react/pull/5333) [`f0603fd`](https://github.com/primer/react/commit/f0603fd763327e47b862fa94f56a074eede6298b) Thanks [@mperrotti](https://github.com/mperrotti)! - - Makes {Checkbox|Radio}Group `<legend>` bold and default font size

  - Makes Checkbox and Radio `<label>` default font weight

- [#5209](https://github.com/primer/react/pull/5209) [`556afbd`](https://github.com/primer/react/commit/556afbda728ef34a278f786f11cce6c459817178) Thanks [@dusave](https://github.com/dusave)! - Check certain refs for nullishness to address HMR issues in dotcom

## 37.5.0

### Minor Changes

- [#5253](https://github.com/primer/react/pull/5253) [`729c0fa`](https://github.com/primer/react/commit/729c0fac9a8d84f20bb77c046063837b38e90d37) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Deprecate width, minWidth and maxWidth props from TextInput

- [#5169](https://github.com/primer/react/pull/5169) [`a2efba0`](https://github.com/primer/react/commit/a2efba0079304e25dd700523dbfa35fab56249ad) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(ActionList): do not truncate description by default

- [#5254](https://github.com/primer/react/pull/5254) [`ac6ddcd`](https://github.com/primer/react/commit/ac6ddcd4b15526dd6f5ad6072a4daa57087eb1e7) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Convert UnstyledTextInput to use CSS Modules behing feature flag

- [#5246](https://github.com/primer/react/pull/5246) [`c4ecb73`](https://github.com/primer/react/commit/c4ecb7312c1f595361a6b5a247c73af894c0be54) Thanks [@keithamus](https://github.com/keithamus)! - Migrate DialogV1 to CSS Modules

### Patch Changes

- [#5277](https://github.com/primer/react/pull/5277) [`a9088e6`](https://github.com/primer/react/commit/a9088e60b6f60ee13e309b7c263def781caba97e) Thanks [@langermank](https://github.com/langermank)! - Fix `TreeViewItem` folder icon color in legacy fallback theme + update VRT

- [#4745](https://github.com/primer/react/pull/4745) [`3f508c7`](https://github.com/primer/react/commit/3f508c7778839a8bfd659adcb21a1eda558e0f0a) Thanks [@cihad](https://github.com/cihad)! - UnderlineNav: Display loading counters only for items with the "counter" prop.

- [#5283](https://github.com/primer/react/pull/5283) [`d6ea909`](https://github.com/primer/react/commit/d6ea909eb3ef8c2ae178ee590865b80108fa3390) Thanks [@jonrohan](https://github.com/jonrohan)! - Move VisuallyHidden component from team to staff flag

- [#5292](https://github.com/primer/react/pull/5292) [`d3959f3`](https://github.com/primer/react/commit/d3959f3685bcf8aff908efe69cbf80c92c85483c) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Stack component from team to staff flag

- [#5280](https://github.com/primer/react/pull/5280) [`973130e`](https://github.com/primer/react/commit/973130e9119e1f592345d3e67c1b61f37957191b) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Checkbox CSS module feature flag from staff to ga

## 37.4.0

### Minor Changes

- [#5221](https://github.com/primer/react/pull/5221) [`11c455c`](https://github.com/primer/react/commit/11c455c1592e2d5919fed2cfbe09b2c1917124ed) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from Avatar

- [#5243](https://github.com/primer/react/pull/5243) [`bc9c696`](https://github.com/primer/react/commit/bc9c696320d83c9d871ac49978e213a9c5cb39d2) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Fix small TextInput to be the use the correct font size

- [#5228](https://github.com/primer/react/pull/5228) [`2da7336`](https://github.com/primer/react/commit/2da7336c6568fd7337b654e54503549715b57e44) Thanks [@jonrohan](https://github.com/jonrohan)! - feat(Tooltip): Convert Tooltip to CSS modules behind team flag

- [#5122](https://github.com/primer/react/pull/5122) [`e021a8f`](https://github.com/primer/react/commit/e021a8f6f1a85e5f70b069674e02c40f56f674d7) Thanks [@TylerJDev](https://github.com/TylerJDev)! - TreeView: Adds prop `truncate`, keeps default behavior of truncation but allows for text to wrap when turned off.

- [#5210](https://github.com/primer/react/pull/5210) [`b1950f5`](https://github.com/primer/react/commit/b1950f572954f504d91c49cc16220be91ecfc38e) Thanks [@francinelucca](https://github.com/francinelucca)! - feat(AnchoredOverlay): allow overlay to reflow

### Patch Changes

- [#5236](https://github.com/primer/react/pull/5236) [`2e5c601`](https://github.com/primer/react/commit/2e5c601b8793c2f15604258b4f66371ea791cac7) Thanks [@jonrohan](https://github.com/jonrohan)! - Update Spinner component to correctly use the `size` prop when both `sx` and `size` are provided

- [#5200](https://github.com/primer/react/pull/5200) [`b28e6b2`](https://github.com/primer/react/commit/b28e6b2ca37cd7138dd7ff5c52594dd2c1a584f8) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(ButtonGroup): add toolbar interactions for role toolbar

## 37.3.0

### Minor Changes

- [#5204](https://github.com/primer/react/pull/5204) [`209c9b0`](https://github.com/primer/react/commit/209c9b0f92a7e1006db8e5752ace247168268340) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Migrate 'InlineMessage' component to use CSS modules

### Patch Changes

- [#5229](https://github.com/primer/react/pull/5229) [`33c5086`](https://github.com/primer/react/commit/33c5086f24cb42a1b2bf7447021520467cb54af6) Thanks [@joshblack](https://github.com/joshblack)! - Update Blankslate description text to always be centered

- [#4693](https://github.com/primer/react/pull/4693) [`570d4b3`](https://github.com/primer/react/commit/570d4b3f3e14f58c134a1716cec6b8bbe79e4f48) Thanks [@renbaoshuo](https://github.com/renbaoshuo)! - fix: hover background in ActionList.Item

- [#5196](https://github.com/primer/react/pull/5196) [`49cbff2`](https://github.com/primer/react/commit/49cbff223459b3805dc6160c771529b7752a9042) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(Treevieew):do not add aria-describedby attribute when empty leading/trailing visual

- [#5144](https://github.com/primer/react/pull/5144) [`271d063`](https://github.com/primer/react/commit/271d063813f3e623bcced3bf949e5c31ba0e3fd9) Thanks [@jonrohan](https://github.com/jonrohan)! - Move ButtonGroup css module feature flag to staff

## 37.2.0

### Minor Changes

- [#5168](https://github.com/primer/react/pull/5168) [`b9749d4`](https://github.com/primer/react/commit/b9749d4efccf17b4aa669231a57df55333497ca2) Thanks [@TylerJDev](https://github.com/TylerJDev)! - TreeView: Adds indication of no nodes in a tree item, allows for `aria-expanded even if the item is empty.

- [#5202](https://github.com/primer/react/pull/5202) [`293c574`](https://github.com/primer/react/commit/293c574a25d49bb52a2f5c17e4c54b1b1b598ddc) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Update `SubNav` component to use CSS modules behind the feature flag primer_react_css_modules_team

### Patch Changes

- [#5225](https://github.com/primer/react/pull/5225) [`e732591`](https://github.com/primer/react/commit/e732591e939e5a86dc5ce2ce2da25388177b6a54) Thanks [@jonrohan](https://github.com/jonrohan)! - chore(Banner): Move Banner CSS module flag from staff to ga

- [#5177](https://github.com/primer/react/pull/5177) [`26b54d8`](https://github.com/primer/react/commit/26b54d8a58e83e50127b5c04ac26ec953a89c108) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - Allow primitives dep to be if version 9 OR 10

## 37.1.0

### Minor Changes

- [#5156](https://github.com/primer/react/pull/5156) [`8e58e4d`](https://github.com/primer/react/commit/8e58e4d1fc8a6ec9e9329b152f3d43d15d6dd5d5) Thanks [@francinelucca](https://github.com/francinelucca)! - feat(LabelGroup): render as list by default

- [#5167](https://github.com/primer/react/pull/5167) [`07b75e7`](https://github.com/primer/react/commit/07b75e78f6842713fff12dad1e7a0502596e30bf) Thanks [@jonrohan](https://github.com/jonrohan)! - Convert Details to css module behind feature flag

- [#5195](https://github.com/primer/react/pull/5195) [`d349cfc`](https://github.com/primer/react/commit/d349cfcb3fca9982040a1389c0fabcaafca5b85e) Thanks [@jonrohan](https://github.com/jonrohan)! - \* Convert SkeletonAvatar to CSS modules behind the feature flag

  - Convert SkeletonBox to CSS modules behind the feature flag
  - Convert SkeletonText to CSS modules behind the feature flag

- [#5187](https://github.com/primer/react/pull/5187) [`2ab7b9e`](https://github.com/primer/react/commit/2ab7b9e649cc2f6a1c290bdbfcf48d3e635d998f) Thanks [@jonrohan](https://github.com/jonrohan)! - Convert Radio to css modules behind feature flag

- [#5129](https://github.com/primer/react/pull/5129) [`e27decd`](https://github.com/primer/react/commit/e27decdae5fcff3b25c9c58194709abbf4de85f8) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Overlay: Adds `min-width` to container to improve responsiveness

- [#5040](https://github.com/primer/react/pull/5040) [`8d9a357`](https://github.com/primer/react/commit/8d9a357db49dbf1f00e19c7aa489bd963a0d3dd5) Thanks [@joshblack](https://github.com/joshblack)! - Update BranchName to use CSS Modules behind feature flag

- [#5188](https://github.com/primer/react/pull/5188) [`573ae51`](https://github.com/primer/react/commit/573ae5168879998946ba1aa3e21af8ddf54351af) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Migrated `Spinner` component to use support CSS modules

- [#5193](https://github.com/primer/react/pull/5193) [`ed3d8c1`](https://github.com/primer/react/commit/ed3d8c1d0825502293b7a772a26e2e3865c9c162) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Migrated `VisuallyHidden` to CSS Modules

- [#4878](https://github.com/primer/react/pull/4878) [`73312d8`](https://github.com/primer/react/commit/73312d8ceb98ae84c0291f05b0b30f7f06975d3c) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Move `aria-*` attributes to `ProgressBar.Item` and marks `ProgressBar.Item` as `role="progressbar".

- [#5194](https://github.com/primer/react/pull/5194) [`719def7`](https://github.com/primer/react/commit/719def7ea83f5212dc6ba888fe22d29b6620ce37) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Migrate `Select` component to css modules

- [#5192](https://github.com/primer/react/pull/5192) [`cbeed21`](https://github.com/primer/react/commit/cbeed2111c02c6e4457228acdb7d83f11e866197) Thanks [@hussam-i-am](https://github.com/hussam-i-am)! - Update `Header` component to use CSS modules behind the feature flag primer_react_css_modules_team

- [#5015](https://github.com/primer/react/pull/5015) [`1473c26`](https://github.com/primer/react/commit/1473c26abb37b2de2af5f4ff848107971ee557c7) Thanks [@francinelucca](https://github.com/francinelucca)! - feat(Details): Add summary subcomponent

- [#5197](https://github.com/primer/react/pull/5197) [`ad84d4f`](https://github.com/primer/react/commit/ad84d4f494cb424b307ed3fa7eb77aec21c2ad40) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Convert `Pagehead` to CSS Modules

- [#5134](https://github.com/primer/react/pull/5134) [`6713e72`](https://github.com/primer/react/commit/6713e72124f4b9e594b31d5abc7dda258940c9cc) Thanks [@TylerJDev](https://github.com/TylerJDev)! - AvatarStack: Adds keyboard support to `AvatarStack`

- [#5060](https://github.com/primer/react/pull/5060) [`33396ea`](https://github.com/primer/react/commit/33396ead24bb25dc042004cd82bbdbe235403c61) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove CSS modules feature flag from Label component

- [#5185](https://github.com/primer/react/pull/5185) [`461ae57`](https://github.com/primer/react/commit/461ae57b4efd1053449643fe4dbd8c18ff86ddd0) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - SelectPanel: Allow using SelectPanel in FormControl

- [#5148](https://github.com/primer/react/pull/5148) [`002be35`](https://github.com/primer/react/commit/002be358676c2a882893dfbe518e1eafbd38db55) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from the Link component

- [#5106](https://github.com/primer/react/pull/5106) [`851c857`](https://github.com/primer/react/commit/851c857f1a69541b6b8b77dac714f2de51419936) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds NavList.GroupHeading component that can be used instead of the ActionList.Group 'title' prop if you need to render something besides a string

### Patch Changes

- [#5213](https://github.com/primer/react/pull/5213) [`a5d7fe3`](https://github.com/primer/react/commit/a5d7fe34a20c9eeffe879e10b4f0165b8f1a6da8) Thanks [@langermank](https://github.com/langermank)! - Bug fix: `ButtonBase` sx base styles leaking into CSS modules feat flag

- [#5214](https://github.com/primer/react/pull/5214) [`916ed95`](https://github.com/primer/react/commit/916ed952d38502b72640dcb07dac69005cb176e3) Thanks [@jonrohan](https://github.com/jonrohan)! - Convert Stack to CSS modules behind feature flag

- [#5146](https://github.com/primer/react/pull/5146) [`ad554da`](https://github.com/primer/react/commit/ad554da1ed3907e5764f68190c0a3dd1cf7529b7) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Checkbox css module feature flag to staff

- [#5171](https://github.com/primer/react/pull/5171) [`8138dee`](https://github.com/primer/react/commit/8138dee8d8235475ec8135591c52abf3df90d50b) Thanks [@alondahari](https://github.com/alondahari)! - catch TooltipV2 errors in old browsers as a temp fix for unnecessary Sentry reports

- [#5140](https://github.com/primer/react/pull/5140) [`73796d3`](https://github.com/primer/react/commit/73796d3b249ade8b69adb5aa720432d77a433103) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(SegmentedControl): set global focus styles

- [#5201](https://github.com/primer/react/pull/5201) [`29a9770`](https://github.com/primer/react/commit/29a9770ead42b01026e8277f6c30d18d2ccaaf84) Thanks [@joshblack](https://github.com/joshblack)! - Update the foreground color for FormControl.Caption to use the control tokens when disabled

- [#5182](https://github.com/primer/react/pull/5182) [`31d9a05`](https://github.com/primer/react/commit/31d9a0587eb76f8d786404881b1727213c55fdbc) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(DataTable): export datatable utility types

- [#5027](https://github.com/primer/react/pull/5027) [`9a30c63`](https://github.com/primer/react/commit/9a30c63dc8e0c2923952f7ffea831446d0ed6122) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(FormControl): allow required check boxes in CheckboxGroup

- [#5147](https://github.com/primer/react/pull/5147) [`e421f32`](https://github.com/primer/react/commit/e421f32002ad07582d0221862f7afb6e8afbbc51) Thanks [@jonrohan](https://github.com/jonrohan)! - Move CounterLabel css modules feature flag to staff

## 37.0.1

### Patch Changes

- [#5162](https://github.com/primer/react/pull/5162) [`a5feea7`](https://github.com/primer/react/commit/a5feea7e8425a9f32fd23eb69aaad8126b8e0216) Thanks [@joshblack](https://github.com/joshblack)! - Update generated docs for draft components to use experimental instead

## 37.0.0

### Major Changes

- [#4953](https://github.com/primer/react/pull/4953) [`04e8c9c`](https://github.com/primer/react/commit/04e8c9c4daf6b2e39f0a13f16e4f2f3399902347) Thanks [@iansan5653](https://github.com/iansan5653)! - Delete deprecated draft components `MarkdownEditor`, `MarkdownInput`, and `InlineAutocomplete`

- [#4800](https://github.com/primer/react/pull/4800) [`482b4d6`](https://github.com/primer/react/commit/482b4d6ab815350d5f5b71d686bf76cb3d234686) Thanks [@joshblack](https://github.com/joshblack)! - Update Primer React to emit _.css files that are imported by emitted _.js files for styling

- [#4992](https://github.com/primer/react/pull/4992) [`d1d911a`](https://github.com/primer/react/commit/d1d911ad739f4f766234e99afca4ced0ad966da2) Thanks [@joshblack](https://github.com/joshblack)! - Move Octicon, Pagehead, Dialog (v1), and Tooltip (v1) to `@primer/react/deprecated`

- [#4783](https://github.com/primer/react/pull/4783) [`7c57f40`](https://github.com/primer/react/commit/7c57f40d55ba2f10c6255e5273d5ae8021a919e5) Thanks [@joshblack](https://github.com/joshblack)! - Remove the SSRProvider component and useSSRSafeId hook

- [#5075](https://github.com/primer/react/pull/5075) [`de7dbde`](https://github.com/primer/react/commit/de7dbde21cb7dcbf2d3cee588d751f2f2a7a70a9) Thanks [@joshblack](https://github.com/joshblack)! - Remove wildcard exports from `@primer/react`

- [#4784](https://github.com/primer/react/pull/4784) [`b518005`](https://github.com/primer/react/commit/b51800530e84520057b7517044ca611b409eaa57) Thanks [@joshblack](https://github.com/joshblack)! - Remove temporary folders for TypeScript resolution of sub-paths

- [#4785](https://github.com/primer/react/pull/4785) [`b74c47f`](https://github.com/primer/react/commit/b74c47f37628f67960343cec083dd60cd1ebc817) Thanks [@joshblack](https://github.com/joshblack)! - The drafts entrypoint has been removed from @primer/react. Use
  @primer/react/experimental instead.

- [#4940](https://github.com/primer/react/pull/4940) [`4d3b504`](https://github.com/primer/react/commit/4d3b50421f0823b3509a048987b15c59cb827176) Thanks [@langermank](https://github.com/langermank)! - Refactor ButtonBase component to use CSS modules behine flag

- [#4781](https://github.com/primer/react/pull/4781) [`2d7307a`](https://github.com/primer/react/commit/2d7307ae575e0a5e17e602bab860e538e2bc148a) Thanks [@joshblack](https://github.com/joshblack)! - Remove the deprecated FilterList component from Primer React

- [#4807](https://github.com/primer/react/pull/4807) [`055c9a7`](https://github.com/primer/react/commit/055c9a7150ac2761ee82998a45448d04129f781b) Thanks [@langermank](https://github.com/langermank)! - Remove deprecated `Button` component

### Minor Changes

- [#5097](https://github.com/primer/react/pull/5097) [`2a3c473`](https://github.com/primer/react/commit/2a3c473db4ee5e76903a82c150e09ad75868b15d) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Added className prop to the AvatarStack component

- [#5113](https://github.com/primer/react/pull/5113) [`c28378e`](https://github.com/primer/react/commit/c28378eeca2658e23c84ed7047bb300be2ed9ce0) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Add `className` prop to `FormControl.Label` component

- [#4814](https://github.com/primer/react/pull/4814) [`1cda89c`](https://github.com/primer/react/commit/1cda89c2d92719e0fa85e3945a53bd5bd6b301de) Thanks [@langermank](https://github.com/langermank)! - Add `link` variant to Button

- [#4965](https://github.com/primer/react/pull/4965) [`5426a9a`](https://github.com/primer/react/commit/5426a9a0b46d4f0a93bba985e248f8b1f775b6e7) Thanks [@joshblack](https://github.com/joshblack)! - Update CounterLabel to use CSS Modules behind feature flag

- [#5064](https://github.com/primer/react/pull/5064) [`29f33ce`](https://github.com/primer/react/commit/29f33ce93c6b7e573cca9f2c0a10bb12ec5245c3) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltip: Do not export all types publicly in the experimental bundle

- [#4956](https://github.com/primer/react/pull/4956) [`15cb90f`](https://github.com/primer/react/commit/15cb90fde3e59f41475b19daef0851a969885248) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(PageHeader): add role prop and aria-label in top-level element

- [#4939](https://github.com/primer/react/pull/4939) [`9936add`](https://github.com/primer/react/commit/9936add13e5dd9e2a46103ef88c030a6ef330e6f) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Adds `aria-describedby` for `LeadingVisual` and `TrailingVisual` in `TextInput`; adds new prop `loaderText` to convey loading state to screen readers

- [#4804](https://github.com/primer/react/pull/4804) [`fd2c705`](https://github.com/primer/react/commit/fd2c7052be423150648d30f4baca0857b0644318) Thanks [@joshblack](https://github.com/joshblack)! - Remove experimental TabPanels component in preference of UnderlinePanels

- [#4771](https://github.com/primer/react/pull/4771) [`92e05f7`](https://github.com/primer/react/commit/92e05f7c51d23778ead897f935f2cc14ed8ceff1) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Set `openOnFocus` default to `false`, making the menu closed initially rather than opening on focus of input

- [#4798](https://github.com/primer/react/pull/4798) [`0fa60a4`](https://github.com/primer/react/commit/0fa60a49177cf6bf60cdb5d4714d5e55708461f9) Thanks [@joshblack](https://github.com/joshblack)! - Add the deprecated Dialog, Octicon, Pagehead, TabNav, and Tooltip components to @primer/react/deprecated

- [#4951](https://github.com/primer/react/pull/4951) [`c9009de`](https://github.com/primer/react/commit/c9009decbdac1f6cbc9253556942762c227fd69d) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(Pagination): Use anchor instead of button for disabled prev/next controls

- [#4834](https://github.com/primer/react/pull/4834) [`7ce1fda`](https://github.com/primer/react/commit/7ce1fda3174b8f707c784a8ffdf576e6ffbfac9d) Thanks [@langermank](https://github.com/langermank)! - Add `size` and `weight` props to `Text`

- [#5010](https://github.com/primer/react/pull/5010) [`8385c33`](https://github.com/primer/react/commit/8385c334df1f31aa810a8e6575986ca420a683f9) Thanks [@joshblack](https://github.com/joshblack)! - Promote Dialog, Tooltip, and Stack from `@primer/react/experimental` to `@primer/react`

- [#4962](https://github.com/primer/react/pull/4962) [`1977a68`](https://github.com/primer/react/commit/1977a682841267dc22ca49b5b05f56511f73764c) Thanks [@joshblack](https://github.com/joshblack)! - Update Checkbox component to use CSS Modules behind feature flag

- [#5102](https://github.com/primer/react/pull/5102) [`2742ee5`](https://github.com/primer/react/commit/2742ee5dbc6c2b98b13249de7dd0f25252caacad) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Add `classname` prop support to `ActionList.Description` component

- [#4976](https://github.com/primer/react/pull/4976) [`f448b1b`](https://github.com/primer/react/commit/f448b1b3debd72a3a372f4083d656a4e235cbfc9) Thanks [@joshblack](https://github.com/joshblack)! - Add certain wildcard exports to named entry points

- [#4819](https://github.com/primer/react/pull/4819) [`0112347`](https://github.com/primer/react/commit/0112347b23d1aebf9a5dfea5cb01591b700dd653) Thanks [@joshblack](https://github.com/joshblack)! - Update Heading component to use CSS Modules behind feature flag

- [#4913](https://github.com/primer/react/pull/4913) [`6c9121e`](https://github.com/primer/react/commit/6c9121e217e4815c7c6ab3c03474b2ca632f05e9) Thanks [@joshblack](https://github.com/joshblack)! - Update Banner to use CSS Modules behind feature flag

- [#4893](https://github.com/primer/react/pull/4893) [`1b098ed`](https://github.com/primer/react/commit/1b098ed246211ed25944984a7cf02348858970af) Thanks [@jonrohan](https://github.com/jonrohan)! - Refactor Label to use CSS modules behind the primer_react_css_modules_team feature flag

- [#4884](https://github.com/primer/react/pull/4884) [`46dc2f3`](https://github.com/primer/react/commit/46dc2f36190edf38f96020443014f8024177ae50) Thanks [@langermank](https://github.com/langermank)! - Bump `primer/primitives` v9

- [#5099](https://github.com/primer/react/pull/5099) [`cb21a38`](https://github.com/primer/react/commit/cb21a384d63473295480a0905c4ca1ba59faf068) Thanks [@joshblack](https://github.com/joshblack)! - Add ButtonBase to `@primer/react/experimental` to help with wildcard import interop

- [#4994](https://github.com/primer/react/pull/4994) [`be58fff`](https://github.com/primer/react/commit/be58fffd14453e977ab4fe3930829d1d67fcc1a8) Thanks [@camertron](https://github.com/camertron)! - [SegmentedControl, Autocomplete] Support passing React.ReactElements for icons.

- [#4750](https://github.com/primer/react/pull/4750) [`414c140`](https://github.com/primer/react/commit/414c140cf86b37cd0104cdc8b027636a57cc0127) Thanks [@iansan5653](https://github.com/iansan5653)! - Add `KeybindingHint` component for indicating an available keyboard shortcut

- [#5074](https://github.com/primer/react/pull/5074) [`e4965ed`](https://github.com/primer/react/commit/e4965ed773e32abc6fc49bff623dd79127047c93) Thanks [@joshblack](https://github.com/joshblack)! - Add the `useFeatureFlag` hook to `@primer/react/experimental`

- [#4923](https://github.com/primer/react/pull/4923) [`1dded73`](https://github.com/primer/react/commit/1dded73ea13dca380cf201e9789bb0338689acc8) Thanks [@jonrohan](https://github.com/jonrohan)! - Move the Blankslate css modules feature flag to primer_react_css_modules_ga

- [#5100](https://github.com/primer/react/pull/5100) [`b0d858a`](https://github.com/primer/react/commit/b0d858a55cf92c131005dfda8dca484793c1af41) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(ProgressBar): add aria-valuetext attribute

- [#5007](https://github.com/primer/react/pull/5007) [`c909285`](https://github.com/primer/react/commit/c90928570c416f226f9bfdba25062131d406f687) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - ProgressBar: Add `bg` prop to `ProgressBar.Item`

- [#5021](https://github.com/primer/react/pull/5021) [`cff067a`](https://github.com/primer/react/commit/cff067afd997988fea9cec4ce9167c07a5d7acbc) Thanks [@joshblack](https://github.com/joshblack)! - Add ResponsiveValue type to `@primer/react` entrypoint

- [#4824](https://github.com/primer/react/pull/4824) [`b85d505`](https://github.com/primer/react/commit/b85d5057d2576a4bad37469daeb8ef66d34091cd) Thanks [@iansan5653](https://github.com/iansan5653)! - Adds new `className` prop to `FormControl` component

- [#4885](https://github.com/primer/react/pull/4885) [`373ce95`](https://github.com/primer/react/commit/373ce95042a4e2244a220378dccfc03fa001e7cf) Thanks [@jonrohan](https://github.com/jonrohan)! - Refactor Avatar component to use CSS modules behind feature flag

- [#5115](https://github.com/primer/react/pull/5115) [`e94f0a1`](https://github.com/primer/react/commit/e94f0a1771ab148108c290bf92cb794289c2173d) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Add 'className' prop to `Dialog` component

- [#4779](https://github.com/primer/react/pull/4779) [`551aff3`](https://github.com/primer/react/commit/551aff34af3e9afbf114b612163a22a2098b2d76) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Adds dependencies to `Dialog` focus trap to ensure focus trap is reset when content within changes

- [#4852](https://github.com/primer/react/pull/4852) [`1cb1470`](https://github.com/primer/react/commit/1cb1470d587087d9927abd2b2991c5068b79cdf4) Thanks [@joshblack](https://github.com/joshblack)! - Add support for sourcemaps for emitted CSS files

- [#4960](https://github.com/primer/react/pull/4960) [`21c3fce`](https://github.com/primer/react/commit/21c3fcea267c2a0f181310934ad34e548a1d605a) Thanks [@joshblack](https://github.com/joshblack)! - Add support for experimental IssueLabel component

- [#4874](https://github.com/primer/react/pull/4874) [`4c69b38`](https://github.com/primer/react/commit/4c69b38937ad0daa7bf4e9e71f28fd8e7e10a026) Thanks [@jonrohan](https://github.com/jonrohan)! - Refactor `Text` to CSS modules behind primer_react_css_modules_team feature flag

- [#4810](https://github.com/primer/react/pull/4810) [`c0425ff`](https://github.com/primer/react/commit/c0425ff7d0b9572f7551f114133fd0302980815f) Thanks [@joshblack](https://github.com/joshblack)! - Update Blankslate component to use CSS Modules behind a feature flag

- [#4838](https://github.com/primer/react/pull/4838) [`7a3b55d`](https://github.com/primer/react/commit/7a3b55d1374217b3cd2a33f048c7d60929fca5b5) Thanks [@joshblack](https://github.com/joshblack)! - Add support for custom icons when a Banner is variant="upsell"

- [#5002](https://github.com/primer/react/pull/5002) [`9bd5c89`](https://github.com/primer/react/commit/9bd5c8936fa316c1216fb8fd22034b3355097431) Thanks [@jonrohan](https://github.com/jonrohan)! - chore(AvatarPair): Convert AvatarPair to CSS modules

- [#4906](https://github.com/primer/react/pull/4906) [`dbf82f4`](https://github.com/primer/react/commit/dbf82f4576e8d071dc2d41b50396fa68ab5505c2) Thanks [@siddharthkp](https://github.com/siddharthkp)! - SelectPanel: Support <kbd>PageDown</kbd> and <kbd>PageUp</kbd> for keyboard navigation

  SelectPanel: Label `listbox` by the title of the panel

- [#5130](https://github.com/primer/react/pull/5130) [`661e94c`](https://github.com/primer/react/commit/661e94c449e8e9feb0c35a1dd62122801a55c6a6) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Add `className` prop support to `Textarea` component

### Patch Changes

- [#5036](https://github.com/primer/react/pull/5036) [`6671a20`](https://github.com/primer/react/commit/6671a207066bebdd54939d0806fca89c7ab55137) Thanks [@langermank](https://github.com/langermank)! - ActionListGroup description style bug fix

- [#5000](https://github.com/primer/react/pull/5000) [`b8f6888`](https://github.com/primer/react/commit/b8f68888d2488d310b57a89ddab0f1562d4c6b0e) Thanks [@jonrohan](https://github.com/jonrohan)! - `Text` component CSS module feature flag changed to `primer_react_css_modules_staff`

- [#4870](https://github.com/primer/react/pull/4870) [`3ca513c`](https://github.com/primer/react/commit/3ca513c824fc50b49a88320ec98dd3f1a15d25b9) Thanks [@jonrohan](https://github.com/jonrohan)! - Add `:where()` selector to classes that land on nodes that have a `sx` prop.

- [#4910](https://github.com/primer/react/pull/4910) [`c2e4d5e`](https://github.com/primer/react/commit/c2e4d5eadb1a0bca3de81b6e2571585777f00a5d) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Changes the accessible name of the "toggle" button in `LabelGroup` to contain the visual label

- [#4941](https://github.com/primer/react/pull/4941) [`80fe025`](https://github.com/primer/react/commit/80fe025aeea23ec4fa15c50075736df4934659b5) Thanks [@langermank](https://github.com/langermank)! - Bug fix: Button loading spinner color

- [#4806](https://github.com/primer/react/pull/4806) [`84d1604`](https://github.com/primer/react/commit/84d1604ecf2c07b5584f7c5db2cd078c18847cbf) Thanks [@langermank](https://github.com/langermank)! - Add `variant` prop to Heading for small, medium and large styles

- [#4916](https://github.com/primer/react/pull/4916) [`7a24a01`](https://github.com/primer/react/commit/7a24a0153b0cbdd80d3a281b44a79b7852c1cf8e) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving Link CSS modules to staff feature flag

- [#4811](https://github.com/primer/react/pull/4811) [`5ee8704`](https://github.com/primer/react/commit/5ee8704ff5b85ec2b848dcfc10c3a8ae40a3a892) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Octicon: Add aria-label to the Icon instead of its container

- [#4911](https://github.com/primer/react/pull/4911) [`9846375`](https://github.com/primer/react/commit/9846375ebc12444936ebec8911b8006f22b1234c) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Include current selected menu item in accessible name when using an `aria-label` in `SegmentedControl`

- [#4975](https://github.com/primer/react/pull/4975) [`0b89fc0`](https://github.com/primer/react/commit/0b89fc040e05a61de4a686d3054f4cb6d9f32f6d) Thanks [@jonrohan](https://github.com/jonrohan)! - Change the Link component feature flag from primer_react_css_modules_staff to primer_react_css_modules_ga

- [#5059](https://github.com/primer/react/pull/5059) [`682e787`](https://github.com/primer/react/commit/682e787071d9bed26801202cf6823a96c1b39462) Thanks [@gwwar](https://github.com/gwwar)! - Fixes negative and invalid pages in data table pagination on re-render.

- [#5078](https://github.com/primer/react/pull/5078) [`3b7bf41`](https://github.com/primer/react/commit/3b7bf411c60d5283eb2fba78e7ab1a26b707af5b) Thanks [@jonrohan](https://github.com/jonrohan)! - Set the `min-width` of `IconButton` to `unset` to resolve layout issues.

- [#4915](https://github.com/primer/react/pull/4915) [`69922d1`](https://github.com/primer/react/commit/69922d1ddde2cb06586a796b3d06fd0af636fb55) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Heading component to staff feature flag

- [#4876](https://github.com/primer/react/pull/4876) [`9dd95a8`](https://github.com/primer/react/commit/9dd95a86274fc0358966aded932526f88c9d505a) Thanks [@TylerJDev](https://github.com/TylerJDev)! - ActionList: Add more guards for `ActionList.Item` before utilizing button semantics (behind feature flag `primer_react_action_list_item_as_button`)

- [#4981](https://github.com/primer/react/pull/4981) [`c8fe1c6`](https://github.com/primer/react/commit/c8fe1c6005a7d8d8fe25e10d4ef107b75ab21db3) Thanks [@jonrohan](https://github.com/jonrohan)! - Removes the feature flag from the `Blankslate` component to always render with CSS modules.

- [#4858](https://github.com/primer/react/pull/4858) [`6c69bff`](https://github.com/primer/react/commit/6c69bffb288caf8006cc3316afe86396d9987e49) Thanks [@jonrohan](https://github.com/jonrohan)! - Refactor Link, Blankslate, Heading to use :where css

- [#4986](https://github.com/primer/react/pull/4986) [`d6471aa`](https://github.com/primer/react/commit/d6471aad819709efbaf049fd2c66600f454e635e) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(Dialog): track mousedown event to prevent accidental closing

- [#4866](https://github.com/primer/react/pull/4866) [`587603b`](https://github.com/primer/react/commit/587603bcd750e558f443b071deb3dac90d004a90) Thanks [@langermank](https://github.com/langermank)! - Add `className` to Blankslate

- [#5062](https://github.com/primer/react/pull/5062) [`0f5d5e0`](https://github.com/primer/react/commit/0f5d5e05096b1b1599a92c90619cde6e11cb5808) Thanks [@jonrohan](https://github.com/jonrohan)! - Move CSS modules feature flag from staff to ga for Avatar component

- [#4967](https://github.com/primer/react/pull/4967) [`98d3d13`](https://github.com/primer/react/commit/98d3d13196ed918b8a4171062d9965d59b9073ed) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Utilizes `[disabled]` selector instead of `:disabled` in `TooltipV2` to address a false positive

- [#5026](https://github.com/primer/react/pull/5026) [`3302440`](https://github.com/primer/react/commit/33024402ccc9f739ebf358cea6e90f409e4e1188) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Banner: Fix alignment of secondary action without primary action

- [#4774](https://github.com/primer/react/pull/4774) [`11e7aef`](https://github.com/primer/react/commit/11e7aef33f124e84b4cf5c9e62c766834c6d1c31) Thanks [@langermank](https://github.com/langermank)! - - Adjust checkbox and radio border color values for high contrast themes

  - Add default border to SegmentedControl
  - Add inset box-shadow to StatusLabel to prep for new border-color in dark high contrast

- [#4957](https://github.com/primer/react/pull/4957) [`6874b89`](https://github.com/primer/react/commit/6874b89026eef5c46fb4d27e1c0fa0f08807a6bc) Thanks [@langermank](https://github.com/langermank)! - Add missing `wide` CSS + className to Stack

- [#5018](https://github.com/primer/react/pull/5018) [`8e4beae`](https://github.com/primer/react/commit/8e4beae98592c38a172aa0c2be604d7c06e941c7) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from `Heading`

- [#4977](https://github.com/primer/react/pull/4977) [`1adea12`](https://github.com/primer/react/commit/1adea12b9c53b4de0f6b34c37617c45fa724f10b) Thanks [@siddharthkp](https://github.com/siddharthkp)! - SelectPanel: Add `role=combobox` to filter input (behind feature flag `primer_react_select_panel_with_modern_action_list`)

- [#4648](https://github.com/primer/react/pull/4648) [`c6931d2`](https://github.com/primer/react/commit/c6931d20ea37888f0416429d068cc495d6cb804d) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu: Make sure event handlers on ActionMenu.Button and ActionMenu.Anchor are called

- [#5126](https://github.com/primer/react/pull/5126) [`f574372`](https://github.com/primer/react/commit/f57437209df3f35901cbb33045f9143285e39268) Thanks [@langermank](https://github.com/langermank)! - Add support for `aria-disabled` in `Button`

- [#4766](https://github.com/primer/react/pull/4766) [`e74e581`](https://github.com/primer/react/commit/e74e5810590ea389a8594153a60b45e6b37f69b3) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - chore(deps): Update eslint-plugin-primer-react to latest

- [#5082](https://github.com/primer/react/pull/5082) [`212714c`](https://github.com/primer/react/commit/212714ccc005eb57e272b3f64e3736e198c555e8) Thanks [@langermank](https://github.com/langermank)! - Add focus styles to Pagination component

- [#5077](https://github.com/primer/react/pull/5077) [`6490b27`](https://github.com/primer/react/commit/6490b27bde15e7687dcda48c444eb909dec2d5a7) Thanks [@jonrohan](https://github.com/jonrohan)! - Bug fix(Avatar): Changed rounded border calculation for the "square" Avatar to better align with existing border styles

- [#4795](https://github.com/primer/react/pull/4795) [`ca6b4b1`](https://github.com/primer/react/commit/ca6b4b1b6db2e867212689417503fcf3f29a7bce) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList: Enable focusZone for roles listbox and menu

- [#5023](https://github.com/primer/react/pull/5023) [`1691e46`](https://github.com/primer/react/commit/1691e466a2749393af87ced37f4f72694582e0bb) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Button component feature flag from primer_react_css_modules_team to primer_react_css_modules_staff

- [#5020](https://github.com/primer/react/pull/5020) [`31f03fb`](https://github.com/primer/react/commit/31f03fbdcdcd1bfca6fee15443b0c0bd241a42df) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Text component feature flag from primer_react_css_modules_staff to primer_react_css_modules_ga

- [#4666](https://github.com/primer/react/pull/4666) [`04eac62`](https://github.com/primer/react/commit/04eac6280224d365f0496d927a87b32150006f9e) Thanks [@TylerJDev](https://github.com/TylerJDev)! - ActionList: Adds `aria-labelledby` to `ActionList.TrailingVisual`, making it part of the accessible name of `ActionList.Item`

- [#4891](https://github.com/primer/react/pull/4891) [`ae00350`](https://github.com/primer/react/commit/ae00350e62f6251afe95591bf60cdb8280739b43) Thanks [@langermank](https://github.com/langermank)! - `StackItem` responsive grow bug fix

- [#5055](https://github.com/primer/react/pull/5055) [`73135c1`](https://github.com/primer/react/commit/73135c1c57a02e35d33ae6ffba16784043dcabb8) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(Banner): rewrite PrimaryAction & SecondaryAction types

- [#4768](https://github.com/primer/react/pull/4768) [`b7c90ea`](https://github.com/primer/react/commit/b7c90ea44be4abfb00a451567115cda6d9bc864d) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Header: Add overflow when there are a lot of items

- [#4816](https://github.com/primer/react/pull/4816) [`f9bc73c`](https://github.com/primer/react/commit/f9bc73c167f4453cfb7a0636e72d216c6bd0d039) Thanks [@siddharthkp](https://github.com/siddharthkp)! - FilteredActionList: export `FilteredActionList` from '@primer/react/experimental'

- [#4971](https://github.com/primer/react/pull/4971) [`ff56b04`](https://github.com/primer/react/commit/ff56b0476e59249db0d46a2c163a61ea75d06750) Thanks [@jonrohan](https://github.com/jonrohan)! - Changed Heading feature flag from `primer_react_css_modules_staff` to `primer_react_css_modules_ga`

- [#5128](https://github.com/primer/react/pull/5128) [`adf8c4f`](https://github.com/primer/react/commit/adf8c4fc2fdaa0ed4bafc2a358f2207d127f3d15) Thanks [@stephaniegiang](https://github.com/stephaniegiang)! - Update confirmation dialog body to default color. Removing the muted color override.

- [#5001](https://github.com/primer/react/pull/5001) [`597d285`](https://github.com/primer/react/commit/597d285a9cd876f52e7be56ba2dde1aed2c473f2) Thanks [@jonrohan](https://github.com/jonrohan)! - Migrate `ButtonGroup` component to use CSS modules behind the `primer_react_css_modules_team` feature flag

- [#5041](https://github.com/primer/react/pull/5041) [`4da550e`](https://github.com/primer/react/commit/4da550ee52bcc8874ddae86e01e26ace64f48bf8) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(TooltipV2): always add aria-hidden

- [#5086](https://github.com/primer/react/pull/5086) [`96ce586`](https://github.com/primer/react/commit/96ce586a6fd831fe6dff8fc4ec770d4904e1e587) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Button CSS module feature flag from staff to ga

- [#5068](https://github.com/primer/react/pull/5068) [`5f7bd0b`](https://github.com/primer/react/commit/5f7bd0b399073b2f22b8eaec548c37ff19a5ea86) Thanks [@jonrohan](https://github.com/jonrohan)! - fix for `toggleStyledComponent` utility, When the feature flag is enabled and sx prop is passed in use, Box

- [#4828](https://github.com/primer/react/pull/4828) [`1a674f7`](https://github.com/primer/react/commit/1a674f7ad18eb51bfc3ea63ec53b14880ebfd25a) Thanks [@jonrohan](https://github.com/jonrohan)! - Refactor Link component to use CSS modules using the feature flag `primer_react_css_modules`

- [#4989](https://github.com/primer/react/pull/4989) [`dc80aa6`](https://github.com/primer/react/commit/dc80aa6352238c26ef31ae3dceb4ffbff6a148b7) Thanks [@camertron](https://github.com/camertron)! - Allow color to be customized for medium-sized IconButtons

- [#4968](https://github.com/primer/react/pull/4968) [`da0f48b`](https://github.com/primer/react/commit/da0f48bcae27965f78fba8f2ba3e61254bae0529) Thanks [@siddharthkp](https://github.com/siddharthkp)! - SelectPanel: Add announcements for screen readers (behind feature flag `primer_react_select_panel_with_modern_action_list`)

- [#4970](https://github.com/primer/react/pull/4970) [`44a3dc9`](https://github.com/primer/react/commit/44a3dc94f38e8056200155ea19bfd19904d8cba2) Thanks [@joshblack](https://github.com/joshblack)! - Update tab in UnderlinePanels to set explicit type

- [#5000](https://github.com/primer/react/pull/5000) [`b8f6888`](https://github.com/primer/react/commit/b8f68888d2488d310b57a89ddab0f1562d4c6b0e) Thanks [@jonrohan](https://github.com/jonrohan)! - `Label` component CSS module feature flag changed to `primer_react_css_modules_staff`

- [#4928](https://github.com/primer/react/pull/4928) [`caf4bcf`](https://github.com/primer/react/commit/caf4bcfc3e731c56e701cbeaf71d2b79e2a05a22) Thanks [@langermank](https://github.com/langermank)! - Bug fix: `invisible` Button variant missing background color when disabled

- [#4831](https://github.com/primer/react/pull/4831) [`0d7a02a`](https://github.com/primer/react/commit/0d7a02a062d19b8909124b0756a41bec6455a39e) Thanks [@siddharthkp](https://github.com/siddharthkp)! - TextInput: Update trailing action styles for hover state

- [#5132](https://github.com/primer/react/pull/5132) [`623a411`](https://github.com/primer/react/commit/623a411182d5b150ac39e69204b7eba6e0e935bc) Thanks [@langermank](https://github.com/langermank)! - Bug fix: ActionList Group className prop

- [#5022](https://github.com/primer/react/pull/5022) [`4395d16`](https://github.com/primer/react/commit/4395d162be1a80233bada149966b36a27f91ba51) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Label component feature flag from primer_react_css_modules_staff to primer_react_css_modules_ga

- [#4972](https://github.com/primer/react/pull/4972) [`082b4e7`](https://github.com/primer/react/commit/082b4e7eae0ebe40ba197ec1582519a9a9046dd8) Thanks [@joshblack](https://github.com/joshblack)! - Update issue where FormControl.Caption was rendering incorrectly when CSS Modules flags were enabled

- [#5091](https://github.com/primer/react/pull/5091) [`4218bef`](https://github.com/primer/react/commit/4218bef879ae70aab3cc30492bacfc9c506be8f7) Thanks [@jonrohan](https://github.com/jonrohan)! - Bug fix for `IconButton` to respect the `style` prop width when the feature flag is on.

- [#4841](https://github.com/primer/react/pull/4841) [`f3b08df`](https://github.com/primer/react/commit/f3b08dfd20681b04c5812a5ff66ea65d0e090db9) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Remove `aria-busy` from `ProgressBar` component

- [#4857](https://github.com/primer/react/pull/4857) [`16c31e6`](https://github.com/primer/react/commit/16c31e6933d4f98db15baa880110fdf8aa2409e5) Thanks [@jonrohan](https://github.com/jonrohan)! - fix(Blankslate): Don't use Box to render heading when flag is enabled

- [#4794](https://github.com/primer/react/pull/4794) [`5f996c6`](https://github.com/primer/react/commit/5f996c641b44303c9b466a3d28f208300eb4f36d) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - SelectPanel: Update SelectPanel to use modern ActionList behind a feature flag `primer_react_select_panel_with_modern_action_list`

- [#4954](https://github.com/primer/react/pull/4954) [`af7f589`](https://github.com/primer/react/commit/af7f58911338f542525ce650f3aa34e85f9bf811) Thanks [@joshblack](https://github.com/joshblack)! - Banner: Update alignment of actions when it is dismissible and has a hidden title

- [#4865](https://github.com/primer/react/pull/4865) [`ce2c674`](https://github.com/primer/react/commit/ce2c6749922a97a258147382bdc31e410f6b76eb) Thanks [@camertron](https://github.com/camertron)! - Update `Label` font weight to match Rails component

- [#5111](https://github.com/primer/react/pull/5111) [`802568a`](https://github.com/primer/react/commit/802568ae1298c6f3eddf74962d5b8227f264ae2e) Thanks [@joshblack](https://github.com/joshblack)! - Update CSS styles for CounterLabel to allow overrides for color, background color

- [#4969](https://github.com/primer/react/pull/4969) [`0cd6151`](https://github.com/primer/react/commit/0cd6151c2b620f10a06921a88edf6d64e0a1bc1a) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Add initial loading state to live region announcement in `TreeView`

- [#4895](https://github.com/primer/react/pull/4895) [`0208e9e`](https://github.com/primer/react/commit/0208e9e50a58c0d44b89f9165b2d55f9b465841b) Thanks [@langermank](https://github.com/langermank)! - Bump `primer/primitives` v9.0.3

- [#4995](https://github.com/primer/react/pull/4995) [`8a1ee22`](https://github.com/primer/react/commit/8a1ee22b287e8303105fab4d24f904b4b112a5d0) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - ProgressBar: Adding default gap between sections for progressbars with more than one section

- [#5073](https://github.com/primer/react/pull/5073) [`472967a`](https://github.com/primer/react/commit/472967a712e9b81856b3b37088142b0ffbda5b15) Thanks [@siddharthkp](https://github.com/siddharthkp)! - SelectPanel: Fix items not being selected when defined within scope (track selection by item.id)

- [#5145](https://github.com/primer/react/pull/5145) [`ccf7cbe`](https://github.com/primer/react/commit/ccf7cbeb060b50afb30072b666de020ddc1c46c8) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Banner css modules feature flag from team to staff

- [#4966](https://github.com/primer/react/pull/4966) [`c097e96`](https://github.com/primer/react/commit/c097e9624cecb6506fcc38abcdc6605e033178f5) Thanks [@siddharthkp](https://github.com/siddharthkp)! - SelectPanel: Fix focus and selection styles for Windows high contrast themes (behind feature flag `primer_react_select_panel_with_modern_action_list`)

- [#4943](https://github.com/primer/react/pull/4943) [`c282642`](https://github.com/primer/react/commit/c282642d0f525eca371aa1142b98482f19b366cb) Thanks [@langermank](https://github.com/langermank)! - Button bug fixes: `invisible` variant icon colors missing variables + icon button disabled state

- [#5033](https://github.com/primer/react/pull/5033) [`0b83fe9`](https://github.com/primer/react/commit/0b83fe9772a8c2e71a2d2eb375a11849a6eabb9c) Thanks [@siddharthkp](https://github.com/siddharthkp)! - SelectPanel: Fix font weight from active styles for modern ActionList (behind feature flag)

- [#5137](https://github.com/primer/react/pull/5137) [`bd1f1c2`](https://github.com/primer/react/commit/bd1f1c2fbb303facb36bcd449f4a8d911cf7546c) Thanks [@jonrohan](https://github.com/jonrohan)! - Make sure all components accept `className` as a prop on outermost component element.

- [#5024](https://github.com/primer/react/pull/5024) [`45f3597`](https://github.com/primer/react/commit/45f359770ae830073f49aa23297aa9788809b46d) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Avatar component feature flag from primer_react_css_modules_team to primer_react_css_modules_staff

- [#4997](https://github.com/primer/react/pull/4997) [`dc2d1f3`](https://github.com/primer/react/commit/dc2d1f3e71afa75757fccd83e0e82acd770d5055) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Popover: Add note on deprecation of `caret` in v38

- [#5066](https://github.com/primer/react/pull/5066) [`702ba5c`](https://github.com/primer/react/commit/702ba5ca59d42abc57a1d6da539935534edcd2ab) Thanks [@jonrohan](https://github.com/jonrohan)! - Use the IconButton for the close button on Dialog

- [#4987](https://github.com/primer/react/pull/4987) [`b82286d`](https://github.com/primer/react/commit/b82286d78588ab4364da6e0666f41aaff3318389) Thanks [@langermank](https://github.com/langermank)! - Bump stylelint + fixes

- [#5011](https://github.com/primer/react/pull/5011) [`7a5205d`](https://github.com/primer/react/commit/7a5205d88e6c1600e83232a102378d97639b4223) Thanks [@langermank](https://github.com/langermank)! - Bug fix: `Button` aria-expanded state (CSS Modules)

- [#5079](https://github.com/primer/react/pull/5079) [`a2e5671`](https://github.com/primer/react/commit/a2e5671e720e4d78a3f5a9b503fc841db100dc1d) Thanks [@jonrohan](https://github.com/jonrohan)! - Correctly pass styled system typography and common props to the `Box` component in the `Text` component when the CSS modules feature flag is enabled.

- [#5053](https://github.com/primer/react/pull/5053) [`2703d0c`](https://github.com/primer/react/commit/2703d0c659a71d3d0c6e307cb4d6dc2606c070d0) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Banner: Fix margin for inline actions

- [#4855](https://github.com/primer/react/pull/4855) [`873249a`](https://github.com/primer/react/commit/873249a1e31d74e1d94399f495558ce9574f22c5) Thanks [@mattcosta7](https://github.com/mattcosta7)! - avoid useeffect when syncing theme config

- [#4803](https://github.com/primer/react/pull/4803) [`527f9a9`](https://github.com/primer/react/commit/527f9a9320c51b9b1a0884b388d5ff53af7c11b1) Thanks [@aprendendofelipe](https://github.com/aprendendofelipe)! - Bumps @github/relative-time-element to v4.4.2

## 37.0.0-rc.11

### Minor Changes

- [#5097](https://github.com/primer/react/pull/5097) [`2a3c473`](https://github.com/primer/react/commit/2a3c473db4ee5e76903a82c150e09ad75868b15d) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Added className prop to the AvatarStack component

- [#5113](https://github.com/primer/react/pull/5113) [`c28378e`](https://github.com/primer/react/commit/c28378eeca2658e23c84ed7047bb300be2ed9ce0) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Add `className` prop to `FormControl.Label` component

- [#5102](https://github.com/primer/react/pull/5102) [`2742ee5`](https://github.com/primer/react/commit/2742ee5dbc6c2b98b13249de7dd0f25252caacad) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Add `classname` prop support to `ActionList.Description` component

- [#5099](https://github.com/primer/react/pull/5099) [`cb21a38`](https://github.com/primer/react/commit/cb21a384d63473295480a0905c4ca1ba59faf068) Thanks [@joshblack](https://github.com/joshblack)! - Add ButtonBase to `@primer/react/experimental` to help with wildcard import interop

- [#4994](https://github.com/primer/react/pull/4994) [`be58fff`](https://github.com/primer/react/commit/be58fffd14453e977ab4fe3930829d1d67fcc1a8) Thanks [@camertron](https://github.com/camertron)! - [SegmentedControl, Autocomplete] Support passing React.ReactElements for icons.

- [#5100](https://github.com/primer/react/pull/5100) [`b0d858a`](https://github.com/primer/react/commit/b0d858a55cf92c131005dfda8dca484793c1af41) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(ProgressBar): add aria-valuetext attribute

- [#5115](https://github.com/primer/react/pull/5115) [`e94f0a1`](https://github.com/primer/react/commit/e94f0a1771ab148108c290bf92cb794289c2173d) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Add 'className' prop to `Dialog` component

- [#5130](https://github.com/primer/react/pull/5130) [`661e94c`](https://github.com/primer/react/commit/661e94c449e8e9feb0c35a1dd62122801a55c6a6) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - Add `className` prop support to `Textarea` component

### Patch Changes

- [#5126](https://github.com/primer/react/pull/5126) [`f574372`](https://github.com/primer/react/commit/f57437209df3f35901cbb33045f9143285e39268) Thanks [@langermank](https://github.com/langermank)! - Add support for `aria-disabled` in `Button`

- [#5128](https://github.com/primer/react/pull/5128) [`adf8c4f`](https://github.com/primer/react/commit/adf8c4fc2fdaa0ed4bafc2a358f2207d127f3d15) Thanks [@stephaniegiang](https://github.com/stephaniegiang)! - Update confirmation dialog body to default color. Removing the muted color override.

- [#5041](https://github.com/primer/react/pull/5041) [`4da550e`](https://github.com/primer/react/commit/4da550ee52bcc8874ddae86e01e26ace64f48bf8) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(TooltipV2): always add aria-hidden

- [#5132](https://github.com/primer/react/pull/5132) [`623a411`](https://github.com/primer/react/commit/623a411182d5b150ac39e69204b7eba6e0e935bc) Thanks [@langermank](https://github.com/langermank)! - Bug fix: ActionList Group className prop

- [#5111](https://github.com/primer/react/pull/5111) [`802568a`](https://github.com/primer/react/commit/802568ae1298c6f3eddf74962d5b8227f264ae2e) Thanks [@joshblack](https://github.com/joshblack)! - Update CSS styles for CounterLabel to allow overrides for color, background color

## 37.0.0-rc.10

### Minor Changes

- [#5064](https://github.com/primer/react/pull/5064) [`29f33ce`](https://github.com/primer/react/commit/29f33ce93c6b7e573cca9f2c0a10bb12ec5245c3) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltip: Do not export all types publicly in the experimental bundle

- [#5010](https://github.com/primer/react/pull/5010) [`8385c33`](https://github.com/primer/react/commit/8385c334df1f31aa810a8e6575986ca420a683f9) Thanks [@joshblack](https://github.com/joshblack)! - Promote Dialog, Tooltip, and Stack from `@primer/react/experimental` to `@primer/react`

- [#5074](https://github.com/primer/react/pull/5074) [`e4965ed`](https://github.com/primer/react/commit/e4965ed773e32abc6fc49bff623dd79127047c93) Thanks [@joshblack](https://github.com/joshblack)! - Add the `useFeatureFlag` hook to `@primer/react/experimental`

### Patch Changes

- [#5059](https://github.com/primer/react/pull/5059) [`682e787`](https://github.com/primer/react/commit/682e787071d9bed26801202cf6823a96c1b39462) Thanks [@gwwar](https://github.com/gwwar)! - Fixes negative and invalid pages in data table pagination on re-render.

- [#5078](https://github.com/primer/react/pull/5078) [`3b7bf41`](https://github.com/primer/react/commit/3b7bf411c60d5283eb2fba78e7ab1a26b707af5b) Thanks [@jonrohan](https://github.com/jonrohan)! - Set the `min-width` of `IconButton` to `unset` to resolve layout issues.

- [#5062](https://github.com/primer/react/pull/5062) [`0f5d5e0`](https://github.com/primer/react/commit/0f5d5e05096b1b1599a92c90619cde6e11cb5808) Thanks [@jonrohan](https://github.com/jonrohan)! - Move CSS modules feature flag from staff to ga for Avatar component

- [#5082](https://github.com/primer/react/pull/5082) [`212714c`](https://github.com/primer/react/commit/212714ccc005eb57e272b3f64e3736e198c555e8) Thanks [@langermank](https://github.com/langermank)! - Add focus styles to Pagination component

- [#5077](https://github.com/primer/react/pull/5077) [`6490b27`](https://github.com/primer/react/commit/6490b27bde15e7687dcda48c444eb909dec2d5a7) Thanks [@jonrohan](https://github.com/jonrohan)! - Bug fix(Avatar): Changed rounded border calculation for the "square" Avatar to better align with existing border styles

- [#5055](https://github.com/primer/react/pull/5055) [`73135c1`](https://github.com/primer/react/commit/73135c1c57a02e35d33ae6ffba16784043dcabb8) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(Banner): rewrite PrimaryAction & SecondaryAction types

- [#5068](https://github.com/primer/react/pull/5068) [`5f7bd0b`](https://github.com/primer/react/commit/5f7bd0b399073b2f22b8eaec548c37ff19a5ea86) Thanks [@jonrohan](https://github.com/jonrohan)! - fix for `toggleStyledComponent` utility, When the feature flag is enabled and sx prop is passed in use, Box

- [#5091](https://github.com/primer/react/pull/5091) [`4218bef`](https://github.com/primer/react/commit/4218bef879ae70aab3cc30492bacfc9c506be8f7) Thanks [@jonrohan](https://github.com/jonrohan)! - Bug fix for `IconButton` to respect the `style` prop width when the feature flag is on.

- [#5073](https://github.com/primer/react/pull/5073) [`472967a`](https://github.com/primer/react/commit/472967a712e9b81856b3b37088142b0ffbda5b15) Thanks [@siddharthkp](https://github.com/siddharthkp)! - SelectPanel: Fix items not being selected when defined within scope (track selection by item.id)

- [#5066](https://github.com/primer/react/pull/5066) [`702ba5c`](https://github.com/primer/react/commit/702ba5ca59d42abc57a1d6da539935534edcd2ab) Thanks [@jonrohan](https://github.com/jonrohan)! - Use the IconButton for the close button on Dialog

- [#5079](https://github.com/primer/react/pull/5079) [`a2e5671`](https://github.com/primer/react/commit/a2e5671e720e4d78a3f5a9b503fc841db100dc1d) Thanks [@jonrohan](https://github.com/jonrohan)! - Correctly pass styled system typography and common props to the `Box` component in the `Text` component when the CSS modules feature flag is enabled.

## 37.0.0-rc.9

### Minor Changes

- [#5021](https://github.com/primer/react/pull/5021) [`cff067a`](https://github.com/primer/react/commit/cff067afd997988fea9cec4ce9167c07a5d7acbc) Thanks [@joshblack](https://github.com/joshblack)! - Add ResponsiveValue type to `@primer/react` entrypoint

### Patch Changes

- [#5053](https://github.com/primer/react/pull/5053) [`2703d0c`](https://github.com/primer/react/commit/2703d0c659a71d3d0c6e307cb4d6dc2606c070d0) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Banner: Fix margin for inline actions

## 37.0.0-rc.8

### Major Changes

- [#4992](https://github.com/primer/react/pull/4992) [`d1d911a`](https://github.com/primer/react/commit/d1d911ad739f4f766234e99afca4ced0ad966da2) Thanks [@joshblack](https://github.com/joshblack)! - Move Octicon, Pagehead, Dialog (v1), and Tooltip (v1) to `@primer/react/deprecated`

### Patch Changes

- [#5036](https://github.com/primer/react/pull/5036) [`6671a20`](https://github.com/primer/react/commit/6671a207066bebdd54939d0806fca89c7ab55137) Thanks [@langermank](https://github.com/langermank)! - ActionList.Group: Fix styles for description

- [#5033](https://github.com/primer/react/pull/5033) [`0b83fe9`](https://github.com/primer/react/commit/0b83fe9772a8c2e71a2d2eb375a11849a6eabb9c) Thanks [@siddharthkp](https://github.com/siddharthkp)! - SelectPanel: Fix font weight from active styles for modern ActionList (behind feature flag)

## 37.0.0-rc.7

### Major Changes

- [#4784](https://github.com/primer/react/pull/4784) [`b518005`](https://github.com/primer/react/commit/b51800530e84520057b7517044ca611b409eaa57) Thanks [@joshblack](https://github.com/joshblack)! - Remove temporary folders for TypeScript resolution of sub-paths

- [#4807](https://github.com/primer/react/pull/4807) [`055c9a7`](https://github.com/primer/react/commit/055c9a7150ac2761ee82998a45448d04129f781b) Thanks [@langermank](https://github.com/langermank)! - Remove deprecated `Button` component

### Minor Changes

- [#4965](https://github.com/primer/react/pull/4965) [`5426a9a`](https://github.com/primer/react/commit/5426a9a0b46d4f0a93bba985e248f8b1f775b6e7) Thanks [@joshblack](https://github.com/joshblack)! - Update CounterLabel to use CSS Modules behind feature flag

- [#4956](https://github.com/primer/react/pull/4956) [`15cb90f`](https://github.com/primer/react/commit/15cb90fde3e59f41475b19daef0851a969885248) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(PageHeader): add role prop and aria-label in top-level element

- [#4962](https://github.com/primer/react/pull/4962) [`1977a68`](https://github.com/primer/react/commit/1977a682841267dc22ca49b5b05f56511f73764c) Thanks [@joshblack](https://github.com/joshblack)! - Update Checkbox component to use CSS Modules behind feature flag

- [#4976](https://github.com/primer/react/pull/4976) [`f448b1b`](https://github.com/primer/react/commit/f448b1b3debd72a3a372f4083d656a4e235cbfc9) Thanks [@joshblack](https://github.com/joshblack)! - Add certain wildcard exports to named entry points

- [#5007](https://github.com/primer/react/pull/5007) [`c909285`](https://github.com/primer/react/commit/c90928570c416f226f9bfdba25062131d406f687) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - ProgressBar: Add `bg` prop to `ProgressBar.Item`

- [#4960](https://github.com/primer/react/pull/4960) [`21c3fce`](https://github.com/primer/react/commit/21c3fcea267c2a0f181310934ad34e548a1d605a) Thanks [@joshblack](https://github.com/joshblack)! - Add support for experimental IssueLabel component

- [#5002](https://github.com/primer/react/pull/5002) [`9bd5c89`](https://github.com/primer/react/commit/9bd5c8936fa316c1216fb8fd22034b3355097431) Thanks [@jonrohan](https://github.com/jonrohan)! - chore(AvatarPair): Convert AvatarPair to CSS modules

### Patch Changes

- [#5026](https://github.com/primer/react/pull/5026) [`3302440`](https://github.com/primer/react/commit/33024402ccc9f739ebf358cea6e90f409e4e1188) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Banner: Fix alignment of secondary action without primary action

- [#5018](https://github.com/primer/react/pull/5018) [`8e4beae`](https://github.com/primer/react/commit/8e4beae98592c38a172aa0c2be604d7c06e941c7) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove the CSS modules feature flag from `Heading`

- [#5023](https://github.com/primer/react/pull/5023) [`1691e46`](https://github.com/primer/react/commit/1691e466a2749393af87ced37f4f72694582e0bb) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Button component feature flag from primer_react_css_modules_team to primer_react_css_modules_staff

- [#5020](https://github.com/primer/react/pull/5020) [`31f03fb`](https://github.com/primer/react/commit/31f03fbdcdcd1bfca6fee15443b0c0bd241a42df) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Text component feature flag from primer_react_css_modules_staff to primer_react_css_modules_ga

- [#5001](https://github.com/primer/react/pull/5001) [`597d285`](https://github.com/primer/react/commit/597d285a9cd876f52e7be56ba2dde1aed2c473f2) Thanks [@jonrohan](https://github.com/jonrohan)! - Migrate `ButtonGroup` component to use CSS modules behind the `primer_react_css_modules_team` feature flag

- [#5022](https://github.com/primer/react/pull/5022) [`4395d16`](https://github.com/primer/react/commit/4395d162be1a80233bada149966b36a27f91ba51) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Label component feature flag from primer_react_css_modules_staff to primer_react_css_modules_ga

- [#4969](https://github.com/primer/react/pull/4969) [`0cd6151`](https://github.com/primer/react/commit/0cd6151c2b620f10a06921a88edf6d64e0a1bc1a) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Add initial loading state to live region announcement in `TreeView`

- [#5024](https://github.com/primer/react/pull/5024) [`45f3597`](https://github.com/primer/react/commit/45f359770ae830073f49aa23297aa9788809b46d) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Avatar component feature flag from primer_react_css_modules_team to primer_react_css_modules_staff

- [#5011](https://github.com/primer/react/pull/5011) [`7a5205d`](https://github.com/primer/react/commit/7a5205d88e6c1600e83232a102378d97639b4223) Thanks [@langermank](https://github.com/langermank)! - Bug fix: `Button` aria-expanded state (CSS Modules)

## 37.0.0-rc.6

### Major Changes

- [#4953](https://github.com/primer/react/pull/4953) [`04e8c9c`](https://github.com/primer/react/commit/04e8c9c4daf6b2e39f0a13f16e4f2f3399902347) Thanks [@iansan5653](https://github.com/iansan5653)! - Delete deprecated draft components `MarkdownEditor`, `MarkdownInput`, and `InlineAutocomplete`

### Minor Changes

- [#4913](https://github.com/primer/react/pull/4913) [`6c9121e`](https://github.com/primer/react/commit/6c9121e217e4815c7c6ab3c03474b2ca632f05e9) Thanks [@joshblack](https://github.com/joshblack)! - Update Banner to use CSS Modules behind feature flag

### Patch Changes

- [#5000](https://github.com/primer/react/pull/5000) [`b8f6888`](https://github.com/primer/react/commit/b8f68888d2488d310b57a89ddab0f1562d4c6b0e) Thanks [@jonrohan](https://github.com/jonrohan)! - `Text` component CSS module feature flag changed to `primer_react_css_modules_staff`

- [#4975](https://github.com/primer/react/pull/4975) [`0b89fc0`](https://github.com/primer/react/commit/0b89fc040e05a61de4a686d3054f4cb6d9f32f6d) Thanks [@jonrohan](https://github.com/jonrohan)! - Change the Link component feature flag from primer_react_css_modules_staff to primer_react_css_modules_ga

- [#4981](https://github.com/primer/react/pull/4981) [`c8fe1c6`](https://github.com/primer/react/commit/c8fe1c6005a7d8d8fe25e10d4ef107b75ab21db3) Thanks [@jonrohan](https://github.com/jonrohan)! - Removes the feature flag from the `Blankslate` component to always render with CSS modules.

- [#4986](https://github.com/primer/react/pull/4986) [`d6471aa`](https://github.com/primer/react/commit/d6471aad819709efbaf049fd2c66600f454e635e) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(Dialog): track mousedown event to prevent accidental closing

- [#4967](https://github.com/primer/react/pull/4967) [`98d3d13`](https://github.com/primer/react/commit/98d3d13196ed918b8a4171062d9965d59b9073ed) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Utilizes `[disabled]` selector instead of `:disabled` in `TooltipV2` to address a false positive

- [#4977](https://github.com/primer/react/pull/4977) [`1adea12`](https://github.com/primer/react/commit/1adea12b9c53b4de0f6b34c37617c45fa724f10b) Thanks [@siddharthkp](https://github.com/siddharthkp)! - SelectPanel: Add `role=combobox` to filter input (behind feature flag `primer_react_select_panel_with_modern_action_list`)

- [#4971](https://github.com/primer/react/pull/4971) [`ff56b04`](https://github.com/primer/react/commit/ff56b0476e59249db0d46a2c163a61ea75d06750) Thanks [@jonrohan](https://github.com/jonrohan)! - Changed Heading feature flag from `primer_react_css_modules_staff` to `primer_react_css_modules_ga`

- [#4989](https://github.com/primer/react/pull/4989) [`dc80aa6`](https://github.com/primer/react/commit/dc80aa6352238c26ef31ae3dceb4ffbff6a148b7) Thanks [@camertron](https://github.com/camertron)! - Allow color to be customized for medium-sized IconButtons

- [#4968](https://github.com/primer/react/pull/4968) [`da0f48b`](https://github.com/primer/react/commit/da0f48bcae27965f78fba8f2ba3e61254bae0529) Thanks [@siddharthkp](https://github.com/siddharthkp)! - SelectPanel: Add announcements for screen readers (behind feature flag `primer_react_select_panel_with_modern_action_list`)

- [#4970](https://github.com/primer/react/pull/4970) [`44a3dc9`](https://github.com/primer/react/commit/44a3dc94f38e8056200155ea19bfd19904d8cba2) Thanks [@joshblack](https://github.com/joshblack)! - Update tab in UnderlinePanels to set explicit type

- [#5000](https://github.com/primer/react/pull/5000) [`b8f6888`](https://github.com/primer/react/commit/b8f68888d2488d310b57a89ddab0f1562d4c6b0e) Thanks [@jonrohan](https://github.com/jonrohan)! - `Label` component CSS module feature flag changed to `primer_react_css_modules_staff`

- [#4995](https://github.com/primer/react/pull/4995) [`8a1ee22`](https://github.com/primer/react/commit/8a1ee22b287e8303105fab4d24f904b4b112a5d0) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - ProgressBar: Adding default gap between sections for progressbars with more than one section

- [#4966](https://github.com/primer/react/pull/4966) [`c097e96`](https://github.com/primer/react/commit/c097e9624cecb6506fcc38abcdc6605e033178f5) Thanks [@siddharthkp](https://github.com/siddharthkp)! - SelectPanel: Fix focus and selection styles for Windows high contrast themes (behind feature flag `primer_react_select_panel_with_modern_action_list`)

- [#4997](https://github.com/primer/react/pull/4997) [`dc2d1f3`](https://github.com/primer/react/commit/dc2d1f3e71afa75757fccd83e0e82acd770d5055) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Popover: Add note on deprecation of `caret` in v38

- [#4987](https://github.com/primer/react/pull/4987) [`b82286d`](https://github.com/primer/react/commit/b82286d78588ab4364da6e0666f41aaff3318389) Thanks [@langermank](https://github.com/langermank)! - Bump stylelint + fixes

## 37.0.0-rc.5

### Major Changes

- [#4785](https://github.com/primer/react/pull/4785) [`b74c47f`](https://github.com/primer/react/commit/b74c47f37628f67960343cec083dd60cd1ebc817) Thanks [@joshblack](https://github.com/joshblack)! - The drafts entrypoint has been removed from @primer/react. Use
  @primer/react/experimental instead.

- [#4940](https://github.com/primer/react/pull/4940) [`4d3b504`](https://github.com/primer/react/commit/4d3b50421f0823b3509a048987b15c59cb827176) Thanks [@langermank](https://github.com/langermank)! - Refactor ButtonBase component to use CSS modules behine flag

### Minor Changes

- [#4951](https://github.com/primer/react/pull/4951) [`c9009de`](https://github.com/primer/react/commit/c9009decbdac1f6cbc9253556942762c227fd69d) Thanks [@francinelucca](https://github.com/francinelucca)! - fix(Pagination): Use anchor instead of button for disabled prev/next controls

- [#4885](https://github.com/primer/react/pull/4885) [`373ce95`](https://github.com/primer/react/commit/373ce95042a4e2244a220378dccfc03fa001e7cf) Thanks [@jonrohan](https://github.com/jonrohan)! - Refactor Avatar component to use CSS modules behind feature flag

- [#4906](https://github.com/primer/react/pull/4906) [`dbf82f4`](https://github.com/primer/react/commit/dbf82f4576e8d071dc2d41b50396fa68ab5505c2) Thanks [@siddharthkp](https://github.com/siddharthkp)! - SelectPanel: Support <kbd>PageDown</kbd> and <kbd>PageUp</kbd> for keyboard navigation

  SelectPanel: Label `listbox` by the title of the panel

### Patch Changes

- [#4910](https://github.com/primer/react/pull/4910) [`c2e4d5e`](https://github.com/primer/react/commit/c2e4d5eadb1a0bca3de81b6e2571585777f00a5d) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Changes the accessible name of the "toggle" button in `LabelGroup` to contain the visual label

- [#4941](https://github.com/primer/react/pull/4941) [`80fe025`](https://github.com/primer/react/commit/80fe025aeea23ec4fa15c50075736df4934659b5) Thanks [@langermank](https://github.com/langermank)! - Bug fix: Button loading spinner color

- [#4957](https://github.com/primer/react/pull/4957) [`6874b89`](https://github.com/primer/react/commit/6874b89026eef5c46fb4d27e1c0fa0f08807a6bc) Thanks [@langermank](https://github.com/langermank)! - Add missing `wide` CSS + className to Stack

- [#4648](https://github.com/primer/react/pull/4648) [`c6931d2`](https://github.com/primer/react/commit/c6931d20ea37888f0416429d068cc495d6cb804d) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu: Make sure event handlers on ActionMenu.Button and ActionMenu.Anchor are called

- [#4972](https://github.com/primer/react/pull/4972) [`082b4e7`](https://github.com/primer/react/commit/082b4e7eae0ebe40ba197ec1582519a9a9046dd8) Thanks [@joshblack](https://github.com/joshblack)! - Update issue where FormControl.Caption was rendering incorrectly when CSS Modules flags were enabled

- [#4794](https://github.com/primer/react/pull/4794) [`5f996c6`](https://github.com/primer/react/commit/5f996c641b44303c9b466a3d28f208300eb4f36d) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - SelectPanel: Update SelectPanel to use modern ActionList behind a feature flag `primer_react_select_panel_with_modern_action_list`

- [#4954](https://github.com/primer/react/pull/4954) [`af7f589`](https://github.com/primer/react/commit/af7f58911338f542525ce650f3aa34e85f9bf811) Thanks [@joshblack](https://github.com/joshblack)! - Banner: Update alignment of actions when it is dismissible and has a hidden title

- [#4943](https://github.com/primer/react/pull/4943) [`c282642`](https://github.com/primer/react/commit/c282642d0f525eca371aa1142b98482f19b366cb) Thanks [@langermank](https://github.com/langermank)! - Button bug fixes: `invisible` variant icon colors missing variables + icon button disabled state

## 37.0.0-rc.4

### Minor Changes

- [#4893](https://github.com/primer/react/pull/4893) [`1b098ed`](https://github.com/primer/react/commit/1b098ed246211ed25944984a7cf02348858970af) Thanks [@jonrohan](https://github.com/jonrohan)! - Refactor Label to use CSS modules behind the primer_react_css_modules_team feature flag

- [#4884](https://github.com/primer/react/pull/4884) [`46dc2f3`](https://github.com/primer/react/commit/46dc2f36190edf38f96020443014f8024177ae50) Thanks [@langermank](https://github.com/langermank)! - Bump `primer/primitives` v9

- [#4923](https://github.com/primer/react/pull/4923) [`1dded73`](https://github.com/primer/react/commit/1dded73ea13dca380cf201e9789bb0338689acc8) Thanks [@jonrohan](https://github.com/jonrohan)! - Move the Blankslate css modules feature flag to primer_react_css_modules_ga

- [#4779](https://github.com/primer/react/pull/4779) [`551aff3`](https://github.com/primer/react/commit/551aff34af3e9afbf114b612163a22a2098b2d76) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Adds dependencies to `Dialog` focus trap to ensure focus trap is reset when content within changes

- [#4874](https://github.com/primer/react/pull/4874) [`4c69b38`](https://github.com/primer/react/commit/4c69b38937ad0daa7bf4e9e71f28fd8e7e10a026) Thanks [@jonrohan](https://github.com/jonrohan)! - Refactor `Text` to CSS modules behind primer_react_css_modules_team feature flag

### Patch Changes

- [#4916](https://github.com/primer/react/pull/4916) [`7a24a01`](https://github.com/primer/react/commit/7a24a0153b0cbdd80d3a281b44a79b7852c1cf8e) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving Link CSS modules to staff feature flag

- [#4911](https://github.com/primer/react/pull/4911) [`9846375`](https://github.com/primer/react/commit/9846375ebc12444936ebec8911b8006f22b1234c) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Include current selected menu item in accessible name when using an `aria-label` in `SegmentedControl`

- [#4915](https://github.com/primer/react/pull/4915) [`69922d1`](https://github.com/primer/react/commit/69922d1ddde2cb06586a796b3d06fd0af636fb55) Thanks [@jonrohan](https://github.com/jonrohan)! - Move Heading component to staff feature flag

- [#4891](https://github.com/primer/react/pull/4891) [`ae00350`](https://github.com/primer/react/commit/ae00350e62f6251afe95591bf60cdb8280739b43) Thanks [@langermank](https://github.com/langermank)! - `StackItem` responsive grow bug fix

- [#4928](https://github.com/primer/react/pull/4928) [`caf4bcf`](https://github.com/primer/react/commit/caf4bcfc3e731c56e701cbeaf71d2b79e2a05a22) Thanks [@langermank](https://github.com/langermank)! - Bug fix: `invisible` Button variant missing background color when disabled

- [#4865](https://github.com/primer/react/pull/4865) [`ce2c674`](https://github.com/primer/react/commit/ce2c6749922a97a258147382bdc31e410f6b76eb) Thanks [@camertron](https://github.com/camertron)! - Update `Label` font weight to match Rails component

- [#4895](https://github.com/primer/react/pull/4895) [`0208e9e`](https://github.com/primer/react/commit/0208e9e50a58c0d44b89f9165b2d55f9b465841b) Thanks [@langermank](https://github.com/langermank)! - Bump `primer/primitives` v9.0.3

## 37.0.0-rc.3

### Patch Changes

- [#4870](https://github.com/primer/react/pull/4870) [`3ca513c824fc50b49a88320ec98dd3f1a15d25b9`](https://github.com/primer/react/commit/3ca513c824fc50b49a88320ec98dd3f1a15d25b9) Thanks [@jonrohan](https://github.com/jonrohan)! - Add `:where()` selector to classes that land on nodes that have a `sx` prop.

- [#4811](https://github.com/primer/react/pull/4811) [`5ee8704ff5b85ec2b848dcfc10c3a8ae40a3a892`](https://github.com/primer/react/commit/5ee8704ff5b85ec2b848dcfc10c3a8ae40a3a892) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Octicon: Add aria-label to the Icon instead of its container

- [#4858](https://github.com/primer/react/pull/4858) [`6c69bffb288caf8006cc3316afe86396d9987e49`](https://github.com/primer/react/commit/6c69bffb288caf8006cc3316afe86396d9987e49) Thanks [@jonrohan](https://github.com/jonrohan)! - Refactor Link, Blankslate, Heading to use :where css

- [#4866](https://github.com/primer/react/pull/4866) [`587603bcd750e558f443b071deb3dac90d004a90`](https://github.com/primer/react/commit/587603bcd750e558f443b071deb3dac90d004a90) Thanks [@langermank](https://github.com/langermank)! - Add `className` to Blankslate

- [#4831](https://github.com/primer/react/pull/4831) [`0d7a02a062d19b8909124b0756a41bec6455a39e`](https://github.com/primer/react/commit/0d7a02a062d19b8909124b0756a41bec6455a39e) Thanks [@siddharthkp](https://github.com/siddharthkp)! - TextInput: Update trailing action styles for hover state

## 37.0.0-rc.2

### Major Changes

- [#4783](https://github.com/primer/react/pull/4783) [`7c57f40d55ba2f10c6255e5273d5ae8021a919e5`](https://github.com/primer/react/commit/7c57f40d55ba2f10c6255e5273d5ae8021a919e5) Thanks [@joshblack](https://github.com/joshblack)! - Remove the SSRProvider component and useSSRSafeId hook

- [#4781](https://github.com/primer/react/pull/4781) [`2d7307ae575e0a5e17e602bab860e538e2bc148a`](https://github.com/primer/react/commit/2d7307ae575e0a5e17e602bab860e538e2bc148a) Thanks [@joshblack](https://github.com/joshblack)! - Remove the deprecated FilterList component from Primer React

### Minor Changes

- [#4804](https://github.com/primer/react/pull/4804) [`fd2c7052be423150648d30f4baca0857b0644318`](https://github.com/primer/react/commit/fd2c7052be423150648d30f4baca0857b0644318) Thanks [@joshblack](https://github.com/joshblack)! - Remove experimental TabPanels component in preference of UnderlinePanels

- [#4819](https://github.com/primer/react/pull/4819) [`0112347b23d1aebf9a5dfea5cb01591b700dd653`](https://github.com/primer/react/commit/0112347b23d1aebf9a5dfea5cb01591b700dd653) Thanks [@joshblack](https://github.com/joshblack)! - Update Heading component to use CSS Modules behind feature flag

- [#4750](https://github.com/primer/react/pull/4750) [`414c140cf86b37cd0104cdc8b027636a57cc0127`](https://github.com/primer/react/commit/414c140cf86b37cd0104cdc8b027636a57cc0127) Thanks [@iansan5653](https://github.com/iansan5653)! - Add `KeybindingHint` component for indicating an available keyboard shortcut

- [#4852](https://github.com/primer/react/pull/4852) [`1cb1470d587087d9927abd2b2991c5068b79cdf4`](https://github.com/primer/react/commit/1cb1470d587087d9927abd2b2991c5068b79cdf4) Thanks [@joshblack](https://github.com/joshblack)! - Add support for sourcemaps for emitted CSS files

### Patch Changes

- [#4795](https://github.com/primer/react/pull/4795) [`ca6b4b1b6db2e867212689417503fcf3f29a7bce`](https://github.com/primer/react/commit/ca6b4b1b6db2e867212689417503fcf3f29a7bce) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList: Enable focusZone for roles listbox and menu

- [#4828](https://github.com/primer/react/pull/4828) [`1a674f7ad18eb51bfc3ea63ec53b14880ebfd25a`](https://github.com/primer/react/commit/1a674f7ad18eb51bfc3ea63ec53b14880ebfd25a) Thanks [@jonrohan](https://github.com/jonrohan)! - Refactor Link component to use CSS modules using the feature flag `primer_react_css_modules`

- [#4841](https://github.com/primer/react/pull/4841) [`f3b08dfd20681b04c5812a5ff66ea65d0e090db9`](https://github.com/primer/react/commit/f3b08dfd20681b04c5812a5ff66ea65d0e090db9) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Remove `aria-busy` from `ProgressBar` component

- [#4857](https://github.com/primer/react/pull/4857) [`16c31e6933d4f98db15baa880110fdf8aa2409e5`](https://github.com/primer/react/commit/16c31e6933d4f98db15baa880110fdf8aa2409e5) Thanks [@jonrohan](https://github.com/jonrohan)! - fix(Blankslate): Don't use Box to render heading when flag is enabled

- [#4855](https://github.com/primer/react/pull/4855) [`873249a1e31d74e1d94399f495558ce9574f22c5`](https://github.com/primer/react/commit/873249a1e31d74e1d94399f495558ce9574f22c5) Thanks [@mattcosta7](https://github.com/mattcosta7)! - avoid useeffect when syncing theme config

## 37.0.0-rc.1

### Minor Changes

- [#4834](https://github.com/primer/react/pull/4834) [`7ce1fda3174b8f707c784a8ffdf576e6ffbfac9d`](https://github.com/primer/react/commit/7ce1fda3174b8f707c784a8ffdf576e6ffbfac9d) Thanks [@langermank](https://github.com/langermank)! - Add `size` and `weight` props to `Text`

- [#4824](https://github.com/primer/react/pull/4824) [`b85d5057d2576a4bad37469daeb8ef66d34091cd`](https://github.com/primer/react/commit/b85d5057d2576a4bad37469daeb8ef66d34091cd) Thanks [@iansan5653](https://github.com/iansan5653)! - Adds new `className` prop to `FormControl` component

- [#4810](https://github.com/primer/react/pull/4810) [`c0425ff7d0b9572f7551f114133fd0302980815f`](https://github.com/primer/react/commit/c0425ff7d0b9572f7551f114133fd0302980815f) Thanks [@joshblack](https://github.com/joshblack)! - Update Blankslate component to use CSS Modules behind a feature flag

- [#4838](https://github.com/primer/react/pull/4838) [`7a3b55d1374217b3cd2a33f048c7d60929fca5b5`](https://github.com/primer/react/commit/7a3b55d1374217b3cd2a33f048c7d60929fca5b5) Thanks [@joshblack](https://github.com/joshblack)! - Add support for custom icons when a Banner is variant="upsell"

### Patch Changes

- [#4806](https://github.com/primer/react/pull/4806) [`84d1604ecf2c07b5584f7c5db2cd078c18847cbf`](https://github.com/primer/react/commit/84d1604ecf2c07b5584f7c5db2cd078c18847cbf) Thanks [@langermank](https://github.com/langermank)! - Add `variant` prop to Heading for small, medium and large styles

- [#4766](https://github.com/primer/react/pull/4766) [`e74e5810590ea389a8594153a60b45e6b37f69b3`](https://github.com/primer/react/commit/e74e5810590ea389a8594153a60b45e6b37f69b3) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - chore(deps): Update eslint-plugin-primer-react to latest

- [#4816](https://github.com/primer/react/pull/4816) [`f9bc73c167f4453cfb7a0636e72d216c6bd0d039`](https://github.com/primer/react/commit/f9bc73c167f4453cfb7a0636e72d216c6bd0d039) Thanks [@siddharthkp](https://github.com/siddharthkp)! - FilteredActionList: export `FilteredActionList` from '@primer/react/experimental'

## 37.0.0-rc.0

### Major Changes

- [#4800](https://github.com/primer/react/pull/4800) [`482b4d6ab815350d5f5b71d686bf76cb3d234686`](https://github.com/primer/react/commit/482b4d6ab815350d5f5b71d686bf76cb3d234686) Thanks [@joshblack](https://github.com/joshblack)! - Update Primer React to emit _.css files that are imported by emitted _.js files for styling

### Minor Changes

- [#4814](https://github.com/primer/react/pull/4814) [`1cda89c2d92719e0fa85e3945a53bd5bd6b301de`](https://github.com/primer/react/commit/1cda89c2d92719e0fa85e3945a53bd5bd6b301de) Thanks [@langermank](https://github.com/langermank)! - Add `link` variant to Button

- [#4771](https://github.com/primer/react/pull/4771) [`92e05f7c51d23778ead897f935f2cc14ed8ceff1`](https://github.com/primer/react/commit/92e05f7c51d23778ead897f935f2cc14ed8ceff1) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Set `openOnFocus` default to `false`, making the menu closed initially rather than opening on focus of input

- [#4798](https://github.com/primer/react/pull/4798) [`0fa60a49177cf6bf60cdb5d4714d5e55708461f9`](https://github.com/primer/react/commit/0fa60a49177cf6bf60cdb5d4714d5e55708461f9) Thanks [@joshblack](https://github.com/joshblack)! - Add the deprecated Dialog, Octicon, Pagehead, TabNav, and Tooltip components to @primer/react/deprecated

### Patch Changes

- [#4774](https://github.com/primer/react/pull/4774) [`11e7aef33f124e84b4cf5c9e62c766834c6d1c31`](https://github.com/primer/react/commit/11e7aef33f124e84b4cf5c9e62c766834c6d1c31) Thanks [@langermank](https://github.com/langermank)! - - Adjust checkbox and radio border color values for high contrast themes

  - Add default border to SegmentedControl
  - Add inset box-shadow to StatusLabel to prep for new border-color in dark high contrast

- [#4666](https://github.com/primer/react/pull/4666) [`04eac6280224d365f0496d927a87b32150006f9e`](https://github.com/primer/react/commit/04eac6280224d365f0496d927a87b32150006f9e) Thanks [@TylerJDev](https://github.com/TylerJDev)! - ActionList: Adds `aria-labelledby` to `ActionList.TrailingVisual`, making it part of the accessible name of `ActionList.Item`

- [#4768](https://github.com/primer/react/pull/4768) [`b7c90ea44be4abfb00a451567115cda6d9bc864d`](https://github.com/primer/react/commit/b7c90ea44be4abfb00a451567115cda6d9bc864d) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Header: Add overflow when there are a lot of items

- [#4803](https://github.com/primer/react/pull/4803) [`527f9a9320c51b9b1a0884b388d5ff53af7c11b1`](https://github.com/primer/react/commit/527f9a9320c51b9b1a0884b388d5ff53af7c11b1) Thanks [@aprendendofelipe](https://github.com/aprendendofelipe)! - Bumps @github/relative-time-element to v4.4.2

## 36.27.0

### Minor Changes

- [#4485](https://github.com/primer/react/pull/4485) [`991839cd2487a24e76f45b516acb974ea006e1c8`](https://github.com/primer/react/commit/991839cd2487a24e76f45b516acb974ea006e1c8) Thanks [@mperrotti](https://github.com/mperrotti)! - Add `loading` state to `Button` and `IconButton`

- [#4725](https://github.com/primer/react/pull/4725) [`6db8b2fba72ac934db1481adc4a6f067032b5936`](https://github.com/primer/react/commit/6db8b2fba72ac934db1481adc4a6f067032b5936) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - PageHeader: Promote the component to Beta status and now it is available to import from "@primer/react"

- [#4719](https://github.com/primer/react/pull/4719) [`801ca9653154490f664e55bbb357cd6cf6f198be`](https://github.com/primer/react/commit/801ca9653154490f664e55bbb357cd6cf6f198be) Thanks [@joshblack](https://github.com/joshblack)! - Add experimental ScrollableRegion component and useOverflow hook

### Patch Changes

- [#4770](https://github.com/primer/react/pull/4770) [`8574027d887eeb202f3c902397d3f9750b0aeaa4`](https://github.com/primer/react/commit/8574027d887eeb202f3c902397d3f9750b0aeaa4) Thanks [@mperrotti](https://github.com/mperrotti)! - Prevents inactive indicator icon/tooltip from appearing in ActionMenu items

- [#4733](https://github.com/primer/react/pull/4733) [`1c131f8ca56790ae516290a8a4199718ccff475b`](https://github.com/primer/react/commit/1c131f8ca56790ae516290a8a4199718ccff475b) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - TextInput: Refactor TextInputInnerAction to use the default icon button tooltip (No changes in the behaviour or DOM is expected)

- [#4778](https://github.com/primer/react/pull/4778) [`a9730c93f3d51b6d976fe598f8168e67d4649fb0`](https://github.com/primer/react/commit/a9730c93f3d51b6d976fe598f8168e67d4649fb0) Thanks [@langermank](https://github.com/langermank)! - Bug fix: ActionList divider disappears on selected items

- [#4757](https://github.com/primer/react/pull/4757) [`d4f23fbaf6ee251e142fddadfa69ab1bd6216ef5`](https://github.com/primer/react/commit/d4f23fbaf6ee251e142fddadfa69ab1bd6216ef5) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel v2: Fix heading color for dark themes

- [#4741](https://github.com/primer/react/pull/4741) [`a9fab9805e166a80585366f865ce50f0a727e660`](https://github.com/primer/react/commit/a9fab9805e166a80585366f865ce50f0a727e660) Thanks [@Princeyadav05](https://github.com/Princeyadav05)! - AnchoredOverlay: Add 'className' prop to the component

- [#4738](https://github.com/primer/react/pull/4738) [`453279368462c8e8581b65c56ba3d31a689009c3`](https://github.com/primer/react/commit/453279368462c8e8581b65c56ba3d31a689009c3) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - PageHeader: Fix shrinking Actions sub component in Safari

- [#4772](https://github.com/primer/react/pull/4772) [`3779dbf117793112945668fe2694cdc6715c2e32`](https://github.com/primer/react/commit/3779dbf117793112945668fe2694cdc6715c2e32) Thanks [@TylerJDev](https://github.com/TylerJDev)! - (Behind feature flag) ActionList: Fix issue where triggering a keyboard event was possible when using the `onSelect` prop

- [#4764](https://github.com/primer/react/pull/4764) [`533f997922f2621e242ab3bbe1799939a3d5a6f0`](https://github.com/primer/react/commit/533f997922f2621e242ab3bbe1799939a3d5a6f0) Thanks [@siddharthkp](https://github.com/siddharthkp)! - StateLabel: Differentiate issue and pull request labels for screen readers

- [#4710](https://github.com/primer/react/pull/4710) [`7d086c73a980de333c55717717dd9e744196dd8e`](https://github.com/primer/react/commit/7d086c73a980de333c55717717dd9e744196dd8e) Thanks [@joshblack](https://github.com/joshblack)! - Update Blankslate styles to better support server-side rendering

## 36.26.0

### Minor Changes

- [#4718](https://github.com/primer/react/pull/4718) [`fd80a60eeb615b3c4464ade10cde7e26e1349e40`](https://github.com/primer/react/commit/fd80a60eeb615b3c4464ade10cde7e26e1349e40) Thanks [@joshblack](https://github.com/joshblack)! - Add support for providing icons as an element to UnderlineNavItem

- [#4702](https://github.com/primer/react/pull/4702) [`2536b4995568a6353c67c812a34a970fca7e76bb`](https://github.com/primer/react/commit/2536b4995568a6353c67c812a34a970fca7e76bb) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - IconButton: Enable tooltips by default in icon buttons by updating the default value of `unsafeDisableTooltip` to `false`.

  This is a behaviour change in icon buttons, please upgrade with a caution.

- [#4707](https://github.com/primer/react/pull/4707) [`d773f264f923677b4109d03b9c5bd5054151037b`](https://github.com/primer/react/commit/d773f264f923677b4109d03b9c5bd5054151037b) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - IconButton: Add `keyshortcuts` prop to allow labelling and describing support for keyboard shortcut (through tooltips)

- [#4729](https://github.com/primer/react/pull/4729) [`71bdfa847d4cc569bb59b0b4e7a3010f1d7a0faa`](https://github.com/primer/react/commit/71bdfa847d4cc569bb59b0b4e7a3010f1d7a0faa) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Dialog2: Add support for "InitialFocusRef" that allows to specify an element that should receive focus when the dialog opens.

### Patch Changes

- [#4742](https://github.com/primer/react/pull/4742) [`c004fd50fb333022644c39645f6fabb494fc1d8b`](https://github.com/primer/react/commit/c004fd50fb333022644c39645f6fabb494fc1d8b) Thanks [@joshblack](https://github.com/joshblack)! - Update exports for UnderlinePanels component

## 36.25.0

### Minor Changes

- [#4051](https://github.com/primer/react/pull/4051) [`7e644b70359fcba07810560abcb8b1fbe785668a`](https://github.com/primer/react/commit/7e644b70359fcba07810560abcb8b1fbe785668a) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds a loading state to ActionList items. Also allows the Spinner component to accept screenreader text.

  <!-- Changed components: ActionList, ActionMenu, NavList, Spinners -->

- [#4697](https://github.com/primer/react/pull/4697) [`a7d1e4f37cd8fd01c86250178ef6ae748d786e03`](https://github.com/primer/react/commit/a7d1e4f37cd8fd01c86250178ef6ae748d786e03) Thanks [@khiga8](https://github.com/khiga8)! - Add TrailingAction support to NavList

### Patch Changes

- [#4706](https://github.com/primer/react/pull/4706) [`71859edc30664e259c855ffdc3732cda8dc6d169`](https://github.com/primer/react/commit/71859edc30664e259c855ffdc3732cda8dc6d169) Thanks [@TylerJDev](https://github.com/TylerJDev)! - (Behind feature flag) ActionList: Fix for "full" variant when using button semantics

- [#4711](https://github.com/primer/react/pull/4711) [`199e3840af17d8ea7c75dbba60cdfbaaf7ef4021`](https://github.com/primer/react/commit/199e3840af17d8ea7c75dbba60cdfbaaf7ef4021) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Removes live region from `FormControl` validation

## 36.24.0

### Minor Changes

- [#4673](https://github.com/primer/react/pull/4673) [`eedc6b16ba3078025c636a8c1368f38f7f9b798d`](https://github.com/primer/react/commit/eedc6b16ba3078025c636a8c1368f38f7f9b798d) Thanks [@joshblack](https://github.com/joshblack)! - Add experimental support for the AriaStatus, AriaAlert, and Announce components

- [#4691](https://github.com/primer/react/pull/4691) [`55e97a9027aafd0ee432d8d5c293d75792de96dc`](https://github.com/primer/react/commit/55e97a9027aafd0ee432d8d5c293d75792de96dc) Thanks [@joshblack](https://github.com/joshblack)! - Update internal VisuallyHidden helper to use a `span` by default over a `div` to support more nesting scenarios by default

### Patch Changes

- [#4699](https://github.com/primer/react/pull/4699) [`546803e66661d353450c9ef2fc8cbfd51ca18d41`](https://github.com/primer/react/commit/546803e66661d353450c9ef2fc8cbfd51ca18d41) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Overlay: Set `style` prop correctly

- [#4669](https://github.com/primer/react/pull/4669) [`1403ef7e015165119b03b73832c5aa8b2f093021`](https://github.com/primer/react/commit/1403ef7e015165119b03b73832c5aa8b2f093021) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - PageHeader: Resolve layout shift issues on Title and Actions

## 36.23.0

### Minor Changes

- [#4634](https://github.com/primer/react/pull/4634) [`db72a714211b1f2aa8ee0cebaca056c702963542`](https://github.com/primer/react/commit/db72a714211b1f2aa8ee0cebaca056c702963542) Thanks [@khiga8](https://github.com/khiga8)! - Introduce ActionList.TrailingAction to support secondary action on ActionList.Item

- [#4052](https://github.com/primer/react/pull/4052) [`e2f35e2eda04e2128aaaf98c188cc94a34de7aeb`](https://github.com/primer/react/commit/e2f35e2eda04e2128aaaf98c188cc94a34de7aeb) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds components to support skeleton loading states, and uses those components to replace ad-hoc skeleton loading states in Primer React components.

  <!-- Changed components: SkeletonAvatar, SkeletonBox, SkeletonText -->

- [#4140](https://github.com/primer/react/pull/4140) [`c093411ec6caa4d4ce1720a68a22e492d5f39458`](https://github.com/primer/react/commit/c093411ec6caa4d4ce1720a68a22e492d5f39458) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds a prop, `srText`, to the Spinner component to convey a loading message to assistive technologies such as screen readers.

  <!-- Changed components: Spinner -->

- [#4272](https://github.com/primer/react/pull/4272) [`3c467efc794d47326613796149f422c24a9b3cb9`](https://github.com/primer/react/commit/3c467efc794d47326613796149f422c24a9b3cb9) Thanks [@TylerJDev](https://github.com/TylerJDev)! - (Behind feature flag) ActionList: Utilizes `<button>` inside of `<li>` for interactive items.

- [#4527](https://github.com/primer/react/pull/4527) [`623b16e9832173d418092e47a85fd0a0a0d895f8`](https://github.com/primer/react/commit/623b16e9832173d418092e47a85fd0a0a0d895f8) Thanks [@langermank](https://github.com/langermank)! - Add `truncation` prop to `Button` to allow for ellipses overflow or text wrapping for long button labels

- [#4550](https://github.com/primer/react/pull/4550) [`3e493ba0723c9f0eadfacae6389959023561a700`](https://github.com/primer/react/commit/3e493ba0723c9f0eadfacae6389959023561a700) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds UnderlinePanels component. It's like UnderlineNav, but for rendering semantic tabs instead of links.

  <!-- Changed components: UnderilnePanels -->

### Patch Changes

- [#4651](https://github.com/primer/react/pull/4651) [`b13bbb33d547352926af5206741db123457a09a1`](https://github.com/primer/react/commit/b13bbb33d547352926af5206741db123457a09a1) Thanks [@mperrotti](https://github.com/mperrotti)! - Prevents text color from changing on hover for "inactive" ActionMenu.Items of the "danger" variant. Before this change, the text color would change on hover. After this change, the text color remains the same on hover.

- [#4695](https://github.com/primer/react/pull/4695) [`9ee8ec9a16d9a72e4723163115dd59ce7e8dce28`](https://github.com/primer/react/commit/9ee8ec9a16d9a72e4723163115dd59ce7e8dce28) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Fixes conditional in `ActionList.Item` that was dependent on FF being active before applying forwarded ref.

## 36.22.0

### Minor Changes

- [#4443](https://github.com/primer/react/pull/4443) [`f2523373e09e0027f29b36a995574a296ffde3da`](https://github.com/primer/react/commit/f2523373e09e0027f29b36a995574a296ffde3da) Thanks [@joshblack](https://github.com/joshblack)! - Add experimental InlineMessage component

- [#4613](https://github.com/primer/react/pull/4613) [`eb2ab132cd451b8c67a85d028483aa00a7a1c81b`](https://github.com/primer/react/commit/eb2ab132cd451b8c67a85d028483aa00a7a1c81b) Thanks [@joshblack](https://github.com/joshblack)! - `Dialog` and `ConfirmationDialog` can now be closed by clicking on the backdrop surrounding the dialog. This will cause `onClose` to be called with the `escape` gesture.

- [#4443](https://github.com/primer/react/pull/4443) [`f2523373e09e0027f29b36a995574a296ffde3da`](https://github.com/primer/react/commit/f2523373e09e0027f29b36a995574a296ffde3da) Thanks [@joshblack](https://github.com/joshblack)! - Add support for InlineMessage to experimental

- [#4667](https://github.com/primer/react/pull/4667) [`e2a974f4a376ca92b305e03f36f905ad02c61341`](https://github.com/primer/react/commit/e2a974f4a376ca92b305e03f36f905ad02c61341) Thanks [@ktravers](https://github.com/ktravers)! - Adds support for `className` prop to PageHeader component and its children.

## 36.21.0

### Minor Changes

- [#4635](https://github.com/primer/react/pull/4635) [`bd861cc779358fcb62fbcb48d2e76cdad90a9301`](https://github.com/primer/react/commit/bd861cc779358fcb62fbcb48d2e76cdad90a9301) Thanks [@lindseywild](https://github.com/lindseywild)! - RelativeTime: Adds `noTitle` prop if you want to not render the `title` attribute with full date time.

### Patch Changes

- [#4456](https://github.com/primer/react/pull/4456) [`65f2cd190069af4502e70c4a4d29099f81614122`](https://github.com/primer/react/commit/65f2cd190069af4502e70c4a4d29099f81614122) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Adds full `aria-expanded` (true/false) state to `AnchoredOverlay`, and components that consume it

- [#4640](https://github.com/primer/react/pull/4640) [`6cbbc497680a1ce4ffe4fa3cda45e6beca586f94`](https://github.com/primer/react/commit/6cbbc497680a1ce4ffe4fa3cda45e6beca586f94) Thanks [@joshblack](https://github.com/joshblack)! - Explicitly set the `type` attribute for `SegmentedControl.Button`

- [#4638](https://github.com/primer/react/pull/4638) [`240fa50d359f9a338be010c5f7f6af26bb881e2d`](https://github.com/primer/react/commit/240fa50d359f9a338be010c5f7f6af26bb881e2d) Thanks [@lindseywild](https://github.com/lindseywild)! - Bumps @github/relative-time-element to v4.4.1

## 36.20.0

### Minor Changes

- [#4358](https://github.com/primer/react/pull/4358) [`e34e4b265f7584c344a4b6b7145da1a5eec1ffb5`](https://github.com/primer/react/commit/e34e4b265f7584c344a4b6b7145da1a5eec1ffb5) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - PageHeader: Update the layout styles so that all interactive content comes after the title (while keeping the component visually the same).
  This is a breaking change however PageHeader is still a draft component so we are releasing the changes as minor but please upgrade with caution.

- [#4617](https://github.com/primer/react/pull/4617) [`42ba5dc5e722c2341761bf4c6e1e993aac9f2ca8`](https://github.com/primer/react/commit/42ba5dc5e722c2341761bf4c6e1e993aac9f2ca8) Thanks [@JelloBagel](https://github.com/JelloBagel)! - Add an ability to provide custom `aria-label` and `aria-labelledby` to `TreeView.Item`

## 36.19.1

### Patch Changes

- [#4555](https://github.com/primer/react/pull/4555) [`9b63299689500808167bacff624ff910269417b1`](https://github.com/primer/react/commit/9b63299689500808167bacff624ff910269417b1) Thanks [@JoyceZhu](https://github.com/JoyceZhu)! - Add `openInFocus` prop (default: true) to `AutocompleteInput`

- [#4601](https://github.com/primer/react/pull/4601) [`f57dd3d687042069c5e5712aa906e59df9f8729e`](https://github.com/primer/react/commit/f57dd3d687042069c5e5712aa906e59df9f8729e) Thanks [@bwittenberg](https://github.com/bwittenberg)! - SelectPanel2: Minor optimization for escape key event listener binding

- [#4589](https://github.com/primer/react/pull/4589) [`ed701bee8b6c1a9fb9b91462034f8fe04b0244ad`](https://github.com/primer/react/commit/ed701bee8b6c1a9fb9b91462034f8fe04b0244ad) Thanks [@joshblack](https://github.com/joshblack)! - Update how gap is set in Stack to work in wide breakpoints

- [#4598](https://github.com/primer/react/pull/4598) [`32c687041a600e8b54ffaf9b3ab77f9215a37e3e`](https://github.com/primer/react/commit/32c687041a600e8b54ffaf9b3ab77f9215a37e3e) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - Replaced space-small with base-size-6

- [#4543](https://github.com/primer/react/pull/4543) [`e47445df6c389fef2aacc72449c02ff471e4cb68`](https://github.com/primer/react/commit/e47445df6c389fef2aacc72449c02ff471e4cb68) Thanks [@TylerJDev](https://github.com/TylerJDev)! - FormControl: Adds new props to `FormControl.Label`, `requiredText` and `requiredIndicator`

## 36.19.0

### Minor Changes

- [#4546](https://github.com/primer/react/pull/4546) [`c81898c93664d224d7a18722cd1abcdcf2d1a510`](https://github.com/primer/react/commit/c81898c93664d224d7a18722cd1abcdcf2d1a510) Thanks [@ayy-bc](https://github.com/ayy-bc)! - TreeView: Add support for `TreeView.LeadingAction`

- [#4574](https://github.com/primer/react/pull/4574) [`9c01a930b97218ea550cd7de3436941990b3b068`](https://github.com/primer/react/commit/9c01a930b97218ea550cd7de3436941990b3b068) Thanks [@pksjce](https://github.com/pksjce)! - ActionBar: Move to main directory. ActionBar can now be imported from `'@primer/react'`

### Patch Changes

- [#4593](https://github.com/primer/react/pull/4593) [`d4e234f52bf63e632d41fe947801d2c16da0b61f`](https://github.com/primer/react/commit/d4e234f52bf63e632d41fe947801d2c16da0b61f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Update NavList to use the new ActionList.GroupHeading API and Add an "as" prop to specify the heading level as default h3. (No changes expected in the rendered HTML)

- [#4591](https://github.com/primer/react/pull/4591) [`6cce7b749d8502fc851ad8a432a04acff21dec14`](https://github.com/primer/react/commit/6cce7b749d8502fc851ad8a432a04acff21dec14) Thanks [@joshblack](https://github.com/joshblack)! - Update the Stack component so that the `justify` prop correctly updates the layout of items

- [#4572](https://github.com/primer/react/pull/4572) [`ac2502975057dc0330e19fdd2d446f43d77eed92`](https://github.com/primer/react/commit/ac2502975057dc0330e19fdd2d446f43d77eed92) Thanks [@iansan5653](https://github.com/iansan5653)! - TreeView: Always align expand/collapse chevron icon, leading visual, and trailing visual to top of item

- [#4596](https://github.com/primer/react/pull/4596) [`4fa4fae099c425bab58c6f5c3c98b10bbca16012`](https://github.com/primer/react/commit/4fa4fae099c425bab58c6f5c3c98b10bbca16012) Thanks [@keithamus](https://github.com/keithamus)! - Update @github/tab-container-element to latest

## 36.18.0

### Minor Changes

- [#4539](https://github.com/primer/react/pull/4539) [`f0de234b42f10a68d660823f54d94371db282fb6`](https://github.com/primer/react/commit/f0de234b42f10a68d660823f54d94371db282fb6) Thanks [@joshblack](https://github.com/joshblack)! - Update Banner to use an explicit aria-label instead of being labelled by Banner title

- [#4554](https://github.com/primer/react/pull/4554) [`ed31476f040dda41f00c2c7f4324120afb20cc18`](https://github.com/primer/react/commit/ed31476f040dda41f00c2c7f4324120afb20cc18) Thanks [@joshblack](https://github.com/joshblack)! - Broaden feature flag type for experimental FeatureFlags to accept undefined

- [#4513](https://github.com/primer/react/pull/4513) [`02a2a2bf0b02e0c2f9a09351eefbe91f9370e210`](https://github.com/primer/react/commit/02a2a2bf0b02e0c2f9a09351eefbe91f9370e210) Thanks [@owenniblock](https://github.com/owenniblock)! - Exports createComponent

- [#4486](https://github.com/primer/react/pull/4486) [`447a1fd1d37e4f61f38345babab954540b58e53b`](https://github.com/primer/react/commit/447a1fd1d37e4f61f38345babab954540b58e53b) Thanks [@iansan5653](https://github.com/iansan5653)! - Adds support for nested submenus to `ActionMenu`

### Patch Changes

- [#4575](https://github.com/primer/react/pull/4575) [`4ecbe1a8997b2cd509b7a97803c33916f3cb4aed`](https://github.com/primer/react/commit/4ecbe1a8997b2cd509b7a97803c33916f3cb4aed) Thanks [@joshblack](https://github.com/joshblack)! - Update minimum version for @primer/live-region-element

- [#4536](https://github.com/primer/react/pull/4536) [`024124a11fc17813de05cae861a5e32596060f8b`](https://github.com/primer/react/commit/024124a11fc17813de05cae861a5e32596060f8b) Thanks [@pksjce](https://github.com/pksjce)! - ActionBar: Add a few fixes and relevant tests

- [#4548](https://github.com/primer/react/pull/4548) [`95cd867ab43e8c2179569ea6e61ad71a6c386256`](https://github.com/primer/react/commit/95cd867ab43e8c2179569ea6e61ad71a6c386256) Thanks [@randall-krauskopf](https://github.com/randall-krauskopf)! - TreeView: Fix toggling subtree via Space key (in addition to Enter key)

- [#4566](https://github.com/primer/react/pull/4566) [`4dd6bef7513e6ae32aa236410f2fbf1eb72a5eb9`](https://github.com/primer/react/commit/4dd6bef7513e6ae32aa236410f2fbf1eb72a5eb9) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList: Fix leaky description styles for disabled item

- [#4567](https://github.com/primer/react/pull/4567) [`e39fcf8dc9e7447c5f04124f408f550f73659dc1`](https://github.com/primer/react/commit/e39fcf8dc9e7447c5f04124f408f550f73659dc1) Thanks [@dgreif](https://github.com/dgreif)! - Dialog: Use dynamic view height/width. This allows available visible space to be properly computed on iOS devices.

- [#4556](https://github.com/primer/react/pull/4556) [`9a567275be423ab8d5fe15edcf06996c2e21217d`](https://github.com/primer/react/commit/9a567275be423ab8d5fe15edcf06996c2e21217d) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - BranchName: Fixing text color when rendered as span

## 36.17.0

### Minor Changes

- [#4389](https://github.com/primer/react/pull/4389) [`02035fef00d927cdf6ff97ce005592657f9a6d13`](https://github.com/primer/react/commit/02035fef00d927cdf6ff97ce005592657f9a6d13) Thanks [@JeffreyKozik](https://github.com/JeffreyKozik)! - experimental/SelectPanel + FormControl: Automatically wires SelectPanel v2 to the accessibility and validation provided by the FormControl component it's nested within

- [#4335](https://github.com/primer/react/pull/4335) [`8b4d838b84af07b0baa7abeda96c5502b9339f19`](https://github.com/primer/react/commit/8b4d838b84af07b0baa7abeda96c5502b9339f19) Thanks [@joshblack](https://github.com/joshblack)! - Add support for experimental Banner component

### Patch Changes

- [#4484](https://github.com/primer/react/pull/4484) [`1c847bdf75e28d62015c5b8e9d77c26e5b0995dc`](https://github.com/primer/react/commit/1c847bdf75e28d62015c5b8e9d77c26e5b0995dc) Thanks [@JelloBagel](https://github.com/JelloBagel)! - TreeView: Fix returning focus when active element is not a treeitem

## 36.16.0

### Minor Changes

- [#4512](https://github.com/primer/react/pull/4512) [`622b1447d12232559e1bf2659a94c191e07da225`](https://github.com/primer/react/commit/622b1447d12232559e1bf2659a94c191e07da225) Thanks [@colebemis](https://github.com/colebemis)! - Added `className` props to `TreeView` and `TreeView.Item` components for custom styling.

## 36.15.0

### Minor Changes

- [#4506](https://github.com/primer/react/pull/4506) [`d1419184511be5a3418fca437c805293456f0845`](https://github.com/primer/react/commit/d1419184511be5a3418fca437c805293456f0845) Thanks [@owenniblock](https://github.com/owenniblock)! - Export ActionBar default as ActionBar so it can be imported correctly

- [#4423](https://github.com/primer/react/pull/4423) [`ee4608833ae79a9c05cbaa76f3602e40c9ba8554`](https://github.com/primer/react/commit/ee4608833ae79a9c05cbaa76f3602e40c9ba8554) Thanks [@langermank](https://github.com/langermank)! - Add support for the experimental Stack component

- [#4276](https://github.com/primer/react/pull/4276) [`13971c92669013ce6f5afe51782d251a5e2c5a17`](https://github.com/primer/react/commit/13971c92669013ce6f5afe51782d251a5e2c5a17) Thanks [@joshblack](https://github.com/joshblack)! - Add support for an experimental FeatureFlags component for working with feature flags in Primer

### Patch Changes

- [#4501](https://github.com/primer/react/pull/4501) [`8bfab0a2760eb0734aea19b38ba5957a5deb8ca2`](https://github.com/primer/react/commit/8bfab0a2760eb0734aea19b38ba5957a5deb8ca2) Thanks [@pksjce](https://github.com/pksjce)! - ActionBar: Make it such that either aria-label or aria-labelledby is present

- [#4331](https://github.com/primer/react/pull/4331) [`77846c4e93cb0b7711654272162fa6f73d9cc90e`](https://github.com/primer/react/commit/77846c4e93cb0b7711654272162fa6f73d9cc90e) Thanks [@langermank](https://github.com/langermank)! - Bug fix: Add `word-break` to ActionList items

## 36.14.0

### Minor Changes

- [#4224](https://github.com/primer/react/pull/4224) [`8e9267fbc77946c65844a5cb3a714ba57291fc5c`](https://github.com/primer/react/commit/8e9267fbc77946c65844a5cb3a714ba57291fc5c) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - IconButton: introduce tooltips on icon buttons behind the `unsafeDisableTooltip` prop for an incremental rollout.

  In the next release, we plan to update the default value of `unsafeDisableTooltip` to `false` so that the tooltip behaviour becomes the default.

- [#4425](https://github.com/primer/react/pull/4425) [`6682d28bbb8fe5aa2c959f8013cbcfc4f3c7030e`](https://github.com/primer/react/commit/6682d28bbb8fe5aa2c959f8013cbcfc4f3c7030e) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Dialog v2: Add support for `returnFocusRef`

### Patch Changes

- [#4463](https://github.com/primer/react/pull/4463) [`4b001296005e1fa2c11afe0b41bc852f44a5b905`](https://github.com/primer/react/commit/4b001296005e1fa2c11afe0b41bc852f44a5b905) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - TooltipV2: Check if tooltip element has `popover` attribute before calling `showPopover` and `hidePopover`

- [#4451](https://github.com/primer/react/pull/4451) [`2f4939375a9d3b81f7f618ad2ea6f1a77cad187e`](https://github.com/primer/react/commit/2f4939375a9d3b81f7f618ad2ea6f1a77cad187e) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Utilize `getGlobalFocusStyle` to prevent `outline-offset` from being overridden by default browser styles

- [#4471](https://github.com/primer/react/pull/4471) [`aa8b6d83467ebd0d18939fc375340471a585deea`](https://github.com/primer/react/commit/aa8b6d83467ebd0d18939fc375340471a585deea) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltipv2: Prevent closing other overlays when tooltip has the focus when ESC is hit

- [#4393](https://github.com/primer/react/pull/4393) [`57e1742c1538be83b208e08ff97b31df02acb5fa`](https://github.com/primer/react/commit/57e1742c1538be83b208e08ff97b31df02acb5fa) Thanks [@maximedegreve](https://github.com/maximedegreve)! - Add our react template to the README.md

- [#4270](https://github.com/primer/react/pull/4270) [`ae14db7378efa90cad8623d6729747f0ca8f098b`](https://github.com/primer/react/commit/ae14db7378efa90cad8623d6729747f0ca8f098b) Thanks [@lukeed](https://github.com/lukeed)! - TreeView: Toggle subtree via Space key (in addition to Enter key)

- [#4477](https://github.com/primer/react/pull/4477) [`054de02df44c2f1144db58e9778350d7bc0fb863`](https://github.com/primer/react/commit/054de02df44c2f1144db58e9778350d7bc0fb863) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ThemeProvider + SSR: Fix incorrect theme with multiple ThemeProviders on page

## 36.13.0

### Minor Changes

- [#4395](https://github.com/primer/react/pull/4395) [`c2557d102b80ea4ccc280e041bea212e8602573e`](https://github.com/primer/react/commit/c2557d102b80ea4ccc280e041bea212e8602573e) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - ActionList.Group: deprecate `title` prop - please use `ActionList.GroupHeading` instead
  ActionList.GroupHeading: update the warning to be an error if there is no explict `as` prop for list `role` action lists.
  ActionList.GroupHeading: There shouldn't be an `as` prop on `ActionList.GroupHeading` for `listbox` or `menu` role action lists. console.error if there is one

- [#4241](https://github.com/primer/react/pull/4241) [`5f94a236adf6511a4817e720d1f7358f38233b31`](https://github.com/primer/react/commit/5f94a236adf6511a4817e720d1f7358f38233b31) Thanks [@owenniblock](https://github.com/owenniblock)! - Adds new alpha component: TabPanels to match Primer View Components.

  TabPanels should be used when semantic tabs are required and the tablist is not a navigation element.

- [#4407](https://github.com/primer/react/pull/4407) [`4a7e44a510d94802acb865e8e5530f8b5fae8dee`](https://github.com/primer/react/commit/4a7e44a510d94802acb865e8e5530f8b5fae8dee) Thanks [@joshblack](https://github.com/joshblack)! - experimental/SelectPanel: Add support for announcements to SelectPanel.Loading

- [#4417](https://github.com/primer/react/pull/4417) [`d7f4f7c71ef86b80d62683cb6e0f0d36ea370681`](https://github.com/primer/react/commit/d7f4f7c71ef86b80d62683cb6e0f0d36ea370681) Thanks [@joshblack](https://github.com/joshblack)! - Update @primer/octicons-react to 19.9.0

### Patch Changes

- [#4305](https://github.com/primer/react/pull/4305) [`37c47708d7755c0387cdc94f68389226799ee707`](https://github.com/primer/react/commit/37c47708d7755c0387cdc94f68389226799ee707) Thanks [@keithamus](https://github.com/keithamus)! - Render SSR date for RelativeTime

- [#4385](https://github.com/primer/react/pull/4385) [`254e289b845c5167febd304be082fe8493aa87ab`](https://github.com/primer/react/commit/254e289b845c5167febd304be082fe8493aa87ab) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - ActionMenu: Add `id` to `ActionMenu.Anchor` types

- [#4388](https://github.com/primer/react/pull/4388) [`c4a4674907f747ee154ca4e2a4ccd8bf2c0c3541`](https://github.com/primer/react/commit/c4a4674907f747ee154ca4e2a4ccd8bf2c0c3541) Thanks [@keithamus](https://github.com/keithamus)! - ActionBar now produces valid HTML

- [#4403](https://github.com/primer/react/pull/4403) [`d4edf2a7f85d944859e744b9c978d89ed92ac6f7`](https://github.com/primer/react/commit/d4edf2a7f85d944859e744b9c978d89ed92ac6f7) Thanks [@keithamus](https://github.com/keithamus)! - Improve display names for React components built from Custom Elements

- [#4446](https://github.com/primer/react/pull/4446) [`a3355a5483e37bebe077c7aa000ae8e4ed0f77b9`](https://github.com/primer/react/commit/a3355a5483e37bebe077c7aa000ae8e4ed0f77b9) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltipv2: Update the threshold value to match with the offset

- [#4440](https://github.com/primer/react/pull/4440) [`674437d421bc6a1237b286d6840a0043a1a67314`](https://github.com/primer/react/commit/674437d421bc6a1237b286d6840a0043a1a67314) Thanks [@joshblack](https://github.com/joshblack)! - Update DataTable to avoid layout overflow when visually hidden selectors are used in Table headers

- [#4277](https://github.com/primer/react/pull/4277) [`69915d9e9cbba2d378e0acc065474a93bf5411b0`](https://github.com/primer/react/commit/69915d9e9cbba2d378e0acc065474a93bf5411b0) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel: Add responsive variants

- [#4426](https://github.com/primer/react/pull/4426) [`369c3036c8701f227ac5e49b38d32f65f6a8ce97`](https://github.com/primer/react/commit/369c3036c8701f227ac5e49b38d32f65f6a8ce97) Thanks [@iansan5653](https://github.com/iansan5653)! - Fixes a bug where consumers cannot override buttons' aria-disabled attribute

- [#4424](https://github.com/primer/react/pull/4424) [`392a3ca508b5de1b7440ff9f6f0700414560f2cf`](https://github.com/primer/react/commit/392a3ca508b5de1b7440ff9f6f0700414560f2cf) Thanks [@pksjce](https://github.com/pksjce)! - ActionBar: The overflow menu was earlier bootlegged with heavily customised ActionList. This is being replaced with ActionMenu which is cleaner and more robust.

- [#4234](https://github.com/primer/react/pull/4234) [`8bbb8e5d7be39bc46d0c9ee1687533f1a9fc6efa`](https://github.com/primer/react/commit/8bbb8e5d7be39bc46d0c9ee1687533f1a9fc6efa) Thanks [@Rebstorm](https://github.com/Rebstorm)! - `<UnderlineNav>` menu now uses the Anchored Position on smaller screen sizes to not clip, or go out of bounds.

- [#4392](https://github.com/primer/react/pull/4392) [`f100683a756c48c433fdd96f0837db9d1525b195`](https://github.com/primer/react/commit/f100683a756c48c433fdd96f0837db9d1525b195) Thanks [@langermank](https://github.com/langermank)! - Bug fix: make `active` label bold in ActionList

## 36.12.0

### Minor Changes

- [#4380](https://github.com/primer/react/pull/4380) [`a392556c734bcc1966f18370d1b3ddf6dcd7d0d4`](https://github.com/primer/react/commit/a392556c734bcc1966f18370d1b3ddf6dcd7d0d4) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltip v1: Remove the caret from the tooltip to make it consistent with the new tooltip design

- [#4364](https://github.com/primer/react/pull/4364) [`2f65ea526fce085f1e55b78c32a6b462d8f3583f`](https://github.com/primer/react/commit/2f65ea526fce085f1e55b78c32a6b462d8f3583f) Thanks [@joshblack](https://github.com/joshblack)! - Update IconButton default color to use fgColor-muted

### Patch Changes

- [#4379](https://github.com/primer/react/pull/4379) [`cb54f4298700d369e616aaefb2e7df4830231736`](https://github.com/primer/react/commit/cb54f4298700d369e616aaefb2e7df4830231736) Thanks [@langermank](https://github.com/langermank)! - Bug fix: default Button disabled bg-color

## 36.11.0

### Minor Changes

- [#4353](https://github.com/primer/react/pull/4353) [`2c0086e6da3ae3a360c12952399256c98941982e`](https://github.com/primer/react/commit/2c0086e6da3ae3a360c12952399256c98941982e) Thanks [@anleac](https://github.com/anleac)! - SelectPanel: Added `footer` prop that renders a sticky footer at the bottom of the item list.

- [#4288](https://github.com/primer/react/pull/4288) [`200fb18839053f669d30d86e4dd88b399b06a44b`](https://github.com/primer/react/commit/200fb18839053f669d30d86e4dd88b399b06a44b) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel: Add back button

- [#4097](https://github.com/primer/react/pull/4097) [`9c535e835a364bce5d01b28f4029d2bf4d5bdfaf`](https://github.com/primer/react/commit/9c535e835a364bce5d01b28f4029d2bf4d5bdfaf) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - TextInput: Update TextInput.Action internal component to use Tooltip v2

### Patch Changes

- [#4359](https://github.com/primer/react/pull/4359) [`937dbdea2a0b2f79b60f68440f5d8c24df344401`](https://github.com/primer/react/commit/937dbdea2a0b2f79b60f68440f5d8c24df344401) Thanks [@pksjce](https://github.com/pksjce)! - ActionBar: Overflow menu items should be able to trigger dialogs

- [#4327](https://github.com/primer/react/pull/4327) [`f08f85b5a90e532c7a8795f7bea5af80765283d4`](https://github.com/primer/react/commit/f08f85b5a90e532c7a8795f7bea5af80765283d4) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltip v2: Set the tooltip position when popover-open attribute is added to the tooltip element not the toggle event is triggered

- [#4348](https://github.com/primer/react/pull/4348) [`c64e5b25698885eeeeee5bc95c47582248011a39`](https://github.com/primer/react/commit/c64e5b25698885eeeeee5bc95c47582248011a39) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel: Do not render children of `<dialog>` when closed

- [#4308](https://github.com/primer/react/pull/4308) [`32b0cf77fcb4112f00da6ffb93a52875d23b9370`](https://github.com/primer/react/commit/32b0cf77fcb4112f00da6ffb93a52875d23b9370) Thanks [@tbenning](https://github.com/tbenning)! - Unify Breadcrumbs + fix a11y issue

- [#4334](https://github.com/primer/react/pull/4334) [`f685d521dd52d0a9601e0021189895e1adca3b0b`](https://github.com/primer/react/commit/f685d521dd52d0a9601e0021189895e1adca3b0b) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Switches focus styles to target `a.focus-visible` instead of `a:focus-visible`.

- [#4349](https://github.com/primer/react/pull/4349) [`15c078dda93ae8579a858efcce3b6a2f97204373`](https://github.com/primer/react/commit/15c078dda93ae8579a858efcce3b6a2f97204373) Thanks [@jonrohan](https://github.com/jonrohan)! - Adding aria-invalid="true" to TextInput when error.

- [#4365](https://github.com/primer/react/pull/4365) [`fe9f8baae473019e3605fae8895ba63f88fae074`](https://github.com/primer/react/commit/fe9f8baae473019e3605fae8895ba63f88fae074) Thanks [@pksjce](https://github.com/pksjce)! - Bugfix: `aria-invalid` is overridden in TextInput

- [#4354](https://github.com/primer/react/pull/4354) [`4b823ff237235564900aeadb81713e984676c5ad`](https://github.com/primer/react/commit/4b823ff237235564900aeadb81713e984676c5ad) Thanks [@siddharthkp](https://github.com/siddharthkp)! - TextInput: Remove redundant `aria-label` attribute from `TextInput.Action` when it already has an `aria-labelledby`.

- [#4320](https://github.com/primer/react/pull/4320) [`7cb3464a50a49efc59e9a29baa2dd543147b0bee`](https://github.com/primer/react/commit/7cb3464a50a49efc59e9a29baa2dd543147b0bee) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel: Move focus to first item if there is no filter input

- [#4337](https://github.com/primer/react/pull/4337) [`69f4489a3a6e928c5c387c8aa42668f5f3b0d92c`](https://github.com/primer/react/commit/69f4489a3a6e928c5c387c8aa42668f5f3b0d92c) Thanks [@manuelpuyol](https://github.com/manuelpuyol)! - Add precompile step for colorSchemes

- [#4360](https://github.com/primer/react/pull/4360) [`5baf73660f86fa4850f7c705d5d3ab1c599fe461`](https://github.com/primer/react/commit/5baf73660f86fa4850f7c705d5d3ab1c599fe461) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltip2: Render tooltip element as `span` instead of `div`

## 36.10.0

### Minor Changes

- [#4233](https://github.com/primer/react/pull/4233) [`fcd05284039b9768e37f687d65eece9242e4e2f8`](https://github.com/primer/react/commit/fcd05284039b9768e37f687d65eece9242e4e2f8) Thanks [@pksjce](https://github.com/pksjce)! - Add a new experimental component ActionBar

### Patch Changes

- [#4321](https://github.com/primer/react/pull/4321) [`94052a35167b2b8f024ebbb2b676acf24641b245`](https://github.com/primer/react/commit/94052a35167b2b8f024ebbb2b676acf24641b245) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel: Fix anchored position inside a Dialog

- [#4279](https://github.com/primer/react/pull/4279) [`a68e2e206eed4ecb8bbf9b0646271c776c301c1a`](https://github.com/primer/react/commit/a68e2e206eed4ecb8bbf9b0646271c776c301c1a) Thanks [@joshblack](https://github.com/joshblack)! - Add aria-labelledby to listbox within draft SelectPanel

- [#4278](https://github.com/primer/react/pull/4278) [`9ec7262fd0bfad6de689c7a73fad71e800cf5620`](https://github.com/primer/react/commit/9ec7262fd0bfad6de689c7a73fad71e800cf5620) Thanks [@langermank](https://github.com/langermank)! - Address a few v8 color bugs

- [#4294](https://github.com/primer/react/pull/4294) [`5ca5c0a6239029abbf285a0e7190e1c766dcab8b`](https://github.com/primer/react/commit/5ca5c0a6239029abbf285a0e7190e1c766dcab8b) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel: Cancel + close panel when user clicks outside

- [#4263](https://github.com/primer/react/pull/4263) [`590486ff650a81637a07f67624497f01303091b4`](https://github.com/primer/react/commit/590486ff650a81637a07f67624497f01303091b4) Thanks [@joshblack](https://github.com/joshblack)! - Update Checkbox to mirror `aria-checked` and the input's `checked` property

- [#4317](https://github.com/primer/react/pull/4317) [`0e744e20620a3e2fefebe94e9e33f71dcb0ee19c`](https://github.com/primer/react/commit/0e744e20620a3e2fefebe94e9e33f71dcb0ee19c) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltip: Take position:absolute back that was introduced in https://github.com/primer/react/pull/4250 since causing flickering issues and update v2 id to be the same with v1 for the new docs site.

- [#4239](https://github.com/primer/react/pull/4239) [`03d8d35c4d2be0dc2b1af67d5a3f57e255406453`](https://github.com/primer/react/commit/03d8d35c4d2be0dc2b1af67d5a3f57e255406453) Thanks [@langermank](https://github.com/langermank)! - Update the font-weight of the Dialog subtitle component to be normal

- [#4295](https://github.com/primer/react/pull/4295) [`e1dbd6adb4ea2f302722b11c62a631b9c43277c2`](https://github.com/primer/react/commit/e1dbd6adb4ea2f302722b11c62a631b9c43277c2) Thanks [@langermank](https://github.com/langermank)! - Fix `placeholder` selector for form components

## 36.9.0

### Minor Changes

- [#4250](https://github.com/primer/react/pull/4250) [`f064534bf6f15261a3b381ce1f7b3828daf98c84`](https://github.com/primer/react/commit/f064534bf6f15261a3b381ce1f7b3828daf98c84) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Add a new entry point 'next' and export the Tooltip v2 from it with an updated documentation

- [#4214](https://github.com/primer/react/pull/4214) [`3dd498e6a7c28a1ec39b56912f76579f6674e022`](https://github.com/primer/react/commit/3dd498e6a7c28a1ec39b56912f76579f6674e022) Thanks [@langermank](https://github.com/langermank)! - Dialog component: add new `position` prop to support fullscreen and bottom sheets on narrow screens

- [#4236](https://github.com/primer/react/pull/4236) [`14a2776f18cf8f4a360b1887db64f8d5e904bc9d`](https://github.com/primer/react/commit/14a2776f18cf8f4a360b1887db64f8d5e904bc9d) Thanks [@joshblack](https://github.com/joshblack)! - Refactor project to avoid circular dependencies

### Patch Changes

- [#4199](https://github.com/primer/react/pull/4199) [`b6e58079a1517d2f1d31098b4e484b94625deabd`](https://github.com/primer/react/commit/b6e58079a1517d2f1d31098b4e484b94625deabd) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel: Improve keyboard navigation from search input

- [#4200](https://github.com/primer/react/pull/4200) [`dc988141216b91561a0ea0943b2cbff03be95029`](https://github.com/primer/react/commit/dc988141216b91561a0ea0943b2cbff03be95029) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltip v2: Allow external id to be passed down in tooltip so that the trigger can be labelled/described by the that id

- [#4246](https://github.com/primer/react/pull/4246) [`2aced1c61f26513ef2f7a5a4d05485c6fe7ec1ff`](https://github.com/primer/react/commit/2aced1c61f26513ef2f7a5a4d05485c6fe7ec1ff) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Dialog v1: Fix font-family for title

- [#4265](https://github.com/primer/react/pull/4265) [`19c716f7f1ec44f1f1ee4a135b828208f2be058a`](https://github.com/primer/react/commit/19c716f7f1ec44f1f1ee4a135b828208f2be058a) Thanks [@siddharthkp](https://github.com/siddharthkp)! - SelectPanel2: Submit panel when an item is selected with `Enter` key

- [#4166](https://github.com/primer/react/pull/4166) [`c66b808cbefdbdd7482be752e5d311d2db4d23d8`](https://github.com/primer/react/commit/c66b808cbefdbdd7482be752e5d311d2db4d23d8) Thanks [@pksjce](https://github.com/pksjce)! - Fix focus styles in ActionList Item to support more than focus-visible

- [#4259](https://github.com/primer/react/pull/4259) [`c9fbef6438131cf358e2eaff3d866cf4398e622c`](https://github.com/primer/react/commit/c9fbef6438131cf358e2eaff3d866cf4398e622c) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList: Prevent scroll when an item is selected with `Space`

- [#4245](https://github.com/primer/react/pull/4245) [`d79a419116ea9e669c1ce598144a4b61ae15c52d`](https://github.com/primer/react/commit/d79a419116ea9e669c1ce598144a4b61ae15c52d) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel: Automatically adjust height based on contents

- [#4204](https://github.com/primer/react/pull/4204) [`da4469d9d958733e1b1dd32d6cd1a1bd0661ff91`](https://github.com/primer/react/commit/da4469d9d958733e1b1dd32d6cd1a1bd0661ff91) Thanks [@dylanatsmith](https://github.com/dylanatsmith)! - Increase Tooltip border-radius to match Primer View Components

- [#4205](https://github.com/primer/react/pull/4205) [`ff354604f70fc900cb79fe4c58eaee541a813d9f`](https://github.com/primer/react/commit/ff354604f70fc900cb79fe4c58eaee541a813d9f) Thanks [@pablonete](https://github.com/pablonete)! - Bugfix: Dialog.Header ignored the sx provided

## 36.7.1

### Patch Changes

- [#4198](https://github.com/primer/react/pull/4198) [`65bde2763`](https://github.com/primer/react/commit/65bde2763b9e2eb2dbe5845e009a88ad2c4972b2) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel: Pass props from SelectPanel root to dialog element

- [#4208](https://github.com/primer/react/pull/4208) [`2217cef45`](https://github.com/primer/react/commit/2217cef4506b94ea8955fb785a8fad41c8647cb6) Thanks [@joshblack](https://github.com/joshblack)! - Update mono font in theme to use font stack as fallback to custom property

- [#4176](https://github.com/primer/react/pull/4176) [`b8b090be2`](https://github.com/primer/react/commit/b8b090be2f146a8d8854028f8a88110e1ed1e4bd) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Checkbox: Add `not-allowed` cursor to unchecked disabled state

## 36.7.0

### Minor Changes

- [#4157](https://github.com/primer/react/pull/4157) [`aafa257e1`](https://github.com/primer/react/commit/aafa257e1df4e0d73bb328edbfca2f23976d4756) Thanks [@langermank](https://github.com/langermank)! - - Adds CSS variable color values to the legacy Primitive design tokens.
  - Three values include: the new v8 color CSS variable, a fallback of the old color CSS variable, and the raw value.

### Patch Changes

- [#4193](https://github.com/primer/react/pull/4193) [`c4193d680`](https://github.com/primer/react/commit/c4193d680b9b392bd1e60b1db1dd3efe0119af2d) Thanks [@langermank](https://github.com/langermank)! - Add missing CSS vars to legacy-theme

## 36.6.0

### Minor Changes

- [#3787](https://github.com/primer/react/pull/3787) [`c9d74219d`](https://github.com/primer/react/commit/c9d74219de81378cabd9df7b3bb379b30322148e) Thanks [@langermank](https://github.com/langermank)! - - Moves legacy color primitives from `primer/primitives` directly into Primer React

  - Cleans up unused dependencies on primitives other than color
  - Preparing for the upgrade to CSS variables (Primitives v8)

- [#3994](https://github.com/primer/react/pull/3994) [`c40f76562`](https://github.com/primer/react/commit/c40f76562ceb5d4c4d54610871487ab1b5481288) Thanks [@maximedegreve](https://github.com/maximedegreve)! - ActionMenu: Only use checkmarks in menus instead of checkboxes

- [#4135](https://github.com/primer/react/pull/4135) [`c2b069cfd`](https://github.com/primer/react/commit/c2b069cfd49491109d9eec2c895f6ddc5eb939bc) Thanks [@dipree](https://github.com/dipree)! - Deprecate the `underline` property of the Link component in favor of the new `inline` property to better handle link visibility and accessibility when adjacent to text.

- [#4145](https://github.com/primer/react/pull/4145) [`996475f7b`](https://github.com/primer/react/commit/996475f7b6a70d8bd0109758368d61d46eacb638) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel: Add SelectPanel.SecondaryAction

- [#4128](https://github.com/primer/react/pull/4128) [`359213b29`](https://github.com/primer/react/commit/359213b294bbc38c384d3db382fa8803453a6dfe) Thanks [@joshblack](https://github.com/joshblack)! - Add "use client" to package entrypoints to support React Server Components

### Patch Changes

- [#4146](https://github.com/primer/react/pull/4146) [`4e7404c37`](https://github.com/primer/react/commit/4e7404c3743140d19a36c3818c68357968afdc9b) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel: Clear action in search input is only visible when there is text to clear

- [#4120](https://github.com/primer/react/pull/4120) [`cbdd98a83`](https://github.com/primer/react/commit/cbdd98a838e5d1fd9cc1a97016466c3b6ecbf14e) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel: Add `modal` variant

- [#4131](https://github.com/primer/react/pull/4131) [`91a899ea2`](https://github.com/primer/react/commit/91a899ea267c74f2935bd7ec433fca1607cffd1c) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel: Fix bug where onSubmit also called onCancel!

- [#4098](https://github.com/primer/react/pull/4098) [`dc97a9b3f`](https://github.com/primer/react/commit/dc97a9b3fd754409b46c7de996a7d44c07a9c1f9) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltip2: Fix the anchor position mapping to reflect the directions correctly

- [#4170](https://github.com/primer/react/pull/4170) [`18d16092d`](https://github.com/primer/react/commit/18d16092d59cab7331e65cb81a3810c5ea466acb) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel: Fix height for `fit-content` in Safari

## 36.5.0

### Minor Changes

- [#4090](https://github.com/primer/react/pull/4090) [`6f043bc34`](https://github.com/primer/react/commit/6f043bc34c712991f074c246ba8df718d387b66f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Deprecate `MarkdownEditor`, `MarkdownViewer`, `InlineAutocomplete`, and related hooks

- [#4049](https://github.com/primer/react/pull/4049) [`f0d38bc39`](https://github.com/primer/react/commit/f0d38bc390b9bbe99227f1c7b36730188e37ea5e) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Replaces deprecated `Button` component in `Dialog` with newest version

- [#4061](https://github.com/primer/react/pull/4061) [`f46c07189`](https://github.com/primer/react/commit/f46c07189c849d727f567c85e985695e75acc4cf) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds a new prop, `animated`, to the ProgressBar component. This allows the "filled" segment(s) to animate and indicate some process is still in progress.

  <!-- Changed components: ProgressBar -->

- [#4090](https://github.com/primer/react/pull/4090) [`6f043bc34`](https://github.com/primer/react/commit/6f043bc34c712991f074c246ba8df718d387b66f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Supports inactive ActionList items by letting users pass the required message to the `inactiveText` prop.

  <!-- Changed components: ActionList, ActionMenu, NavList -->

- [#4028](https://github.com/primer/react/pull/4028) [`bbe58b8e1`](https://github.com/primer/react/commit/bbe58b8e1c7cca0ebec46fffd184c1db23bebcdf) Thanks [@joshblack](https://github.com/joshblack)! - Use a CSS variable for the monospace font stack

### Patch Changes

- [#4082](https://github.com/primer/react/pull/4082) [`c2809d677`](https://github.com/primer/react/commit/c2809d677a44686573f0bd31fc1988e73ef80b84) Thanks [@mperrotti](https://github.com/mperrotti)! - - Corrects the math to calculate the width of AvatarStack containers.

  - Prevents `.pc-AvatarStackBody` from being removed from document flow by `position: absolute`. This isn't strictly necessary now that we're correctly setting the width of the stack, but it's an extra level of safety for preserving the correct layout.

  <!-- Changed components: AvatarStack -->

- [#4020](https://github.com/primer/react/pull/4020) [`c2a53a003`](https://github.com/primer/react/commit/c2a53a003fb392b97cd33aa5eea0329e4f726874) Thanks [@siddharthkp](https://github.com/siddharthkp)! - experimental/SelectPanel2: Use `<dialog>` element

- [#4090](https://github.com/primer/react/pull/4090) [`6f043bc34`](https://github.com/primer/react/commit/6f043bc34c712991f074c246ba8df718d387b66f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltip2: Do not wrap the tooltip span and its trigger in a div

- [#4090](https://github.com/primer/react/pull/4090) [`6f043bc34`](https://github.com/primer/react/commit/6f043bc34c712991f074c246ba8df718d387b66f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Sync theme in effect

- [#4090](https://github.com/primer/react/pull/4090) [`6f043bc34`](https://github.com/primer/react/commit/6f043bc34c712991f074c246ba8df718d387b66f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Use `aria-required` instead of `required` on required form elements

  <!-- Changed components: TextInput, Textarea -->

- [#4090](https://github.com/primer/react/pull/4090) [`6f043bc34`](https://github.com/primer/react/commit/6f043bc34c712991f074c246ba8df718d387b66f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - TextInput, Textarea: Does not pass `aria-required` attribute to input or textarea if it is undefined. This fixes some tests that were breaking in dotcom.

  <!-- Changed components: TextInput, Textarea -->

- [#4090](https://github.com/primer/react/pull/4090) [`6f043bc34`](https://github.com/primer/react/commit/6f043bc34c712991f074c246ba8df718d387b66f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Adapts Blankslate to render proportionally in narrow areas.

  <!-- Changed components: Blankslate -->

- [#4090](https://github.com/primer/react/pull/4090) [`6f043bc34`](https://github.com/primer/react/commit/6f043bc34c712991f074c246ba8df718d387b66f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Fix an issue where the scrollable Dialog body could not be focused with the keyboard

- [#4002](https://github.com/primer/react/pull/4002) [`1a1d89ce0`](https://github.com/primer/react/commit/1a1d89ce048e51c4d59e9873d8b76c0da07a786a) Thanks [@peterbe](https://github.com/peterbe)! - Adds the ability to unset `emptyStateText` in Autocomplete.Menu. This results in no menu being rendered.

  <!-- Changed components: Autocomplete -->

- [#3926](https://github.com/primer/react/pull/3926) [`4e4c5ec68`](https://github.com/primer/react/commit/4e4c5ec68a9c744aedc15cadb7a9a7024e997426) Thanks [@strackoverflow](https://github.com/strackoverflow)! - Allow overflow scrolling to be controlled via an optional `overflow` property on Overlay

- [#4096](https://github.com/primer/react/pull/4096) [`1b9011da4`](https://github.com/primer/react/commit/1b9011da4e0a0f20547b2e1146bb78f3892b96ea) Thanks [@strackoverflow](https://github.com/strackoverflow)! - Fix missing `aria-selected` & `aria-checked` attributes in ActionList items

- [#4090](https://github.com/primer/react/pull/4090) [`6f043bc34`](https://github.com/primer/react/commit/6f043bc34c712991f074c246ba8df718d387b66f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - use <BaseStyles> in confirm()

- [#4090](https://github.com/primer/react/pull/4090) [`6f043bc34`](https://github.com/primer/react/commit/6f043bc34c712991f074c246ba8df718d387b66f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Fixed confirm() leaving <div>s in the DOM.

- [#4074](https://github.com/primer/react/pull/4074) [`06c7c6c1d`](https://github.com/primer/react/commit/06c7c6c1d126520ced0c5641b7e0a69e343aacdd) Thanks [@dependabot](https://github.com/apps/dependabot)! - Update types for Select to include `placeholder`

- [#4090](https://github.com/primer/react/pull/4090) [`6f043bc34`](https://github.com/primer/react/commit/6f043bc34c712991f074c246ba8df718d387b66f) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Portal avoids useless createElement

## 36.4.0

### Minor Changes

- [#3982](https://github.com/primer/react/pull/3982) [`968d4ef05`](https://github.com/primer/react/commit/968d4ef05808005efde7de06ca480b4870179485) Thanks [@joshblack](https://github.com/joshblack)! - Update SSRProvider, useSSRSafeId to use the native React 18 useId() instead of @react-aria/ssr

- [#3812](https://github.com/primer/react/pull/3812) [`3f82a1cab`](https://github.com/primer/react/commit/3f82a1cab370951e11b474696fbfdbfe169ce970) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds an 'inactive' state to buttons. An inactive button looks disabled and has aria-disabled, but it can still be clicked and focused. This was added to support buttons that are broken due to availability issues, but can't be removed from the page.

  <!-- Changed components: Button, Button2, IconButton -->

### Patch Changes

- [#4026](https://github.com/primer/react/pull/4026) [`503c7e625`](https://github.com/primer/react/commit/503c7e625a8a3388737949880b64791f5833f027) Thanks [@mperrotti](https://github.com/mperrotti)! - Fixes layout for loading DataTable cells

  <!-- Changed components: DataTable -->

- [#4001](https://github.com/primer/react/pull/4001) [`0e9d841e3`](https://github.com/primer/react/commit/0e9d841e398118843c92f9b92881ead62337c682) Thanks [@langermank](https://github.com/langermank)! - Fix `line-height` on markdown viewer (comment box)

- [#3987](https://github.com/primer/react/pull/3987) [`4321d59e9`](https://github.com/primer/react/commit/4321d59e9de5e319523c438e8e7d238178571301) Thanks [@iulia-b](https://github.com/iulia-b)! - MarkdownEditor & MarkdownViewer: Update new line identifier for formatting markdown

- [#4008](https://github.com/primer/react/pull/4008) [`df7dc2af1`](https://github.com/primer/react/commit/df7dc2af1679a3a6634ec313476de0cb2fc07a19) Thanks [@dipree](https://github.com/dipree)! - Changes the focus styling of input components such as `Textarea`, `TextInput`, `TextInputWithTokens` and `Select` from using `border` and `box-shadow` to use `outline` only for better border rendering and scrollbar support.

- [#4013](https://github.com/primer/react/pull/4013) [`d26aeab32`](https://github.com/primer/react/commit/d26aeab32ad90e084d2cec0073df18d811fda820) Thanks [@keithamus](https://github.com/keithamus)! - Avoid error when using Modal Dialog within TreeView

- [#4012](https://github.com/primer/react/pull/4012) [`5fd025f04`](https://github.com/primer/react/commit/5fd025f0414b343abf3435cfab90bc9b24bdcea7) Thanks [@keithamus](https://github.com/keithamus)! - Ensure ConfirmationDialog adds host element to the DOM

- [#4024](https://github.com/primer/react/pull/4024) [`0ea121af3`](https://github.com/primer/react/commit/0ea121af393e13a22c64514283ed881ae57414e5) Thanks [@colebemis](https://github.com/colebemis)! - StateLabel: Use correct octicons for `draft` and `pullClosed` states

- [#4022](https://github.com/primer/react/pull/4022) [`98ad3203a`](https://github.com/primer/react/commit/98ad3203a33c9caf2579474fa517a0c7a2ba8924) Thanks [@joshblack](https://github.com/joshblack)! - Update the resize behavior of PageLayout to ignore right clicks when resizing

## 36.3.1

### Patch Changes

- [#3998](https://github.com/primer/react/pull/3998) [`dd285e2ac`](https://github.com/primer/react/commit/dd285e2ac83eb282ae7c111fd44e2dffaf15ccb2) Thanks [@joshblack](https://github.com/joshblack)! - Remove changes to focus outline to prevent double focus rings from showing

## 36.3.0

### Minor Changes

- [#3963](https://github.com/primer/react/pull/3963) [`e16927b5a`](https://github.com/primer/react/commit/e16927b5aef72a2d6b78705066fd26b3741b73df) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds "unavailable" status to StateLabel

  <!-- Changed components: StateLabel -->

- [#3484](https://github.com/primer/react/pull/3484) [`e40378951`](https://github.com/primer/react/commit/e4037895105c7e86e79c5bb6fbafb86e715337ba) Thanks [@ValbertMartins](https://github.com/ValbertMartins)! - TextArea: Add contrast property

### Patch Changes

- [#3897](https://github.com/primer/react/pull/3897) [`6b0c118b3`](https://github.com/primer/react/commit/6b0c118b34e97c558991ebdc17a13350296245a8) Thanks [@mperrotti](https://github.com/mperrotti)! - When passing an `id` prop to ActionMenu.Button, it will be passed as the rendered button element's `id` attribute instead of being set as an automatically generated ID.

  <!-- Changed components: ActionMenu -->

- [#3960](https://github.com/primer/react/pull/3960) [`ec8a2cadd`](https://github.com/primer/react/commit/ec8a2cadda01a3a3463380b911922b9c28e4e241) Thanks [@pksjce](https://github.com/pksjce)! - Update to @primer/behaviors v1.5.1

- [#3945](https://github.com/primer/react/pull/3945) [`40b29787e`](https://github.com/primer/react/commit/40b29787ec4c8f709e7522147e58bd03e51b28e7) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList: Fix bug that did not allow both inline and block description at the same time

- [#3903](https://github.com/primer/react/pull/3903) [`f62ec728a`](https://github.com/primer/react/commit/f62ec728acd5c90f105c3e3c5162a69dbe0c4b6d) Thanks [@pksjce](https://github.com/pksjce)! - Make resize vertical splitter keyboard accessible

- [#3946](https://github.com/primer/react/pull/3946) [`e08432d54`](https://github.com/primer/react/commit/e08432d54dd45a5e793719509dc78657570dde0b) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Link: Add `inline` prop to tag links inside a text block, underlined with accessibility setting `[data-a11y-link-underlines]`

- [#3983](https://github.com/primer/react/pull/3983) [`43d1dce4a`](https://github.com/primer/react/commit/43d1dce4a103b5e23064e8a32a7bb27677dbbb95) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Readjust order of `PageLayout.Pane` contents

- [#3972](https://github.com/primer/react/pull/3972) [`87028d2b9`](https://github.com/primer/react/commit/87028d2b963b788f1525f6f9326ed7eb1b7346d6) Thanks [@iulia-b](https://github.com/iulia-b)! - Update MarkdownEditor to correctly identify non-standard formatted tasklist items

## 36.2.0

### Minor Changes

- [#3900](https://github.com/primer/react/pull/3900) [`2f9b5869`](https://github.com/primer/react/commit/2f9b58691ed2531b3af263e0f0547737ade9e717) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - ActionList: Add ActionList.GroupHeading component to label the group lists and update labelling semantics for accessibility

- [#3143](https://github.com/primer/react/pull/3143) [`cc0c16e9`](https://github.com/primer/react/commit/cc0c16e9bb05f16d5aaec7d35431649a9652f056) Thanks [@green6erry](https://github.com/green6erry)! - Adjusts position of children within `PageLayout.Pane` to live above adjustable resize form.

### Patch Changes

- [#3935](https://github.com/primer/react/pull/3935) [`89702725`](https://github.com/primer/react/commit/89702725bc4174cc37d7e0ec77ed1a4f7d7db3cf) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Dialog: Add sx back to dialog footer

- [#3918](https://github.com/primer/react/pull/3918) [`e8d0c15f`](https://github.com/primer/react/commit/e8d0c15f169f51a87c414a411f819e71338e661b) Thanks [@dylanatsmith](https://github.com/dylanatsmith)! - Update the spacing for buttons in the footer of a Dialog.

- [#3893](https://github.com/primer/react/pull/3893) [`a4006e2f`](https://github.com/primer/react/commit/a4006e2fee11bd6a5efa99b8ddbd3eddec9ff274) Thanks [@stkao05](https://github.com/stkao05)! - Fix MarkdownEditor fullHeight support

- [#3895](https://github.com/primer/react/pull/3895) [`9daea96b`](https://github.com/primer/react/commit/9daea96bd25310420b729125f187a25ddcbdd971) Thanks [@cs25-esc](https://github.com/cs25-esc)! - AvatarStack: Both `disableExpand` and `rightAlign` can be passed together now

- [#3667](https://github.com/primer/react/pull/3667) [`791c9838`](https://github.com/primer/react/commit/791c983846115438bbea54768b73272260736007) Thanks [@six7](https://github.com/six7)! - Changes visual appearance of MarkdownEditor

  <!-- Changed components: MarkdownEditor -->

- [#3910](https://github.com/primer/react/pull/3910) [`988b297d`](https://github.com/primer/react/commit/988b297d7c42da662326d2255360d24f0b01fe98) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltip (draft): Do not expose the tooltip text to AT when it is not visible

- [#3924](https://github.com/primer/react/pull/3924) [`e512c049`](https://github.com/primer/react/commit/e512c0499b3a9d4143d930570ce62d5a40da1515) Thanks [@thyeggman](https://github.com/thyeggman)! - Fix issue in DataTable so that sort order is determined after column headers are created

- [#3916](https://github.com/primer/react/pull/3916) [`c2f81b3c`](https://github.com/primer/react/commit/c2f81b3c175c18c76acef1d9d1e537aeb6387a8c) Thanks [@strackoverflow](https://github.com/strackoverflow)! - Fix inconsistent border treatment when there is one avatar in an AvatarStack

- [#3925](https://github.com/primer/react/pull/3925) [`6b362b2a`](https://github.com/primer/react/commit/6b362b2a3603bb06736a70e64eafccd8b1207006) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltip2: make the text prop required

## 36.1.0

### Minor Changes

- [#3843](https://github.com/primer/react/pull/3843) [`4ea8bcf7`](https://github.com/primer/react/commit/4ea8bcf74719947854f28d55210269e0d4431ebb) Thanks [@thyeggman](https://github.com/thyeggman)! - Vertically align cell contents in `DataTable`

### Patch Changes

- [#3866](https://github.com/primer/react/pull/3866) [`22fa0928`](https://github.com/primer/react/commit/22fa0928a162bd19b509773a90631c9e53e24de5) Thanks [@strackoverflow](https://github.com/strackoverflow)! - DataTable: fix incorrect pagination steps when defaultPageIndex is provided

  <!-- Changed components: DataTable -->

- [#3888](https://github.com/primer/react/pull/3888) [`3e20ab1f`](https://github.com/primer/react/commit/3e20ab1fe9ae1ff6c34abd4a8139e7ff008f7c18) Thanks [@strackoverflow](https://github.com/strackoverflow)! - Select: Add support for `sx` prop

  <!-- Changed components: Select -->

- [#3870](https://github.com/primer/react/pull/3870) [`2c24d6a8`](https://github.com/primer/react/commit/2c24d6a876df5c4d0e3ba83fcbdccc685a07b8fb) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList: Checkbox inside a disabled item should have `not-allowed` cusor

  <!-- Changed components: ActionList -->

## 36.0.0

### Major Changes

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - Update styled-components and related dependencies to v5.x

  <!-- Changed components: _none_ -->

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - Remove components from deprecated

  - `BorderBox`, `ChoiceFieldset`, `Flex`, `Grid`, `Position`, `Dropdown`, `FormGroup`, `SelectMenu`, `InputField`, `Label`

  <!-- Changed components: _none_ -->

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - Remove components from draft bundle

  - Move UnderlineNav2 (draft) to the main bundle

  ```diff
  - import {UnderlineNav} from '@primer/react/drafts'
  + import {UnderlineNav} from '@primer/react'
  ```

  ....

  - Remove TreeView from drafts

  ```diff
  - import {TreeView} from '@primer/react/drafts'
  + import {TreeView} from '@primer/react'
  ```

  - Remove SegmentedControl from drafts

  ```diff
  - import {SegmentedControl} from '@primer/react/drafts'
  + import {SegmentedControl} from '@primer/react'
  ```

  - Remove NavList from drafts

  ```diff
  - import {NavList} from '@primer/react/drafts'
  + import {NavList} from '@primer/react'
  ```

  - Remove SplitPageLayout from drafts

  ```diff
  - import {SplitPageLayout} from '@primer/react/drafts'
  + import {SplitPageLayout} from '@primer/react'
  ```

  <!-- Changed components: UnderlineNav, TreeView, SegmentedControl, NavList, SplitPageLayout -->

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - - Changes `leadingIcon` and `trailingIcon` to `leadingVisual` and `trailingVisual`

  - Removes `Button.Counter` as a child component, replacing it with a `count` prop. This change allows us to use the `trailingVisual` slot for counters.
  - Removes the `outline` button variant as we wish to only support `invisible` buttons.

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - Remove deprecated `extralarge` variant from `Token` and `TextInputWithToken` component

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - Remove StyledOcticon component. The component was renamed to `Octicon`. Update your imports by swapping `StyledOcticon` with `Octicon`

  <!-- Changed components: Octicon -->

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - Deprecates FilterList and FilteredSearch components

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - Makes @types/styled-components an optional peer dependency, not a dependency

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - ConfirmationDialog: Use createRoot instead of ReactDOM.render for React 18 compatibility.

  <!-- Changed components: ConfirmationDialog -->

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - Update minimum version for react and react-dom to v18

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - Remove `DropdownButton` and `DropdownMenu` from deprecated and update the usages across

  <!-- Changed components: SelectPanel, ActionList -->

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - The Autocomplete component no longer uses the deprecated ActionList component. There have been minor API updates, but it's largely the same.

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - Removes 'warning' option from form components' `validationStatus` props

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - Remove support for `activeClassName` for Breadcrumb, SubNav, TabNav, UnderlineNav

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - Ensure ActionList item has `border-radius` on hover with `full` variant

### Patch Changes

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - Fixes type errors that appeared during v36 development. Likely caused by Button updates

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - Use IconButton instead of ButtonClose in v1 Dialog.

  <!-- Changed components: Dialog -->

- [#3384](https://github.com/primer/react/pull/3384) [`3633535c`](https://github.com/primer/react/commit/3633535c2acae5c69016a9a0f2f7ee5729694804) Thanks [@joshblack](https://github.com/joshblack)! - FilteredActionList now uses new ActionList as a base, and SelectPanel reflects those changes.

## 35.32.2

### Patch Changes

- [#3861](https://github.com/primer/react/pull/3861) [`85d9e515`](https://github.com/primer/react/commit/85d9e51503ebecf558ff7d2bef8b4c1e217084da) Thanks [@langermank](https://github.com/langermank)! - Use `button` CSS vars for border-color to support a feature flag

- [#3862](https://github.com/primer/react/pull/3862) [`8cd6007e`](https://github.com/primer/react/commit/8cd6007e589d33fd89a1ab2a93547b9977e274b2) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Adds `aria-disabled` to inactive pagination buttons.

## 35.32.1

### Patch Changes

- [#3839](https://github.com/primer/react/pull/3839) [`d463d547`](https://github.com/primer/react/commit/d463d547f564d225786df7b702b735c0c7da6fd6) Thanks [@joshblack](https://github.com/joshblack)! - Restore Link underline preference to original behavior

- [#3836](https://github.com/primer/react/pull/3836) [`038a7899`](https://github.com/primer/react/commit/038a7899ccaa28f57bc5ececa5aed301bab3495d) Thanks [@xiaolou86](https://github.com/xiaolou86)! - docs: fix typo

## 35.32.0

### Minor Changes

- [#3720](https://github.com/primer/react/pull/3720) [`521b02f4`](https://github.com/primer/react/commit/521b02f4fa1fcba6375f3642e0cf1a9b01a4bda7) Thanks [@mperrotti](https://github.com/mperrotti)! - Updates link styles to support underline link preferences.

  <!-- Changed components: ActionList, BranchName, Breadcrumbs, Button, Button2, Heading, Link -->

- [#3813](https://github.com/primer/react/pull/3813) [`1fcfc478`](https://github.com/primer/react/commit/1fcfc47885c5c152264d7402e243700f7d02ec31) Thanks [@joshblack](https://github.com/joshblack)! - Add support for a `ref` on the inner <button> in ToggleSwitch

### Patch Changes

- [#3815](https://github.com/primer/react/pull/3815) [`794a477c`](https://github.com/primer/react/commit/794a477c9065f37c5ab789e99cddaee010e6af4c) Thanks [@pksjce](https://github.com/pksjce)! - Update hover styles for ActionList item

- [#3691](https://github.com/primer/react/pull/3691) [`f4648b19`](https://github.com/primer/react/commit/f4648b19d664ba07d4a921bcafadd26f151093bd) Thanks [@joshblack](https://github.com/joshblack)! - Update ActionList to place `id` on item with an ARIA role

  <!-- Changed components: ActionList -->

- [#3809](https://github.com/primer/react/pull/3809) [`6b18eaec`](https://github.com/primer/react/commit/6b18eaecbd99f81f92b2dd654b771c85b53f365b) Thanks [@gr2m](https://github.com/gr2m)! - export `SelectPanel` from `@primer/react/drafts`

  <!-- Changed components: _none_ -->

- [#3683](https://github.com/primer/react/pull/3683) [`a84a1498`](https://github.com/primer/react/commit/a84a149826f658ddca715c4948d5a5002a648e4e) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Button: Allow leadingIcon, trailingIcon, trailingAction to be overridable with sx

  <!-- Changed components: Button -->

- [#3784](https://github.com/primer/react/pull/3784) [`6f4fe7d2`](https://github.com/primer/react/commit/6f4fe7d2a91786569f2f1492168268c58eca2b53) Thanks [@radglob](https://github.com/radglob)! - Revert "Add aria-selected value to ActionList.Item."

  <!-- Changed components: ActionList -->

## 35.31.0

### Minor Changes

- [#3394](https://github.com/primer/react/pull/3394) [`9cd50f70`](https://github.com/primer/react/commit/9cd50f700eb9ebcee5d49181437fd497ec19c055) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Tooltip: Release Tooltip v2 as a draft/experimental

  <!-- Changed components: _none_ -->

- [#3749](https://github.com/primer/react/pull/3749) [`b4fe331e`](https://github.com/primer/react/commit/b4fe331e3264a34ee4f1aec56e87f4e2b034f45c) Thanks [@thyeggman](https://github.com/thyeggman)! - Add suport for sparse sorting to DataTable

  <!-- Changed components: DataTable -->

- [#3581](https://github.com/primer/react/pull/3581) [`cc12464d`](https://github.com/primer/react/commit/cc12464df2492d5e38ce0aafa3ce523e62a8e567) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - ActionList: Add ActionList.Heading component

  <!-- Changed components: ActionList -->

## 35.30.0

### Minor Changes

- [#3714](https://github.com/primer/react/pull/3714) [`88340269`](https://github.com/primer/react/commit/883402697efa8c9ff5c434753d4af36737b65e4b) Thanks [@iansan5653](https://github.com/iansan5653)! - Add support for controlling which side `ActionMenu` renders on (via a `side` prop on `ActionMenu.Overlay`)

  <!-- Changed components: ActionMenu -->

- [#3715](https://github.com/primer/react/pull/3715) [`1f889281`](https://github.com/primer/react/commit/1f88928117acf86a3acd75c405b0064f080a66e3) Thanks [@joshblack](https://github.com/joshblack)! - Add support for leadingVisual and trailingVisual props to Button

  <!-- Changed components: Button -->

- [#3739](https://github.com/primer/react/pull/3739) [`b90e5476`](https://github.com/primer/react/commit/b90e547639a7a906ef21cbf1a1c702c3d92210bc) Thanks [@joshblack](https://github.com/joshblack)! - Add the Column type and createColumnHelper function to easily define columns for DataTable

  <!-- Changed components: DataTable -->

- [#3719](https://github.com/primer/react/pull/3719) [`500e529d`](https://github.com/primer/react/commit/500e529df47ae5def4bf5cedc55fc099251c25a1) Thanks [@joshblack](https://github.com/joshblack)! - The UnderlineNav, FilterList, and FilteredSearch components will be deprecated in v36 and have been moved to the deprecated entrypoint. To use the new UnderlineNav, migrate to the component available in drafts.

  <!-- Changed components: FilterList, FilteredSearch, UnderlineNav -->

- [#3732](https://github.com/primer/react/pull/3732) [`8928acc3`](https://github.com/primer/react/commit/8928acc38fa32e5d752c57cb80070e5368c66314) Thanks [@joshblack](https://github.com/joshblack)! - Add default `type="button"` to `IconButton` component

  <!-- Changed components: IconButton -->

### Patch Changes

- [#3661](https://github.com/primer/react/pull/3661) [`25693b08`](https://github.com/primer/react/commit/25693b08e8f2c89af1199c2f9d4fe38777f8a70b) Thanks [@joshblack](https://github.com/joshblack)! - Update the `children` prop for `Button` to be optional

  <!-- Changed components: Button, IconButton -->

- [#3737](https://github.com/primer/react/pull/3737) [`a93eca21`](https://github.com/primer/react/commit/a93eca218043a3009ac0d6768e818fe3e15bb6c9) Thanks [@joshblack](https://github.com/joshblack)! - Restore default main landmark in PageLayout.Content

  <!-- Changed components: PageLayout, SplitPageLayout -->

- [#3722](https://github.com/primer/react/pull/3722) [`0baa5a7f`](https://github.com/primer/react/commit/0baa5a7f6a009e6a7c77cd380f9b9ad93fdfd7cd) Thanks [@mattcosta7](https://github.com/mattcosta7)! - use isomorphic layout effects only

  <!-- Changed components: InlineAutocomplete, MarkdownEditor -->

## 35.29.0

### Minor Changes

- [#3692](https://github.com/primer/react/pull/3692) [`4046e058`](https://github.com/primer/react/commit/4046e058253cd9b2fb0f7e45cc01d12049bfd306) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Octicons: Upgrade react-octicons to v19.7.0

  <!-- Changed components: _none_ -->

- [#3647](https://github.com/primer/react/pull/3647) [`e480a4a4`](https://github.com/primer/react/commit/e480a4a42d33e21c7db0c4ba364bc0fc0372ec93) Thanks [@paxos](https://github.com/paxos)! - Adds onSelectSuggestion callback to <InlineAutocomplete />

  <!-- Changed components: _none_ -->

- [#3607](https://github.com/primer/react/pull/3607) [`c0e22fc1`](https://github.com/primer/react/commit/c0e22fc14697627c81c8a21137c72350e8d1a703) Thanks [@langermank](https://github.com/langermank)! - Update ActionList checkbox styles to form checkbox styles (impacts ActionMenu and SelectPanel)

  <!-- Changed components: ActionList -->

- [#3632](https://github.com/primer/react/pull/3632) [`3a8b841c`](https://github.com/primer/react/commit/3a8b841ce7d1d411142619b7a942e896d3eb01c9) Thanks [@iansan5653](https://github.com/iansan5653)! - Allow consumers to make components that are compatible with `FormControl` by reading forwarded props in from the `useFormControlForwardedProps` hook

  <!-- Changed components: FormControl -->

### Patch Changes

- [#3675](https://github.com/primer/react/pull/3675) [`ade10e64`](https://github.com/primer/react/commit/ade10e64afd320a5299eea68f214718a638fc290) Thanks [@radglob](https://github.com/radglob)! - PageLayout.Content no longer renders as `main` by default. Instead, developers may add a `main` landmark within `Pagelayout.Content` themselves.

  <!-- Changed components: PageLayout -->

- [#3709](https://github.com/primer/react/pull/3709) [`edc0168e`](https://github.com/primer/react/commit/edc0168ea0a9747d7cbe06f0f2973a8f10937db5) Thanks [@mperrotti](https://github.com/mperrotti)! - Fixes a bug where children of AvatarStack would still show a transition when the component re-renders with a different number of children. Fixes https://github.com/primer/react/issues/3688

  <!-- Changed components: AvatarStack -->

- [#3698](https://github.com/primer/react/pull/3698) [`d759fd32`](https://github.com/primer/react/commit/d759fd32c36369b9ef4b7efafe1a5463baa48c14) Thanks [@gracepark](https://github.com/gracepark)! - Adds the defaultOpen prop to NavList.Item

  <!-- Changed components: _none_ -->

- [#3662](https://github.com/primer/react/pull/3662) [`2ca670a8`](https://github.com/primer/react/commit/2ca670a882925ce2cbd447d52f1ac390efe29253) Thanks [@joshblack](https://github.com/joshblack)! - Update type exports to prevent missing export warnings

  <!-- Changed components: _none_ -->

- [#3654](https://github.com/primer/react/pull/3654) [`556d826a`](https://github.com/primer/react/commit/556d826af1dd9cc74f8bf22e7f0f521d185a87d2) Thanks [@langermank](https://github.com/langermank)! - Use `control` CSS var with fallback for form component border-color

  <!-- Changed components: _none_ -->

- [#3689](https://github.com/primer/react/pull/3689) [`5d992715`](https://github.com/primer/react/commit/5d9927154518e9076fa6e7d5a83d1d7ff94c6aee) Thanks [@jdrush89](https://github.com/jdrush89)! - Fix dialog bug where escape would move focus when dialog was closed

  <!-- Changed components: _none_ -->

## 35.28.0

### Minor Changes

- [#3563](https://github.com/primer/react/pull/3563) [`3bb6dc8c`](https://github.com/primer/react/commit/3bb6dc8cea75fa07974493cfaf95f7e51504c9d3) Thanks [@radglob](https://github.com/radglob)! - Add option to specify custom widths for PageLayout.Pane via the `width` prop.

  <!-- Changed components: PageLayout -->

### Patch Changes

- [#3619](https://github.com/primer/react/pull/3619) [`d4ae582b`](https://github.com/primer/react/commit/d4ae582b7d2420fd460bb14c2fa45f36be714311) Thanks [@gr2m](https://github.com/gr2m)! - Include `border*Color` properties in sx to support named Primer colors

  <!-- Changed components: _none_ -->

- [#3561](https://github.com/primer/react/pull/3561) [`94e8d38f`](https://github.com/primer/react/commit/94e8d38f92975b12d1ded61228597c5b322a78ea) Thanks [@joshblack](https://github.com/joshblack)! - Update @react-aria/ssr dependency to ^3.5.0 to address server-side rendering mismatch when using React StrictMode

  <!-- Changed components: FormControl -->

- [#3613](https://github.com/primer/react/pull/3613) [`dbcd4072`](https://github.com/primer/react/commit/dbcd40727993a0faebe3033ee1556549fb5baa1a) Thanks [@langermank](https://github.com/langermank)! - [Bug] Remove `flex` from Button labels

  <!-- Changed components: Button -->

- [#3579](https://github.com/primer/react/pull/3579) [`66482a72`](https://github.com/primer/react/commit/66482a72000a0f1baf021e2b554e98942081d685) Thanks [@radglob](https://github.com/radglob)! - Add aria-selected value to ActionList.Item.

  <!-- Changed components: ActionList -->

- [#3614](https://github.com/primer/react/pull/3614) [`709024ff`](https://github.com/primer/react/commit/709024ff45a68c73ed6736e72d9db22b0a25cd33) Thanks [@iansan5653](https://github.com/iansan5653)! - Automatically reposition `InlineAutocomplete` suggestions depending on available space

  <!-- Changed components: InlineAutocomplete -->

- [#3609](https://github.com/primer/react/pull/3609) [`f487a8d6`](https://github.com/primer/react/commit/f487a8d653329d73f238b908eca6085f94ca3c93) Thanks [@iansan5653](https://github.com/iansan5653)! - Expose `useSlots` from `drafts/hooks`

  <!-- Changed components: _none_ -->

- [#3611](https://github.com/primer/react/pull/3611) [`ace603d8`](https://github.com/primer/react/commit/ace603d85e2966fbf8b3bb8b54da42bf00a56679) Thanks [@siddharthkp](https://github.com/siddharthkp)! - NavList: Fix when subNav opens automatically and shows current indicator

  <!-- Changed components: NavList -->

## 35.27.1

### Patch Changes

- [#3589](https://github.com/primer/react/pull/3589) [`d598a53b`](https://github.com/primer/react/commit/d598a53bf4e925f22df6a51aa0f8c933227c85bd) Thanks [@siddharthkp](https://github.com/siddharthkp)! - - PageLayout: Undo deprecation of `position` prop for PageLayout.Pane (Revert primer/react#3389)

  - SplitPageLayout: Undo deprecation of `position` prop for SplitPageLayout.Pane (Revert primer/react#3389)

  <!-- Changed components: PageLayout, SplitPageLayout -->

## 35.27.0

### Minor Changes

- [#3510](https://github.com/primer/react/pull/3510) [`bdbcfd15`](https://github.com/primer/react/commit/bdbcfd151d00a7995b07f57e2b37468af0bd0ee5) Thanks [@camertron](https://github.com/camertron)! - Implement accessibility audit feedback for ToggleSwitch

  <!-- Changed components: ToggleSwitch -->

- [#3466](https://github.com/primer/react/pull/3466) [`11b54ac8`](https://github.com/primer/react/commit/11b54ac88aff4bb8383a0e6a41174e4b477f85d7) Thanks [@mperrotti](https://github.com/mperrotti)! - Allows consumers to disable the behavior where the AvatarStack expands to show each Avatar on hover. There are also changes that allow users to customize the size of the avatars - even responsively!

  <!-- Changed components: Avatar, AvatarStack -->

- [#3390](https://github.com/primer/react/pull/3390) [`b4e15b84`](https://github.com/primer/react/commit/b4e15b8452772dc72d3efda73f5d96dbe2c35150) Thanks [@mperrotti](https://github.com/mperrotti)! - The showPages prop on both Pagination components can now accept a responsive value.

  <!-- Changed components: DataTable, Pagination -->

- [#3496](https://github.com/primer/react/pull/3496) [`11cdbdcc`](https://github.com/primer/react/commit/11cdbdcc3b7a662a93c46eafc92714fc3f1dc0c0) Thanks [@joshblack](https://github.com/joshblack)! - Update dependency ranges to use caret ranges instead of pinned versions

  <!-- Changed components: _none_ -->

### Patch Changes

- [#3264](https://github.com/primer/react/pull/3264) [`5e655203`](https://github.com/primer/react/commit/5e6552039605bff358671e725687b37ce524ce2b) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds truncation features to the LabelGroup component:

  - truncate LabelGroup children after a static number of children (for example, truncate after the 5th label)
  - truncate LabelGroup children to fit in the width of the parent
  - show full list in an Overlay
  - show full list inline

  <!-- Changed components: LabelGroup -->

- [#3505](https://github.com/primer/react/pull/3505) [`c3f1e3c7`](https://github.com/primer/react/commit/c3f1e3c790b36034022ef548dfd300c3d89872a4) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList: Fix icon and description hover colors for danger variant

  <!-- Changed components: ActionList -->

- [#3520](https://github.com/primer/react/pull/3520) [`daee9a9c`](https://github.com/primer/react/commit/daee9a9ce3f21901e029c856d452ca47cfe35887) Thanks [@mattcosta7](https://github.com/mattcosta7)! - passthrough dom props on toggleswitch

  <!-- Changed components: ToggleSwitch -->

- [#3441](https://github.com/primer/react/pull/3441) [`90a145cc`](https://github.com/primer/react/commit/90a145ccd37338f50a47a8e16491a80e2d276b52) Thanks [@tomthorogood](https://github.com/tomthorogood)! - Renders docs.json markdown content

  <!-- Changed components: _none_ -->

- [#3540](https://github.com/primer/react/pull/3540) [`a90350cc`](https://github.com/primer/react/commit/a90350ccc4e2779cd5f21fc343d1fe793ebc5b56) Thanks [@kendallgassner](https://github.com/kendallgassner)! - Css styled block fixes

  <!-- Changed components: DataTable, Timeline -->

- [#3389](https://github.com/primer/react/pull/3389) [`57c4bdf9`](https://github.com/primer/react/commit/57c4bdf928c0c277dfcf896f67443a2e9779a1d7) Thanks [@radglob](https://github.com/radglob)! - Deprecates `position` prop for PageLayout.Pane and SplitPageLayout.Pane.

  ```diff
  -<PageLayout>
  -    <PageLayout.Content />
  -    <PageLayout.Pane position="start" />
  -</PageLayout>

  +<PageLayout>
  +    <PageLayout.Pane />
  +    <PageLayout.Content />
  +</PageLayout>

  ```

  <!-- Changed components: PageLayout, SplitPageLayout -->

- [#3490](https://github.com/primer/react/pull/3490) [`8d1d5146`](https://github.com/primer/react/commit/8d1d51469f981fc0717adc80637369dd207670ca) Thanks [@langermank](https://github.com/langermank)! - Bug fix: ActionList item label weight and spacing if description exists

  <!-- Changed components: ActionList -->

- [#3361](https://github.com/primer/react/pull/3361) [`bea39c24`](https://github.com/primer/react/commit/bea39c24a7bc210cae78681572e7819edaec13db) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: underline nav items' selected state can be managed by the app state

  <!-- Changed components: UnderlineNav -->

- [#3533](https://github.com/primer/react/pull/3533) [`33b60551`](https://github.com/primer/react/commit/33b60551af4749d476f970d5447f422a6ace33ca) Thanks [@amarmanhala](https://github.com/amarmanhala)! - Changed div tag to HTML semantic tag header for Header (file Header.tsx) component.

  <!-- Changed components: _none_ -->

- [#3516](https://github.com/primer/react/pull/3516) [`33d43459`](https://github.com/primer/react/commit/33d43459258c28fa5d69a1eca83d46cdb4bfe773) Thanks [@danielguillan](https://github.com/danielguillan)! - ActionList: Fixes the width of items for the full variant

  <!-- Changed components: ActionList -->

- [#3517](https://github.com/primer/react/pull/3517) [`cf9d8a5e`](https://github.com/primer/react/commit/cf9d8a5e0cb21583e3b6280e2d493e54fd2c1ca0) Thanks [@kendallgassner](https://github.com/kendallgassner)! - Adding aria-attributes and role to the ProgressBar component

  <!-- Changed components: ProgressBar -->

- [#3539](https://github.com/primer/react/pull/3539) [`c02f3a2f`](https://github.com/primer/react/commit/c02f3a2f3cdf4cf009e4c4856588f4b34bf97785) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds 'display' text size to PRC theme. This size is described in our [typography documentation](https://primer.style/design/foundations/typography#headings), but was never added to our React theme.

  <!-- Changed components: _none_ -->

- [#3537](https://github.com/primer/react/pull/3537) [`311c8c91`](https://github.com/primer/react/commit/311c8c918e33ca6692a7cb1eeb4c59ac27775ea1) Thanks [@kendallgassner](https://github.com/kendallgassner)! - Make checkmark visible on reduced-motion

  <!-- Changed components: Checkbox -->

- [#3491](https://github.com/primer/react/pull/3491) [`263d5978`](https://github.com/primer/react/commit/263d5978dfceda3c5c18da6cfcb9f72cc616fe2b) Thanks [@nicolleromero](https://github.com/nicolleromero)! - MarkdownViewer: Address scenario in useListInteraction where the position calculation can be incorrect when tasklists appear above legacy task lists

  <!-- Changed components: MarkdownViewer -->

- [#3447](https://github.com/primer/react/pull/3447) [`40808db7`](https://github.com/primer/react/commit/40808db7a603b8b39872317c36b56e655705d475) Thanks [@jesskuo4](https://github.com/jesskuo4)! - [Bug] Leading & Trailing Visual Colors for Button

- [#3562](https://github.com/primer/react/pull/3562) [`53791841`](https://github.com/primer/react/commit/537918414b1f576368efd447962479b9f8afcb27) Thanks [@iansan5653](https://github.com/iansan5653)! - Fix `MarkdownEditor` file uploads inserting the URL into the wrong input when an overlay is open

- [#3547](https://github.com/primer/react/pull/3547) [`7ef802e8`](https://github.com/primer/react/commit/7ef802e84833d08f0912e4ce91d5eedb3e3ca655) Thanks [@mperrotti](https://github.com/mperrotti)! - Prevents body scroll when Dialog (the newer Dialog) is open

  <!-- Changed components: Dialog -->

## 35.26.1

### Patch Changes

- [#3446](https://github.com/primer/react/pull/3446) [`650a46d5`](https://github.com/primer/react/commit/650a46d5dbf10500d4d9af508c71744665f1bd0d) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Correct the icon colours to be `fg.muted`

- [#3423](https://github.com/primer/react/pull/3423) [`af32ec79`](https://github.com/primer/react/commit/af32ec7989899b48b4fc2cec393bc2de29f9f643) Thanks [@japf](https://github.com/japf)! - improve performance of the MarkdownEditor component when fullHeight is enabled

- [#3437](https://github.com/primer/react/pull/3437) [`b298c326`](https://github.com/primer/react/commit/b298c3266b8034c695f0d8d2d3c97813f5f44fa0) Thanks [@mattcosta7](https://github.com/mattcosta7)! - update icon types and primer octicons

- [#3476](https://github.com/primer/react/pull/3476) [`379d947e`](https://github.com/primer/react/commit/379d947ee5500cc20dbf637e6d0fe47af39efc10) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu: Fix missing divider for first item when the menu is open with mouse

  <!-- Changed components: ActionMenu -->

- [#3489](https://github.com/primer/react/pull/3489) [`c79e78c7`](https://github.com/primer/react/commit/c79e78c7a9cba327ae826a8923893b78f402e628) Thanks [@adrianababakanian](https://github.com/adrianababakanian)! - Remove `aria-hidden=true` from `span`s with required asterisk

- [#3196](https://github.com/primer/react/pull/3196) [`21fa73cd`](https://github.com/primer/react/commit/21fa73cde4ff0172a95e0aca19550e5dd554c2a0) Thanks [@iansan5653](https://github.com/iansan5653)! - Fix `useDynamicTextareaHeight` initial render with slots

- [#3413](https://github.com/primer/react/pull/3413) [`4dc719c4`](https://github.com/primer/react/commit/4dc719c453870c7ddb595cfbabc1310358f4ecce) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Ignore arrow key events when combined with cmd or alt keys to avoid interfering with native browser shortcuts.

- [#3411](https://github.com/primer/react/pull/3411) [`295c4bcd`](https://github.com/primer/react/commit/295c4bcd4b2db37a92979afedb2b25aee80db632) Thanks [@dusave](https://github.com/dusave)! - Fix `Dialog2` backdrop color variable

- [#3440](https://github.com/primer/react/pull/3440) [`99a641bd`](https://github.com/primer/react/commit/99a641bde39f5b9029465be48a4f4d8a23f04a59) Thanks [@joshblack](https://github.com/joshblack)! - Add the experimental folder to the npm package for @primer/react

## 35.26.0

### Minor Changes

- [#3346](https://github.com/primer/react/pull/3346) [`63049234`](https://github.com/primer/react/commit/63049234a31b124775a3b6b67d6113cf6d9d0cb6) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu: Calling `event.preventDefault` inside `onSelect` of `ActionList.Item` will prevent the default behavior of closing the menu

- [#3276](https://github.com/primer/react/pull/3276) [`8abf2688`](https://github.com/primer/react/commit/8abf2688952ff0e69ba843ee6ccfc5d5574abb76) Thanks [@joshblack](https://github.com/joshblack)! - Add experimental Table.ErrorDialog component

- [#3244](https://github.com/primer/react/pull/3244) [`42a78c11`](https://github.com/primer/react/commit/42a78c116fbffda44d85cbbfb93d24f0785fde83) Thanks [@Bestra](https://github.com/Bestra)! - Add pullQueued state to StateLabel

- [#3229](https://github.com/primer/react/pull/3229) [`c0cbdd08`](https://github.com/primer/react/commit/c0cbdd0806809236e681cab535b4a74ecdfcc14a) Thanks [@colebemis](https://github.com/colebemis)! - Add `minWidth prop to `PageLayout.Pane`and`SplitPageLayout.Pane`

- [#3343](https://github.com/primer/react/pull/3343) [`786013e3`](https://github.com/primer/react/commit/786013e3f44947da4fa8ecebfcb24012d93a501c) Thanks [@mperrotti](https://github.com/mperrotti)! - Allows up to 4 levels of nesting in the NavList component.

- [#3199](https://github.com/primer/react/pull/3199) [`bfd9e0c8`](https://github.com/primer/react/commit/bfd9e0c8ee3b6b335e04c5c1d4ca82cf23760877) Thanks [@joshblack](https://github.com/joshblack)! - Add support for Pagination in DataTable

- [#3311](https://github.com/primer/react/pull/3311) [`00cf2e3f`](https://github.com/primer/react/commit/00cf2e3fac652300c516e554220e60176dfccd92) Thanks [@colebemis](https://github.com/colebemis)! - SelectPanel: Add `title` prop

- [#3148](https://github.com/primer/react/pull/3148) [`ac437bb1`](https://github.com/primer/react/commit/ac437bb1944b88251c719ae7ae689c5906f19c3f) Thanks [@jonrohan](https://github.com/jonrohan)! - Rename component StyledOcticon to Octicon

- [#3322](https://github.com/primer/react/pull/3322) [`c0b2fcfb`](https://github.com/primer/react/commit/c0b2fcfbbd46e91ca169e782c48f0b06a337ab57) Thanks [@colebemis](https://github.com/colebemis)! - SelectPanel: Add `subtitle` prop

- [#3295](https://github.com/primer/react/pull/3295) [`e71d928c`](https://github.com/primer/react/commit/e71d928c6ebd3b4bf5de6d75853d94ca15e0ba4e) Thanks [@joshblack](https://github.com/joshblack)! - Add @primer/react/experimental entrypoint as an alternative to drafts

### Patch Changes

- [#3121](https://github.com/primer/react/pull/3121) [`3ad56486`](https://github.com/primer/react/commit/3ad564865d3e387ff9f62d34ad5873c837d13f72) Thanks [@mperrotti](https://github.com/mperrotti)! - Changes the alignment of the validation message icon to be vertically center-aligned with the first line of text.

- [#3270](https://github.com/primer/react/pull/3270) [`6f2340cc`](https://github.com/primer/react/commit/6f2340cc7e17a90b9cb09722ec791d82f4f71329) Thanks [@langermank](https://github.com/langermank)! - Button counter contrast fixes

- [#3207](https://github.com/primer/react/pull/3207) [`6773b90d`](https://github.com/primer/react/commit/6773b90d8ced05fae4ac9024e84cc31f1da9b9a3) Thanks [@colebemis](https://github.com/colebemis)! - `MarkdownViewer` is now SSR-compatible

- [#3310](https://github.com/primer/react/pull/3310) [`5746c746`](https://github.com/primer/react/commit/5746c746d8d7eac29cfa2db702ba4a545527b588) Thanks [@colebemis](https://github.com/colebemis)! - SelectPanel: Add `role="dialog"` to overlay

- [#3368](https://github.com/primer/react/pull/3368) [`c8095a1d`](https://github.com/primer/react/commit/c8095a1d1c242bc15168d59f201a7dbc2f9e1997) Thanks [@mperrotti](https://github.com/mperrotti)! - Correct disabled Button icon fill colors

- [#3312](https://github.com/primer/react/pull/3312) [`56c9dd2b`](https://github.com/primer/react/commit/56c9dd2b022f78fb9905fad86a1b64873a0bfb1b) Thanks [@colebemis](https://github.com/colebemis)! - SelectPanel: Add filter input label and description

- [#3332](https://github.com/primer/react/pull/3332) [`ff8c6858`](https://github.com/primer/react/commit/ff8c685806c5fa8cc123acf5bf0ccfc6d42116f6) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Move `lodash.isempty` and `lodash.isobject` from `devDependencies` to `dependencies`

- [#3200](https://github.com/primer/react/pull/3200) [`63d8ad6d`](https://github.com/primer/react/commit/63d8ad6d16dd66b96d370ee64d34be026739816a) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Add a z-index to make it appear on the top of the stack

- [#3350](https://github.com/primer/react/pull/3350) [`524120c0`](https://github.com/primer/react/commit/524120c046614c7005ba67953748d9765e65002b) Thanks [@langermank](https://github.com/langermank)! - Loosen `@primitives` dependency

- [#3300](https://github.com/primer/react/pull/3300) [`5d067381`](https://github.com/primer/react/commit/5d067381243139b79ea65b47ce61782cd14a92a0) Thanks [@jdrush89](https://github.com/jdrush89)! - Fixing toggle bug on Treeview when it initially receives focus

- [#3277](https://github.com/primer/react/pull/3277) [`0ac31da8`](https://github.com/primer/react/commit/0ac31da8681c769c7d508d9290d81d19c76f762d) Thanks [@adrianababakanian](https://github.com/adrianababakanian)! - `Pagination`: Use `<button>` instead of `<span>` for disabled prev/next controls to improve accessibility

- [#3262](https://github.com/primer/react/pull/3262) [`7f2ddcec`](https://github.com/primer/react/commit/7f2ddcecd867a5fc73d21ec1f5c672ef306f13ef) Thanks [@mattcosta7](https://github.com/mattcosta7)! - passthrough form control label props

- [#3316](https://github.com/primer/react/pull/3316) [`2cf7cdda`](https://github.com/primer/react/commit/2cf7cdda8bfb45f7dd677700386b620df91061b2) Thanks [@colebemis](https://github.com/colebemis)! - SelectPanel: Announce changes to screen readers

- [#3325](https://github.com/primer/react/pull/3325) [`3ece2f6b`](https://github.com/primer/react/commit/3ece2f6b55d9e37c3e57ba8b0ea297e190603873) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Remove chroma-js dependency. Companion to #3243

- [#3182](https://github.com/primer/react/pull/3182) [`7827c711`](https://github.com/primer/react/commit/7827c71163e4d964e9878d624cf4cf1694c7447d) Thanks [@green6erry](https://github.com/green6erry)! - Removed default aria-live polite

- [#3291](https://github.com/primer/react/pull/3291) [`1378bc1f`](https://github.com/primer/react/commit/1378bc1f59b48f99d623f1eb5b92c513ce6cde00) Thanks [@mattcosta7](https://github.com/mattcosta7)! - Counter label forwards refs and dom props

## 35.25.1

### Patch Changes

- [#3174](https://github.com/primer/react/pull/3174) [`d4c6ae5b`](https://github.com/primer/react/commit/d4c6ae5b481631ab9bcd7256f5287612c97e021e) Thanks [@colebemis](https://github.com/colebemis)! - `MarkdownEditor` is now SSR-compatible.

  Warning: In this new implementation, `MarkdownEditor.Toolbar`, `MarkdownEditor.Actions`, and `MarkdownEditor.Label` must be direct children of `MarkdownEditor`.

- [#3209](https://github.com/primer/react/pull/3209) [`a6279536`](https://github.com/primer/react/commit/a6279536e3c2c28788196fd9a5e28fc53ec6538a) Thanks [@langermank](https://github.com/langermank)! - Remove `--primer` prefix from CSS var

- [#3173](https://github.com/primer/react/pull/3173) [`6b900e90`](https://github.com/primer/react/commit/6b900e90c3a551251b8161227c3d51ba476b9b5c) Thanks [@colebemis](https://github.com/colebemis)! - `ActionList` and `NavList` are now SSR-compatible.

  Warning: In this new implementation, `ActionList.LeadingVisual`, `ActionList.TrailingVisual,` and `ActionList.Description` must be direct children of `ActionList`. The same applies to `NavList`.

- [#3198](https://github.com/primer/react/pull/3198) [`a273748b`](https://github.com/primer/react/commit/a273748b6d8162b7f6e819200c5663963558ec2f) Thanks [@langermank](https://github.com/langermank)! - Bug fix: `ButtonGroup` borders show incorrectly on hover

## 35.25.0

### Minor Changes

- [#3186](https://github.com/primer/react/pull/3186) [`2b147794`](https://github.com/primer/react/commit/2b14779453de66a889d9bbcb6b81e3e9a7360f4d) Thanks [@joshblack](https://github.com/joshblack)! - Modules under an internal export pattern are not able to be imported from outside @primer/react

- [#3090](https://github.com/primer/react/pull/3090) [`1b8bb16f`](https://github.com/primer/react/commit/1b8bb16f9d874738bae02f88e458495c39052134) Thanks [@kendallgassner](https://github.com/kendallgassner)! - Experimental Support: exporting useResponsiveValue

- [#3055](https://github.com/primer/react/pull/3055) [`42037c98`](https://github.com/primer/react/commit/42037c98b845a99cdf922802e9869e1bb3c3f07d) Thanks [@joshblack](https://github.com/joshblack)! - Add Table.Skeleton component

### Patch Changes

- [#3124](https://github.com/primer/react/pull/3124) [`5b3cf499`](https://github.com/primer/react/commit/5b3cf49957ea96e0b7f00b8ac2c78d02688a908d) Thanks [@mattcosta7](https://github.com/mattcosta7)! - replace createRef with useRef

- [#3149](https://github.com/primer/react/pull/3149) [`4c2d121f`](https://github.com/primer/react/commit/4c2d121fa44386c596c8b29dc159c57c49341c01) Thanks [@colebemis](https://github.com/colebemis)! - `FormControl` is now SSR-compatible.

  Warning: In this new implementation, `FormControl.Caption`, `FormControl.Label`, `FormControl.LeadingVisual`, and `FormControl.Validation` must be direct children of `FormControl`.

- [#3114](https://github.com/primer/react/pull/3114) [`f5c7f299`](https://github.com/primer/react/commit/f5c7f2997ec568420cc980bf672b6c5b44712ef7) Thanks [@radglob](https://github.com/radglob)! - Adds the option to declare multiple segments in a ProgressBar.

- [#3127](https://github.com/primer/react/pull/3127) [`5224fcbf`](https://github.com/primer/react/commit/5224fcbf026b7627be1d20a5ff097d1200b66af2) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Suppress SSR warning for useLayoutEffect in NavList, use useIsomorphicLayoutEffect instead of useLayoutEffect

- [#3165](https://github.com/primer/react/pull/3165) [`d749f495`](https://github.com/primer/react/commit/d749f495e0129de41dc33136b4d5f1145b17a275) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Add transparent outline for focus to support WHCM

- [#3120](https://github.com/primer/react/pull/3120) [`9e40fdf4`](https://github.com/primer/react/commit/9e40fdf47ac7c6003a9ba3ebb7efc17e3b7306bd) Thanks [@simurai](https://github.com/simurai)! - Bump @primer/primitives to `7.11.5`

- [#3093](https://github.com/primer/react/pull/3093) [`8b5307da`](https://github.com/primer/react/commit/8b5307daad011627fdc96fec1a6d600f479458b5) Thanks [@simurai](https://github.com/simurai)! - Bump @primer/primitives to `7.11.3`

- [#3097](https://github.com/primer/react/pull/3097) [`a38c00e6`](https://github.com/primer/react/commit/a38c00e6722373599e6be83b857c7f22c2014459) Thanks [@colebemis](https://github.com/colebemis)! - `TreeView` is now SSR-compatible.

  Warning: In this new implementation, `TreeView.LeadingVisual` and `TreeView.TrailingView` must be direct children of `TreeView.Item`.

- [#3170](https://github.com/primer/react/pull/3170) [`1f2df9b7`](https://github.com/primer/react/commit/1f2df9b7164fe29dccfe24cb752766c2f63754d1) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - When an inline description is added to the item the normal text is set to bold

- [#3160](https://github.com/primer/react/pull/3160) [`4b05b19e`](https://github.com/primer/react/commit/4b05b19e6812396e0b88db37d65ca05c61ad7732) Thanks [@joshblack](https://github.com/joshblack)! - Update PageLayout.Pane to provide a warning instead of an error when overflow is detected and no label has been provided

- [#3094](https://github.com/primer/react/pull/3094) [`16cae51a`](https://github.com/primer/react/commit/16cae51a243a66707ddd1f027d9429ee3e0f45b6) Thanks [@mperrotti](https://github.com/mperrotti)! - Fixes styling issue where PointerBox would show a border between the caret and the box if the background color was transparent.

- [#3112](https://github.com/primer/react/pull/3112) [`bd4e1393`](https://github.com/primer/react/commit/bd4e13934c99bdfaa7f5941afc1beaec371fef28) Thanks [@langermank](https://github.com/langermank)! - Adds shadow and color change to IssueLabelToken on hover

- [#3146](https://github.com/primer/react/pull/3146) [`a19b721c`](https://github.com/primer/react/commit/a19b721c8abde18cd05b745e9e18074c4eaa16f0) Thanks [@colebemis](https://github.com/colebemis)! - `CheckboxGroup` and `RadioGroup` are now SSR-compatible.

  Warning: In this new implementation, `CheckboxGroup.Caption`, `CheckboxGroup.Label,` and `CheckboxGroup.Validation` must be direct children of `CheckboxGroup`. The same applies to `RadioGroup`.

## 35.24.0

### Minor Changes

- [#3071](https://github.com/primer/react/pull/3071) [`681e2271`](https://github.com/primer/react/commit/681e2271ecc90bde2920887c50c0d44b121005f1) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds a helper component for rendering placeholder text to explain why a DataTable cell has no content.

- [#3089](https://github.com/primer/react/pull/3089) [`4a6a9f73`](https://github.com/primer/react/commit/4a6a9f7326d5bf1e476a040d7f2f4f61e4d5bd05) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds the ability to exclose indentation for flat tree views.

- [#3011](https://github.com/primer/react/pull/3011) [`f8132d8e`](https://github.com/primer/react/commit/f8132d8ef653e1bd5a16203ab47f6006a871f662) Thanks [@edersonlucas](https://github.com/edersonlucas)! - Add the `tooltipDirection` property to the `TextInput.Action` component to make the tooltip position flexible.

### Patch Changes

- [#3085](https://github.com/primer/react/pull/3085) [`bf8c73b4`](https://github.com/primer/react/commit/bf8c73b4c36422fdd70b56f9ba677b6d6b961e87) Thanks [@mperrotti](https://github.com/mperrotti)! - Renames DataTable 'shrink' column width to 'growCollapse'

- [#3104](https://github.com/primer/react/pull/3104) [`e46e33b8`](https://github.com/primer/react/commit/e46e33b8be0d553b838887d70893734923bb27d8) Thanks [@iansan5653](https://github.com/iansan5653)! - Fix `IssueLabelToken` treating alternative light schemes as dark

## 35.23.0

### Minor Changes

- [#3068](https://github.com/primer/react/pull/3068) [`09e11335`](https://github.com/primer/react/commit/09e11335f5a415459e18feabe2686511adb51fe4) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds text alignment option to columns

- [#3012](https://github.com/primer/react/pull/3012) [`04d9db02`](https://github.com/primer/react/commit/04d9db02c0ba6ddca13a0b2bd0f4ada3e00991e7) Thanks [@radglob](https://github.com/radglob)! - Adds `tabIndex` and `role="region"` to `PageLayout.Pane` when overflow is detected (scrollHeight > clientHeight). Also requires either `aria-labelledby` or `aria-label` when overflow is detected, and throws an error if neither is defined.

### Patch Changes

- [#3056](https://github.com/primer/react/pull/3056) [`7e4f7714`](https://github.com/primer/react/commit/7e4f7714f4839b0bd304770da1e64aa247a68d7b) Thanks [@langermank](https://github.com/langermank)! - Remove incorrect focus styles on ActionList items

- [#3061](https://github.com/primer/react/pull/3061) [`b71cb1fb`](https://github.com/primer/react/commit/b71cb1fb2240b08a816278af0dd94ac4e2e1246d) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Stop rendering `activeClassName` when there is no `to` prop is passed for react-router (TabNav, SubNav, BreadCrumb, UnderlineNav v1)

- [#3041](https://github.com/primer/react/pull/3041) [`e5f13300`](https://github.com/primer/react/commit/e5f133004721426a63c8647e22f987dddd716442) Thanks [@simurai](https://github.com/simurai)! - Use open/closed colors for `StateLabel`

## 35.22.0

### Minor Changes

- [#2901](https://github.com/primer/react/pull/2901) [`992f1acd`](https://github.com/primer/react/commit/992f1acd14e6425c1f12879d142f2171c131d416) Thanks [@joshblack](https://github.com/joshblack)! - Add babel-plugin-dev-expression to transform warning calls in package bundle

- [#3027](https://github.com/primer/react/pull/3027) [`3153c810`](https://github.com/primer/react/commit/3153c8106cbfcdd2890461c2ff8845b8fb131920) Thanks [@talum](https://github.com/talum)! - Export `useResizeObserver` hook

### Patch Changes

- [#2996](https://github.com/primer/react/pull/2996) [`baa63958`](https://github.com/primer/react/commit/baa6395821caada57a9d4a662cf3fa1bd27c07ec) Thanks [@mperrotti](https://github.com/mperrotti)! - Implements column width features for the DataTable

- [#3036](https://github.com/primer/react/pull/3036) [`51a2cc94`](https://github.com/primer/react/commit/51a2cc9484a6b9b822d61b3ea2e1f8af5ed1bca2) Thanks [@colebemis](https://github.com/colebemis)! - `PageLayout` and `SplitPageLayout` are now SSR-compatible.

  Warning: In this new implementation, `PageLayout.Header` and `PageLayout.Footer` must be direct children of `PageLayout`. The same applies to `SplitPageLayout`

- [#3029](https://github.com/primer/react/pull/3029) [`bb9f1561`](https://github.com/primer/react/commit/bb9f1561c847e9b6f64027060ecf0b45303b8f40) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds new a11y improvements to Pagination.

- [#2993](https://github.com/primer/react/pull/2993) [`6aa9205e`](https://github.com/primer/react/commit/6aa9205e37197b6ab05650c4a33f6cd7246f771c) Thanks [@mperrotti](https://github.com/mperrotti)! - Makes StateLabel's 'status' prop required

- [#3009](https://github.com/primer/react/pull/3009) [`cc4e2bc5`](https://github.com/primer/react/commit/cc4e2bc5b6dffdbbb367d130e6f08683f28c20f1) Thanks [@iansan5653](https://github.com/iansan5653)! - Recalculate autocomplete suggestions if the input data changes while the menu is open

- [#3010](https://github.com/primer/react/pull/3010) [`022d449c`](https://github.com/primer/react/commit/022d449c61457377f516617814488a03def5fc32) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - SegmentedControl: Resolve axe-violation by adding a discernible text to the icon button and removing the tooltip until it is marked as accessible

## 35.21.0

### Minor Changes

- [#2953](https://github.com/primer/react/pull/2953) [`91688a41`](https://github.com/primer/react/commit/91688a4110b2b1c2208fc3ea257a40b61fa022bb) Thanks [@joshblack](https://github.com/joshblack)! - Add Table.Divider and Table.Actions components for Table

- [#2985](https://github.com/primer/react/pull/2985) [`38ac17a6`](https://github.com/primer/react/commit/38ac17a6da12230c2037124776e55d165a6c1ee6) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Hidden: rename prop 'on' -> 'when'

- [#2951](https://github.com/primer/react/pull/2951) [`eff43b07`](https://github.com/primer/react/commit/eff43b0789afea74078b4024d7f35d4723b7055b) Thanks [@joshblack](https://github.com/joshblack)! - Add DataTable, Table to drafts entrypoint

### Patch Changes

- [#2929](https://github.com/primer/react/pull/2929) [`ee4b76f8`](https://github.com/primer/react/commit/ee4b76f8ff2b711f72efb0cf790113c67bdd08e6) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Button: Fixes the style override issue when size is explicitly specified as medium

- [#2933](https://github.com/primer/react/pull/2933) [`81ed5403`](https://github.com/primer/react/commit/81ed5403688129809957bd0224cce68d4087ad36) Thanks [@langermank](https://github.com/langermank)! - Bug fix: ButtonGroup hover state causes buttons to shift horizontally

- [#2948](https://github.com/primer/react/pull/2948) [`0215c969`](https://github.com/primer/react/commit/0215c96905969f514326621eb1fef84e09ef3af0) Thanks [@colebemis](https://github.com/colebemis)! - Include story source code in `generated/components.json`

- [#2905](https://github.com/primer/react/pull/2905) [`6bf9e677`](https://github.com/primer/react/commit/6bf9e6772608a639da8b7db5f6f13248b7b186cf) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - PageHeader: Make default heading level `h2`

- [#2973](https://github.com/primer/react/pull/2973) [`3a25597a`](https://github.com/primer/react/commit/3a25597a093edf96601d05f3353c4c1277a06005) Thanks [@colebemis](https://github.com/colebemis)! - Upgrade @primer/octicons-react dependency to `^18.0.0`

- [#2910](https://github.com/primer/react/pull/2910) [`0c701920`](https://github.com/primer/react/commit/0c7019201084c0f39ff3b4cb51d4f57f0e3d65d1) Thanks [@iansan5653](https://github.com/iansan5653)! - Add `isolation:isolate` to `ButtonGroup` container

- [#2843](https://github.com/primer/react/pull/2843) [`533f0b4a`](https://github.com/primer/react/commit/533f0b4aaa762938f61c9fad03de1b2660fd1cb9) Thanks [@mperrotti](https://github.com/mperrotti)! - Updates the ToggleSwitch styles to be more minimal and less dimensional

- [#2702](https://github.com/primer/react/pull/2702) [`0121c0f5`](https://github.com/primer/react/commit/0121c0f5ce3a0ceb9dc61b40a102847fb9795abc) Thanks [@mperrotti](https://github.com/mperrotti)! - Pagination design updates:

  - Updates spacing inside of the buttons to match the "medium" control metrics: https://primer.style/primitives/spacing#medium
  - Updates hover style to align with ActionList items and other elements that may appear on any background color
  - Updates ARIA markup to improve assistive technology experience

- [#2974](https://github.com/primer/react/pull/2974) [`6a795da6`](https://github.com/primer/react/commit/6a795da6d223692734fb679e31336de7a63f757a) Thanks [@iansan5653](https://github.com/iansan5653)! - Fix ellipsis truncation in `Token`

- [#2925](https://github.com/primer/react/pull/2925) [`6f50b156`](https://github.com/primer/react/commit/6f50b1569ac4024672fa19bc3a916528e2308566) Thanks [@langermank](https://github.com/langermank)! - Decrease `invisible` button icon CSS specifity

- [#2922](https://github.com/primer/react/pull/2922) [`7140ac8f`](https://github.com/primer/react/commit/7140ac8f14f309e879b1cc98742b92b1c2d78961) Thanks [@green6erry](https://github.com/green6erry)! - Updated PageLayout.Pane to conditionally include id prop

- [#2702](https://github.com/primer/react/pull/2702) [`0121c0f5`](https://github.com/primer/react/commit/0121c0f5ce3a0ceb9dc61b40a102847fb9795abc) Thanks [@mperrotti](https://github.com/mperrotti)! - Updates the visual design of the Pagination component to align with the latest design token usage patterns. Also improves ARIA markup to hide the "..." from assistive technologies.

- [#2954](https://github.com/primer/react/pull/2954) [`041dd150`](https://github.com/primer/react/commit/041dd150d6a85b0e60a3802dc59b00da63aeedd1) Thanks [@iansan5653](https://github.com/iansan5653)! - Allow `React.ReactNode` as `Token` content

- [#3004](https://github.com/primer/react/pull/3004) [`45107bc5`](https://github.com/primer/react/commit/45107bc56e54da883ce134b2b1c9637935e9f6e3) Thanks [@iansan5653](https://github.com/iansan5653)! - Add support for custom emojis and a declarative "loading" state in `MarkdownEditor` suggestions

## 35.20.0

### Minor Changes

- [`5967b0a9`](https://github.com/primer/react/commit/5967b0a9b71b0d2296eada7031ff6c82ad1b17a4) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Issue a deprecation notice for UnderlineNav v1

- [#2815](https://github.com/primer/react/pull/2815) [`74df59c4`](https://github.com/primer/react/commit/74df59c4e0df580dce7dd5c426fe44143d586b77) Thanks [@mperrotti](https://github.com/mperrotti)! - Addresses feedback from the accessibility team about our SegmentedControl component. These changes include an update to ActionMenu that allows u to specify the ID of the DOM node that labels the menu.

- [#2768](https://github.com/primer/react/pull/2768) [`5055b91b`](https://github.com/primer/react/commit/5055b91b9cf40e163b9b19fa4a5bcc707adae329) Thanks [@green6erry](https://github.com/green6erry)! - Confine Heading as prop to header element types

- [#2903](https://github.com/primer/react/pull/2903) [`13651ba1`](https://github.com/primer/react/commit/13651ba1ec73533900dc36501af307266d3a63c7) Thanks [@colebemis](https://github.com/colebemis)! - TreeView promoted to [beta](https://primer.style/contribute/component-lifecycle#beta) status. You can now import it from the main bundle instead of `/drafts`:

  ```diff
  - import {TreeView} from '@primer/react/drafts'
  + import {TreeView} from '@primer/react'
  ```

### Patch Changes

- [#2792](https://github.com/primer/react/pull/2792) [`03b470b0`](https://github.com/primer/react/commit/03b470b0eebc97a9c74483914ab638ae9cf11436) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - - Add a block prop for full width

  - Add alignContent prop to align content to center or start for full width buttons
  - Use control sizing CSS variable values (not using CSS vars just yet)
  - Use height over padding for more control over sizing
  - Adjust invisible button variant to match new design using ActionList colors

- [#2868](https://github.com/primer/react/pull/2868) [`03ebf41b`](https://github.com/primer/react/commit/03ebf41b0ae4681841455217661e768ef2237686) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Reliably move focus from loading item to first asynchronously loaded item

- [#2845](https://github.com/primer/react/pull/2845) [`c31314c8`](https://github.com/primer/react/commit/c31314c84186999ed6d7d905c04c5aa67057d3b3) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: When moving focus to TreeView, the current item will be focused by default.

- [#2770](https://github.com/primer/react/pull/2770) [`3bf1b0e3`](https://github.com/primer/react/commit/3bf1b0e368df10180291de205573df6c85434343) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Handle the case when container is too small to render any items

- [`d8f18435`](https://github.com/primer/react/commit/d8f184351f01092ac144b736fd694da07ae9254d) Thanks [@iansan5653](https://github.com/iansan5653)! - Add `aria-modal` attribute to `Dialog` (V2) element

- [`3127e104`](https://github.com/primer/react/commit/3127e104c6f165e76866c1b834a9d092ca4ca19a) Thanks [@jbrown1618](https://github.com/jbrown1618)! - Upgrade primer/behaviors from 1.3.1 to 1.3.2

- [`2a00aab6`](https://github.com/primer/react/commit/2a00aab6a5424ff72f7cffcc75bc8a2fc9ecbc54) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Set aria-selected=true on focused item

- [`ca7398df`](https://github.com/primer/react/commit/ca7398dfdda698c2eff9c3ed3744d7b7fee387ad) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - CounterLabel: Do not parse children to string for visually hidden content

- [#2900](https://github.com/primer/react/pull/2900) [`3768cd7d`](https://github.com/primer/react/commit/3768cd7d3458081b07c8a21ec6a85cd59d286c39) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - PageHeader: A11y eng review remediations

- [`8bce9740`](https://github.com/primer/react/commit/8bce974010967ab203e348a063ae2f2cdf996fe3) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Update total height of the navigation to `48px`

- [`196a7929`](https://github.com/primer/react/commit/196a792964867c92b3beeaab6bbe4681aa10e1a4) Thanks [@iansan5653](https://github.com/iansan5653)! - Fix `useDynamicTextareaHeight` not taking into account top padding of `textarea`

  Also makes the hook accept a `RefObject` instead of an element instance

- [#2845](https://github.com/primer/react/pull/2845) [`c31314c8`](https://github.com/primer/react/commit/c31314c84186999ed6d7d905c04c5aa67057d3b3) Thanks [@colebemis](https://github.com/colebemis)! - TabNav: Re-focusing a TabNav will focus the selected tab

## 35.19.0

### Minor Changes

- [#2807](https://github.com/primer/react/pull/2807) [`81447a10`](https://github.com/primer/react/commit/81447a10c7795e268f6c62535ca24c166bb0d630) Thanks [@joshblack](https://github.com/joshblack)! - Add default `type="button"` for `Button`. This removes the implicit `type="submit"` for a `<button>` and requires an explicit `type` to change.

- [#2789](https://github.com/primer/react/pull/2789) [`44f66cb9`](https://github.com/primer/react/commit/44f66cb976c4be496733f3f85a3fc23dbb6023c7) Thanks [@green6erry](https://github.com/green6erry)! - warn user if link `as` prop is not <a> or <button>

### Patch Changes

- [#2818](https://github.com/primer/react/pull/2818) [`7403a47f`](https://github.com/primer/react/commit/7403a47f4230bbde600d64eb678cef5c3ee14c2b) Thanks [@iansan5653](https://github.com/iansan5653)! - Improve initial `useCombobox` initialization process to avoid race conditions

## 35.18.0

### Minor Changes

- [#2715](https://github.com/primer/react/pull/2715) [`8bd40de2`](https://github.com/primer/react/commit/8bd40de25536bce68f3ac238063243a6c70bee0a) Thanks [@ajhenry](https://github.com/ajhenry)! - Overlay: Add `position`, `right`, and `bottom` props

### Patch Changes

- [#2732](https://github.com/primer/react/pull/2732) [`3f70b2e6`](https://github.com/primer/react/commit/3f70b2e6d283667b0f09d97423563fdba0721ba9) Thanks [@renbaoshuo](https://github.com/renbaoshuo)! - Prevent automatic batching updates in ThemeProvider to ensure client use right colorMode

- [#2701](https://github.com/primer/react/pull/2701) [`73dbefdb`](https://github.com/primer/react/commit/73dbefdbe145c240c3f6a1ac3a21e9e02084d6bd) Thanks [@mperrotti](https://github.com/mperrotti)! - Updates visual design of the Checkbox and Radio component to match the new direction defined by design.

- [#2729](https://github.com/primer/react/pull/2729) [`4dcf658c`](https://github.com/primer/react/commit/4dcf658cf6155d44bac4b79556b38dcbe954f344) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - PageHeader: Add visual ordering for layout enforcement

- [#2710](https://github.com/primer/react/pull/2710) [`ac0abd17`](https://github.com/primer/react/commit/ac0abd179598ab3a3e5439a38bdde6aeacaf8b6a) Thanks [@green6erry](https://github.com/green6erry)! - TreeView: aria status description is now accurate

- [#2729](https://github.com/primer/react/pull/2729) [`4dcf658c`](https://github.com/primer/react/commit/4dcf658cf6155d44bac4b79556b38dcbe954f344) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Hidden: Refactor Hidden component to use `getBreakpointsDeclarations` util function to reduce layout shifts

- [#2759](https://github.com/primer/react/pull/2759) [`693ce68c`](https://github.com/primer/react/commit/693ce68c9e47c37fb36a334f7f524e688d31bccd) Thanks [@manuelpuyol](https://github.com/manuelpuyol)! - Update defaultProps to be JS function defaults

## 35.17.0

### Minor Changes

- [#2677](https://github.com/primer/react/pull/2677) [`d356be83`](https://github.com/primer/react/commit/d356be836c1d16666d4e952c21e71e4318749f46) Thanks [@mattcosta7](https://github.com/mattcosta7)! - update types for button extensions

- [#2661](https://github.com/primer/react/pull/2661) [`5dd4bb1f`](https://github.com/primer/react/commit/5dd4bb1f7f92647197160298fc1f521b23b4823b) Thanks [@joshblack](https://github.com/joshblack)! - Update to React.useId() when using React 18

- [#2694](https://github.com/primer/react/pull/2694) [`5a659295`](https://github.com/primer/react/commit/5a659295f3ed505ea3af10e66cf8402a2c4b660c) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - PageHeader: export PageHeader in the draft bundle

- [#2662](https://github.com/primer/react/pull/2662) [`1266b108`](https://github.com/primer/react/commit/1266b108bfa54d219580f18651ed02cd38fc0d87) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - PageHeader: Add a util function that returns breakpoint styles with the given CSS property and values

- [#2593](https://github.com/primer/react/pull/2593) [`d8875861`](https://github.com/primer/react/commit/d887586133bf679a1b008f49b112cae39d764c91) Thanks [@radglob](https://github.com/radglob)! - Make resizable SplitPageLayout.Pane keyboard accessible.

### Patch Changes

- [#2765](https://github.com/primer/react/pull/2765) [`154db4b9`](https://github.com/primer/react/commit/154db4b9b2e543f7d75af3ca33f935d05cff3736) Thanks [@iansan5653](https://github.com/iansan5653)! - Remove shadow from `MarkdownEditor` `textarea`

- [#2685](https://github.com/primer/react/pull/2685) [`3a8bb765`](https://github.com/primer/react/commit/3a8bb765424bb51976792c3e585788065755d823) Thanks [@radglob](https://github.com/radglob)! - Setting overflow: auto without a media query to fix resizable pane bug.

- [#2718](https://github.com/primer/react/pull/2718) [`9cb01190`](https://github.com/primer/react/commit/9cb011907cb9cdfd89c8d4442b182cae9ee364db) Thanks [@marywhite](https://github.com/marywhite)! - Prevent default when clicking on MarkdownViewer links with openLinksInNewTab

- [#2656](https://github.com/primer/react/pull/2656) [`db0db6ec`](https://github.com/primer/react/commit/db0db6ec681f00b4ad1bbbc104ac53f133f2349d) Thanks [@joshblack](https://github.com/joshblack)! - Update useDetails `ref` type to HTMLDetailsElement

- [#2762](https://github.com/primer/react/pull/2762) [`74016a7c`](https://github.com/primer/react/commit/74016a7c1426c915534dde95220ccee3bde264d2) Thanks [@mattcosta7](https://github.com/mattcosta7)! - Token: Update component type to be PolymorphicForwardRefComponent.

  this avoids types being swallowed by forwardRef (which isn't polymorphic)

- [#2658](https://github.com/primer/react/pull/2658) [`20e18c07`](https://github.com/primer/react/commit/20e18c07c2a4a4e8b9b2e2456b4dbab08ffe6801) Thanks [@joshblack](https://github.com/joshblack)! - Update TypeScript types for deprecated ButtonClose to support React 18

- [#2755](https://github.com/primer/react/pull/2755) [`dd1e5ce7`](https://github.com/primer/react/commit/dd1e5ce79e6bf02cee8c284a2437a3b910b5a7bd) Thanks [@dwilsonactual](https://github.com/dwilsonactual)! - Update `isScrollable` utility to only run `getComputedStyle` on scrollable content.

- [#2660](https://github.com/primer/react/pull/2660) [`1fb6ee9f`](https://github.com/primer/react/commit/1fb6ee9ff6a13a80d5cb53ada8b5ef027ec02ded) Thanks [@joshblack](https://github.com/joshblack)! - Update npm package to include `deprecated/package.json` for TypeScript type resolution

- [#2721](https://github.com/primer/react/pull/2721) [`386561a3`](https://github.com/primer/react/commit/386561a37b2b6f1f9d4b597e0ac6ede3a40ccbf7) Thanks [@simurai](https://github.com/simurai)! - Add `Noto Sans` to fontStack

- [#2756](https://github.com/primer/react/pull/2756) [`5826b94d`](https://github.com/primer/react/commit/5826b94d2686fff3f8304c6d366542df7bcc3f5e) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Button: Revert new enhancement due to introducing major styling changes

- [#2760](https://github.com/primer/react/pull/2760) [`24fb9a77`](https://github.com/primer/react/commit/24fb9a77a951b3e2e8bda8f4aff8d9aab0fcb34c) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Token: Omit `onResize` and `onResizeCapture` methods that are included in the method expansion and causes type issues in React 18

- [#2757](https://github.com/primer/react/pull/2757) [`b55d8232`](https://github.com/primer/react/commit/b55d8232ce9d990cc91862fff2f6f15ff2fdb65d) Thanks [@jdrush89](https://github.com/jdrush89)! - Making onClick of ActionList.LinkItem functional

- [#2697](https://github.com/primer/react/pull/2697) [`5efab195`](https://github.com/primer/react/commit/5efab195dd75c6871c7240abdf65b4af0e05390d) Thanks [@keithamus](https://github.com/keithamus)! - Update `@github/relative-time-element` package dependency to a range

- [#2712](https://github.com/primer/react/pull/2712) [`88008a0d`](https://github.com/primer/react/commit/88008a0d3e0394b23b3fbb0aa0ca7586b9335601) Thanks [@ajhenry](https://github.com/ajhenry)! - Add `sx` prop to Dialog v2

- [#2750](https://github.com/primer/react/pull/2750) [`dcb51c64`](https://github.com/primer/react/commit/dcb51c64d011afe8e2c8974965e32ee33fb6b876) Thanks [@jdrush89](https://github.com/jdrush89)! - Show tooltips on focus-within

- [#2661](https://github.com/primer/react/pull/2661) [`5dd4bb1f`](https://github.com/primer/react/commit/5dd4bb1f7f92647197160298fc1f521b23b4823b) Thanks [@joshblack](https://github.com/joshblack)! - Update types for components to work for React 17 and 18

## 35.16.0

### Minor Changes

- [#2265](https://github.com/primer/react/pull/2265) [`2ef9ad43`](https://github.com/primer/react/commit/2ef9ad430c3c74fccfe87c77c8eb7fd21335aa69) Thanks [@pksjce](https://github.com/pksjce)! - PageHeader: Draft implementation

- [#2484](https://github.com/primer/react/pull/2484) [`5eb6939a`](https://github.com/primer/react/commit/5eb6939ad5a291a1f440391ffcce01a48ca952ee) Thanks [@keithamus](https://github.com/keithamus)! - Add RelativeTime component

- [#2657](https://github.com/primer/react/pull/2657) [`cc909dc4`](https://github.com/primer/react/commit/cc909dc46edaf8515f80b6d718e356661679beb3) Thanks [@green6erry](https://github.com/green6erry)! - Assign aria-keyshorcuts and role properties to the correct element in LinkItem.tsx

- [#2693](https://github.com/primer/react/pull/2693) [`f8939f33`](https://github.com/primer/react/commit/f8939f33b6ac9d8f2e7332ff0afcacd0c0d9fcc8) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Relative Time Element : Publish v4.1.2 in NPM and GPR

### Patch Changes

- [#2659](https://github.com/primer/react/pull/2659) [`84d29977`](https://github.com/primer/react/commit/84d2997764c065854695e5ecfb07ec04086a34de) Thanks [@kendallgassner](https://github.com/kendallgassner)! - Add a console warning if the Button and IconButton as property is used incorrectly

- [#2666](https://github.com/primer/react/pull/2666) [`d995bb84`](https://github.com/primer/react/commit/d995bb8485fa1dfd0a3637b4851c5ac539b8416d) Thanks [@mattcosta7](https://github.com/mattcosta7)! - make check for semantic as a compile time effect

- [#2639](https://github.com/primer/react/pull/2639) [`fd9ab396`](https://github.com/primer/react/commit/fd9ab3960f5f819bd7c49a495800059545041674) Thanks [@iansan5653](https://github.com/iansan5653)! - Fix `MarkdownEditor` preview overflowing its container

- [#2689](https://github.com/primer/react/pull/2689) [`7fc9acd7`](https://github.com/primer/react/commit/7fc9acd7f8bdd45e8debd96b93fa7c32ff8a544b) Thanks [@mperrotti](https://github.com/mperrotti)! - Removes useless z-index from the remove button in tokens

- [#2635](https://github.com/primer/react/pull/2635) [`95ba0790`](https://github.com/primer/react/commit/95ba079070cfdd01931f64418fbfa288a0474a97) Thanks [@joshblack](https://github.com/joshblack)! - Update Radio to only use disabled when provided and no longer set aria-disabled

- [#2640](https://github.com/primer/react/pull/2640) [`a8f2289d`](https://github.com/primer/react/commit/a8f2289de81c503c4b586c82f7b25ef15783bc3e) Thanks [@jdrush89](https://github.com/jdrush89)! - TreeView: Add containIntrinsicSize prop and typeahead performance improvement

- [#2692](https://github.com/primer/react/pull/2692) [`5352bccb`](https://github.com/primer/react/commit/5352bccb331c4a8941bb505c21a7a7380422f529) Thanks [@jdrush89](https://github.com/jdrush89)! - Trigger onSelect when TreeView items are middle clicked

## 35.15.1

### Patch Changes

- [#2625](https://github.com/primer/react/pull/2625) [`404e2b15`](https://github.com/primer/react/commit/404e2b15f4fe53e4cbeccb138c0d680beacb3045) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Use useIsomorphicLayoutEffect to make it SSR friendly

- [#2606](https://github.com/primer/react/pull/2606) [`e98bcdf9`](https://github.com/primer/react/commit/e98bcdf966fea513dc79c73da35e610039aaba3d) Thanks [@radglob](https://github.com/radglob)! - Fix issue where scroll containers nested inside of PageLayout.Pane would be hard to use on mobile.

## 35.15.0

### Minor Changes

- [#2591](https://github.com/primer/react/pull/2591) [`764bf6b9`](https://github.com/primer/react/commit/764bf6b9789560e071506912abf033d8592ce052) Thanks [@iansan5653](https://github.com/iansan5653)! - Add `useRefObjectAsForwardedRef` to public hooks

- [#2618](https://github.com/primer/react/pull/2618) [`04683150`](https://github.com/primer/react/commit/046831500afb7915a9fd109536ad3bc873a109dc) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: expose aria-current in the API to enable it to be used as the selected status of UnderlineNav.Item

### Patch Changes

- [#2592](https://github.com/primer/react/pull/2592) [`d9c7290a`](https://github.com/primer/react/commit/d9c7290aa9ce31f975e03bfd2ed2cf433bba73fc) Thanks [@radglob](https://github.com/radglob)! - Delete `TreeView.LinkItem`. Use `TreeView.Item` and call a navigation function inside the `onSelect` callback instead:

  ```diff
  - <TreeView.LinkItem href="#">...
  + <TreeView.Item onSelect={() => navigate('#')}>...
  ```

- [#2545](https://github.com/primer/react/pull/2545) [`eb30fdad`](https://github.com/primer/react/commit/eb30fdad958c9e9c8a8656f2fe1ca9416551e1ab) Thanks [@joshblack](https://github.com/joshblack)! - Update setTimeout in AutocompleteInput to cancel when unmounting

- [#2615](https://github.com/primer/react/pull/2615) [`a7455696`](https://github.com/primer/react/commit/a7455696f8bcfd318d04fac777d72e73044fec64) Thanks [@Swiftwork](https://github.com/Swiftwork)! - Fix Windows checkout by removing unsupported colon in filename

- [#2603](https://github.com/primer/react/pull/2603) [`22059e9f`](https://github.com/primer/react/commit/22059e9fb81d65f59b8d7908bcbc3fd0b0b93393) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Render non-breaking space properly for screen readers

- [#2563](https://github.com/primer/react/pull/2563) [`3085fde0`](https://github.com/primer/react/commit/3085fde046bed4961c69ab1fde8d5f50fdc7aefb) Thanks [@josepmartins](https://github.com/josepmartins)! - Remove deprecated component instances in stories

- [#2569](https://github.com/primer/react/pull/2569) [`0e7a6388`](https://github.com/primer/react/commit/0e7a63883e1733db38aba4e7934cd7d66d8fa219) Thanks [@nicolleromero](https://github.com/nicolleromero)! - Present MarkdownEditor from resizing when rendered in a condensed state

- [#2604](https://github.com/primer/react/pull/2604) [`7e9e3678`](https://github.com/primer/react/commit/7e9e3678eb37e4ed65373706fd84543c367d427d) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Accessibility improvements on CounterLabel for better screen reader announcing

## 35.14.2

### [Permalink to documentation](https://primer-d5e3dada59-13348165.drafts.github.io/)

### Patch Changes

- [#2553](https://github.com/primer/react/pull/2553) [`3a4b3124`](https://github.com/primer/react/commit/3a4b3124b92700a871ee2ff9b42fa3b158b50b18) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Only allow `Enter` and `Space` key to select an UnderlineNav item

- [#2506](https://github.com/primer/react/pull/2506) [`a20faba0`](https://github.com/primer/react/commit/a20faba0f20cb5142b72716cc454af133b93975c) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Prevent item width calculation when they are null

- [#2549](https://github.com/primer/react/pull/2549) [`205e1d29`](https://github.com/primer/react/commit/205e1d29cef2c0d44c67031e76ad5d0b14ac36b7) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds a focus style to ActionList.LinkItem that is used when the primary input method is a cursor. Before this change, there was only a focus style for when the keyboard is being used as the primary input method.

- [#2546](https://github.com/primer/react/pull/2546) [`8a8b1a4f`](https://github.com/primer/react/commit/8a8b1a4fa7002f33f5f1c999b69d80346263da98) Thanks [@joshblack](https://github.com/joshblack)! - Add support for PageUp and PageDown for TreeView

- [#2485](https://github.com/primer/react/pull/2485) [`e2a2d78c`](https://github.com/primer/react/commit/e2a2d78cc81a81767f3ba10bd74b9de8a81abaf2) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Only run overflow layout function when nav item has a width

- [#2552](https://github.com/primer/react/pull/2552) [`7877f895`](https://github.com/primer/react/commit/7877f895d902e32ce6878e57895ed90f47574789) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Add aria-hidden and sr-only class support for a descriptive "More" button label

- [#2550](https://github.com/primer/react/pull/2550) [`e13e8ad7`](https://github.com/primer/react/commit/e13e8ad751d31db738e185031fba477da4874aa4) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Remove focus zone and unnecessary 'Arrow keys' & 'Home' & 'End' button navigation support

- [#2551](https://github.com/primer/react/pull/2551) [`5bc5c703`](https://github.com/primer/react/commit/5bc5c703e26175231bfaa1209a3f9b3d0791ff23) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Add aria-hidden and sr-only class support for descriptive counters

- [#2538](https://github.com/primer/react/pull/2538) [`bdbccaaf`](https://github.com/primer/react/commit/bdbccaaff826d0378e3d1af4d5c1c4197dfcc9ac) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Preserve expanded state of nested items when parent item is collapsed.

  **Breaking change**

  `TreeView.Item` and `TreeView.LinkItem` now require an `id` prop:

  ```diff
  - <TreeView.Item>...</TreeView.Item>
  + <TreeView.Item id="unqiue-id">...</TreeView.Item>
  ```

  This is not in a major release because TreeView is still a `draft` component.

- [#2555](https://github.com/primer/react/pull/2555) [`dc1cf6da`](https://github.com/primer/react/commit/dc1cf6da2864dd7dfa4ed0cb2c5362f9ff9dd60f) Thanks [@josepmartins](https://github.com/josepmartins)! - Remove deprecated components usage in Overlay stories

## 35.14.1

### Patch Changes

- [#2510](https://github.com/primer/react/pull/2510) [`c326777e`](https://github.com/primer/react/commit/c326777ec0369968e49d9d9ceb21f7f5609f697b) Thanks [@langermank](https://github.com/langermank)! - Remove deprecated focus style primitives

- [#2483](https://github.com/primer/react/pull/2483) [`23647cfc`](https://github.com/primer/react/commit/23647cfce6132bcf16aa2a31c33c20be029124e0) Thanks [@joshblack](https://github.com/joshblack)! - Add unobserve mock for ResizeObserver in test helpers

- [#2504](https://github.com/primer/react/pull/2504) [`ea4a3c2a`](https://github.com/primer/react/commit/ea4a3c2a11d8d9cdc972405495902ac8e7b61e54) Thanks [@joshblack](https://github.com/joshblack)! - TreeView: Add support for Backspace to move focus to parent item

- [#2511](https://github.com/primer/react/pull/2511) [`0a94420e`](https://github.com/primer/react/commit/0a94420e96a1989a0183f36ec7b90954c4ff4c7b) Thanks [@joshblack](https://github.com/joshblack)! - Remove selected from `<option>` and add defaultValue for `<select>` when placeholder is provided

- [#2523](https://github.com/primer/react/pull/2523) [`50ed6441`](https://github.com/primer/react/commit/50ed644180733ab7baa8ee79dc019a9b6f61bf99) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Performance improvements

- [#2521](https://github.com/primer/react/pull/2521) [`862f93c7`](https://github.com/primer/react/commit/862f93c7438b4c9be753e98a39af98c496d8629f) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Fix unexpected scrolling when focusing child items

- [#2518](https://github.com/primer/react/pull/2518) [`60c36f58`](https://github.com/primer/react/commit/60c36f5872182047c8242718ae1fdeb5bf1669b8) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Remove loading indicator delay

## 35.14.0

### Minor Changes

- [#2466](https://github.com/primer/react/pull/2466) [`9ff856de`](https://github.com/primer/react/commit/9ff856ded581f70ded3eb9c2704e1ada8eb77c13) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Introduce disclosure widget pattern

- [#2466](https://github.com/primer/react/pull/2466) [`9ff856de`](https://github.com/primer/react/commit/9ff856ded581f70ded3eb9c2704e1ada8eb77c13) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Always show at least two items in the overflow menu

- [#2352](https://github.com/primer/react/pull/2352) [`0c2db835`](https://github.com/primer/react/commit/0c2db835b9aca091558d46ac60df1b1bba1c8f0e) Thanks [@japf](https://github.com/japf)! - Add resizable support to the PageLayout component.

### Patch Changes

- [#2502](https://github.com/primer/react/pull/2502) [`6199b10c`](https://github.com/primer/react/commit/6199b10cf3c0f58c3197f69abfcd1c46f4fa680b) Thanks [@joshblack](https://github.com/joshblack)! - Add maxWidth to container of PageLayout.{Pane, Content}

- [#2490](https://github.com/primer/react/pull/2490) [`776fb958`](https://github.com/primer/react/commit/776fb958b8f179f37f4c3da826e164fae904538a) Thanks [@colebemis](https://github.com/colebemis)! - ConfirmationDialog: Remove header landmark to improve accessibility

- [#2492](https://github.com/primer/react/pull/2492) [`cbf0ccfe`](https://github.com/primer/react/commit/cbf0ccfeb48fa4cf5c576da167beeefa84784ff1) Thanks [@joshblack](https://github.com/joshblack)! - Add support for aria-current styles in high contrast mode for TreeView

- [#2317](https://github.com/primer/react/pull/2317) [`a60f0f8d`](https://github.com/primer/react/commit/a60f0f8d449b2e0cf705d94280fed5a8a8f5070e) Thanks [@willglas](https://github.com/willglas)! - useMnemonics hook ignores keydown events from textarea elements

- [#2467](https://github.com/primer/react/pull/2467) [`d396c89a`](https://github.com/primer/react/commit/d396c89aa4beb655bb8e6bae0863aa94057ce736) Thanks [@josepmartins](https://github.com/josepmartins)! - Align status components table to primer.style/status table

- [#2509](https://github.com/primer/react/pull/2509) [`cbcc0225`](https://github.com/primer/react/commit/cbcc0225b82e66be55460b666bfc2824bf0082f3) Thanks [@joshblack](https://github.com/joshblack)! - Update FormControl to correctly render Checkbox labels

- [#2487](https://github.com/primer/react/pull/2487) [`6a30812c`](https://github.com/primer/react/commit/6a30812c1d47a64144f0675f8a540136af04726b) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - fixes colors for done and sponsors label

- [#2493](https://github.com/primer/react/pull/2493) [`7ea92ab4`](https://github.com/primer/react/commit/7ea92ab422f89af458626be2e8f380043d00168d) Thanks [@nicolleromero](https://github.com/nicolleromero)! - Address scenario in useLinkInterception where onLinkClick was not being called when the DOM was updated outside of React

- [#2359](https://github.com/primer/react/pull/2359) [`b05fa743`](https://github.com/primer/react/commit/b05fa74367a15a3a929c2858e09e12b439758538) Thanks [@joshblack](https://github.com/joshblack)! - Update `Button` to only spread additional `props` onto underlying `<button>`
  element.

- [#2466](https://github.com/primer/react/pull/2466) [`9ff856de`](https://github.com/primer/react/commit/9ff856ded581f70ded3eb9c2704e1ada8eb77c13) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Render a visually hidden heading for screen readers when aria-label is present

## 35.13.0

### Minor Changes

- [#2447](https://github.com/primer/react/pull/2447) [`e03b5e4d`](https://github.com/primer/react/commit/e03b5e4d3d7ad5f7761d59158e9223da746f4592) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Add support and docs for react router configuration

- [#2447](https://github.com/primer/react/pull/2447) [`e03b5e4d`](https://github.com/primer/react/commit/e03b5e4d3d7ad5f7761d59158e9223da746f4592) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Deprecate coarse input detection and its scroll behaviour

### Patch Changes

- [#2465](https://github.com/primer/react/pull/2465) [`2cd11b7d`](https://github.com/primer/react/commit/2cd11b7d331dc50cc63995d8c792204cbbeafd79) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Add aria-atomic attribute to live region

- [#2478](https://github.com/primer/react/pull/2478) [`7cbb5c98`](https://github.com/primer/react/commit/7cbb5c98919b40b9472a867e3e4a447bd16cbf8e) Thanks [@joshblack](https://github.com/joshblack)! - Add support for dynamic aria-expanded support on TreeView.Item

- [#2445](https://github.com/primer/react/pull/2445) [`6a1a2bdc`](https://github.com/primer/react/commit/6a1a2bdc491fd6f06565b647fb9a5ffe1bbdd8f7) Thanks [@mattcosta7](https://github.com/mattcosta7)! - fixes types for Button

- [#2464](https://github.com/primer/react/pull/2464) [`d68f5ff6`](https://github.com/primer/react/commit/d68f5ff671805b24f0917379901c93bebafded5d) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Fix scroll behavior when focus changes

- [#2460](https://github.com/primer/react/pull/2460) [`1f25c904`](https://github.com/primer/react/commit/1f25c9043af82ad07c36e9ec251549623da15cdf) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Improve performance when rendering lots of items

- [#2455](https://github.com/primer/react/pull/2455) [`77c0259b`](https://github.com/primer/react/commit/77c0259b8df2757a05cfc0570156f54bc66ef3ed) Thanks [@joshblack](https://github.com/joshblack)! - TreeView: Add support for a skeleton state with the TreeView.SubTree `count` prop

- [#2452](https://github.com/primer/react/pull/2452) [`aca96c0d`](https://github.com/primer/react/commit/aca96c0d41eaf276cbb2fa18694a059ae4ef299f) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Add `TreeView.ErrorDialog` component

- [#2447](https://github.com/primer/react/pull/2447) [`e03b5e4d`](https://github.com/primer/react/commit/e03b5e4d3d7ad5f7761d59158e9223da746f4592) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Add string type to the `counter` prop and display loading counter for all

- [#2468](https://github.com/primer/react/pull/2468) [`9dcf61b6`](https://github.com/primer/react/commit/9dcf61b6f0af72b63620ef186cab446177caf80a) Thanks [@joshblack](https://github.com/joshblack)! - Change focus strategy for TabNav after initial focus is set

## 35.12.0

### Minor Changes

- [#2435](https://github.com/primer/react/pull/2435) [`e335cc4b`](https://github.com/primer/react/commit/e335cc4b39eb626e327d1c6e6a1adab29a437245) Thanks [@colebemis](https://github.com/colebemis)! - SplitPageLayout has moved from `@primer/react/drafts` to `@primer/react`:

  ```diff
  - import {SplitPageLayout} from '@primer/react/drafts'
  + import {SplitPageLayout} from '@primer/react'
  ```

### Patch Changes

- [#2428](https://github.com/primer/react/pull/2428) [`7ad9e77d`](https://github.com/primer/react/commit/7ad9e77d6dfe7736874ac87ae73570030171cf8c) Thanks [@joshblack](https://github.com/joshblack)! - Update TreeView focus ring styles and call event.preventDefault() in arrow key events

* [#2444](https://github.com/primer/react/pull/2444) [`2b6323ca`](https://github.com/primer/react/commit/2b6323caf0878157deb212ccab38f81835da6b14) Thanks [@colebemis](https://github.com/colebemis)! - Dialog: Remove landmark elements to improve accessibility

- [#2429](https://github.com/primer/react/pull/2429) [`e7802ed9`](https://github.com/primer/react/commit/e7802ed9ab501e4badd41c099969eb55a3ee4df7) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Add `state` prop to `TreeView.SubTree` component

* [#2432](https://github.com/primer/react/pull/2432) [`99309e00`](https://github.com/primer/react/commit/99309e00da96454aafbcf3145fb3e9ee61408712) Thanks [@joshblack](https://github.com/joshblack)! - Update useStickyPaneHeight and useMedia to not warn during SSR

- [#2433](https://github.com/primer/react/pull/2433) [`a08997b3`](https://github.com/primer/react/commit/a08997b3ec6a58046242ac2fef4e884479ab6893) Thanks [@joshblack](https://github.com/joshblack)! - Update TreeView hover and focus styles to work in Windows High Contrast Mode

* [#2446](https://github.com/primer/react/pull/2446) [`e00d03c1`](https://github.com/primer/react/commit/e00d03c140987cec4e957f769638aef77e3dd8b5) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Use correct design tokens and icons

- [#2429](https://github.com/primer/react/pull/2429) [`e7802ed9`](https://github.com/primer/react/commit/e7802ed9ab501e4badd41c099969eb55a3ee4df7) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Improve accessibility of async items

* [#2434](https://github.com/primer/react/pull/2434) [`57c3b4d8`](https://github.com/primer/react/commit/57c3b4d840e619c76e72f4e5d9de75e7732ae41b) Thanks [@joshblack](https://github.com/joshblack)! - Add support for labels in TreeView.LeadingVisual and TreeView.TrailingVisual

- [#2360](https://github.com/primer/react/pull/2360) [`0f41dfec`](https://github.com/primer/react/commit/0f41dfec6ba995b448358d13fa7f8bb0f1951490) Thanks [@joshblack](https://github.com/joshblack)! - Update types to support TypeScript v4.8.3

* [#2326](https://github.com/primer/react/pull/2326) [`31bbec8c`](https://github.com/primer/react/commit/31bbec8cbfd64880eed120e7b6449433b54e91bd) Thanks [@joshblack](https://github.com/joshblack)! - Update the sticky layout algorithm for PageLayout and PageLayout.Pane

- [#2442](https://github.com/primer/react/pull/2442) [`6b559a97`](https://github.com/primer/react/commit/6b559a97694d483c5603d202d81fc1e9f37ff3fb) Thanks [@joshblack](https://github.com/joshblack)! - Inline ESM-only dependencies in CommonJS bundle

* [#2443](https://github.com/primer/react/pull/2443) [`3012faec`](https://github.com/primer/react/commit/3012faec1b185935bd30c11711d88e92bcc00af0) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Use roving tabindex instead of `aria-activedescendant` for improved VoiceOver support in Safari

## 35.11.0

### Minor Changes

- [#2378](https://github.com/primer/react/pull/2378) [`c35c2ac9`](https://github.com/primer/react/commit/c35c2ac9aa48e170a55c993f19c049b5ddd90e56) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Introducing loading states for counters

* [#2361](https://github.com/primer/react/pull/2361) [`ba7cf923`](https://github.com/primer/react/commit/ba7cf923bf10a473fd2ab83c5e16943d46e49e87) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Introduce "keeping the selected item always visible" functionality

- [#2297](https://github.com/primer/react/pull/2297) [`cad2bc0c`](https://github.com/primer/react/commit/cad2bc0cca63b9159b981c01ae5bd42093964bf1) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Introducing overflow behavior for fine and coarse pointer devices

* [#2366](https://github.com/primer/react/pull/2366) [`13b44608`](https://github.com/primer/react/commit/13b4460807124bc8d7014916476774d229950678) Thanks [@joshblack](https://github.com/joshblack)! - Update "exports" config to use "import" and "require" for ESM and CommonJS bundles

- [#2367](https://github.com/primer/react/pull/2367) [`252a605d`](https://github.com/primer/react/commit/252a605d0d3add613b441b5be0fa9a027f191592) Thanks [@iansan5653](https://github.com/iansan5653)! - Remove non-tab elements from `TabNav` focus zone

* [#2368](https://github.com/primer/react/pull/2368) [`aeb6152c`](https://github.com/primer/react/commit/aeb6152c04f299fda80131673b422009d5df0913) Thanks [@iansan5653](https://github.com/iansan5653)! - Add `pasteUrlsAsPlainText` prop to control URL pasting behavior in `MarkdownEditor`

### Patch Changes

- [#2388](https://github.com/primer/react/pull/2388) [`d459364a`](https://github.com/primer/react/commit/d459364adb6cf19c93595b731bbf34b880708f00) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Add `TreeView.LoadingItem` component

* [#2375](https://github.com/primer/react/pull/2375) [`96f3b8a1`](https://github.com/primer/react/commit/96f3b8a1f84f8b934d43c19af0e03025be9d5e9f) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Fix focus styles in styled-components v5.2+

- [#2258](https://github.com/primer/react/pull/2258) [`270157a6`](https://github.com/primer/react/commit/270157a627097851e576ed0169d2321077f80602) Thanks [@josepmartins](https://github.com/josepmartins)! - Add new accessible frontmatter variable

* [#2408](https://github.com/primer/react/pull/2408) [`c639acb0`](https://github.com/primer/react/commit/c639acb014917a4f2f8cd4b08eece7dbb0bb3168) Thanks [@mattcosta7](https://github.com/mattcosta7)! - fix react 18 typing for MarkdownEditor.Label

- [#2251](https://github.com/primer/react/pull/2251) [`4a4e47c0`](https://github.com/primer/react/commit/4a4e47c04dc4d1081c663c557f8e9f2c805506ae) Thanks [@joshblack](https://github.com/joshblack)! - Add support for the dvh unit in `PageLayout` in order to correctly display pane contents on iOS devices

* [#2301](https://github.com/primer/react/pull/2301) [`45afa3d0`](https://github.com/primer/react/commit/45afa3d0cbed4cb08ca5a885db87b7ac3e664c38) Thanks [@pksjce](https://github.com/pksjce)! - Hidden component

- [#2323](https://github.com/primer/react/pull/2323) [`9c0c1078`](https://github.com/primer/react/commit/9c0c10787cd010810144946f667a00d9cce92d77) Thanks [@joshblack](https://github.com/joshblack)! - Update `ButtonBase` to minimize re-renders through stable `sx` prop values

* [#2357](https://github.com/primer/react/pull/2357) [`143286ed`](https://github.com/primer/react/commit/143286edc2aebc55a03ca81d6a303046cb6d0da1) Thanks [@colebemis](https://github.com/colebemis)! - Add support for typeahead search of items in a TreeView

- [#2391](https://github.com/primer/react/pull/2391) [`845001b1`](https://github.com/primer/react/commit/845001b13113ea879b3a4410a2fb1f9d1358a14e) Thanks [@joshblack](https://github.com/joshblack)! - Update the files field in package.json to include all package artifacts

* [#2424](https://github.com/primer/react/pull/2424) [`09728c91`](https://github.com/primer/react/commit/09728c91d88559bdad8e93da865500d3811c2c3d) Thanks [@iansan5653](https://github.com/iansan5653)! - Fix `MarkdownEditor` suggestions filtering bug and allow lazy-loading suggestions

- [#2327](https://github.com/primer/react/pull/2327) [`df2a834c`](https://github.com/primer/react/commit/df2a834cdddcf32dc339ce50a29ef6bcfc7ae813) Thanks [@joshblack](https://github.com/joshblack)! - [Internal] Update build process to use `rollup`. This change should be transparent as generated entrypoints remain the same

* [#2376](https://github.com/primer/react/pull/2376) [`33ba836f`](https://github.com/primer/react/commit/33ba836fbf064b30400e9675d44f5d798aa95cf1) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Increase touch target size for coarse pointers

- [#2393](https://github.com/primer/react/pull/2393) [`294b4c4b`](https://github.com/primer/react/commit/294b4c4bb93359805423c520384a93c3707008a9) Thanks [@futurouz](https://github.com/futurouz)! - Fix invalid hover outline variant of the Button component

* [#2404](https://github.com/primer/react/pull/2404) [`1d1d07b7`](https://github.com/primer/react/commit/1d1d07b7783156f1c93d40a3ddc64ce2936ee4c7) Thanks [@joshblack](https://github.com/joshblack)! - Update bundle to not inline @github dependencies

- [#2419](https://github.com/primer/react/pull/2419) [`64f719f1`](https://github.com/primer/react/commit/64f719f1f7498e5753faa9bd3c8586a8c5a9efe3) Thanks [@joshblack](https://github.com/joshblack)! - Refactor rollup to support all lib-esm/\* export patterns and include utils entrypoint

* [#2373](https://github.com/primer/react/pull/2373) [`e4af7a74`](https://github.com/primer/react/commit/e4af7a749dd6c9995d3ace00bcb9a72c8487af45) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Allow expanded state to be controlled

- [#2383](https://github.com/primer/react/pull/2383) [`81013a7d`](https://github.com/primer/react/commit/81013a7d682aa5c2dcca44de1a646c7d62575117) Thanks [@colebemis](https://github.com/colebemis)! - TreeView: Add support for leading and trailing visuals

* [#2406](https://github.com/primer/react/pull/2406) [`96b004b7`](https://github.com/primer/react/commit/96b004b734dbbaf2990b72802ee837057be67b47) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav2: Address accessibility feedback and re-style arrow buttons for scroll behaviour

## 35.10.0

### Minor Changes

- [#2347](https://github.com/primer/react/pull/2347) [`09a5d806`](https://github.com/primer/react/commit/09a5d8064b794221be4cd961759ec15c1eea2a02) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds a `size` prop to the SegmentedControl component. Users can choose between 'medium' (default), and 'small'. More sizes can be added when/if we find we need them.

* [#2324](https://github.com/primer/react/pull/2324) [`027e44a7`](https://github.com/primer/react/commit/027e44a73542a9b115d688a7f16a0f63c2d9d86f) Thanks [@joshblack](https://github.com/joshblack)! - Update PageLayout.Pane to support a ref on the element wrapping children

### Patch Changes

- [#2355](https://github.com/primer/react/pull/2355) [`e052644d`](https://github.com/primer/react/commit/e052644d75068438e69c68a86344ad0e8a7a02b0) Thanks [@mperrotti](https://github.com/mperrotti)! - Fixes the sx prop on the SegmentedControl buttons by properly merging the sx prop when cloning button children.

* [#2305](https://github.com/primer/react/pull/2305) [`6cd50a54`](https://github.com/primer/react/commit/6cd50a54f8b399eef751507d44ffbfa35ede3d9f) Thanks [@colebemis](https://github.com/colebemis)! - Add draft TreeView component

- [#2350](https://github.com/primer/react/pull/2350) [`61a93e20`](https://github.com/primer/react/commit/61a93e20d9a7ced443ef5c2ee6b93bcefcd9c78e) Thanks [@colebemis](https://github.com/colebemis)! - Adds lines to indicate the depth of items in a TreeView

* [#2331](https://github.com/primer/react/pull/2331) [`31b8804c`](https://github.com/primer/react/commit/31b8804cf346412b7365cd411f6ee14e22f4a19d) Thanks [@colebemis](https://github.com/colebemis)! - Adds support for arrow key navigation of a TreeView using `aria-activedescendant`

- [#2338](https://github.com/primer/react/pull/2338) [`68c49803`](https://github.com/primer/react/commit/68c498038c097cfd339ff3feddc54221e6ed438d) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Reverted SelectPanel breaking behavioral changes

* [#2348](https://github.com/primer/react/pull/2348) [`c76e1610`](https://github.com/primer/react/commit/c76e161081573240c212b3dcfad5af5457a7312a) Thanks [@colebemis](https://github.com/colebemis)! - Add a `current` prop to `TreeView.Item` and `TreeView.LinkItem`

- [#2356](https://github.com/primer/react/pull/2356) [`e2fb2fca`](https://github.com/primer/react/commit/e2fb2fca2792470dda584a81f18d1389b57239f6) Thanks [@nicolleromero](https://github.com/nicolleromero)! - MarkdownViewer bug fix: Only run `replaceChildren` when `htmlContainer` changes

## 35.9.0

### Minor Changes

- [#2294](https://github.com/primer/react/pull/2294) [`4536b87a`](https://github.com/primer/react/commit/4536b87ad63d4aa3b6608c9d36673f45b304b4eb) Thanks [@joshblack](https://github.com/joshblack)! - Add support for `aria-label` and `aria-labelledby` to `PageLayout`

* [#2262](https://github.com/primer/react/pull/2262) [`3ec0c9db`](https://github.com/primer/react/commit/3ec0c9dbe4b56273cb36ca2fb363cd952da8e6a2) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Rename `stickyTop` prop name for the PageLayout to `offsetHeader` and improve docs

- [#2277](https://github.com/primer/react/pull/2277) [`cc88235e`](https://github.com/primer/react/commit/cc88235e1d65a308458306855641fd41712f068c) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - UnderlineNav.Link renamed to UnderlineNav.Item along with updated styles

### Patch Changes

- [#2266](https://github.com/primer/react/pull/2266) [`4cc6e52a`](https://github.com/primer/react/commit/4cc6e52a64f70065626607618931e35b419abc59) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu: Fix keyboard navigation for ActionMenu inside Overlay by re-enabling focus trap. It was disabled in v35.6.0, that led to a regression for ActionMenu within focus zones (example: AnchoredOverlay)

* [#2252](https://github.com/primer/react/pull/2252) [`e52415e1`](https://github.com/primer/react/commit/e52415e1b1f00b8693d22dc8b1aa7eb74f6df83e) Thanks [@joshblack](https://github.com/joshblack)! - Update ButtonBase.tsx to memoize calls to styles to improve performance

- [#2318](https://github.com/primer/react/pull/2318) [`10305092`](https://github.com/primer/react/commit/1030509285941da9b82680ff07c56a787178bcb5) Thanks [@iansan5653](https://github.com/iansan5653)! - - Fix `InlineAutocomplete` accessibility hint affecting page layout outside of the suggestions
  - Fix suggestion icons not being visible in `InlineAutocomplete` items

* [#2206](https://github.com/primer/react/pull/2206) [`3a38e6e3`](https://github.com/primer/react/commit/3a38e6e34b16eec6ce4c0357fd5ce4095e384550) Thanks [@maximedegreve](https://github.com/maximedegreve)! - Add missing border on avatars

- [#2294](https://github.com/primer/react/pull/2294) [`4536b87a`](https://github.com/primer/react/commit/4536b87ad63d4aa3b6608c9d36673f45b304b4eb) Thanks [@joshblack](https://github.com/joshblack)! - Change the default markup of `PageLayout.Pane` from `<aside>` to `<div>`

## 35.8.0

### Minor Changes

- [#2259](https://github.com/primer/react/pull/2259) [`0383f1ae`](https://github.com/primer/react/commit/0383f1ae57209b3efa68efe494b18d3045a4e92f) Thanks [@joshblack](https://github.com/joshblack)! - Add support for `'dark'` and `'light'` in `colorMode` for ThemeProvider

* [#2138](https://github.com/primer/react/pull/2138) [`ace38afb`](https://github.com/primer/react/commit/ace38afb0f469f93fbfea0df488e688005609a62) Thanks [@bolonio](https://github.com/bolonio)! - Accessibility fixes for SelectPanel.

### Patch Changes

- [#2260](https://github.com/primer/react/pull/2260) [`88b8c0e7`](https://github.com/primer/react/commit/88b8c0e7a9a4b8f37d85f5ac6c3902d1cf1f476a) Thanks [@iansan5653](https://github.com/iansan5653)! - Add hooks in `drafts/hooks` to `@primer/react/drafts` exports

* [#2225](https://github.com/primer/react/pull/2225) [`2c9bd012`](https://github.com/primer/react/commit/2c9bd0121340f017d5d0df96007de8ac42ef0023) Thanks [@pksjce](https://github.com/pksjce)! - Add small variant to underline nav

- [#2236](https://github.com/primer/react/pull/2236) [`8cc0efef`](https://github.com/primer/react/commit/8cc0efefa59143a6b18092d2035f6213294a4e30) Thanks [@iansan5653](https://github.com/iansan5653)! - Fix `MarkdownViewer` doc examples, add <kbd>Cmd/Ctrl+Shift+P</kbd> shortcut for toggling `MarkdownEditor` view mode, and strictly limit the type of the `ref` passed to `MarkdownEditor`.

* [#2242](https://github.com/primer/react/pull/2242) [`d46ae9f3`](https://github.com/primer/react/commit/d46ae9f30fcb9a4432a043f720c811e4318a5f41) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Remove z-index assignment that used to be necessary for the dropdown children of FilteredSearch

- [#2188](https://github.com/primer/react/pull/2188) [`8fc2e422`](https://github.com/primer/react/commit/8fc2e422d36c2be0ce66b7fd6d144788bccabfbb) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Support React.ReactNode as child type in ActionMenu.Overlay

## 35.7.0

### Minor Changes

- [#2232](https://github.com/primer/react/pull/2232) [`a0fcce61`](https://github.com/primer/react/commit/a0fcce61c04f45ead24fee8f8e25fcf6f3137cd3) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Add a `stickyTop` prop, the height of a sticky header, to the `PageLayout.Pane` to push the pane down for the sticky header when necessary.

* [#2228](https://github.com/primer/react/pull/2228) [`bf99db99`](https://github.com/primer/react/commit/bf99db999a54149682cc708f620145cd0fa1938d) Thanks [@mperrotti](https://github.com/mperrotti)! - Moves SegmentedControl to the main bundle and updates its lifecycle status to "Alpha"

### Patch Changes

- [#2239](https://github.com/primer/react/pull/2239) [`041d6d0e`](https://github.com/primer/react/commit/041d6d0ee478456fdb6ff691b1704bfc01d891bc) Thanks [@colebemis](https://github.com/colebemis)! - Add draft `SplitPageLayout` component

* [#2205](https://github.com/primer/react/pull/2205) [`4badb579`](https://github.com/primer/react/commit/4badb579d3832d06670ebf200a713d610254825d) Thanks [@okuryu](https://github.com/okuryu)! - Include React 18 in peerDependencies

- [#2244](https://github.com/primer/react/pull/2244) [`cf6f0e6b`](https://github.com/primer/react/commit/cf6f0e6bfedc78901ebe4fa2689a53ae86f021ed) Thanks [@iansan5653](https://github.com/iansan5653)! - Inline the `@koddson/textarea-caret` dependency to fix non-ESM builds

## 35.6.0

### Minor Changes

- [#2191](https://github.com/primer/react/pull/2191) [`7edf1347`](https://github.com/primer/react/commit/7edf134757837e3a8b71bf31f67242226b1a2fd2) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds responsive behavior to SegmentedControl's `fullWidth` prop.

* [#2174](https://github.com/primer/react/pull/2174) [`62dbc981`](https://github.com/primer/react/commit/62dbc9810f93cf16f17fce412c47ac2bf885a89e) Thanks [@colebemis](https://github.com/colebemis)! - Add a responsive `hidden` prop to `PageLayout.Header`, `PageLayout.Pane`, `PageLayout.Content`, and `PageLayout.Footer` that allows you to hide layout regions based on the viewport width. Example usage:

  ```jsx
  // Hide pane on narrow viewports
  <PageLayout.Pane hidden={{narrow: true}}>...</PageLayout.Pane>
  ```

- [#2199](https://github.com/primer/react/pull/2199) [`fb385b63`](https://github.com/primer/react/commit/fb385b63f22c1eb76193e42e92ea2a056e61fdbb) Thanks [@colebemis](https://github.com/colebemis)! - \* Updated the `position` prop in `PageLayout.Pane` to use the new responsive prop API introduced in https://github.com/primer/react/pull/2174.

  - Deprecated the `positionWhenNarrow` prop in favor of the new responsive prop API

  **Before**

  ```
  position="start"
  positionWhenNarrow="end"
  ```

  **After**

  ```
  position={{regular: 'start', narrow: 'end'}}
  ```

* [#2201](https://github.com/primer/react/pull/2201) [`885064ed`](https://github.com/primer/react/commit/885064edda758f59eb0ce2031632d9924ea6987d) Thanks [@colebemis](https://github.com/colebemis)! - Add `padding` prop to `PageLayout.Header`, `PageLayout.Content`, `PageLayout.Pane`, and `PageLayout.Footer`

- [#2164](https://github.com/primer/react/pull/2164) [`2b5c86e5`](https://github.com/primer/react/commit/2b5c86e59f16d697433e3302e78d623a177a061e) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds support for a responsive 'variant' prop to the SegmentedControl component

* [#2212](https://github.com/primer/react/pull/2212) [`04d9d9c1`](https://github.com/primer/react/commit/04d9d9c1bf33971a80aba6f0565e94d2ce047e94) Thanks [@colebemis](https://github.com/colebemis)! - Add a `sticky` prop to the `PageLayout.Pane` component that provides a convenient way for you to make side panes sticky:

  ```diff
  <PageLayout>
  - <PageLayout.Pane>...</PageLayout.Pane>
  + <PageLayout.Pane sticky>...</PageLayout.Pane>
    <PageLayout.Content>...</PageLayout.Content>
  </PageLayout>
  ```

- [#2198](https://github.com/primer/react/pull/2198) [`4d9b7db9`](https://github.com/primer/react/commit/4d9b7db9d82ca5ac58c2b7e745fad782c6e852b5) Thanks [@colebemis](https://github.com/colebemis)! - \* Updated the `divider` prop in `PageLayout.Header`, `PageLayout.Pane`, and `PageLayout.Footer` to use the new responsive prop API introduced in https://github.com/primer/react/pull/2174.

  - Deprecated the `dividerWhenNarrow` prop in favor of the new responsive prop API

  **Before**

  ```
  divider="line"
  dividerWhenNarrow="filled"
  ```

  **After**

  ```
  divider={{regular: 'line', narrow: 'filled'}}
  ```

### Patch Changes

- [#2024](https://github.com/primer/react/pull/2024) [`5321f1c9`](https://github.com/primer/react/commit/5321f1c9731087378860d7623480fa0997b6dcd4) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu: Remove focus trap to enable Tab and Shift+Tab behavior and fix initial focus on click

* [#2186](https://github.com/primer/react/pull/2186) [`e28aadbd`](https://github.com/primer/react/commit/e28aadbdf1c5b0d03aba83dcfbe1c77746cfcf97) Thanks [@mperrotti](https://github.com/mperrotti)! - Updates SegmentedControl styles to use component primitives.

- [#2171](https://github.com/primer/react/pull/2171) [`384ae6b9`](https://github.com/primer/react/commit/384ae6b9adb2bcf1389e2059cbd68f319cc2e56d) Thanks [@anleac](https://github.com/anleac)! - Support issues closed as not planned, and correct the standard issue closed backgroud colour

* [#2157](https://github.com/primer/react/pull/2157) [`77e7ab05`](https://github.com/primer/react/commit/77e7ab057bef5394e757356c58ca7ae0f0bfdb64) Thanks [@iansan5653](https://github.com/iansan5653)! - Add `InlineAutocomplete` component, `useCombobox` hook, and `useSyntheticChange` hook to drafts

- [#2189](https://github.com/primer/react/pull/2189) [`35716587`](https://github.com/primer/react/commit/3571658723aa33e731a3a3b498d18a174113d4cd) Thanks [@mperrotti](https://github.com/mperrotti)! - Makes SegmentedControl uncontrolled by default.

* [#2196](https://github.com/primer/react/pull/2196) [`5ff5bb81`](https://github.com/primer/react/commit/5ff5bb81f68dc533b2d32fd3f24863c2699ca8f3) Thanks [@mattcosta7](https://github.com/mattcosta7)! - update types to allow children for react 18

- [#2219](https://github.com/primer/react/pull/2219) [`af534f15`](https://github.com/primer/react/commit/af534f1578d4af7b345028eff17e66c867c036af) Thanks [@iansan5653](https://github.com/iansan5653)! - Fix slots infinite rendering when no `context` prop is provided

* [#2182](https://github.com/primer/react/pull/2182) [`47725a92`](https://github.com/primer/react/commit/47725a926fca68bf266a47db55ed05606a8e1436) Thanks [@iansan5653](https://github.com/iansan5653)! - - Add `MarkdownEditor` and `MarkdownViewer` draft components. The `MarkdownEditor` is also known as the `CommentBox` component
  - Add `useUnifiedFileSelect`, `useIgnoreKeyboardInputWhileComposing`, `useDynamicTextareaHeight`, and `useSafeAsyncCallback` draft hooks

- [#2173](https://github.com/primer/react/pull/2173) [`ed609719`](https://github.com/primer/react/commit/ed60971944316279bb48128f3fb466dd2385a36e) Thanks [@mperrotti](https://github.com/mperrotti)! - Updates styles for the Select component so that the focus outline is even all the way around.

* [#2216](https://github.com/primer/react/pull/2216) [`82fd8c35`](https://github.com/primer/react/commit/82fd8c35e4017b34f03119d8eb99188b34bbd713) Thanks [@iansan5653](https://github.com/iansan5653)! - Change `createSlots` to use layout effects when registering slots

- [#2185](https://github.com/primer/react/pull/2185) [`3756a1ed`](https://github.com/primer/react/commit/3756a1ede2054aee2179e58ac7bbe9d72b85e045) Thanks [@mattcosta7](https://github.com/mattcosta7)! - Set ConfirmationDialog initial focus based on the confirmationButtonVariant. When `danger` autoFocus the cancel button, otherwise autoFocus the confirmation button

* [#2166](https://github.com/primer/react/pull/2166) [`75d21745`](https://github.com/primer/react/commit/75d21745daa8e50f707a80a4358a86163c64453c) Thanks [@mattcosta7](https://github.com/mattcosta7)! - button should be polymorphic

- [#2220](https://github.com/primer/react/pull/2220) [`f4ef7b4b`](https://github.com/primer/react/commit/f4ef7b4b1ba2d709847bda7c531d810db63e7d03) Thanks [@mperrotti](https://github.com/mperrotti)! - - Fixes `role` and keyboard behavior for SegmentedControl.
  - Fixes a bug where icon-only SegmentedControl buttons did not fill the parent width when the `fullWidth` prop was set
  - Fixes a bug where click handlers were not passed correctly when the responsive variant was set to `'hideLabels'`

* [#2204](https://github.com/primer/react/pull/2204) [`522f5806`](https://github.com/primer/react/commit/522f580666295ba4ca05e226ea773f6fbc8407bc) Thanks [@iansan5653](https://github.com/iansan5653)! - Replace `useCombinedRefs` with `useRefObjectAsForwardedRef`

- [#2221](https://github.com/primer/react/pull/2221) [`9ce64937`](https://github.com/primer/react/commit/9ce64937ce234d65f3e4ab28bfed1a71aac9a4de) Thanks [@josepmartins](https://github.com/josepmartins)! - Overlay documentation fixes

## 35.5.0

### Minor Changes

- [#2180](https://github.com/primer/react/pull/2180) [`300025d1`](https://github.com/primer/react/commit/300025d11a010eb076f2327897744d06539bb355) Thanks [@mattcosta7](https://github.com/mattcosta7)! - Update the primer/primitives dependency

### Patch Changes

- [#2150](https://github.com/primer/react/pull/2150) [`63a2de51`](https://github.com/primer/react/commit/63a2de51c0d7de0d2640cc80435b1cead071f1f6) Thanks [@dgreif](https://github.com/dgreif)! - Ensure all files in `lib-esm` are in fact esm and not CommonJS

* [#2145](https://github.com/primer/react/pull/2145) [`a2950ac4`](https://github.com/primer/react/commit/a2950ac40b9caeeb2b3d9883508d2d6a84980252) Thanks [@mperrotti](https://github.com/mperrotti)! - Updates SegmentedControl component's keyboard navigation to align with the recommendations of GitHub's accessibility team.

- [#2143](https://github.com/primer/react/pull/2143) [`d9b161a0`](https://github.com/primer/react/commit/d9b161a0bde13a20a5972159a3f71e7be7475d7a) Thanks [@mperrotti](https://github.com/mperrotti)! - Fixes bugs in form components discovered while fixing/improving Storybook and docs.

## 35.4.0

### Minor Changes

- [#2108](https://github.com/primer/react/pull/2108) [`e5be3db3`](https://github.com/primer/react/commit/e5be3db3112db20efef5e49ebe89ea3af17fd486) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds a draft component to render a basic segmented control.

* [#2139](https://github.com/primer/react/pull/2139) [`f17446e0`](https://github.com/primer/react/commit/f17446e0dbfb9021291207972ece47e90a5656e0) Thanks [@owenniblock](https://github.com/owenniblock)! - Changes focus rules of TabNav to match WAI-ARIA rules for tablist

### Patch Changes

- [#2099](https://github.com/primer/react/pull/2099) [`40da598e`](https://github.com/primer/react/commit/40da598e8d41b688eba53f4c594bff66b269f5f4) Thanks [@siddharthkp](https://github.com/siddharthkp)! - AnchoredOverlay: `aria-expanded` attribute is removed from anchor when overlay is not open

* [#2155](https://github.com/primer/react/pull/2155) [`003cbcf0`](https://github.com/primer/react/commit/003cbcf0e5530d580636e4ce09e539317a95dc73) Thanks [@mperrotti](https://github.com/mperrotti)! - Update Checkbox component to useIsomorphicLayoutEffect instead of useLayoutEffect to support SSR

- [#2154](https://github.com/primer/react/pull/2154) [`96ad635b`](https://github.com/primer/react/commit/96ad635b3063af03e31fcac06cfe8bdea248d0d3) Thanks [@mperrotti](https://github.com/mperrotti)! - Allow "falsely/empty" Autocomplete.Input values

* [#2153](https://github.com/primer/react/pull/2153) [`ce45de30`](https://github.com/primer/react/commit/ce45de308f1aaaf760a8e3f18ee39f20610f896b) Thanks [@willglas](https://github.com/willglas)! - Add AutocompleteContext to Autocomplete component exports

- [#2105](https://github.com/primer/react/pull/2105) [`c7bbd06f`](https://github.com/primer/react/commit/c7bbd06fd7c67690ed7a612737f79662444d388b) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu: Replace typeahead behavior with single key mnemonics

* [#2125](https://github.com/primer/react/pull/2125) [`78dc8134`](https://github.com/primer/react/commit/78dc8134b1d38c6826766f2f85ae943e8b1a8088) Thanks [@owenniblock](https://github.com/owenniblock)! - Adds roles of tablist and tab to the TabNav component, required rearranging the HTML elements to be semantically correct

- [#2149](https://github.com/primer/react/pull/2149) [`b3a98bac`](https://github.com/primer/react/commit/b3a98baccc19a77d16b8c42f7873073070f24b89) Thanks [@dgreif](https://github.com/dgreif)! - Converted commonjs `require` of `focus-visible` to an esm `import`

* [#2120](https://github.com/primer/react/pull/2120) [`53713b2f`](https://github.com/primer/react/commit/53713b2f3ab7dd7084ce3e602c01c3f66ccd7579) Thanks [@colebemis](https://github.com/colebemis)! - Deprecate SideNav in favor of [NavList](https://primer.style/NavList).

  ## Before

  ```jsx
  <SideNav aria-label="Main">
    <SideNav.Link href="/" selected>
      Home
    </SideNav.Link>
    <SideNav.Link href="/about">About</SideNav.Link>
    <SideNav.Link href="/contact">Contact</SideNav.Link>
  </SideNav>
  ```

  ## After

  ```jsx
  <NavList aria-label="Main">
    <NavList.Item href="/" aria-current="page">
      Home
    </NavList.Item>
    <NavList.Item href="/about">About</NavList.Item>
    <NavList.Item href="/contact">Contact</NavList.Item>
  </NavList>
  ```

- [#2133](https://github.com/primer/react/pull/2133) [`65fcd9f2`](https://github.com/primer/react/commit/65fcd9f23de939014351f8e135f912cfa00f71a3) Thanks [@mattcosta7](https://github.com/mattcosta7)! - Passthrough ActionList.Group props from NavList.Group

* [#2158](https://github.com/primer/react/pull/2158) [`ac92de47`](https://github.com/primer/react/commit/ac92de477f6d7a5527f32dd55d3082318c800d7d) Thanks [@owenniblock](https://github.com/owenniblock)! - Fixes issue when tabs are not links

## 35.3.0

### Minor Changes

- [#2112](https://github.com/primer/react/pull/2112) [`74e1d138`](https://github.com/primer/react/commit/74e1d1386bc6bb6326c3c2b64b5e31146f9cc56b) Thanks [@colebemis](https://github.com/colebemis)! - [NavList](https://primer.style/NavList) is ready to use. You can now import it from the main bundle:

  ```js
  import {NavList} from '@primer/react'
  ```

### Patch Changes

- [#2083](https://github.com/primer/react/pull/2083) [`ea69ccd6`](https://github.com/primer/react/commit/ea69ccd6b5255e70251889ffc2434e975a9c8184) Thanks [@ty-v1](https://github.com/ty-v1)! - Export new Dialog component from the `@primer/react/drafts` bundle:

  ```diff
  - import {Dialog} from '@primer/react/lib-esm/Dialog/Dialog'
  + import {Dialog} from '@primer/react/drafts'
  ```

* [#2117](https://github.com/primer/react/pull/2117) [`6e3532cf`](https://github.com/primer/react/commit/6e3532cf8ca11f6edc08e101d9cea4df6a1655ce) Thanks [@dgreif](https://github.com/dgreif)! - Allow minor version updates for production dependencies

- [#2095](https://github.com/primer/react/pull/2095) [`db5e629c`](https://github.com/primer/react/commit/db5e629c667203728d4256d4b6b549b9d3962e9d) Thanks [@hectahertz](https://github.com/hectahertz)! - Communicate the SelectPanel multi-select capability to assistive technologies.

## 35.2.2

### Patch Changes

- [#2058](https://github.com/primer/react/pull/2058) [`ab30f14a`](https://github.com/primer/react/commit/ab30f14a3ff70a2d6146366f777ebfd5f1907ff3) Thanks [@colebemis](https://github.com/colebemis)! - Add draft of `NavList` component

* [#2038](https://github.com/primer/react/pull/2038) [`1c2eeb9c`](https://github.com/primer/react/commit/1c2eeb9c4a1370db5555a089c7e99f06d49ac043) Thanks [@mperrotti](https://github.com/mperrotti)! - Fixes accessibility bugs in the Select component.

- [#2076](https://github.com/primer/react/pull/2076) [`05301033`](https://github.com/primer/react/commit/053010337a13559bef7caa308adf8196c6bb77c1) Thanks [@colebemis](https://github.com/colebemis)! - Draft `NavList.Item` now accepts an `as` prop, allowing it to be rendered as a Next.js or React Router link

* [#2082](https://github.com/primer/react/pull/2082) [`3252b74c`](https://github.com/primer/react/commit/3252b74c852a0743ff2dacc42ffc6c9bd1ca68ba) Thanks [@mperrotti](https://github.com/mperrotti)! - Fixes broken links in the documentation

- [#2075](https://github.com/primer/react/pull/2075) [`56dbbd32`](https://github.com/primer/react/commit/56dbbd3200a110fac3828ba39b25884ad9a5fdb3) Thanks [@colebemis](https://github.com/colebemis)! - Fix overflow issues in `PageLayout.Content`

  | Before                                                                                                                                    | After                                                                                                                                     |
  | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
  | <img width="1224" alt="image" src="https://user-images.githubusercontent.com/3026298/167502059-81e0ef9e-2fd6-40fe-b1f1-708368286578.png"> | <img width="1247" alt="image" src="https://user-images.githubusercontent.com/3026298/167502084-1c4f247e-2713-4419-8f4c-bb1a20e24dca.png"> |

* [#2087](https://github.com/primer/react/pull/2087) [`b319b29d`](https://github.com/primer/react/commit/b319b29df6fca39bbdbce918fcebe1ff4e445e8c) Thanks [@mperrotti](https://github.com/mperrotti)! - Prevents the `onRemove` prop from being passed through to the HTML element from Token, AvatarToken, and IssueToken.

- [#2077](https://github.com/primer/react/pull/2077) [`30f93ffb`](https://github.com/primer/react/commit/30f93ffb6669700d682b97de7143ddaa0380d7c2) Thanks [@colebemis](https://github.com/colebemis)! - Adds support for the `sx` prop on the draft implementation of `NavList` and all its subcomponents (e.g., `NavList.Item`)

* [#2050](https://github.com/primer/react/pull/2050) [`0f9edcac`](https://github.com/primer/react/commit/0f9edcaca4973c9e998362004e7d549989b59c6f) Thanks [@mperrotti](https://github.com/mperrotti)! - Finishes updating components with the global focus styles defined in Primer CSS ([this PR](https://github.com/primer/css/pull/1744))

- [#2054](https://github.com/primer/react/pull/2054) [`a682735f`](https://github.com/primer/react/commit/a682735f6e0a112718e5d4ed619216fc89e5980f) Thanks [@colebemis](https://github.com/colebemis)! - Fixes layout bug with ButtonGroup by changing the `display` property from `inline-block` to `inline-flex`

* [#2064](https://github.com/primer/react/pull/2064) [`62d90af8`](https://github.com/primer/react/commit/62d90af8a078ea283459e2d88b669f6fd66bfa46) Thanks [@colebemis](https://github.com/colebemis)! - Add support for sub-items in draft implementation of NavList

- [#2057](https://github.com/primer/react/pull/2057) [`c8f7e235`](https://github.com/primer/react/commit/c8f7e2352fe17de6ae8766e9220cec095fa977da) Thanks [@mperrotti](https://github.com/mperrotti)! - - adds [`color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) style to inputs so they get the correct user-agent dark/light styles
  - crops ToggleSwitch knob's shadow inside the toggle switch boundaries
  - changes FormControl styles to prevent `<select>`, `<textarea>`, `<input>` from filling the parent's width when the `block` prop has not been passed to the input component

* [#2048](https://github.com/primer/react/pull/2048) [`4e15985b`](https://github.com/primer/react/commit/4e15985b5d2c7c64ec507e2e362d509f3acd79d8) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ThemeProvider: Bug fix, in `colorMode=auto`, the theme now syncs with system changes.

## 35.2.1

### Patch Changes

- [#2013](https://github.com/primer/react/pull/2013) [`5f6c5e22`](https://github.com/primer/react/commit/5f6c5e2249c9bb4c6a6b744755ea4607d10a0b74) Thanks [@mperrotti](https://github.com/mperrotti)! - 1. Fix a spacing issue with the loading spinner in a `TextInputWithTokens` 2. Bolds form validation text to be visually balanced with the icon

* [#2053](https://github.com/primer/react/pull/2053) [`231c70b9`](https://github.com/primer/react/commit/231c70b9e3757840e0dc1baf53e5bfd9a679e953) Thanks [@langermank](https://github.com/langermank)! - Namespace UnderlineNav

- [#2033](https://github.com/primer/react/pull/2033) [`0d7a871a`](https://github.com/primer/react/commit/0d7a871a64fb8770405d252ec88d7467d350a550) Thanks [@mperrotti](https://github.com/mperrotti)! - - Text input inner action's hover bg should not touch the text input edges
  - Increases touch target area of the text input inner action button
  - Deprecated `children` and `variant` props on the `TextInputInnerAction` component, but they're **still supported for now**.

## 35.2.0

### Minor Changes

- [#1947](https://github.com/primer/react/pull/1947) [`edc85c96`](https://github.com/primer/react/commit/edc85c96c6c70adebbc4af1e2d05a913f249f2d3) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds the option to render a trailing action inside of the TextInput component

* [#1933](https://github.com/primer/react/pull/1933) [`ae7650f1`](https://github.com/primer/react/commit/ae7650f1b6551b56effabe420ec4531804e97e7c) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds a toggle switch component

### Patch Changes

- [#1973](https://github.com/primer/react/pull/1973) [`adbcd3bf`](https://github.com/primer/react/commit/adbcd3bf37334b867bd159c012d69aa9722ebbf3) Thanks [@colebemis](https://github.com/colebemis)! - The `PageLayout` component now renders [HTML5 landmark elements](https://web.dev/use-landmarks/) (`header`, `aside`, `footer`) to improve the navigation experience for people using assistive technologies (like screen readers)

* [#1998](https://github.com/primer/react/pull/1998) [`cd8a5bb3`](https://github.com/primer/react/commit/cd8a5bb31b1d2a6a2c1b21c7342371cf1657e429) Thanks [@mperrotti](https://github.com/mperrotti)! - Updates the API for token components to align with our size-naming ADR, avatar guidelines, and icon guidelines

- [#2002](https://github.com/primer/react/pull/2002) [`3ebc1bb0`](https://github.com/primer/react/commit/3ebc1bb048f788b5c0ad3ede8e7430e1a26435b6) Thanks [@dgreif](https://github.com/dgreif)! - Update `@primer/behaviors` for better ESM compatibility

* [#2007](https://github.com/primer/react/pull/2007) [`a8b3ed16`](https://github.com/primer/react/commit/a8b3ed16e59c40c45ff4843df491838afb6931a1) Thanks [@pksjce](https://github.com/pksjce)! - Add button focus styles

## 35.1.0

### Minor Changes

- [#1942](https://github.com/primer/react/pull/1942) [`3f50ef54`](https://github.com/primer/react/commit/3f50ef543b8cea0306aba44bb44611f22dae657d) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds button element selector to FilteredSearch button styles

* [#1920](https://github.com/primer/react/pull/1920) [`40ed423e`](https://github.com/primer/react/commit/40ed423ed546ed91b69bc7bcc8361fd1e41faa8c) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds a loadings state to our text input components

- [#1961](https://github.com/primer/react/pull/1961) [`767d4166`](https://github.com/primer/react/commit/767d4166ef3e76e8ea12b6eec2d1d22f45f8609c) Thanks [@simurai](https://github.com/simurai)! - Bump primer/primitives to `7.5.1`

### Patch Changes

- [#1970](https://github.com/primer/react/pull/1970) [`3b236044`](https://github.com/primer/react/commit/3b23604438b850557e7e3d0a0594a8cca119859b) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu: Fix styles for windows high contrast mode

* [#1981](https://github.com/primer/react/pull/1981) [`e9bb5956`](https://github.com/primer/react/commit/e9bb595680ff51a563260c020d1475102eba2535) Thanks [@mperrotti](https://github.com/mperrotti)! - Ensures select option text has acceptable contrast in Firefox when in dark mode

- [#1945](https://github.com/primer/react/pull/1945) [`ef3b58a1`](https://github.com/primer/react/commit/ef3b58a1fdffc8d3f709c9f63e0ee70ee0f397ba) Thanks [@pksjce](https://github.com/pksjce)! - Icon button fixes: Removes iconLabel and adds aria-label to the type

* [#1959](https://github.com/primer/react/pull/1959) [`2025036e`](https://github.com/primer/react/commit/2025036e552d8c8d02ed3139e5c8da4cb1546bb7) Thanks [@colebemis](https://github.com/colebemis)! - Fix `TextInput` types

- [#1968](https://github.com/primer/react/pull/1968) [`1b01485a`](https://github.com/primer/react/commit/1b01485a282dc882aa7c8cc3a55fe736afdac029) Thanks [@mperrotti](https://github.com/mperrotti)! - Instead of rendering unexpected FormControl children before the rest of the content, we render them in the same spot we'd normally render a Primer input component

* [#1967](https://github.com/primer/react/pull/1967) [`c83a06f0`](https://github.com/primer/react/commit/c83a06f00280ee2f8139d0cc3489242f1af46982) Thanks [@pksjce](https://github.com/pksjce)! - Add overlay props to Autocomplete.Overlay

- [#1955](https://github.com/primer/react/pull/1955) [`77e123f4`](https://github.com/primer/react/commit/77e123f403df0669f492ac636de651506709bd9a) Thanks [@pksjce](https://github.com/pksjce)! - Add disabled color and backgroundColor to Button.Counter

## 35.0.1

### Patch Changes

- [#1958](https://github.com/primer/react/pull/1958) [`be8f9014`](https://github.com/primer/react/commit/be8f9014cb532d122665c83a94035b0de8e0d300) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList: Add focus styles for Windows high contrast mode
  ActionList: Fix incorrect role for ActionList.Group outside ActionMenu

* [#1949](https://github.com/primer/react/pull/1949) [`e430bd8b`](https://github.com/primer/react/commit/e430bd8b635d8cb25e73e4301a0fedc6c60a1e3a) Thanks [@colebemis](https://github.com/colebemis)! - `FormControl` now accepts a `ref` prop

- [#1960](https://github.com/primer/react/pull/1960) [`26c7784d`](https://github.com/primer/react/commit/26c7784d24a2c3d1e0b33457c42ac804ac1dcd64) Thanks [@colebemis](https://github.com/colebemis)! - Checkbox: `value` prop is now optional

* [#1935](https://github.com/primer/react/pull/1935) [`40c93d8b`](https://github.com/primer/react/commit/40c93d8bad64e3e5c906f0140978b8991d15be92) Thanks [@pksjce](https://github.com/pksjce)! - Add monospace prop to textinput

## 35.0.0

### Major Changes

- [#1893](https://github.com/primer/react/pull/1893) [`17ef5ef8`](https://github.com/primer/react/commit/17ef5ef8908cc9b4a9992c709518025184105082) Thanks [@siddharthkp](https://github.com/siddharthkp)! - <br />

  ### ActionList

  ⚠️ ActionList has been rewritten with a composable API, design updates and accessibility fixes.

  See full list of props and examples: https://primer.style/react/ActionList

  <table>
  <tr>
  <th> Before (v34)</th> <th> After (v35)</th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  <ActionList
    items={[
      {text: 'New file'},
      {text: 'Copy link'},
      {text: 'Edit file'},
      ActionList.Divider,
      {text: 'Delete file', variant: 'danger'},
    ]}
  />
  ```

   </td>
  <td valign="top">

  ```jsx
  <ActionList>
    <ActionList.Item>New file</ActionList.Item>
    <ActionList.Item>Copy link</ActionList.Item>
    <ActionList.Item>Edit file</ActionList.Item>
    <ActionList.Divider />
    <ActionList.Item variant="danger">Delete file</ActionList.Item>
  </ActionList>
  ```

  </td>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  <ActionList
    showItemDividers
    items={[
      {
        key: '0',
        leadingVisual: LinkIcon,
        text: 'github/primer',
      },
      {
        key: '1',
        leadingVisual: () => <Avatar src="https://github.com/mona.png" />,
        text: 'mona',
        description: 'Monalisa Octocat',
        descriptionVariant: 'block',
      },
      {
        key: '2',
        leadingVisual: GearIcon,
        text: 'View Settings',
        trailingVisual: ArrowRightIcon,
      },
    ]}
  />
  ```

   </td>
  <td valign="top">

  ```jsx
  <ActionList showDividers>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <LinkIcon />
      </ActionList.LeadingVisual>
      github/primer
    </ActionList.Item>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <Avatar src="https://github.com/mona.png" />
      </ActionList.LeadingVisual>
      mona
      <ActionList.Description variant="block">Monalisa Octocat</ActionList.Description>
    </ActionList.Item>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <GearIcon />
      </ActionList.LeadingVisual>
      View settings
      <ActionList.TrailingVisual>
        <ArrowRightIcon />
      </ActionList.TrailingVisual>
    </ActionList.Item>
  </ActionList>
  ```

  </td>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  <ActionList
    groupMetadata={[
      {groupId: '0', header: {title: 'Live query'}},
      {groupId: '1', header: {title: 'Layout'}},
    ]}
    items={[
      {key: '0', text: 'repo:github/github', groupId: '0'},
      {key: '1', text: 'Table', groupId: '1'},
      {key: '2', text: 'Board', groupId: '1'},
      {key: '3', text: 'View settings'},
    ]}
  />
  ```

   </td>
  <td valign="top">

  ```jsx
  <ActionList>
    <ActionList.Group title="Live query">
      <ActionList.Item>repo:github/github</ActionList.Item>
    </ActionList.Group>
    <ActionList.Divider />

    <ActionList.Group title="Layout">
      <ActionList.Item>Table</ActionList.Item>
      <ActionList.Item>Board Description</ActionList.Item>
    </ActionList.Group>
    <ActionList.Divider />

    <ActionList.Item>View settings</ActionList.Item>
  </ActionList>
  ```

  </td>
  </tr>
  </table>

  To continue to use the deprecated API for now, change the import path to `@primer/react/deprecated`:

  ```js
  import {ActionList} from '@primer/react/deprecated'
  ```

  You can use the [one-time codemod](https://github.com/primer/react-migrate#readme) to change your import statements automatically.

* [#1883](https://github.com/primer/react/pull/1883) [`310e6553`](https://github.com/primer/react/commit/310e6553134cd333a96e67d434d3b07167d01ed1) Thanks [@siddharthkp](https://github.com/siddharthkp)! - `ActionList2` exported types are now prefixed with `ActionList`:

  ```
  ListProps → ActionListProps
  GroupProps → ActionListGroupProps
  ItemProps → ActionListItemProps
  DescriptionProps → ActionListDescriptionProps
  LeadingVisualProps → ActionListLeadingVisualProps,
  TrailingVisualProps → ActionListTrailingVisualProps
  ```

  `ActionMenu2` exported types are now prefixed with `ActionMenu`:

  ```
  MenuButtonProps → ActionMenuButtonProps
  MenuAnchorProps → ActionMenuAnchorProps
  ```

* [#1897](https://github.com/primer/react/pull/1897) [`d4023572`](https://github.com/primer/react/commit/d4023572804cf3d8ce6cd1e9480715ab855abefc) Thanks [@siddharthkp](https://github.com/siddharthkp)! - <br />

  ### ActionMenu

  ⚠️ ActionMenu has been rewritten with a composable API, design updates and accessibility fixes.

  See full list of props and examples: https://primer.style/react/ActionMenu

  Main changes:

  1. Instead of using `items` prop, use `ActionList` inside `ActionMenu`
  2. Instead of using `anchorContent` on `ActionMenu`, use `ActionMenu.Button` with `children`
  3. Instead of using `onAction` prop on `ActionMenu`, use `onSelect` prop on `ActionList.Item`
  4. Instead of using `groupMetadata` on `ActionMenu`, use `ActionList.Group`
  5. Instead of `overlayProps` on `ActionMenu`, use `ActionMenu.Overlay`

  <table>
  <tr>
  <th> Before (v34)</th> <th> After (v35)</th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  <ActionMenu
    anchorContent="Menu"
    onAction={fn}
    items={[
      {text: 'New file'},
      {text: 'Copy link'},
      {text: 'Edit file'},
      ActionMenu.Divider,
      {text: 'Delete file', variant: 'danger'},
    ]}
    overlayProps={{width: 'small'}}
  />
  ```

   </td>
  <td valign="top">

  ```jsx
  <ActionMenu>
    <ActionMenu.Button>Menu</ActionMenu.Button>
    <ActionMenu.Overlay width="small">
      <ActionList>
        <ActionList.Item onSelect={fn}>New file</ActionList.Item>
        <ActionList.Item>Copy link</ActionList.Item>
        <ActionList.Item>Edit file</ActionList.Item>
        <ActionList.Divider />
        <ActionList.Item variant="danger">Delete file</ActionList.Item>
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
  ```

  </td>
  </tr>
  </table>

  To continue to use the deprecated API for now, change the import path to `@primer/react/deprecated`:

  ```js
  import {ActionMenu} from '@primer/react/deprecated'
  ```

  You can use the [one-time codemod](https://github.com/primer/react-migrate#readme) to change your import statements automatically.

- [#1898](https://github.com/primer/react/pull/1898) [`d6d1ca4c`](https://github.com/primer/react/commit/d6d1ca4c7ecf5276dd94f1da00a56c783e67e8d8) Thanks [@siddharthkp](https://github.com/siddharthkp)! - <br />

  ### DropdownMenu

  ⚠️ DropdownMenu has been deprecated in favor of ActionMenu with ActionList

  See example with selection: https://primer.style/react/ActionMenu#with-selection

  Migration guide:

  1. Instead of using `items` prop, use `ActionList` inside `ActionMenu`
  2. Use `selectionVariant="single"` on `ActionList` to set the right semantics for selection
  3. Instead of using `selectedItem` prop, use `selected` prop on `ActionList.Item`
  4. Instead of using `renderAnchor` and `placeholder` props on `DropdownMenu`, use `ActionMenu.Button` or `ActionMenu.Anchor`
  5. Instead of using `onChange` prop on `DropdownMenu`, use `onSelect` prop on `ActionList.Item`
  6. Instead of using `groupMetadata` on `DropdownMenu`, use `ActionList.Group`
  7. Instead of `overlayProps` on `DropdownMenu`, use `ActionMenu.Overlay`

  <table>
  <tr>
  <th> Before (v34)</th> <th> After (v35)</th>
  </tr>
  <tr>
  <td valign="top">

  ```js
  const fieldTypes = [
    {key: 0, text: 'Text'},
    {key: 1, text: 'Number'},
    {key: 3, text: 'Date'},
    {key: 4, text: 'Single select'},
    {key: 5, text: 'Iteration'},
  ]

  const Example = () => {
    const [selectedType, setSelectedType] = React.useState()

    return (
      <DropdownMenu
        renderAnchor={({children, ...anchorProps}) => (
          <ButtonInvisible {...anchorProps}>
            {children} <GearIcon />
          </ButtonInvisible>
        )}
        placeholder="Field type"
        items={fieldTypes}
        selectedItem={selectedType}
        onChange={setSelectedType}
        overlayProps={{width: 'medium'}}
      />
    )
  }
  ```

   </td>
  <td valign="top">

  ```jsx
  const fieldTypes = [
    {id: 0, text: 'Text'},
    {id: 1, text: 'Number'},
    {id: 3, text: 'Date'},
    {id: 4, text: 'Single select'},
    {id: 5, text: 'Iteration'},
  ]

  const Example = () => {
    const [selectedType, setSelectedType] = React.useState()

    render(
      <ActionMenu>
        <ActionMenu.Button aria-label="Select field type">{selectedType.name || 'Field type'}</ActionMenu.Button>
        <ActionMenu.Overlay width="medium">
          <ActionList selectionVariant="single">
            {fieldTypes.map(type => (
              <ActionList.Item
                key={type.id}
                selected={type.id === selectedType.id}
                onSelect={() => setSelectedType(type)}
              >
                {type.name}
              </ActionList.Item>
            ))}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>,
    )
  }
  ```

  </td>
  </tr>
  </table>

  To continue to use the deprecated API for now, change the import path to `@primer/react/deprecated`:

  ```js
  import {DropdownMenu} from '@primer/react/deprecated'
  ```

  You can use the [one-time codemod](https://github.com/primer/react-migrate#readme) to change your import statements automatically.

  ### drafts/DropdownMenu2

  ⚠️ DropdownMenu2 has been removed in favor of ActionMenu with ActionList

* [#1889](https://github.com/primer/react/pull/1889) [`e9b81fae`](https://github.com/primer/react/commit/e9b81fae792b5222fdb1ca9b8ed98a1d5981a2d5) Thanks [@mperrotti](https://github.com/mperrotti)! - <br />

  ### Label

  The Label component's API and visual design have been updated to be consistent with its counterpart in [Primer ViewComponents' Label component](https://primer.style/view-components/components/label).

  ⚠️ Major changes in the new Label component:

  - No more `medium` size - only `small` and `large`
  - Labels are outlined by default, so the `outline` prop has been removed
  - Custom text and background colors are discouraged, but still possible via the `sx` prop

  If you were using the `Label` component to render issue/PR labels, use the [IssueLabelToken](https://primer.style/react/Token#issuelabeltoken) component instead.

  <table>
  <tr>
  <th> Before (v34) </th> <th> After (v35) </th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  import {Label} from '@primer/react'

  function Example() {
    return (
      <>
        <Label outline>default</Label>
        <Label variant="small" outline sx={{borderColor: 'danger.emphasis', color: 'danger.fg'}}>
          danger
        </Label>
      </>
    )
  }
  ```

   </td>
  <td valign="top">

  ```jsx
  import {Label} from '@primer/react'

  function Example() {
    return (
      <>
        <Label>default</Label>
        <Label size="small" variant="danger">
          danger
        </Label>
      </>
    )
  }
  ```

  </td>
  </tr>
  </table>

  To continue to use the deprecated API for now, change the import path to `@primer/react/deprecated`:

  ```js
  import {Label} from '@primer/react/deprecated'
  ```

  You can use the [one-time codemod](https://github.com/primer/react-migrate#readme) to change your import statements automatically.

- [#1908](https://github.com/primer/react/pull/1908) [`61404aed`](https://github.com/primer/react/commit/61404aed7fba293577b077183bd54d7caa9c5158) Thanks [@pksjce](https://github.com/pksjce)! - <br />

  ### Button

  Before `v35`, `Button` was a set of seven independent components. In `v35`, we've simplified the `Button` API.

  #### Button variants

  We now support a variant property which takes values `primary`, `invisible`, `outline` and `danger`

  <table>
  <tr>
  <th> Before (v34)</th> <th> After (v35)</th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  import {ButtonPrimary, ButtonInvisible, ButtonOutline, ButtonDanger} from '@primer/react'

  function Example() {
    return (
      <>
        <ButtonPrimary>Primary Button</ButtonPrimary>
        <ButtonInvisible>Invisible Button</ButtonInvisible>
        <ButtonOutline>Outline Button</ButtonOutline>
        <ButtonDanger>Danger Button</ButtonDanger>
      </>
    )
  }
  ```

   </td>
  <td valign="top">

  ```jsx
  import {Button} from '@primer/react'

  function Example() {
    return (
      <>
        <Button variant="primary">Primary Button</Button>
        <Button variant="invisible">Invisible Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="danger">Danger Button</Button>
      </>
    )
  }
  ```

  </td>
  </tr>
  </table>

  #### Leading and trailing icons

  Previously including icons inside buttons required a lot of custom styling. In the new `Button` component, we now support first-class `leadingIcon` and `trailingIcon` props:

  <table>
  <tr>
  <th> Before (v34)</th> <th> After (v35)</th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  <Button>
    <SearchIcon />
    Search
  </Button>
  ```

   </td>
  <td valign="top">

  ```jsx
  <Button leadingIcon={SearchIcon}>Search</Button>
  ```

  </td>
  </tr>
  </table>

  #### Icon buttons

  Icon-only buttons are common in many applications. We now have a component designed for this use-case:

  <table>
  <tr>
  <th> Before (v34)</th> <th> After (v35)</th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  <Button>
    <XIcon />
  </Button>
  ```

   </td>
  <td valign="top">

  ```jsx
  <IconButton aria-label="Close button" icon={XIcon} />
  ```

  </td>
  </tr>
  </table>

  #### Size property

  Previously, we used a `variant` prop to set the size of buttons. We now have a prop called `size` which is more semantically correct.

  <table>
  <tr>
  <th> Before (v34)</th> <th> After (v35)</th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  <Button variant="small">Small button</Button>
  ```

   </td>
  <td valign="top">

  ```jsx
  <Button size="small">Small button</Button>
  ```

  </td>
  </tr>
  </table>

* [#1900](https://github.com/primer/react/pull/1900) [`d61b28ad`](https://github.com/primer/react/commit/d61b28ad6dcec3da1e207a3094a8f7741f71bdb4) Thanks [@mperrotti](https://github.com/mperrotti)! - <br />

  ### ChoiceFieldset

  ⚠️ The `CheckboxGroup` and `RadioGroup` components are replacing the `ChoiceFieldset` component.

  `CheckboxGroup` and `RadioGroup` have the ability to render contextual content with your fieldset: labels, validation statuses, captions. They also handle the ARIA attributes that make the form controls accessible to assistive technology.

  <table>
  <tr>
  <th> Before (v34)</th> <th> After (v35)</th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  import {ChoiceFieldset} from '@primer/react'

  function Example() {
    return (
      <>
        {/* Multi-select */}
        <ChoiceFieldset>
          <ChoiceFieldset.Legend>Preferred Primer component interface</ChoiceFieldset.Legend>
          <ChoiceFieldset.List selectionVariant="multiple">
            <ChoiceFieldset.Item value="figma">Figma library</ChoiceFieldset.Item>
            <ChoiceFieldset.Item value="css">Primer CSS</ChoiceFieldset.Item>
            <ChoiceFieldset.Item value="react">Primer React components</ChoiceFieldset.Item>
            <ChoiceFieldset.Item value="viewcomponents">Primer ViewComponents</ChoiceFieldset.Item>
          </ChoiceFieldset.List>
        </ChoiceFieldset>

        {/* Single select */}
        <ChoiceFieldset>
          <ChoiceFieldset.Legend>Preferred Primer component interface</ChoiceFieldset.Legend>
          <ChoiceFieldset.List>
            <ChoiceFieldset.Item value="figma">Figma library</ChoiceFieldset.Item>
            <ChoiceFieldset.Item value="css">Primer CSS</ChoiceFieldset.Item>
            <ChoiceFieldset.Item value="react">Primer React components</ChoiceFieldset.Item>
            <ChoiceFieldset.Item value="viewcomponents">Primer ViewComponents</ChoiceFieldset.Item>
          </ChoiceFieldset.List>
        </ChoiceFieldset>
      </>
    )
  }
  ```

  </td>
  <td valign="top">

  ```jsx
  import {CheckboxGroup, RadioGroup, FormControl, Checkbox, Radio} from '@primer/react'

  function Example() {
    return (
      <>
        {/* Multi-select */}
        <CheckboxGroup>
          <CheckboxGroup.Label>Preferred Primer component interface</CheckboxGroup.Label>
          <FormControl>
            <Checkbox value="figma" />
            <FormControl.Label>Figma</FormControl.Label>
          </FormControl>
          <FormControl>
            <Checkbox value="css" />
            <FormControl.Label>CSS</FormControl.Label>
          </FormControl>
          <FormControl>
            <Checkbox value="react" />
            <FormControl.Label>Primer React components</FormControl.Label>
          </FormControl>
          <FormControl>
            <Checkbox value="viewcomponents" />
            <FormControl.Label>Primer ViewComponents</FormControl.Label>
          </FormControl>
        </CheckboxGroup>

        {/* Single select */}
        <RadioGroup name="preferred-primer">
          <RadioGroup.Label>Preferred Primer component interface</RadioGroup.Label>
          <FormControl>
            <Radio value="figma" />
            <FormControl.Label>Figma</FormControl.Label>
          </FormControl>
          <FormControl>
            <Radio value="css" />
            <FormControl.Label>CSS</FormControl.Label>
          </FormControl>
          <FormControl>
            <Radio value="react" />
            <FormControl.Label>Primer React components</FormControl.Label>
          </FormControl>
          <FormControl>
            <Radio value="viewcomponents" />
            <FormControl.Label>Primer ViewComponents</FormControl.Label>
          </FormControl>
        </RadioGroup>
      </>
    )
  }
  ```

  </td>
  </tr>
  </table>

  To continue to use the deprecated API for now, change the import path to `@primer/react/deprecated`:

  ```js
  import {ChoiceFieldset} from '@primer/react/deprecated'
  ```

  You can use the [one-time codemod](https://github.com/primer/react-migrate#readme) to change your import statements automatically.

- [#1882](https://github.com/primer/react/pull/1882) [`df757521`](https://github.com/primer/react/commit/df757521a7a088628d96deeb263fbd0f0aefd9ca) Thanks [@colebemis](https://github.com/colebemis)! - <br />

  ### PageLayout

  `PageLayout` is being graduated from the `drafts` bundle to the `main` bundle.

  To upgrade, rewrite your imports accordingly:

  ```diff
  - import {PageLayout} from '@primer/react/drafts'
  + import {PageLayout} from '@primer/react'
  ```

* [#1888](https://github.com/primer/react/pull/1888) [`f94dcd33`](https://github.com/primer/react/commit/f94dcd33ffa20eb86ed685412c057b8df30d860d) Thanks [@mperrotti](https://github.com/mperrotti)! - <br />

  ### FormGroup, InputField, ChoiceInputField

  ⚠️ The `FormControl` component is replacing the `FormGroup`, `InputField`, and `ChoiceInputField` components. It has the ability to render contextual content with your inputs: labels, validation statuses, captions. It also handles the ARIA attributes that make the form controls accessible to assistive technology.

  <table>
  <tr>
  <th> Before (v34) </th> <th> After (v35) </th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  import {FormControl, Checkbox, TextInput} from '@primer/react'

  function Example() {
    return (
      <>
        <FormGroup>
          <FormGroup.Label htmlFor="example-text">Example text</FormGroup.Label>
          <TextInput id="example-text" />
        </FormGroup>
        {/* OR */}
        <InputField>
          <InputField.Label>Example text</InputField.Label>
          <TextInput />
        </InputField>
        {/* OR */}
        <ChoiceInputField>
          <ChoiceInputField.Label>Example text</ChoiceInputField.Label>
          <Checkbox />
        </ChoiceInputField>
      </>
    )
  }
  ```

  </td>
  <td valign="top">

  ```jsx
  import {FormGroup, TextInput} from '@primer/react'

  function Example() {
    return (
      <>
        <FormControl>
          <FormControl.Label>Example text</FormControl.Label>
          <TextInput />
        </FormControl>
        {/* OR */}
        <FormControl>
          <FormControl.Label>Example text</FormControl.Label>
          <Checkbox />
        </FormControl>
      </>
    )
  }
  ```

  </td>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  import {InputField, TextInput} from '@primer/react'

  function Example() {
    return (
      <InputField>
        <InputField.Label>Example text</InputField.Label>
        <TextInput />
      </InputField>
    )
  }
  ```

  </td>
  <td valign="top">

  ```jsx
  import {FormControl, TextInput} from '@primer/react'

  function Example() {
    return (
      <FormControl>
        <FormControl.Label>Example text</FormControl.Label>
        <TextInput />
      </FormControl>
    )
  }
  ```

  </td>
  </tr>
  </table>

  To continue to use the deprecated API for now, change the import path to `@primer/react/deprecated`:

  ```js
  import {FormGroup, ChoiceInputField, InputField} from '@primer/react/deprecated'
  ```

  You can use the [one-time codemod](https://github.com/primer/react-migrate#readme) to change your import statements automatically.

- [#1881](https://github.com/primer/react/pull/1881) [`8cd12439`](https://github.com/primer/react/commit/8cd12439703e39d38893e02df0ed84a45d846e55) Thanks [@pksjce](https://github.com/pksjce)! - <br />

  ### SelectMenu

  ⚠️ `SelectMenu` has been deprecated. Please use `ActionMenu` instead.

  <table>
  <tr>
  <th> Before </th> <th> After </th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  <SelectMenu>
    <Button as="summary">Projects</Button>
    <SelectMenu.Modal>
      <SelectMenu.Header>Projects</SelectMenu.Header>
      <SelectMenu.List>
        <SelectMenu.Item href="#">Primer React bugs</SelectMenu.Item>
        <SelectMenu.Item href="#">Primer React roadmap</SelectMenu.Item>
        <SelectMenu.Item href="#">Project 3</SelectMenu.Item>
        <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
      </SelectMenu.List>
    </SelectMenu.Modal>
  </SelectMenu>
  ```

   </td>
  <td valign="top">

  ```jsx
  <ActionMenu>
    <ActionMenu.Button>Projects</ActionMenu.Button>
    <ActionMenu.Overlay>
      <ActionList showDividers>
        <ActionList.Group title="Projects">
          <ActionList.Item>Primer React bugs</ActionList.Item>
          <ActionList.Item>Primer React roadmap</ActionList.Item>
          <ActionList.Item>Project three</ActionList.Item>
          <ActionList.Item>Project four</ActionList.Item>
        </ActionList.Group>
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
  ```

  </td>
  </tr>
  </table>

  See [https://primer.style/react/ActionMenu](https://primer.style/react/ActionMenu) for more migration examples.

  ### Dropdown

  ⚠️ `Dropdown` has been deprecated. Please use `ActionMenu` instead.

  <table>
  <tr>
  <th> Before </th> <th> After </th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  const fieldTypes = [
    {leadingVisual: TypographyIcon, text: 'Text'},
    {leadingVisual: NumberIcon, text: 'Number'},
  ]

  const Example = () => {
    const [selectedItem, setSelectedItem] = React.useState()

    return (
      <DropdownMenu
        renderAnchor={({children, ...anchorProps}) => <ButtonInvisible {...anchorProps}>{children}</ButtonInvisible>}
        placeholder="Select a field type"
        items={fieldTypes}
        selectedItem={selectedItem}
        onChange={() => setSelectedIndex(index)}
      />
    )
  }
  ```

   </td>
  <td valign="top">

  ```jsx
  const fieldTypes = [
    {icon: <TypographyIcon />, name: 'Text'},
    {icon: <NumberIcon />, name: 'Number'},
  ]

  const Example = () => {
    const [selectedItem, setSelectedItem] = React.useState()

    return (
      <ActionMenu>
        <ActionMenu.Button>{selectedItem ? selectedItem.name : 'Select a field type'}</ActionMenu.Button>
        <ActionMenu.Overlay>
          <ActionList selectionVariant="single">
            {fieldTypes.map(field => (
              <ActionList.Item onSelect={() => setSelectedItem(field)} key={field.name}>
                <ActionList.LeadingVisual>{field.icon}</ActionList.LeadingVisual>
                {field.name}
              </ActionList.Item>
            ))}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    )
  }
  ```

  </td>
  </tr>
  </table>

  See [https://primer.style/react/ActionMenu](https://primer.style/react/ActionMenu) for more migration examples.

  ### Flex

  ⚠️ `Flex` has been deprecated. Please use [`Box`](https://primer.style/react/Box) instead.

  <table>
  <tr>
  <th> Before </th> <th> After </th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  <Flex flexWrap="nowrap">
    <Box p={3} color="fg.onEmphasis" bg="accent.emphasis">
      Item 1
    </Box>
  </Flex>
  ```

   </td>
  <td valign="top">

  ```jsx
  <Box display="flex" flexWrap="nowrap">
    <Box p={3} color="fg.onEmphasis" bg="accent.emphasis">
      Item 1
    </Box>
  </Box>
  ```

  </td>
  </tr>
  </table>

  ### Grid

  ⚠️ `Grid` has been deprecated. Please use [`Box`](https://primer.style/react/Box) instead.

  <table>
  <tr>
  <th> Before </th> <th> After </th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  <Grid gridTemplateColumns="repeat(2, auto)" gridGap={3}>
    <Box p={3} color="fg.onEmphasis" bg="accent.emphasis">
      1
    </Box>
    <Box p={3} color="fg.onEmphasis" bg="attention.emphasis">
      2
    </Box>
  </Grid>
  ```

   </td>
  <td valign="top">

  ```jsx
  <Box display="grid" gridTemplateColumns="repeat(2, auto)" gridGap={3}>
    <Box p={3} color="fg.onEmphasis" bg="accent.emphasis">
      1
    </Box>
    <Box p={3} color="fg.onEmphasis" bg="attention.emphasis">
      2
    </Box>
  </Box>
  ```

  </td>
  </tr>
  </table>

  ### BorderBox

  ⚠️ `BorderBox` has been deprecated. Please use [`Box`](https://primer.style/react/Box) instead.

  <table>
  <tr>
  <th> Before </th> <th> After </th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  <BorderBox>Item 1</BorderBox>
  ```

   </td>
  <td valign="top">

  ```jsx
  <Box borderWidth="1px" borderStyle="solid" borderColor="border.default" borderRadius={2}>
    Item 1
  </Box>
  ```

  </td>
  </tr>
  </table>

  ### Position

  ⚠️ `Position` has been deprecated. Please use [`Box`](https://primer.style/react/Box) instead.

  <table>
  <tr>
  <th> Before </th> <th> After </th>
  </tr>
  <tr>
  <td valign="top">

  ```jsx
  <>
    <Position position="absolute">...</Position>
    <Absolute>...</Absolute>
    <Relative>...</Relative>
    <Fixed>...</Fixed>
    <Sticky>...</Sticky>
  </>
  ```

   </td>
  <td valign="top">

  ```jsx
  <>
    <Box position="absolute">...</Box>
    <Box position="absolute">...</Box>
    <Box position="relative">...</Box>
    <Box position="fixed">...</Box>
    <Box position="sticky">...</Box>
  </>
  ```

  </td>
  </tr>
  </table>

### Minor Changes

- [#1921](https://github.com/primer/react/pull/1921) [`561aad86`](https://github.com/primer/react/commit/561aad864c5b98514b0edef6c313cc9debedfe8d) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Add align prop on ActionMenu.Overlay to pass through to AnchoredOverlay

### Patch Changes

- [#1922](https://github.com/primer/react/pull/1922) [`b1d7b8c9`](https://github.com/primer/react/commit/b1d7b8c9eb829b93977c9ed6a0d9d423c756e588) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu.Button: Fix spacing between text and caret

* [#1915](https://github.com/primer/react/pull/1915) [`a98091c1`](https://github.com/primer/react/commit/a98091c13da9b9aadb2f061084628a5616c42a65) Thanks [@siddharthkp](https://github.com/siddharthkp)! - - Update styles for default variant of Button's active state
  - Use active state for Button when it is used to open an Overlay

- [#1934](https://github.com/primer/react/pull/1934) [`33da6a0e`](https://github.com/primer/react/commit/33da6a0eeeae1cc65553ca19650b9c51e49ea2ec) Thanks [@rezrah](https://github.com/rezrah)! - Surfaced the following components and hooks from the root index:

  - Portal
  - AnchoredOverlay
  - useFocusTrap
  - useFocusZone (and types)
  - sx (and types)
  - ConfirmationDialogProps

  These exports can now be imported from the root index, rather than from their nested subfolders.

  E.g.

  ```diff
  - import { ConfirmationDialogProps } from '@primer/react/lib-esm/Dialog/ConfirmationDialog';
  + import { ConfirmationDialogProps } from '@primer/react';
  ```

## 34.7.1

### Patch Changes

- [#1936](https://github.com/primer/react/pull/1936) [`ceaaf171`](https://github.com/primer/react/commit/ceaaf17174f08ccccd5223066e456c38b76241c1) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ThemeProvider: Fix `setColorMode`. Broken in `34.6.0`

* [#1913](https://github.com/primer/react/pull/1913) [`92a02377`](https://github.com/primer/react/commit/92a023770f04662a3571de7e87fab8565592bae4) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Fixes the theming implementation with server side rendering to use a CSRF safe approach

- [#1928](https://github.com/primer/react/pull/1928) [`4dc15c33`](https://github.com/primer/react/commit/4dc15c3300838733da39fd2895692cce5bc3a3b5) Thanks [@pksjce](https://github.com/pksjce)! - Add outline background and border color

## 34.7.0

### Minor Changes

- [#1862](https://github.com/primer/react/pull/1862) [`eebb3f27`](https://github.com/primer/react/commit/eebb3f27c54b68c4a8b4d46c555f7d603e9c8e7d) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds CheckboxGroup and RadioGroup components to replace the ChoiceFieldset component

### Patch Changes

- [#1886](https://github.com/primer/react/pull/1886) [`ecbf923e`](https://github.com/primer/react/commit/ecbf923e794498654e9e5d749e3593136a5790ff) Thanks [@mperrotti](https://github.com/mperrotti)! - Makes it possible to render leading and trailing visuals in TextInputWithTokens just like we do in TextInput

* [#1880](https://github.com/primer/react/pull/1880) [`0256a5f5`](https://github.com/primer/react/commit/0256a5f5bef5fb939700fd2c2d9d92b22c02ab11) Thanks [@pksjce](https://github.com/pksjce)! - Remove link button from the new button

- [#1914](https://github.com/primer/react/pull/1914) [`b651d70d`](https://github.com/primer/react/commit/b651d70d73b5693ebafc301177aed275c1a17e29) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu: Fix typeahead with leading visuals

## 34.6.0

### Minor Changes

- [#1834](https://github.com/primer/react/pull/1834) [`2abd7b7a`](https://github.com/primer/react/commit/2abd7b7a1f8a1cddaf452770c9c102b9d66f3316) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu2 + DropdownMenu2: Implement typeahead search. [See detailed spec.](https://github.com/github/primer/issues/518#issuecomment-999104848)

### Patch Changes

- [#1877](https://github.com/primer/react/pull/1877) [`50fa9880`](https://github.com/primer/react/commit/50fa98802700130576c81be85dba5695013f5f23) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Upgrade @primer/behaviors to 1.1.0

* [#1876](https://github.com/primer/react/pull/1876) [`6cc9260a`](https://github.com/primer/react/commit/6cc9260a97334aea835c3981da0e8ed5d55d3467) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Better aria roles for ActionList group

- [#1848](https://github.com/primer/react/pull/1848) [`96a151ac`](https://github.com/primer/react/commit/96a151ac4d6edf9b3eb3e05bbee64a49cd87e17c) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Merges drafts/DropdownMenu2 into drafts/ActionMenu2

* [#1866](https://github.com/primer/react/pull/1866) [`01efa73f`](https://github.com/primer/react/commit/01efa73fb003d6529bb27c961bb802faab57d034) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Fix the behavior of Escape key in nested overlays [#1854](https://github.com/primer/react/issues/1854), now only the top most overlay will close instead of all of them.

- [#1855](https://github.com/primer/react/pull/1855) [`c3b4ad70`](https://github.com/primer/react/commit/c3b4ad705a40f6e0f09dd74cf8457cb6bc0d5ca1) Thanks [@jclem](https://github.com/jclem)! - Fix [an issue](https://github.com/primer/react/issues/1849) where transitive
  dependency interface augmentations appeared in our build output

* [#1826](https://github.com/primer/react/pull/1826) [`004c4623`](https://github.com/primer/react/commit/004c4623162816cbf1b77b0b1387b8c03732675b) Thanks [@PeterYangIO](https://github.com/PeterYangIO)! - Remove unnecessary "required field" label title in favor for native `required` input attribute

- [#1868](https://github.com/primer/react/pull/1868) [`f3f42553`](https://github.com/primer/react/commit/f3f425536dde3cd2c92599216987305964b76187) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Fixes a bug for theming with server side rendering where the output of the server and client mismatch [#1773](https://github.com/primer/react/issues/1773)

* [#1864](https://github.com/primer/react/pull/1864) [`8558ae5b`](https://github.com/primer/react/commit/8558ae5b1734bdcf306a43a08fa0fae34f98609c) Thanks [@pksjce](https://github.com/pksjce)! - Small fixes to icon button sizes. Truthy checks for children props

## 34.5.0

### Minor Changes

- [#1831](https://github.com/primer/react/pull/1831) [`96473f39`](https://github.com/primer/react/commit/96473f398bb0fe5f2eff1b3e8bb9110a009f1894) Thanks [@mperrotti](https://github.com/mperrotti)! - Makes validation styling available for Select and TextInputWithTokens

* [#1836](https://github.com/primer/react/pull/1836) [`7e8ae653`](https://github.com/primer/react/commit/7e8ae653664796349358e80a7c5f585efe893707) Thanks [@mperrotti](https://github.com/mperrotti)! - Introduces FormControl component. The FormControl component combines the functionality of InputField and ChoiceInputField, and will replace FormGroup, InputField, and ChoiceInputField.

### Patch Changes

- [#1846](https://github.com/primer/react/pull/1846) [`65c405b6`](https://github.com/primer/react/commit/65c405b60c053cad4e9cb9b678d67459740764d6) Thanks [@colebemis](https://github.com/colebemis)! - PageLayout: Prevent content region from wrapping on wide viewports

* [#1856](https://github.com/primer/react/pull/1856) [`3f405221`](https://github.com/primer/react/commit/3f405221c64abb90c1f3a54211b62a90e9354d98) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Revert "Overlay: Attach escape handler to overlay container"

- [#1850](https://github.com/primer/react/pull/1850) [`fad43d67`](https://github.com/primer/react/commit/fad43d67bd82b51104c11900871be9132219e6f8) Thanks [@mperrotti](https://github.com/mperrotti)! - FormControl:
  - Add `sx` prop
  - Rename `appearance` prop to `variant`

## 34.4.0

### Minor Changes

- [#1812](https://github.com/primer/react/pull/1812) [`97bf7c62`](https://github.com/primer/react/commit/97bf7c627bb10cdd18406557e6f1e79a39ed5b48) Thanks [@rezrah](https://github.com/rezrah)! - Add new Textarea component

### Patch Changes

- [#1824](https://github.com/primer/react/pull/1824) [`4eab65e5`](https://github.com/primer/react/commit/4eab65e57571d64a0f8a4fcb4aafbf47d3e98a2d) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Overlay: Attach escape handler to overlay container instead of document to fix stopPropagation

* [#1840](https://github.com/primer/react/pull/1840) [`1c4786c7`](https://github.com/primer/react/commit/1c4786c7d99fe083b47902acff5326c44a7c8288) Thanks [@jclem](https://github.com/jclem)! - Set Node.js and npm versions to ">=12" and ">=7", respectively, in package.json manifests, and update package-lock.json files accordingly.

- [#1828](https://github.com/primer/react/pull/1828) [`6a695bdc`](https://github.com/primer/react/commit/6a695bdcea356821390f42c575d78a2f5ded6e86) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu2 + DropdownMenu2: A keyboard user will be able to wrap through options

* [#1810](https://github.com/primer/react/pull/1810) [`35ad7084`](https://github.com/primer/react/commit/35ad7084bca048748479301e286ca305faada5b2) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu2 + DropdownMenu2: Focus the correct element when Menu is opened with keyboard. [See detailed spec.](https://github.com/github/primer/issues/518#issuecomment-999104848)

  - ArrowDown | Space | Enter: first element
  - ArrowUp: last element

- [#1842](https://github.com/primer/react/pull/1842) [`11011f55`](https://github.com/primer/react/commit/11011f5598a2c97f2dbb5928962dfa12b7437be0) Thanks [@jclem](https://github.com/jclem)! - Allow `KeyPaths` type to accept any type in order to remove need for `// @ts-ignore` internally.

* [#1820](https://github.com/primer/react/pull/1820) [`50c7bfaa`](https://github.com/primer/react/commit/50c7bfaa283154e28d1905e3eb01f7f01901c806) Thanks [@colebemis](https://github.com/colebemis)! - Add draft `PageLayout` component

## 34.3.0

### Minor Changes

- [#1797](https://github.com/primer/react/pull/1797) [`8b376b9d`](https://github.com/primer/react/commit/8b376b9d3c894eaa1a77edbdd3d168d3afa7b66d) Thanks [@mperrotti](https://github.com/mperrotti)! - Introduces a draft for component to replace the existing Label component

### Patch Changes

- [#1759](https://github.com/primer/react/pull/1759) [`493c6ea1`](https://github.com/primer/react/commit/493c6ea1e92382fd3bbbfb002b2127fafbd7bc6f) Thanks [@siddharthkp](https://github.com/siddharthkp)! - AnchoredOverlay: Add support for passing an id to the anchor. Remove unnecessary aria-labelledby on anchor.
  ActionMenu v2: Add aria-labelledby for ActionList

* [#1779](https://github.com/primer/react/pull/1779) [`2630800d`](https://github.com/primer/react/commit/2630800d7905b1004d40481ab4f25517bcc34f5a) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu v2: ActionMenu.Button now uses Button v2

- [#1735](https://github.com/primer/react/pull/1735) [`8ff114b1`](https://github.com/primer/react/commit/8ff114b1347047f9a518d7d361da455a59573f3b) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Add composable `DropdownMenu` to `@primer/components/drafts`

* [#1814](https://github.com/primer/react/pull/1814) [`384c3756`](https://github.com/primer/react/commit/384c375649da0718cc66b088e3ec5928afbeaded) Thanks [@pksjce](https://github.com/pksjce)! - Upgrade @primer/behaviors

- [#1804](https://github.com/primer/react/pull/1804) [`aa09ed79`](https://github.com/primer/react/commit/aa09ed790ba9461a4516c546924a4673c0b21462) Thanks [@rezrah](https://github.com/rezrah)! - Fixes bug in PointerBox component where caret doesn't inherit correct styling. Backwards compatible with previous API.

## 34.2.0

### Minor Changes

- [#1736](https://github.com/primer/react/pull/1736) [`82961d44`](https://github.com/primer/react/commit/82961d441b2108243a8798990f896969fe245457) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds a component for a native select input

* [#1657](https://github.com/primer/react/pull/1657) [`d143c956`](https://github.com/primer/react/commit/d143c956cd867fe7858670dd58ce69ec652a4c4d) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds ChoiceFieldset component

### Patch Changes

- [#1758](https://github.com/primer/react/pull/1758) [`b604403c`](https://github.com/primer/react/commit/b604403c709a7c766d69001bc080957d88a0ed7b) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu v2: Add aria-expanded to the ActionMenu.Button

* [#1770](https://github.com/primer/react/pull/1770) [`39a3bc29`](https://github.com/primer/react/commit/39a3bc29d1362c382027f8749e171fc2b7caa0da) Thanks [@PeterYangIO](https://github.com/PeterYangIO)! - Adds aria-hidden="true" to InputLabel required asterisk

- [#1781](https://github.com/primer/react/pull/1781) [`064828d2`](https://github.com/primer/react/commit/064828d27584bf098ec370881319a26420eb40e7) Thanks [@rezrah](https://github.com/rezrah)! - restores color prop functionality to StyledOcticon

* [#1794](https://github.com/primer/react/pull/1794) [`a8c427da`](https://github.com/primer/react/commit/a8c427dab3c7450c1c69b76d600a529f72268214) Thanks [@rezrah](https://github.com/rezrah)! - replace `Location | Pathname` union type for `to` prop with more appropriate `To`

- [#1772](https://github.com/primer/react/pull/1772) [`52947c44`](https://github.com/primer/react/commit/52947c4446a334180362bd927c4d54b028e036ba) Thanks [@pksjce](https://github.com/pksjce)! - Export SelectPanel from the package

* [#1757](https://github.com/primer/react/pull/1757) [`6e44d786`](https://github.com/primer/react/commit/6e44d7869c1eba7f5ba9d6bfaaf61b78be721bfd) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList v2 Divider: Make divider aria-hidden

- [#1751](https://github.com/primer/react/pull/1751) [`03584e09`](https://github.com/primer/react/commit/03584e09830956bbd4cd721c26566e29966a7cef) Thanks [@talune](https://github.com/talune)! - Fix AvatarStack opacity for children without sx prop

* [#1791](https://github.com/primer/react/pull/1791) [`6a8472b4`](https://github.com/primer/react/commit/6a8472b4acc65dc2609a46fab69d83c89e23956f) Thanks [@rezrah](https://github.com/rezrah)! - Fix type errors due to missing pathname (string) in union type for LocationDescriptor

## 34.1.0

### Minor Changes

- [#1611](https://github.com/primer/react/pull/1611) [`11382eeb`](https://github.com/primer/react/commit/11382eeb60441fe4d03f5aedf1f28b4b061cb07d) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds TextInputField, CheckboxInputField, and RadioInputField components. Also adds a few internal (private to primer/react) components to support form fields

### Patch Changes

- [#1754](https://github.com/primer/react/pull/1754) [`08cdb0bc`](https://github.com/primer/react/commit/08cdb0bcad859663e7e425a89d3b696388f449f3) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Fix title and subtitle tag for Dialog2 and ConfirmationDialog

* [#1730](https://github.com/primer/react/pull/1730) [`a9dc6f20`](https://github.com/primer/react/commit/a9dc6f20b65d3ed31d4bb13dd234a3c7b36caf10) Thanks [@pksjce](https://github.com/pksjce)! - NewButton -> Button2 file name changes

- [#1742](https://github.com/primer/react/pull/1742) [`4ab78a26`](https://github.com/primer/react/commit/4ab78a26eaeea517b65ec202a2abeb7f93dcfc89) Thanks [@pksjce](https://github.com/pksjce)! - Fix for SelectPanel Filter width

## 34.0.1

### Patch Changes

- [#1661](https://github.com/primer/react/pull/1661) [`6f13441b`](https://github.com/primer/react/commit/6f13441b074bc47e4982bdb15e0470378799dfe0) Thanks [@pksjce](https://github.com/pksjce)! - Text Input enhancements

* [#1700](https://github.com/primer/react/pull/1700) [`9d2827a9`](https://github.com/primer/react/commit/9d2827a9cbb023c0a412d8040182a887651a55b7) Thanks [@dgreif](https://github.com/dgreif)! - Use extracted [@primer/behaviors](https://github.com/primer/behaviors) for hook behaviors

- [#1712](https://github.com/primer/react/pull/1712) [`4ce8f07b`](https://github.com/primer/react/commit/4ce8f07be6452ef9bc55ca61ce03202d5ab6a3f9) Thanks [@colebemis](https://github.com/colebemis)! - Remove "engines" field from package.json

* [#1734](https://github.com/primer/react/pull/1734) [`bba4c245`](https://github.com/primer/react/commit/bba4c2451f1c32cd25e7351ad8f808dc22c85e97) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Button v2 - Fix font family

## 34.0.0

### Major Changes

- [#1676](https://github.com/primer/react/pull/1676) [`1195336e`](https://github.com/primer/react/commit/1195336e475441f6f7bc266630070834ad564503) Thanks [@colebemis](https://github.com/colebemis)! - Rename npm package from `@primer/components` to `@primer/react`

  To upgrade, run:

  ```shell
  npm uninstall @primer/components
  npm install @primer/react
  ```

  Then update your imports:

  ```diff
  - import {Box} from '@primer/components'
  + import {Box} from '@primer/react'
  ```

## 33.1.0

### Minor Changes

- [#1658](https://github.com/primer/react/pull/1658) [`edc48ba8`](https://github.com/primer/react/commit/edc48ba817e2052d2f4ed8e602bffd92e82b8893) Thanks [@rezrah](https://github.com/rezrah)! - Adds a Radio component

### Patch Changes

- [#1675](https://github.com/primer/react/pull/1675) [`2380b668`](https://github.com/primer/react/commit/2380b66848a885ee5dd2e6b07a1173201976545f) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionMenu v2: Added `ActionMenu.Overlay` which accepts props to customize the Menu overlay.

* [#1702](https://github.com/primer/react/pull/1702) [`2c42c382`](https://github.com/primer/react/commit/2c42c382fc4ddf50fc18dd62ca854dc04304a539) Thanks [@colebemis](https://github.com/colebemis)! - Update `BranchName` styles to match github.com

## 33.0.0

### Major Changes

- [#1643](https://github.com/primer/react/pull/1643) [`3938550f`](https://github.com/primer/react/commit/3938550fb3ea3fbec542a0cadaf6aeb734fba938) Thanks [@jfuchs](https://github.com/jfuchs)! - Details no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1643](https://github.com/primer/react/pull/1643) [`3938550f`](https://github.com/primer/react/commit/3938550fb3ea3fbec542a0cadaf6aeb734fba938) Thanks [@jfuchs](https://github.com/jfuchs)! - Avatar no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1643](https://github.com/primer/react/pull/1643) [`3938550f`](https://github.com/primer/react/commit/3938550fb3ea3fbec542a0cadaf6aeb734fba938) Thanks [@jfuchs](https://github.com/jfuchs)! - BranchName no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1643](https://github.com/primer/react/pull/1643) [`3938550f`](https://github.com/primer/react/commit/3938550fb3ea3fbec542a0cadaf6aeb734fba938) Thanks [@jfuchs](https://github.com/jfuchs)! - Heading no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

### Minor Changes

- [#1619](https://github.com/primer/react/pull/1619) [`a13efa45`](https://github.com/primer/react/commit/a13efa457ded69656fb390b5b9b666d00157fd21) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Add composable `ActionMenu` to `@primer/components/drafts`

* [#1679](https://github.com/primer/react/pull/1679) [`006cc80b`](https://github.com/primer/react/commit/006cc80bd8fa2f31947e17e0683880e0b8cdc400) Thanks [@mattcosta7](https://github.com/mattcosta7)! - Add `resolvedColorScheme` property to the object returned by `useTheme()`

### Patch Changes

- [#1668](https://github.com/primer/react/pull/1668) [`98dc6336`](https://github.com/primer/react/commit/98dc633674b793edfa4fbeb88fd239e6ca40544e) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList: Fix multiple selection svg by overriding global shape-rendering for github.com

* [#1596](https://github.com/primer/react/pull/1596) [`5c6dc644`](https://github.com/primer/react/commit/5c6dc644c1e68b36d309deac653aca189f1fa624) Thanks [@dmarcey](https://github.com/dmarcey)! - Fix alignment of items in ActionList (single-select) if some of the items have wrapping text.

- [#1538](https://github.com/primer/react/pull/1538) [`dda6e5d7`](https://github.com/primer/react/commit/dda6e5d7204347c3c66183464dd0903e878a4f20) Thanks [@shiftkey](https://github.com/shiftkey)! - Update `typescript` package to correct generated type declarations.

## 32.1.0

### Minor Changes

- [#1606](https://github.com/primer/react/pull/1606) [`985120a6`](https://github.com/primer/react/commit/985120a61b62c1bbd1872d9a11e34fab407a4096) Thanks [@rezrah](https://github.com/rezrah)! - Adds a new Checkbox form component

### Patch Changes

- [#1648](https://github.com/primer/react/pull/1648) [`8b40a0a9`](https://github.com/primer/react/commit/8b40a0a91f6804496f78c342be62607983ee4081) Thanks [@jfuchs](https://github.com/jfuchs)! - Fixed a bug with Overlay's type where DOM props were not allowed.

## 32.0.1

### Patch Changes

- [#1649](https://github.com/primer/react/pull/1649) [`b1315367`](https://github.com/primer/react/commit/b1315367858c6b4319ac601e5e324bb37331e4a3) Thanks [@jonrohan](https://github.com/jonrohan)! - Upgrading primer/primitives@7.1.1

* [#1652](https://github.com/primer/react/pull/1652) [`47550d34`](https://github.com/primer/react/commit/47550d3400fec87a26eb74c8344dfbd71635a3f5) Thanks [@colebemis](https://github.com/colebemis)! - Fix preval of `theme-preval.js`

## 32.0.0

### Major Changes

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Truncate no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Timeline no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Dropdown no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Pagehead no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - LabelGroup no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Link no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Popover no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - StateLabel no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - CircleBadge no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - SelectMenu no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Header no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - UnderlineNav no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Overlay no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - StyledOcticon no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Dialog no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - TabNav no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - SubNav no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Dialog2 no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Buttons no longer accept styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Label no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Flash no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Tooltip no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Pagination no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - Breadcrumbs no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - FilteredSearch no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - SideNav no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - FilterList no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

* [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - CounterLabel no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

- [#1639](https://github.com/primer/react/pull/1639) [`8ce0eb92`](https://github.com/primer/react/commit/8ce0eb92d23e2d46760e8b77900e10e7c04da43e) Thanks [@jfuchs](https://github.com/jfuchs)! - FormGroup no longer accepts styled-system props. Please use the `sx` prop to extend Primer component styling instead. See also https://primer.style/react/overriding-styles for information about `sx` and https://primer.style/react/system-props for context on the removal.

### Patch Changes

- [#1598](https://github.com/primer/react/pull/1598) [`3bb895f1`](https://github.com/primer/react/commit/3bb895f1a2cbd36d509f005524878d14218acb39) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList: Better semantics for accessible ActionList.Group

* [#1601](https://github.com/primer/react/pull/1601) [`250e4b00`](https://github.com/primer/react/commit/250e4b00f4d996b6125d381bae2487b57156687c) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList: Use icon instead of input for multiple selection in ActionList

- [#1629](https://github.com/primer/react/pull/1629) [`47fdbf40`](https://github.com/primer/react/commit/47fdbf40c3b3e0b0efaa7d50e4c08e283eecc5ee) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList: Visual update for disabled Items to make them more obvious

* [#1486](https://github.com/primer/react/pull/1486) [`34cfca53`](https://github.com/primer/react/commit/34cfca53f8a85a5639b958c61a2474be7390d8a9) Thanks [@pksjce](https://github.com/pksjce)! - ActionList: Add focus and hover colors to all themes in Item using functional variables

## 31.2.0

### Minor Changes

- [#1544](https://github.com/primer/react/pull/1544) [`5b55b0ab`](https://github.com/primer/react/commit/5b55b0ab8ea06b077e141c02285c81b99e246b77) Thanks [@jfuchs](https://github.com/jfuchs)! - The sx prop now has types that will inform autocomplete for color and shadow values that are key paths into the theme.

* [#1517](https://github.com/primer/react/pull/1517) [`561c0bd3`](https://github.com/primer/react/commit/561c0bd371b8d2135fb1d69555abc424ab796f2d) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Add experimental `ActionList` with composable API

### Patch Changes

- [#1599](https://github.com/primer/react/pull/1599) [`a2e195b0`](https://github.com/primer/react/commit/a2e195b0a26ce70f44aea38b009856c0089aae0e) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList: Better labels and description for accessible ActionList.Item

* [#1603](https://github.com/primer/react/pull/1603) [`f4057b89`](https://github.com/primer/react/commit/f4057b897cc4c23012fb1b1881cefacbb57e081d) Thanks [@siddharthkp](https://github.com/siddharthkp)! - ActionList: Improve keyboard accessibility with focus styles cross browser

- [#1583](https://github.com/primer/react/pull/1583) [`24b1ebbc`](https://github.com/primer/react/commit/24b1ebbc21ca2eaa92bd6b5b8c15ab0e7577f5a0) Thanks [@pksjce](https://github.com/pksjce)! - Add a utility to provide useIsoMorphicEffect function and use that instead of useLayoutEffect everywhere

* [#1592](https://github.com/primer/react/pull/1592) [`8d3d491f`](https://github.com/primer/react/commit/8d3d491fa3c9437b3a8f310e233b7009cae13095) Thanks [@rezrah](https://github.com/rezrah)! - Fixes a styling bug in TextInput components while using its `icon` and `block` props together

- [#1549](https://github.com/primer/react/pull/1549) [`f565840f`](https://github.com/primer/react/commit/f565840f2d879b987ef9df7cd046e146214ed5f5) Thanks [@michael-lefebvre](https://github.com/michael-lefebvre)! - Fix `auxiliaryText` in ActionList Group header

* [#1604](https://github.com/primer/react/pull/1604) [`d2090b5b`](https://github.com/primer/react/commit/d2090b5b0321df1a415054d9b6a4d407627a385f) Thanks [@japf](https://github.com/japf)! - Add support for draft issues to the StateLabel component

- [#1609](https://github.com/primer/react/pull/1609) [`5eb7ade9`](https://github.com/primer/react/commit/5eb7ade92082fda2a94b45828a32e25b07c039db) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Rename `@primer/components/unreleased` to `@primer/components/drafts` to avoid confusion when referring to it.

## 31.1.0

### Minor Changes

- [#1523](https://github.com/primer/react/pull/1523) [`56e2f159`](https://github.com/primer/react/commit/56e2f159b9d627564a7717e6961a6bfa355189b3) Thanks [@mperrotti](https://github.com/mperrotti)! - Add the ability to truncate tokens in the TextInputWithToken component when the input is not focused

### Patch Changes

- [#1529](https://github.com/primer/react/pull/1529) [`da566044`](https://github.com/primer/react/commit/da566044649a114e23789e3ac90c022cdbf5eaeb) Thanks [@mperrotti](https://github.com/mperrotti)! - Fixes a bug in `TextInputWithTokens` where the next token would not receive focus after the user deleted the first token using the keyboard

* [#1526](https://github.com/primer/react/pull/1526) [`1378e771`](https://github.com/primer/react/commit/1378e771323a48e6084c5ffac7d93b54960f4a0e) Thanks [@mperrotti](https://github.com/mperrotti)! - replaces flexbox gap usage with margins

## 31.0.1

### Patch Changes

- [#1521](https://github.com/primer/react/pull/1521) [`28b5980c`](https://github.com/primer/react/commit/28b5980c64dc5e05cb3ddb0c8c5f18fa5d0c490c) Thanks [@siddharthkp](https://github.com/siddharthkp)! - Add `trailingVisual` prop to ActionList/ActionMenu. Deprecate `trailingIcon` and `trailingText` props.

## 31.0.0

### Major Changes

- [#1514](https://github.com/primer/react/pull/1514) [`dc789025`](https://github.com/primer/react/commit/dc789025d4976e2f0863e1f377c4a834aab88e3a) Thanks [@colebemis](https://github.com/colebemis)! - Remove deprecated color variables by upgrading to @primer/primitives [v5](https://github.com/primer/primitives/pull/251)

  **Note:** Install [`eslint-plugin-primer-react`](https://primer.style/react/linting) to ensure that you're not using any deprecated or removed color variables.

### Patch Changes

- [#1512](https://github.com/primer/react/pull/1512) [`1e5ac406`](https://github.com/primer/react/commit/1e5ac406f8558a20248157a9bfe13ee4709890c8) Thanks [@pksjce](https://github.com/pksjce)! - Change disabled color from muted to custom primer disabled color

## 30.3.0

### Minor Changes

- [#1490](https://github.com/primer/react/pull/1490) [`c156b07a`](https://github.com/primer/react/commit/c156b07ab6f2f5ad6d35d1c4f89d8a7f37ad1cef) Thanks [@mperrotti](https://github.com/mperrotti)! - Adds `Autocomplete`, `AutocompleteMenu`, `AutocompleteInput`, and `AutocompleteOverlay` components

* [#1489](https://github.com/primer/react/pull/1489) [`273ef29d`](https://github.com/primer/react/commit/273ef29d1d8f28bb856faba4da803e7ad0892c6e) Thanks [@mperrotti](https://github.com/mperrotti)! - Add alpha `TextInputWithTokens` component

- [#1488](https://github.com/primer/react/pull/1488) [`05ac5aab`](https://github.com/primer/react/commit/05ac5aabb6bf39150557732605f9ce0fb3b9d1ec) Thanks [@mperrotti](https://github.com/mperrotti)! - Add alpha `Token`, `AvatarToken`, `IssueLabelToken` components

## 30.2.1

### Patch Changes

- [#1500](https://github.com/primer/react/pull/1500) [`8c3531aa`](https://github.com/primer/react/commit/8c3531aa73c37770f961cbcfd94acbf1398f29bd) Thanks [@jfuchs](https://github.com/jfuchs)! - Fixed a bug where SelectPanel would not scroll with height:'auto'; maxHeight:'medium' passed to Overlay (https://github.com/github/primer/issues/333)

## 30.2.0

### Minor Changes

- [#1497](https://github.com/primer/react/pull/1497) [`b9d6a662`](https://github.com/primer/react/commit/b9d6a662390a66298a4b2171319029812f5ea88d) Thanks [@jfuchs](https://github.com/jfuchs)! - Updated ActionList's ItemInput type to accept DOM props for divs when renderItem is not provided

## 30.1.0

### Minor Changes

- [#1463](https://github.com/primer/react/pull/1463) [`bde3a034`](https://github.com/primer/react/commit/bde3a0344c713f15f5650b35195258901582bd41) Thanks [@jfuchs](https://github.com/jfuchs)! - `ActionList.item` accepts an `as` prop, allowing it to be a link, or (in combination with the renderItem prop) a Next.js or React Router link

### Patch Changes

- [#1471](https://github.com/primer/react/pull/1471) [`f1cebb7e`](https://github.com/primer/react/commit/f1cebb7e9af297a7c466701454aac6dc1eb7b3a4) Thanks [@smockle](https://github.com/smockle)! - Change the button which receives focus when a 'ConfirmationDialog' opens from the secondary (e.g. 'Cancel') to the primary (e.g. 'OK'). Fixes github/primer#313.

## 30.0.0

### Major Changes

- [#1448](https://github.com/primer/react/pull/1448) [`1a39fb02`](https://github.com/primer/react/commit/1a39fb0284c5e19324d378629d09a343be4cde05) Thanks [@SferaDev](https://github.com/SferaDev)! - Remove `.Breadcrumb` classname from the root element of the `Breadcrumbs` component. This change shouldn't break anything unless you have styles, scripts, or tests that reference the `.Breadcrumb` classname.

* [#1468](https://github.com/primer/react/pull/1468) [`dc15763c`](https://github.com/primer/react/commit/dc15763c733994ea9baa3475139b9bf3c2111e5b) Thanks [@jfuchs](https://github.com/jfuchs)! - AvatarStack no longer accepts styled props or DOM props

### Minor Changes

- [#1474](https://github.com/primer/react/pull/1474) [`c54156bc`](https://github.com/primer/react/commit/c54156bc43f87370f3e8cb23fd9ebf338b5082e4) Thanks [@colebemis](https://github.com/colebemis)! - Add `light_protanopia` and `dark_protanopia` color blind color schemes

### Patch Changes

- [#1448](https://github.com/primer/react/pull/1448) [`1a39fb02`](https://github.com/primer/react/commit/1a39fb0284c5e19324d378629d09a343be4cde05) Thanks [@SferaDev](https://github.com/SferaDev)! - Rename `Breadcrumb` component to `Breadcrumbs`

* [#1470](https://github.com/primer/react/pull/1470) [`f2e29a08`](https://github.com/primer/react/commit/f2e29a08e2aab9e98a460eb073229933f6ae050b) Thanks [@pksjce](https://github.com/pksjce)! - Fix ActionList.Item color

## 29.1.1

### Patch Changes

- [#1441](https://github.com/primer/react/pull/1441) [`f3f5afb9`](https://github.com/primer/react/commit/f3f5afb9cf91e0ce3ea287351c871eb1559f1fa4) Thanks [@jfuchs](https://github.com/jfuchs)! - Fix type error where `css` is a required prop of some components by excluding storybook stories from TypeScript compilation for builds

* [#1446](https://github.com/primer/react/pull/1446) [`b4e5287c`](https://github.com/primer/react/commit/b4e5287cf1ec75a27e4b78b17425952e85f82f47) Thanks [@colebemis](https://github.com/colebemis)! - Fix filter input spacing in SelectPanel

## 29.1.0

### Minor Changes

- [#1412](https://github.com/primer/react/pull/1412) [`627cd3e9`](https://github.com/primer/react/commit/627cd3e95614ab4347e5acf456dd23588196ec87) Thanks [@colebemis](https://github.com/colebemis)! - Add `dark_high_contrast` color scheme

* [#1412](https://github.com/primer/react/pull/1412) [`627cd3e9`](https://github.com/primer/react/commit/627cd3e95614ab4347e5acf456dd23588196ec87) Thanks [@colebemis](https://github.com/colebemis)! - Add new [functional color variables](https://primer.style/primitives/colors) to the theme object.

  **Tip:** Install [`eslint-plugin-primer-react`](https://primer.style/react/linting) to ensure that you're not using any deprecated color variables.

## 29.0.0

### Major Changes

- [#1414](https://github.com/primer/react/pull/1414) [`f4e1de6d`](https://github.com/primer/react/commit/f4e1de6dbe9d20dfcf2144d879294d189433a810) Thanks [@jfuchs](https://github.com/jfuchs)! - Removed system props support from `<TextInput>` and fixed its type definition.

### Minor Changes

- [#1409](https://github.com/primer/react/pull/1409) [`90b17dd6`](https://github.com/primer/react/commit/90b17dd6447419ce1d661e5399b7ac193836ad1a) Thanks [@jfuchs](https://github.com/jfuchs)! - Use @react-aria/ssr for isomorphic ID generation.

### Patch Changes

- [#1424](https://github.com/primer/react/pull/1424) [`7cf8d8b8`](https://github.com/primer/react/commit/7cf8d8b82a6387b1143c06e090cde8f87b4f3a33) Thanks [@jfuchs](https://github.com/jfuchs)! - Removed irregular styling on Timeline

* [#1403](https://github.com/primer/react/pull/1403) [`65cab2cc`](https://github.com/primer/react/commit/65cab2ccd5eae3dcc5d75cbd1a1fd78a6f78abf7) Thanks [@mathiasbosman](https://github.com/mathiasbosman)! - Fix the Timeline.Item layout

## 28.5.0

### Minor Changes

- [#1398](https://github.com/primer/react/pull/1398) [`e4dac575`](https://github.com/primer/react/commit/e4dac575420c05e5e7528fd004c85c54f1b9a450) Thanks [@jfuchs](https://github.com/jfuchs)! - Default portal containers created by primer are absolutely positioned at 0,0

* [#1385](https://github.com/primer/react/pull/1385) [`5470b61b`](https://github.com/primer/react/commit/5470b61b448aeb29e859766ca0ff7f9f8457c690) Thanks [@jfuchs](https://github.com/jfuchs)! - Make top and left position explicit props of Overlay handled separately from other styles

- [#1388](https://github.com/primer/react/pull/1388) [`83b888f0`](https://github.com/primer/react/commit/83b888f0b325f9370ede9c5d7ac8f70702d6e8ea) Thanks [@jfuchs](https://github.com/jfuchs)! - Overlay takes a portalContainerName prop. This allows overlays with an anchor inside a scrolling container to track with their anchor, so long as the specified portal is also inside that scrolling container.

## 28.4.0

### Minor Changes

- [#1381](https://github.com/primer/react/pull/1381) [`b31f0853`](https://github.com/primer/react/commit/b31f08533e9fd41ebc5dc0e109d09facd975287c) Thanks [@jfuchs](https://github.com/jfuchs)! - AnchoredOverlay positions are set directly on style property

### Patch Changes

- [#1372](https://github.com/primer/react/pull/1372) [`23be0ed7`](https://github.com/primer/react/commit/23be0ed7aeff3cc21a678769eb5ba0ddf9a8d155) Thanks [@jfuchs](https://github.com/jfuchs)! - Extends DropdownMenu to allow anchorRef, open, and onOpenChange props.

* [#1386](https://github.com/primer/react/pull/1386) [`2ea30b43`](https://github.com/primer/react/commit/2ea30b43854a1dcf5e1c64c696a57d6e1c651bdf) Thanks [@colebemis](https://github.com/colebemis)! - Bump @primer/primitives dependency to 4.6.4

- [#1387](https://github.com/primer/react/pull/1387) [`6b4d52da`](https://github.com/primer/react/commit/6b4d52dacbed2e4452e780c01fc9e69d9f9511ee) Thanks [@jfuchs](https://github.com/jfuchs)! - Guard against MediaQueryList.addEventListener calls where unavailable and possibly fall back to .addListener

## 28.3.2

### Patch Changes

- [#1368](https://github.com/primer/react/pull/1368) [`36f156a0`](https://github.com/primer/react/commit/36f156a0e42e242489dc1046ea8592b049a88bd7) Thanks [@dgreif](https://github.com/dgreif)! - Allow `anchorRef` to be passed into `SelectPanel` if you want to use an external anchor

## 28.3.1

### Patch Changes

- [#1355](https://github.com/primer/react/pull/1355) [`3cc7be77`](https://github.com/primer/react/commit/3cc7be77d766b9161808898a0d2cc8373aee5a21) Thanks [@colebemis](https://github.com/colebemis)! - Replace octoface icon with spinner in SelectMenu component

## 28.3.0

### Minor Changes

- [#1315](https://github.com/primer/react/pull/1315) [`85d0202b`](https://github.com/primer/react/commit/85d0202b0edd553bcbb50f9b280caf13ce79dae3) Thanks [@VanAnderson](https://github.com/VanAnderson)! - `Box` now accepts all [styled system props](https://styled-system.com/table/).

* [#1316](https://github.com/primer/react/pull/1316) [`4c063317`](https://github.com/primer/react/commit/4c0633171170205c53ef7dc29e5d4104a8486059) Thanks [@VanAnderson](https://github.com/VanAnderson)! - The following components have been deprecated in favor of the `Box` component:

  | Component   | Replacement                                                                                 |
  | ----------- | ------------------------------------------------------------------------------------------- |
  | `Flex`      | `<Box display="flex">`                                                                      |
  | `Grid`      | `<Box display="grid">`                                                                      |
  | `Position`  | `<Box>`                                                                                     |
  | `Absolute`  | `<Box position="absolute">`                                                                 |
  | `Fixed`     | `<Box position="fixed">`                                                                    |
  | `Relative`  | `<Box position="relative">`                                                                 |
  | `Sticky`    | `<Box position="sticky">`                                                                   |
  | `BorderBox` | `<Box borderWidth="1px" borderStyle="solid" borderColor="border.primary" borderRadius={2}>` |

  There is a codemod available to upgrade these components:

  - TypeScript example:

    ```shell
    npx jscodeshift -t node_modules/@primer/react/codemods/deprecateUtilityComponents.js
    --parser=tsx path/to/workspace/src/*.tsx
    ```

  - Babel example:

    ```shell
    npx jscodeshift -t node_modules/@primer/react/codemods/deprecateUtilityComponents.js
    --parser=babel path/to/workspace/src/*.tsx
    ```

- [#1336](https://github.com/primer/react/pull/1336) [`489a718b`](https://github.com/primer/react/commit/489a718b6b6d2892906bc2709e243195bf5fd91e) Thanks [@VanAnderson](https://github.com/VanAnderson)! - System props are deprecated in all components except `Box`. Move all system props into the [`sx` prop](https://primer.style/components/overriding-styles) instead. Example:

  ```diff
  - <Button mr={2}>...</Button>
  + <Button sx={{mr: 2}}>...</Button>
  ```

  There is a codemod available to migrate from system props to the `sx` prop:

  - TypeScript example:

    ```shell
    npx jscodeshift -t node_modules/@primer/react/codemods/removeSystemProps.js
    --parser=tsx path/to/workspace/src/*.tsx
    ```

  - Babel example:

    ```shell
    npx jscodeshift -t node_modules/@primer/react/codemods/removeSystemProps.js
    --parser=babel path/to/workspace/src/*.tsx
    ```

### Patch Changes

- [#1332](https://github.com/primer/react/pull/1332) [`ec11d7b8`](https://github.com/primer/react/commit/ec11d7b8a589742a41134d31f419b6b5d34ad026) Thanks [@mattcosta7](https://github.com/mattcosta7)! - Side effects are properly declared in package.json

* [#1308](https://github.com/primer/react/pull/1308) [`a8f3ca6d`](https://github.com/primer/react/commit/a8f3ca6dbff5c2619e067ad5118fcb784f8525bc) Thanks [@dgreif](https://github.com/dgreif)! - Focus zones will now update active-descendant on `mousemove` over focusable elements. ActionList has been updated to handle direct (key press) vs indirect (`mousemove`, DOM change, etc.) changes to active-descendant, and will use a distinct background color for the directly activated items.

## 28.2.5

### Patch Changes

- [#1311](https://github.com/primer/react/pull/1311) [`6f0535df`](https://github.com/primer/react/commit/6f0535dfcf5c640da2322c68654cb369d8eafea0) Thanks [@lukewar](https://github.com/lukewar)! - Expose 'textInputProps' from the 'SelectPanel'

* [#1309](https://github.com/primer/react/pull/1309) [`dc17a49e`](https://github.com/primer/react/commit/dc17a49e6a8f2f71e689f4666bcf0384111deb36) Thanks [@colebemis](https://github.com/colebemis)! - Include all shadow variables in theme object

- [#1251](https://github.com/primer/react/pull/1251) [`528e9a41`](https://github.com/primer/react/commit/528e9a411eac6730e05ce39d22ba8982283b71a5) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Call `useOnOutsideClick` handlers in reverse order that they are registered, and allow propagation to stop if default is prevented or an non-outside click is detected.

* [#1312](https://github.com/primer/react/pull/1312) [`76a38432`](https://github.com/primer/react/commit/76a384328fc57b0cf9d3d92170de5ce071334121) Thanks [@smockle](https://github.com/smockle)! - Ensure clicking an `AnchoredOverlay`’s trigger allows it to close without immediately reopening.

## 28.2.4

### Patch Changes

- [#1293](https://github.com/primer/react/pull/1293) [`1148a718`](https://github.com/primer/react/commit/1148a718aa1db92fb90d15efc150aa4c0c2ef018) Thanks [@smockle](https://github.com/smockle)! - Restore "fix: Don’t focus first 'Item' of 'DropdownMenu' and 'SelectMenu' on open" by deferring the removal of a temporary `tabIndex` until focus moves within the container.

* [#1279](https://github.com/primer/react/pull/1279) [`bb38754f`](https://github.com/primer/react/commit/bb38754f9f5c9f1d2d6cfa03f2bf9984fbd3c82d) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Update overlay shadows

- [#1297](https://github.com/primer/react/pull/1297) [`5fb3683d`](https://github.com/primer/react/commit/5fb3683df6cc116975c729e83ce3c14b87ffaea1) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Bump @primer/primitives to 4.4.0

* [#1288](https://github.com/primer/react/pull/1288) [`15207119`](https://github.com/primer/react/commit/15207119d25a3d6b0b13294bb99dc4efd780a788) Thanks [@dgreif](https://github.com/dgreif)! - Focus zones with an `activeDescendantControl` will now activate the first descendant as soon as the control element is focused, rather than waiting for an up/down arrow press. Descendants stay active until the control element is blurred. This is a breaking change to `useFocusZone`, but this behavior is still considered to be in `alpha`.

- [#1292](https://github.com/primer/react/pull/1292) [`4b643818`](https://github.com/primer/react/commit/4b64381872eac9df00c53186782a370b0d6da638) Thanks [@dgreif](https://github.com/dgreif)! - Bump dependencies

* [#1279](https://github.com/primer/react/pull/1279) [`bb38754f`](https://github.com/primer/react/commit/bb38754f9f5c9f1d2d6cfa03f2bf9984fbd3c82d) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Update TextInput border color

## 28.2.3

### Patch Changes

- [`0ffc381c`](https://github.com/primer/react/commit/0ffc381c833219959ed3b99a9dd64fe56ac51036) [#1294](https://github.com/primer/react/pull/1294) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Revert first item focus fix for ActionList components.

## 28.2.2

### Patch Changes

- [`68877076`](https://github.com/primer/react/commit/68877076fcbbc1c4cd308f2e6f8f44290751efe4) [#1275](https://github.com/primer/react/pull/1275) Thanks [@VanAnderson](https://github.com/VanAnderson)! - data props can be used in overlayProps.

* [`2793ef48`](https://github.com/primer/react/commit/2793ef48d554e307e46442fcc198ed4adf8c137f) [#1286](https://github.com/primer/react/pull/1286) Thanks [@colebemis](https://github.com/colebemis)! - `ThemeProvider` now uses the first defined color scheme if passed an invalid color scheme name

- [`321b9a3d`](https://github.com/primer/react/commit/321b9a3d9e0ddf6755bd7299ea6cd42a52f427a9) [#1266](https://github.com/primer/react/pull/1266) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Anchored overlay can take an external anchorRef.

## 28.2.1

### Patch Changes

- [`f793ed00`](https://github.com/primer/react/commit/f793ed00e244de861f373cf0882397a1f640b046) [#1280](https://github.com/primer/react/pull/1280) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Export TexContainer from of ActionList/Item.

* [`2893326b`](https://github.com/primer/react/commit/2893326bc45fd841cd71ac46ca71cdaececa7343) [#1259](https://github.com/primer/react/pull/1259) Thanks [@smockle](https://github.com/smockle)! - Hide intra-'Item' dividers on ':hover' and ':focus'

## 28.2.0

### Minor Changes

- [`8368a83e`](https://github.com/primer/react/commit/8368a83efbc89aa73f9c775c25da62e34960c95c) [#1238](https://github.com/primer/react/pull/1238) Thanks [@dgreif](https://github.com/dgreif)! - New sizes for Overlay and Dialog. Sizes have been changed from abbreviations to full words. `xs` -> `xsmall`, `sm` -> `small`, `md` -> `medium`, `lg` -> `large`, `xl` -> `xlarge`. The sizing for `Overlay` has also been updated to provide a wider range of options. The original values for Overlay were based on the needs of Dialog, but Dialog is not reliant on Overlay so they don't need to have similar sizing. This is technically a breaking change, but is being released as a minor because these components are both still in `alpha` status.

### Patch Changes

- [`a7fe32c8`](https://github.com/primer/react/commit/a7fe32c8ba42ad75a945185b5f358f274a21ef0e) [#1248](https://github.com/primer/react/pull/1248) Thanks [@dgreif](https://github.com/dgreif)! - Hide overflow from `Overlay`

* [`02e86095`](https://github.com/primer/react/commit/02e86095e6775f42c150c362e5281f0ffc332212) Thanks [@dgreif](https://github.com/dgreif)! - Allow `filterValue` to be provided to `SelectPanel`

- [`10df320b`](https://github.com/primer/react/commit/10df320bb4d2a3d7ad7e59722c0b8896eeef0357) [#1247](https://github.com/primer/react/pull/1247) Thanks [@dgreif](https://github.com/dgreif)! - Handle overflow and active-descendant scrolling within `SelectPanel`

* [`25d88c49`](https://github.com/primer/react/commit/25d88c49709f1c91c1a596fc77ed05e66cae083f) [#1253](https://github.com/primer/react/pull/1253) Thanks [@dgreif](https://github.com/dgreif)! - Correct font size and truncate for description within ActionList Items

- [`9cb715cd`](https://github.com/primer/react/commit/9cb715cd2a613a0cedae60e488d4f69449465a38) [#1258](https://github.com/primer/react/pull/1258) Thanks [@dgreif](https://github.com/dgreif)! - prevent focusTrap from causing a `blur` if trap container is not in DOM

* [`aa7d80fc`](https://github.com/primer/react/commit/aa7d80fcb70b5e7936eae13fd073f7c2163df7ec) [#1246](https://github.com/primer/react/pull/1246) Thanks [@dgreif](https://github.com/dgreif)! - Fix border radius on buttons and title `font-weight` in ConfirmationDialog

## 28.1.1

### Patch Changes

- [`ff177c88`](https://github.com/primer/react/commit/ff177c88200f2ebb8c27a8e41aeb869a8eddf95b) [#1242](https://github.com/primer/react/pull/1242) Thanks [@dgreif](https://github.com/dgreif)! - Use `Item` `index` as fallback key within `List` groups

* [`fb2fa6c2`](https://github.com/primer/react/commit/fb2fa6c2f40be51f4f7201b93e004bb7d2257110) [#1244](https://github.com/primer/react/pull/1244) Thanks [@dgreif](https://github.com/dgreif)! - Allow focus to move to an input outside an overlay on mousedown

- [`1519742f`](https://github.com/primer/react/commit/1519742fcffcad9d14c972bc8c1fdd8e575c956e) [#1243](https://github.com/primer/react/pull/1243) Thanks [@dgreif](https://github.com/dgreif)! - Use `active-descendant` to control focus in `SelectPanel`

* [`c1991318`](https://github.com/primer/react/commit/c1991318aa7ee5d021f458db26cd2597279cc4ba) [#1158](https://github.com/primer/react/pull/1158) Thanks [@dgreif](https://github.com/dgreif)! - Add background styles for focused action list items, instead of using default `outline`

## 28.1.0

### Minor Changes

- [`6800c609`](https://github.com/primer/react/commit/6800c609634d8227c6538a49bca3ef59d8b660a1) [#1232](https://github.com/primer/react/pull/1232) Thanks [@dgreif](https://github.com/dgreif)! - New `Spinner` Component

### Patch Changes

- [`909ada5c`](https://github.com/primer/react/commit/909ada5c47c597f0260563c5030df0613051f618) [#1224](https://github.com/primer/react/pull/1224) Thanks [@dgreif](https://github.com/dgreif)! - Add `SelectPanel` alpha component

* [`0d26d2b0`](https://github.com/primer/react/commit/0d26d2b07d8ed242eec71fd05959d8cdd0e6f0ba) [#1240](https://github.com/primer/react/pull/1240) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Fix check Spacing on selected items for ActionList components.

- [`e009e321`](https://github.com/primer/react/commit/e009e321bf6c456ca6584650cd5f3ea35fe36003) [#1235](https://github.com/primer/react/pull/1235) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Dialog properly auto-focuses cancel button by default when originating from a FocusZone/FocusTrap.

## 28.0.4

### Patch Changes

- [`e1bde42b`](https://github.com/primer/react/commit/e1bde42b7a11d9f642132601a5c776a988926747) [#1228](https://github.com/primer/react/pull/1228) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Action Menu correctly fires onAction callback after close.

* [`961c07eb`](https://github.com/primer/react/commit/961c07ebc7cbf483029d5326bb8e56c78777028d) [#1227](https://github.com/primer/react/pull/1227) Thanks [@stephenotalora](https://github.com/stephenotalora)! - Change focus state style of `SideNav.Link`

- [`84c7e771`](https://github.com/primer/react/commit/84c7e771f8ac9bb707fbb977658e9e40620bc20c) [#1225](https://github.com/primer/react/pull/1225) Thanks [@dgreif](https://github.com/dgreif)! - handle complex child reordering within a focusZone

## 28.0.3

### Patch Changes

- [`c63fa4b5`](https://github.com/primer/react/commit/c63fa4b59bf5fa3e6f985b1d81b040efc8bc896c) [#1215](https://github.com/primer/react/pull/1215) Thanks [@dgreif](https://github.com/dgreif)! - Hide divider before `ActionList.Group`s with filled header

* [`a9260812`](https://github.com/primer/react/commit/a9260812ebaaa07747eb7cca40c6ff1c12892c49) [#1221](https://github.com/primer/react/pull/1221) Thanks [@dgreif](https://github.com/dgreif)! - Improved performance for lists in `ActionMenu` and `DropdownMenu`

- [`c63fa4b5`](https://github.com/primer/react/commit/c63fa4b59bf5fa3e6f985b1d81b040efc8bc896c) [#1215](https://github.com/primer/react/pull/1215) Thanks [@dgreif](https://github.com/dgreif)! - Align `Item` description to when rendered in-line

* [`c63fa4b5`](https://github.com/primer/react/commit/c63fa4b59bf5fa3e6f985b1d81b040efc8bc896c) [#1215](https://github.com/primer/react/pull/1215) Thanks [@dgreif](https://github.com/dgreif)! - Allow `focusZoneSettings` to be passed into `AnchoredOverlay`

- [`c63fa4b5`](https://github.com/primer/react/commit/c63fa4b59bf5fa3e6f985b1d81b040efc8bc896c) [#1215](https://github.com/primer/react/pull/1215) Thanks [@dgreif](https://github.com/dgreif)! - Add `selectionVariant: 'multiple'` for `Item`s. These will use a checkbox input instead of a checkmark icon for selected state

* [`d78af591`](https://github.com/primer/react/commit/d78af591971984a3a2d2707904eb235701d1c749) [#1214](https://github.com/primer/react/pull/1214) Thanks [@VanAnderson](https://github.com/VanAnderson)! - renderMenuItem in ActionMenu checks preventDefault for conditionally calling onClose

- [`4ab3d175`](https://github.com/primer/react/commit/4ab3d1752d14969fff222a4cf7fb2dcc1110d0fb) [#1222](https://github.com/primer/react/pull/1222) Thanks [@dgreif](https://github.com/dgreif)! - Trap focus in `AnchoredOverlay` as soon as it opens, regardless of the event that triggered it to open

* [`ff9ce6f1`](https://github.com/primer/react/commit/ff9ce6f108e29ac061b23e3338cb03e2f168f701) [#1217](https://github.com/primer/react/pull/1217) Thanks [@VanAnderson](https://github.com/VanAnderson)! - overlayProps passthrough from ActionMenu and DropdownMenu to AnchoredOverlay.

## 28.0.2

### Patch Changes

- [`d20a5996`](https://github.com/primer/react/commit/d20a5996aafdbc6446f13aaa7a489394926f083a) [#1209](https://github.com/primer/react/pull/1209) Thanks [@dgreif](https://github.com/dgreif)! - Allow Overlay height and width to be set through AnchoredOverlay
  Allow ActionList Items to supply an `id` instead of `key`
  Performance improvements when ActionList is not given any groups
  Enable focus zone as soon as AnchoredOverlay opens

* [`d29741ca`](https://github.com/primer/react/commit/d29741cab4bfa4249000e5b2479e99f5aeea3189) [#1196](https://github.com/primer/react/pull/1196) Thanks [@dgreif](https://github.com/dgreif)! - Allow custom `children` in `ActionItem`. `text` and `description` can still be provided as a shortcut, but `children` is now available if you need more control over the rending of the item, without sacrificing benefits from `Item` by using `renderItem`.

- [`4c2e1a2b`](https://github.com/primer/react/commit/4c2e1a2b449d3f762c530f70a5056e581404d3d8) [#1195](https://github.com/primer/react/pull/1195) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Export useConfirm hook and ConfirmationDialog component from index.

* [`3c13d039`](https://github.com/primer/react/commit/3c13d039466370a70ed1e0bf8c3af0860fe26702) [#1201](https://github.com/primer/react/pull/1201) Thanks [@T-Hugs](https://github.com/T-Hugs)! - Fix overlay position when using an AnchoredOverlay

- [`c9b4db79`](https://github.com/primer/react/commit/c9b4db79ec2b4360f23f42d3ab49f265a56e9447) [#1199](https://github.com/primer/react/pull/1199) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Action Menu can have its open state be controlled externally.

* [`3e759e59`](https://github.com/primer/react/commit/3e759e59b5af115e82cca2253c0caca9e400be24) [#1211](https://github.com/primer/react/pull/1211) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use preventDefault on AnchoredOverlay instead of stopPropagation.

- [`84e3c570`](https://github.com/primer/react/commit/84e3c5706fa313eab5605f551256c0dc34a8626d) [#1194](https://github.com/primer/react/pull/1194) Thanks [@dgreif](https://github.com/dgreif)! - Handle `onAction` for `DropdownMenu` Items

* [`7aeb53fe`](https://github.com/primer/react/commit/7aeb53fec23a80414f6c1db8b31c06beb2073dd2) [#1200](https://github.com/primer/react/pull/1200) Thanks [@dgreif](https://github.com/dgreif)! - Perform ActionMenu actions after overlay has closed. This allows the action to move focus if so desired, without the ActionMenu focus trap preventing focus from moving away.

- [`bba66fdd`](https://github.com/primer/react/commit/bba66fddb51be251456711e21e725b1034bae806) [#1206](https://github.com/primer/react/pull/1206) Thanks [@VanAnderson](https://github.com/VanAnderson)! - stopPropagation for mousedown and click in AnchoredOverlay based components

## 28.0.1

### Patch Changes

- [`b319ce43`](https://github.com/primer/react/commit/b319ce4396b11c185faee23f0884632806922303) [#1197](https://github.com/primer/react/pull/1197) Thanks [@dmarcey](https://github.com/dmarcey)! - Typescript declare files will now be published to the lib-esm directory, as well as lib

* [`17957f29`](https://github.com/primer/react/commit/17957f293542d6cbf5f8005698bb352f95d5c8f7) [#1192](https://github.com/primer/react/pull/1192) Thanks [@dgreif](https://github.com/dgreif)! - Add basic docs for `AnchoredOverlay`

## 28.0.0

### Major Changes

- [`5f85394d`](https://github.com/primer/react/commit/5f85394dc16f076080824d8fdb3bda06d01e29da) [#1157](https://github.com/primer/react/pull/1157) Thanks [@dgreif](https://github.com/dgreif)! - Removed `useMouseIntent` in favor of [`:focus-visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible). With the removal of `useMouseIntent`, the `intent-mouse` class will no longer be added to the `<body>`. Since `:focus-visible` is a relatively new psuedo-class, a polyfill is included. Any focused elements that meet the criteria for `:focus-visible` will also have a `focus-visible` class added to them by the polyfill.

### Patch Changes

- [`f7857a06`](https://github.com/primer/react/commit/f7857a06031df339fa61d27f8ca717e4df95d5e5) [#1159](https://github.com/primer/react/pull/1159) Thanks [@hehex9](https://github.com/hehex9)! - Removed unused dependencies

## 27.0.0

### Major Changes

- [`db478205`](https://github.com/primer/react/commit/db478205bf467a118394e0519034bb87116dc85a) [#1147](https://github.com/primer/react/pull/1147) Thanks [@colebemis](https://github.com/colebemis)! - Type definitions are now being generated by TypeScript instead of manually maintained. These new type definitions may differ from the previous type definitions and cause breaking changes. If you experience any new TypeScript errors, feel free to create an [issue](https://github.com/primer/react/issues) or reach out in Slack (#design-systems).

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
    import {BoxProps} from '@primer/react'

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

- [`016a273f`](https://github.com/primer/react/commit/016a273fde30f0185e23309e1a39c1bc034174f8) [#1115](https://github.com/primer/react/pull/1115) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Removes deprecated presentational theme variables in favor of _functional variables_ for styling components that are consistent across multiple themes.

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

- [`8799f74a`](https://github.com/primer/react/commit/8799f74ad69911e9840d51a65d08237f3cb1f172) [#1112](https://github.com/primer/react/pull/1112) Thanks [@colebemis](https://github.com/colebemis)! - Primer React now supports color modes! 🎉

  See the new [Theming](https://primer.style/components/theming) documentation for more details.

  #### Breaking changes

  - You'll need to replace the `ThemeProvider` from `styled-components` with the new Primer React `ThemeProvider`:

  ```diff
  - import {ThemeProvider} from 'styled-components'
  - import {theme} from '@primer/react
  + import {ThemeProvider} from '@primer/react'

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
  - import {theme} from '@primer/react'
  + import {useTheme} from '@primer/react'

  function Example() {
  + const {theme} = useTheme()
    const myColor = theme.colors.text.primary
    ...
  }
  ```

### Patch Changes

- [`360e3595`](https://github.com/primer/react/commit/360e3595a6e133e8caf391e7355f25b856936b12) [#1111](https://github.com/primer/react/pull/1111) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Update color variable used in ProgressBar (`state.success` → `bg.successInverse`)

* [`1b3d87d2`](https://github.com/primer/react/commit/1b3d87d27103b99dd02cbf61f88d93b7df80d5b1) [#1127](https://github.com/primer/react/pull/1127) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Bump @primer/primitives from 0.0.0-20211167520 to 0.0.0-20212178221

## 24.0.0

### Major Changes

- [`b9d9d245`](https://github.com/primer/react/commit/b9d9d2450c3f726fa0e6bc8cb43ba678df0c60ad) [#1068](https://github.com/primer/react/pull/1068) Thanks [@colebemis](https://github.com/colebemis)! - Remove propTypes in favor of TypeScript types

* [`beef075e`](https://github.com/primer/react/commit/beef075e0274396b77887adf0b912583fe564b3f) [#1094](https://github.com/primer/react/pull/1094) Thanks [@colebemis](https://github.com/colebemis)! - Components no longer have a default `theme` prop. To ensure components still render correctly, you'll need pass the Primer theme to a [styled-components](https://styled-components.com/) `<ThemeProvider>` at the root of your application:

  ```jsx
  import {ThemeProvider} from 'styled-components'
  import {theme} from '@primer/react'

  function App(props) {
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

- [`397f3360`](https://github.com/primer/react/commit/397f3360f1e6486ae475394b5b4cef968a0cdb21) [#1106](https://github.com/primer/react/pull/1106) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in Pagination

* [`fa106ea9`](https://github.com/primer/react/commit/fa106ea9a43a8451efb648d1e3ec9df87577379c) [#1090](https://github.com/primer/react/pull/1090) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in BaseStyles

- [`fa106ea9`](https://github.com/primer/react/commit/fa106ea9a43a8451efb648d1e3ec9df87577379c) [#1090](https://github.com/primer/react/pull/1090) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in BranchName

* [`e93cf268`](https://github.com/primer/react/commit/e93cf268b9b8b25fee535dc4aa7d31c0b015d420) [#1092](https://github.com/primer/react/pull/1092) Thanks [@bscofield](https://github.com/bscofield)! - Use functional color variables in Caret, CircleBadge, Pagehead, ProgressBar, and Popover

- [`5a042778`](https://github.com/primer/react/commit/5a04277861a78d567b812e7b83c2977c61402247) [#1099](https://github.com/primer/react/pull/1099) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in FilterList

* [`a886bbcf`](https://github.com/primer/react/commit/a886bbcf765659a4742245d37c9f8d1327daca7a) [#1098](https://github.com/primer/react/pull/1098) Thanks [@bscofield](https://github.com/bscofield)! - Update SelectMenu and child components to use functional color variables

- [`f2c57794`](https://github.com/primer/react/commit/f2c57794dc8163eda974d37a4fbb939b631c82cc) [#1085](https://github.com/primer/react/pull/1085) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in SideNav

* [`756191e7`](https://github.com/primer/react/commit/756191e7d20ea46c83a591fd2cf7b2ab9c3ed0fc) [#1100](https://github.com/primer/react/pull/1100) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in ButtonOutline

- [`6b2dc95f`](https://github.com/primer/react/commit/6b2dc95f2b3e250e130ff7e36d18eda3cda94b4a) [#1085](https://github.com/primer/react/pull/1085) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in TabNav

* [`51d180ac`](https://github.com/primer/react/commit/51d180ace3562569910a80557904f138677b3262) [#1089](https://github.com/primer/react/pull/1089) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in Timeline

- [`51d180ac`](https://github.com/primer/react/commit/51d180ace3562569910a80557904f138677b3262) [#1089](https://github.com/primer/react/pull/1089) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in TextInput

* [`8f2b4d2e`](https://github.com/primer/react/commit/8f2b4d2e434d1af2eb6d5d3c7f566fae147033ee) [#1100](https://github.com/primer/react/pull/1100) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in ButtonPrimary

- [`51d180ac`](https://github.com/primer/react/commit/51d180ace3562569910a80557904f138677b3262) [#1089](https://github.com/primer/react/pull/1089) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in Link

* [`fa106ea9`](https://github.com/primer/react/commit/fa106ea9a43a8451efb648d1e3ec9df87577379c) [#1090](https://github.com/primer/react/pull/1090) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in BorderBox

- [`51d180ac`](https://github.com/primer/react/commit/51d180ace3562569910a80557904f138677b3262) [#1089](https://github.com/primer/react/pull/1089) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in Tooltip

* [`1fb750af`](https://github.com/primer/react/commit/1fb750afc9083466eadad76b3387967d466d336a) [#1097](https://github.com/primer/react/pull/1097) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in ButtonTableList

- [`ea21d8eb`](https://github.com/primer/react/commit/ea21d8eb99f710727b31d2c0f8ddc1d5f59d61cf) [#1102](https://github.com/primer/react/pull/1102) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in Flash

* [`51d180ac`](https://github.com/primer/react/commit/51d180ace3562569910a80557904f138677b3262) [#1089](https://github.com/primer/react/pull/1089) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in UnderlineNav

- [`44aa68e2`](https://github.com/primer/react/commit/44aa68e2e725bdb2a3be349d7bec3e18b3f17809) [#1101](https://github.com/primer/react/pull/1101) Thanks [@emplums](https://github.com/emplums)! - Forwards aria-label to correct component

* [`d0f38c3d`](https://github.com/primer/react/commit/d0f38c3d7bbcc7d57a8d459d8c61862102f89b1e) [#1102](https://github.com/primer/react/pull/1102) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in Header

- [`5df7723a`](https://github.com/primer/react/commit/5df7723afabe0d3bdd29e3eab8622586b3ab072a) [#1099](https://github.com/primer/react/pull/1099) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in DropdownStyles

* [`170876e6`](https://github.com/primer/react/commit/170876e6546a435faf7e0401d6fc8060a64b199d) [#1097](https://github.com/primer/react/pull/1097) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in Button

- [`c44ee363`](https://github.com/primer/react/commit/c44ee363e9d663b873ea721e42dac8e5366ebcd1) [#1085](https://github.com/primer/react/pull/1085) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in SubNav

* [`198e24ad`](https://github.com/primer/react/commit/198e24adef084b115441c72b80d3113f411a5fa5) [#1100](https://github.com/primer/react/pull/1100) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in ButtonDanger

- [`39371d98`](https://github.com/primer/react/commit/39371d98be5c7fa1bf2be5542a90d752bc330e2b) [#1099](https://github.com/primer/react/pull/1099) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in CounterLabel

* [`92597504`](https://github.com/primer/react/commit/9259750429913d7977746c55da5a397d591a4f45) [#1100](https://github.com/primer/react/pull/1100) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in ButtonClose

- [`fa106ea9`](https://github.com/primer/react/commit/fa106ea9a43a8451efb648d1e3ec9df87577379c) [#1090](https://github.com/primer/react/pull/1090) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in AvatarPair

* [`fa106ea9`](https://github.com/primer/react/commit/fa106ea9a43a8451efb648d1e3ec9df87577379c) [#1090](https://github.com/primer/react/pull/1090) Thanks [@colebemis](https://github.com/colebemis)! - Use functional color variables in AvatarStack

- [`565f1980`](https://github.com/primer/react/commit/565f19808c528a2d33042c339603ea76d6097d0c) [#1097](https://github.com/primer/react/pull/1097) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in Breadcrumb

* [`4e19045e`](https://github.com/primer/react/commit/4e19045ec1ca46ece0c029a193ed1863a8994030) [#1085](https://github.com/primer/react/pull/1085) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in StateLabel

- [`31025697`](https://github.com/primer/react/commit/31025697b61f80fc35442e66e73311269d0cdc48) [#1099](https://github.com/primer/react/pull/1099) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in Dialog

* [`67cc5b23`](https://github.com/primer/react/commit/67cc5b23fb5b968a7ecbebbca9671e65d4acfee6) [#1097](https://github.com/primer/react/pull/1097) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Use functional color variables in ButtonInvisible

## 23.2.1

### Patch Changes

- [`a42162c0`](https://github.com/primer/react/commit/a42162c011fa3718a32124b79aecfe306f358298) [#1087](https://github.com/primer/react/pull/1087) Thanks [@emplums](https://github.com/emplums)! - Fix up styles in TabNav allowing for items positioned on the right end of TabNav

## 23.2.0

### Minor Changes

- [`b273f1f9`](https://github.com/primer/react/commit/b273f1f95fcb3e2224414d6a0be124e29701d439) [#1083](https://github.com/primer/react/pull/1083) Thanks [@emplums](https://github.com/emplums)! - Adds a `contrast` prop to TextInput

### Patch Changes

- [`c50b9f93`](https://github.com/primer/react/commit/c50b9f93402e7898b2a30f6f7fd0159ed40a8e86) [#1059](https://github.com/primer/react/pull/1059) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Dropdown` to TypeScript

* [`681799fd`](https://github.com/primer/react/commit/681799fd996537f56b15169ce8ac801e68aff41b) [#1066](https://github.com/primer/react/pull/1066) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `useMouseIntent` to TypeScript

- [`eaeb2389`](https://github.com/primer/react/commit/eaeb2389738c1c366e41ddb7795b03c865359034) [#1055](https://github.com/primer/react/pull/1055) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `utils` to TypeScript

* [`106eb85e`](https://github.com/primer/react/commit/106eb85e969fa9ece03a789b1175346e8d53cb83) [#1060](https://github.com/primer/react/pull/1060) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `Dialog` to TypeScript

- [`f11e6ac6`](https://github.com/primer/react/commit/f11e6ac67ff675137e672a33d445678fd3b64b3a) [#1048](https://github.com/primer/react/pull/1048) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `SelectMenu` to TypeScript

* [`bb635a50`](https://github.com/primer/react/commit/bb635a5094baf6821e45a7a03c6582989ee86fd5) [#1058](https://github.com/primer/react/pull/1058) Thanks [@colebemis](https://github.com/colebemis)! - Migrate theme to TypeScript

- [`fabca94e`](https://github.com/primer/react/commit/fabca94ebc3b5429b5c541aeaac6eb508fd5f182) [#1047](https://github.com/primer/react/pull/1047) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `Pagination` to TypeScript

* [`c868bc96`](https://github.com/primer/react/commit/c868bc9613cb32d6fc0de009c75abdaa20c1bcdb) [#1074](https://github.com/primer/react/pull/1074) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Add functional color variables from Primer Primitives to theme object

## 23.1.0

### Minor Changes

- [`e0432b35`](https://github.com/primer/react/commit/e0432b35f152031be8e4a0830df5d228d7b14832) [#1041](https://github.com/primer/react/pull/1041) Thanks [@emplums](https://github.com/emplums)! - Adds new `useSafeTimeout` helper Hook

### Patch Changes

- [`eaf57cf5`](https://github.com/primer/react/commit/eaf57cf514da106f9bd1b4de01f5fc037a84fa23) [#1054](https://github.com/primer/react/pull/1054) Thanks [@emplums](https://github.com/emplums)! - Fix border radius on ButtonClose

* [`57eba0da`](https://github.com/primer/react/commit/57eba0da8fea003d00fce781d05ac581616de391) [#1054](https://github.com/primer/react/pull/1054) Thanks [@emplums](https://github.com/emplums)! - Add ButtonInvisible focus styles

- [`e2c90dba`](https://github.com/primer/react/commit/e2c90dba38976c280f44544cd7bf5cbbc8816ee3) [#1049](https://github.com/primer/react/pull/1049) Thanks [@eintxaurtieta](https://github.com/eintxaurtieta)! - Added font-family:inherit to TextInput

* [`be82a500`](https://github.com/primer/react/commit/be82a50033e8392c2dd80f56df9f398397f45379) [#1046](https://github.com/primer/react/pull/1046) Thanks [@emplums](https://github.com/emplums)! - - Fixed Dropdown & Details types.

- [`7c4c726c`](https://github.com/primer/react/commit/7c4c726c822fafc524e9b6928a7f9d413e1a7bc8) [#1046](https://github.com/primer/react/pull/1046) Thanks [@emplums](https://github.com/emplums)! - - Added useDetails behavior back to Dropdown

## 23.0.4

### Patch Changes

- [`8de64e95`](https://github.com/primer/react/commit/8de64e9588dd4c545f7eca3a13d74d5f860e2b0e) [#1029](https://github.com/primer/react/pull/1029) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `TabNav` to TypeScript

* [`16aeca6b`](https://github.com/primer/react/commit/16aeca6bb37f1724037cd83db580eee69c473332) [#1032](https://github.com/primer/react/pull/1032) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `AvatarStack` to TypeScript

- [`4070310a`](https://github.com/primer/react/commit/4070310a334d8d37c5a1277f11298ef675ed1465) [#1026](https://github.com/primer/react/pull/1026) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `Details` to TypeScript

* [`8f483bd9`](https://github.com/primer/react/commit/8f483bd94bb9a09ca88e3f2a116c4396404627c3) [#1042](https://github.com/primer/react/pull/1042) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `PointerBox` to TypeScript

- [`c5d2b657`](https://github.com/primer/react/commit/c5d2b65725c7e584412430fd3156875b8e1714d8) [#1035](https://github.com/primer/react/pull/1035) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `CircleBadge` to TypeScript

* [`3fcdf25f`](https://github.com/primer/react/commit/3fcdf25fc7c2def336dec4f5b34f518b2dbff903) [#1040](https://github.com/primer/react/pull/1040) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `SideNav` to TypeScript

- [`ff02c038`](https://github.com/primer/react/commit/ff02c038cdeef9cbeb8d050b3c5a951ccdbb9574) [#1033](https://github.com/primer/react/pull/1033) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Tooltip` to TypeScript

* [`0d62f260`](https://github.com/primer/react/commit/0d62f260672453a7509173b5b6d02778cf73a3e8) [#1030](https://github.com/primer/react/pull/1030) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Caret` to TypeScript

- [`d1785f4c`](https://github.com/primer/react/commit/d1785f4cd312eff66f4a0b897aaf22aff11441bc) [#1038](https://github.com/primer/react/pull/1038) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `SubNav` to TypeScript

* [`058e7919`](https://github.com/primer/react/commit/058e791936399b1e08c31bfa18c772015da587c7) [#1036](https://github.com/primer/react/pull/1036) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `CircleOcticon` to TypeScript

- [`9b71bf38`](https://github.com/primer/react/commit/9b71bf387aad9f3cd3802594fd3cccc473b46661) [#998](https://github.com/primer/react/pull/998) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Position` to TypeScript

* [`b2ac3010`](https://github.com/primer/react/commit/b2ac301092e37a319ddc10440f929425da066f69) [#1037](https://github.com/primer/react/pull/1037) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Timeline` to TypeScript

- [`ef25d019`](https://github.com/primer/react/commit/ef25d01961d20fd590dd3abcef10c87fd26135be) [#1031](https://github.com/primer/react/pull/1031) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `AvatarPair` to TypeScript

* [`62f45a12`](https://github.com/primer/react/commit/62f45a12fbd87d18adbc611a6410734f9fd16ab9) [#1028](https://github.com/primer/react/pull/1028) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `TextInput` to TypeScript

- [`a4dce5da`](https://github.com/primer/react/commit/a4dce5daecdf65ce2ea8e55f962e5843b2b10e26) [#1017](https://github.com/primer/react/pull/1017) Thanks [@smockle](https://github.com/smockle)! - Migrate button components to TypeScript

* [`cc36e6b4`](https://github.com/primer/react/commit/cc36e6b410600994d46af864cec7b83314a6987c) [#1034](https://github.com/primer/react/pull/1034) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Popover` to TypeScript

- [`11340814`](https://github.com/primer/react/commit/113408140bef3d47a023925aa975273e264959ac) [#1020](https://github.com/primer/react/pull/1020) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `Header` to TypeScript

## 23.0.3

### Patch Changes

- [`3e0110bc`](https://github.com/primer/react/commit/3e0110bc942ba080c8c7bbaf1778b88b3cc25570) [#995](https://github.com/primer/react/pull/995) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Flash` to TypeScript

* [`b0cea82e`](https://github.com/primer/react/commit/b0cea82e27e72f2bd351c14721e0d70343c98ebd) [#1003](https://github.com/primer/react/pull/1003) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Truncate` to TypeScript

- [`f9a7e78a`](https://github.com/primer/react/commit/f9a7e78a0e512be90cc349483ed6fab2010e1765) [#987](https://github.com/primer/react/pull/987) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `ProgressBar` to TypeScript

* [`d848b9e0`](https://github.com/primer/react/commit/d848b9e054a0f96648ddd02b13ac9c19f56ecb42) [#993](https://github.com/primer/react/pull/993) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `StyledOcticon` to TypeScript

- [`73bced4b`](https://github.com/primer/react/commit/73bced4bdf70b71137e1d4c349db232842efcdee) [#1015](https://github.com/primer/react/pull/1015) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `FilterList` to TypeScript

* [`fcd773c4`](https://github.com/primer/react/commit/fcd773c4212062b2957dd3befba90ac034dd3fe5) [#1009](https://github.com/primer/react/pull/1009) Thanks [@emplums](https://github.com/emplums)! - Upgrade Octicons to 11.3.0

- [`b9671ca2`](https://github.com/primer/react/commit/b9671ca28bbcf9521882f9ca2fed986c426a8833) [#1005](https://github.com/primer/react/pull/1005) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `CounterLabel` to TypeScript

* [`1fb77ac3`](https://github.com/primer/react/commit/1fb77ac3b0ed60dee0481bd14f069f913d37cfdd) [#1012](https://github.com/primer/react/pull/1012) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Breadcrumb` to TypeScript

- [`91002078`](https://github.com/primer/react/commit/91002078bc173134e7c94541fe5388fca0baefa5) [#1008](https://github.com/primer/react/pull/1008) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `StateLabel` to TypeScript

* [`3a3c81a4`](https://github.com/primer/react/commit/3a3c81a4e71a88249d08a02d26575c7d00e35fa3) [#984](https://github.com/primer/react/pull/984) Thanks [@bscofield](https://github.com/bscofield)! - Migrate `Avatar` to TypeScript

- [`df2920f5`](https://github.com/primer/react/commit/df2920f5e80e6f73d423f1e1dd468994a5894618) [#1014](https://github.com/primer/react/pull/1014) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `UnderlineNav` to TypeScript

* [`b947aff2`](https://github.com/primer/react/commit/b947aff26f26d46ebe8f7bb4b930863ba1b05eaa) [#1006](https://github.com/primer/react/pull/1006) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `FilteredSearch` to TypeScript

- [`2e71f70f`](https://github.com/primer/react/commit/2e71f70f2113de273b9c41a667f2fc9b539a01de) [#1011](https://github.com/primer/react/pull/1011) Thanks [@VanAnderson](https://github.com/VanAnderson)! - Migrate `Link` to TypeScript

## 23.0.2

### Patch Changes

- [`7128403c`](https://github.com/primer/react/commit/7128403c488a2cfefda3743d7f92be8142071bc8) [#979](https://github.com/primer/react/pull/979) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Text` to TypeScript

* [`fe16e21c`](https://github.com/primer/react/commit/fe16e21cb3a67d424cdbb663ea2d13e2397eb42c) [#982](https://github.com/primer/react/pull/982) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `BaseStyles` to TypeScript

- [`ee806857`](https://github.com/primer/react/commit/ee8068579106d34309faa1a0c44e1ed25edafb59) [#975](https://github.com/primer/react/pull/975) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Heading` to TypeScript

* [`25315571`](https://github.com/primer/react/commit/2531557171cd2e39b980a456d42e15880e16256f) [#976](https://github.com/primer/react/pull/976) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Label` to TypeScript

- [`4076bf4e`](https://github.com/primer/react/commit/4076bf4e173d997c46ba1130c5f0f86f04952790) [#986](https://github.com/primer/react/pull/986) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Flex` to TypeScript

* [`397a46fe`](https://github.com/primer/react/commit/397a46fe1edee9c2bb71e6ceedafff8dc4e76cb2) [#976](https://github.com/primer/react/pull/976) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `LabelGroup` to TypeScript

- [`e841e158`](https://github.com/primer/react/commit/e841e158dcc557169fce19c78d5d90af5fef6af6) [#983](https://github.com/primer/react/pull/983) Thanks [@shiftkey](https://github.com/shiftkey)! - Add supported `htmlFor` prop to `FormGroupLabelProps` type definition

* [`dc0df4b2`](https://github.com/primer/react/commit/dc0df4b209d952b121f04fc86d0f2984a6e661cf) [#973](https://github.com/primer/react/pull/973) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `BorderBox` to TypeScript

- [`0cac0042`](https://github.com/primer/react/commit/0cac00426d4d29c51d9f110f091aac06c49ec054) [#974](https://github.com/primer/react/pull/974) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `BranchName` to TypeScript

* [`755a1a5c`](https://github.com/primer/react/commit/755a1a5c19f6d6298f9c6785b50fed71aaea59ad) [#977](https://github.com/primer/react/pull/977) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Pagehead` to TypeScript

- [`34ff4885`](https://github.com/primer/react/commit/34ff4885311686699fbb6d2e3fab0337bad3d016) [#989](https://github.com/primer/react/pull/989) Thanks [@colebemis](https://github.com/colebemis)! - Migrate `Grid` to TypeScript
