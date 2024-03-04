# @primer/react

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
