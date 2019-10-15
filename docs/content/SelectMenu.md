---
title: SelectMenu
---

```jsx live
<SelectMenu>
    <SelectMenu.Summary>Robots</SelectMenu.Summary>
    <SelectMenu.Modal>
      <SelectMenu.Header>
        <SelectMenu.Title>Filter by project</SelectMenu.Title>
      </SelectMenu.Header>
      <SelectMenu.Filter placeholder="Filter projects" aria-label="Filter Projects"/>
      <SelectMenu.Tabs>
        <SelectMenu.Tab selected>Repository</SelectMenu.Tab>
        <SelectMenu.Tab>Organization</SelectMenu.Tab>
      </SelectMenu.Tabs>
      <SelectMenu.List>
        <SelectMenu.Item>Primer Components release tracking</SelectMenu.Item>
        <SelectMenu.Item >Primer Compononents roadmap</SelectMenu.Item>
        <SelectMenu.Divider>More options</SelectMenu.Divider>
        <SelectMenu.Item >Primer Components bugs</SelectMenu.Item>
      </SelectMenu.List>
      <SelectMenu.List hidden>
        <SelectMenu.Item>Design Systems projects</SelectMenu.Item>
      </SelectMenu.List>
      <SelectMenu.Footer>Showing 3 of 3</SelectMenu.Footer>
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