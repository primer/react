---
"@primer/react": major
---

Rename npm package from `@primer/components` to `@primer/react`

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
