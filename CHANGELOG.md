# @primer/components

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

* [#2228](https://github.com/primer/react/pull/2228) [`bf99db99`](https://github.com/primer/react/commit/bf99db999a54149682cc708f620145cd0fa1938d) Thanks [@mperrotti](https://github.com/mperrotti)! - Moves SegmentedControl to the main bundle and updates it's lifecycle status to "Alpha"

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

- [#2013](https://github.com/primer/react/pull/2013) [`5f6c5e22`](https://github.com/primer/react/commit/5f6c5e2249c9bb4c6a6b744755ea4607d10a0b74) Thanks [@mperrotti](https://github.com/mperrotti)! - 1. Fix a spacing issue with the loading spinner in a `TextInputWithTokens`
  2. Bolds form validation text to be visually balanced with the icon

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
      {text: 'Delete file', variant: 'danger'}
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
        text: 'github/primer'
      },
      {
        key: '1',
        leadingVisual: () => <Avatar src="https://github.com/mona.png" />,
        text: 'mona',
        description: 'Monalisa Octocat',
        descriptionVariant: 'block'
      },
      {
        key: '2',
        leadingVisual: GearIcon,
        text: 'View Settings',
        trailingVisual: ArrowRightIcon
      }
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
      {groupId: '1', header: {title: 'Layout'}}
    ]}
    items={[
      {key: '0', text: 'repo:github/github', groupId: '0'},
      {key: '1', text: 'Table', groupId: '1'},
      {key: '2', text: 'Board', groupId: '1'},
      {key: '3', text: 'View settings'}
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
      {text: 'Delete file', variant: 'danger'}
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
    {key: 5, text: 'Iteration'}
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
    {id: 5, text: 'Iteration'}
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
      </ActionMenu>
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
    {leadingVisual: NumberIcon, text: 'Number'}
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
    {icon: <NumberIcon />, name: 'Number'}
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
