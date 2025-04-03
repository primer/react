---
'@primer/react': patch
---

- Instead of relying on parent component checks (e.g. “is this `ActionList` wrapped in an `ActionMenu` or `SelectPanel`?”) to decide between a tooltip or inline inactive message, we now check the `role` on `ActionList`.
  - If `role` is `"menu"` or `"listbox"`, the inactive message is rendered inline (e.g. in `ActionMenu` or `SelectPanel`)
  - Otherwise, the message is shown in a tooltip
- This `role`-based logic fixes inactive NavList item behavior:
  - Now shows the message in a tooltip instead of inline
- This `role`-based logic fixes inactive SelectPanel item behavior:
  - Now shows the message inline instead of in a tooltip
  - **Important note:** Inactive text only works in `SelectPanel` items when using the modern `ActionList`. The deprecated `ActionList` does not support inactive items.
- Uses the same `role`-based logic to determine whether `ActionList.TrailingAction` is allowed inside an item
  - Previously, we relied on parent component checks to block nesting interactive elements
  - This change is unrelated to inactive states, but it's a more robust way to prevent interactive conflicts
- Updates `aria-describedby` and `aria-labelledby` associations for tooltip buttons on inactive items:
  - **Before**: `aria-describedby` → item label ("Item 1"), `aria-labelledby` → inactive message ("Unavailable due to an outage")
  - **After**: `aria-labelledby` → item label, `aria-describedby` → inactive message
