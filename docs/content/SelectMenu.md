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
        <SelectMenu.Item>master</SelectMenu.Item>
        <SelectMenu.Item >fix-SelectMenu.Item</SelectMenu.Item>
        <SelectMenu.Divider>More options</SelectMenu.Divider>
        <SelectMenu.Item >add-styles</SelectMenu.Item>
        <SelectMenu.Item >delete-page</SelectMenu.Item>
        <SelectMenu.Item >hotfix-1</SelectMenu.Item>
      </SelectMenu.List>
      <SelectMenu.Footer>Showing 5 of 5</SelectMenu.Footer>
    </SelectMenu.Modal>
</SelectMenu>
```

#### With Loading State
```jsx live
<SelectMenu>
    <SelectMenu.Summary>Robots</SelectMenu.Summary>
    <SelectMenu.Modal>
      <SelectMenu.Header>
        <SelectMenu.Title>Filter by Author</SelectMenu.Title>
      </SelectMenu.Header>
      <SelectMenu.Filter placeholder="Filter users" aria-label="Filter users"/>
      <SelectMenu.Loading/>
      <SelectMenu.Footer>Loading...</SelectMenu.Footer>
    </SelectMenu.Modal>
</SelectMenu>
```