# @primer/components

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
