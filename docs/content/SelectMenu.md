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
      <button type="button" role="menuitem">Hubot</button>
      <button type="button" role="menuitem">Bender</button>
      <button type="button" role="menuitem">BB-8</button>
    </SelectMenu.Modal>
</SelectMenu>
```