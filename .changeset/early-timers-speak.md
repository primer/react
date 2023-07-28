---
'@primer/react': major
---

Remove components from draft bundle

* Move UnderlineNav2 (draft) to the main bundle
    
```diff 
- import {UnderlineNav} from '@primer/react/drafts'
+ import {UnderlineNav} from '@primer/react'
```

....
* Remove TreeView from drafts

```diff
- import {TreeView} from '@primer/react/drafts'
+ import {TreeView} from '@primer/react'
```

* Remove SegmentedControl from drafts

```diff
- import {SegmentedControl} from '@primer/react/drafts'
+ import {SegmentedControl} from '@primer/react'
```

* Remove NavList from drafts

```diff
- import {NavList} from '@primer/react/drafts'
+ import {NavList} from '@primer/react'
```

* Remove SplitPageLayout from drafts

```diff
- import {SplitPageLayout} from '@primer/react/drafts'
+ import {SplitPageLayout} from '@primer/react'
```

<!-- Changed components: UnderlineNav, TreeView, SegmentedControl, NavList, SplitPageLayout -->
