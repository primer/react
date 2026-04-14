---
'@primer/react': minor
---

Add stable `data-component` selectors to multiple components following ADR-023:

- **ActionBar**
- **ActionList** and friends
- **Button**
- **Table** and friends
- **FilteredActionList** and friends
- **IconButton**
- **Link**
- **LinkButton**
- **Pagination**
- **SelectPanel** and friends
- **TextInput**
- **TextInputwithTokens**
- **TooltipV2**

This enables consumers to query and test components using stable selectors like `[data-component="Table.Row"]`.
