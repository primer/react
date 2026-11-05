## Full unit suite

```text
> test
> vitest --run


 RUN  v5.0.5 $WORKTREE


 Test Files  163 passed (163)
      Tests  2994 passed | 3 skipped | 10 todo (3007)
   Start at  16:06:32
   Duration  38.67s (worker 88%, tests 4%, transform 3%, setup 3%, import 2%)
```

## Targeted DataTable/live-region regressions

```text
> test
> vitest --run packages/react/src/DataTable packages/react/src/live-region


 RUN  v5.0.5 $WORKTREE


 Test Files  14 passed (14)
      Tests  273 passed (273)
   Start at  16:04:04
   Duration  10.82s (setup 55%, worker 22%, tests 20%, import 3%)
```

## New selection browser regressions

```text

(node:88436) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)


(node:88436) [DEP0205] DeprecationWarning: `module.register()` is deprecated. Use `module.registerHooks()` instead.

(node:88436) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)


[1/2] e2e/components/DataTableAnnouncements.test.ts:5:7 › DataTable selection announcements › inactive actions leave the table tree and clearing restores keyboard focus @aat
[2/2] e2e/components/DataTableAnnouncements.test.ts:33:7 › DataTable selection announcements › selection without a toolbar updates the shared live region @aat
  2 passed (4.3s)
```

## Existing DataTable accessibility checks

```text
[145/157] e2e/components/DataTable.test.ts:183:15 › DataTable › With Standalone And Grouped Row Selection › dark_tritanopia › axe @aat
[146/157] e2e/components/DataTable.test.ts:183:15 › DataTable › With Paginated Row Selection › light › axe @aat
[147/157] e2e/components/DataTable.test.ts:183:15 › DataTable › With Paginated Row Selection › light_high_contrast › axe @aat
[148/157] e2e/components/DataTable.test.ts:183:15 › DataTable › With Paginated Row Selection › light_colorblind › axe @aat
[149/157] e2e/components/DataTable.test.ts:183:15 › DataTable › With Paginated Row Selection › light_tritanopia › axe @aat
[150/157] e2e/components/DataTable.test.ts:183:15 › DataTable › With Paginated Row Selection › dark › axe @aat
[151/157] e2e/components/DataTable.test.ts:183:15 › DataTable › With Paginated Row Selection › dark_dimmed › axe @aat
[152/157] e2e/components/DataTable.test.ts:183:15 › DataTable › With Paginated Row Selection › dark_high_contrast › axe @aat
[153/157] e2e/components/DataTable.test.ts:183:15 › DataTable › With Paginated Row Selection › dark_colorblind › axe @aat
[154/157] e2e/components/DataTable.test.ts:183:15 › DataTable › With Paginated Row Selection › dark_tritanopia › axe @aat
[155/157] e2e/components/DataTable.test.ts:207:7 › DataTable › standalone and grouped selection stays wired through keyboard input and sorting @aat
[156/157] e2e/components/DataTable.test.ts:230:7 › DataTable › paginated selection example selects only the current page @aat
[157/157] e2e/components/DataTable.test.ts:247:7 › DataTable › pagination across a group boundary @aat
  157 passed (1.4m)
```

## Type check

```text
example-nextjs:type-check: cache miss, executing 62e5cb5d0989e6db
codesandbox:type-check: cache miss, executing 14c974e99492aed2
codesandbox:type-check:
codesandbox:type-check: > codesandbox@0.0.0 type-check
codesandbox:type-check: > tsc --noEmit
codesandbox:type-check:
example-nextjs:type-check:
example-nextjs:type-check: > example-nextjs@0.0.0 type-check
example-nextjs:type-check: > tsc --noEmit
example-nextjs:type-check:

 Tasks:    15 successful, 15 total
Cached:    6 cached, 15 total
  Time:    27.386s
```

## Build

```text
@primer/react-canvas:build: <DIR>/index.js                      chunk │ size: 637.89 kB
@primer/react-canvas:build:
@primer/react-canvas:build: ✔ rolldown v1.2.14 Finished in 113.95 ms
@primer/mcp:build: <DIR>/index.js            chunk │ size:  0.07 kB
@primer/mcp:build: <DIR>/stdio.js            chunk │ size:  0.21 kB
@primer/mcp:build: <DIR>/server-CZDOBVxP.js  chunk │ size: 47.65 kB
@primer/mcp:build: <DIR>/transports/stdio.d.ts  chunk │ size: 0.01 kB
@primer/mcp:build: <DIR>/index.d.ts             chunk │ size: 0.21 kB
@primer/mcp:build:
@primer/mcp:build: ✔ rolldown v1.2.14 Finished in 758.29 ms

 Tasks:    5 successful, 5 total
Cached:    3 cached, 5 total
  Time:    1.192s
```

## Lint

```text
> lint
> eslint '**/*.{js,ts,tsx,md,mdx}' --max-warnings=0 --cache
```

## CSS lint

```text
> lint:css
> stylelint --rd -q --cache '**/*.css'
```

## Formatting check

```text
> format:diff
> prettier --cache --list-different '**/*.{js,css,md,mdx,ts,tsx,yml}'
```
