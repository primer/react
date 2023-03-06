---
"@primer/react": major
---

Update PRC ActionList implementation to have similar semantics to PVC.
* Removes `ActionList.Group`.
* Adds `ActionList.Heading` to be used for labelling children in an `ActionList`.
* Adds `headingProps` prop to `ActionList` for adding headings that label internal lists correctly.
