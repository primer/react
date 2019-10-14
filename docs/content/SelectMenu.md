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
        <SelectMenu.Tab selected>Users</SelectMenu.Tab>
        <SelectMenu.Tab>Repos</SelectMenu.Tab>
      </SelectMenu.Tabs>
      <SelectMenu.List>
        <button type="button">Hubot</button>
        <button type="button">Bender</button>
        <button type="button">BB-8</button>
      </SelectMenu.List>
    </SelectMenu.Modal>
</SelectMenu>
```