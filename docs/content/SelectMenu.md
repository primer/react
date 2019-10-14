---
title: SelectMenu
---

```jsx live
<SelectMenu>
    <SelectMenu.Summary>Robots</SelectMenu.Summary>
    <SelectMenu.Modal>
      <SelectMenu.Header>
        <SelectMenu.Title>Filter by Author</SelectMenu.Title>
      </SelectMenu.Header>
      <SelectMenu.Filter placeholder="Filter users" aria-label="Filter users"/>
      <SelectMenu.Tabs>
        <SelectMenu.Tab selected>Branches</SelectMenu.Tab>
        <SelectMenu.Tab>Tags</SelectMenu.Tab>
      </SelectMenu.Tabs>
      <SelectMenu.List>
        <button type="button">master</button>
        <button type="button">fix-button</button>
        <button type="button">add-styles</button>
        <button type="button">delete-page</button>
        <button type="button">hotfix-1</button>
      </SelectMenu.List>
      <SelectMenu.Footer>Showing 5 of 5</SelectMenu.Footer>
    </SelectMenu.Modal>
</SelectMenu>
```