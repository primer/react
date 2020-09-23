---
title: Header
---

Use the `Header` component to create a header that has all of its items aligned vertically with consistent horizontal spacing.

## Default example

All items directly under the Header component should be a `Header.Item` component. Inside these components can be anything (text, forms, images...), and the `Header.Item` component will make sure these elements vertically align with each other.

`Header.Item` elements have a built-in margin that will need to be overridden with the `mr={0}` props for the last element in the container. We relied on the prop here instead of `:last-child` because the last child isn't always the item visible. On responsive pages, there's a mobile menu that gets presented to the user at smaller breakpoints.

```jsx live
<Header>
  <Header.Item>
    <Header.Link href="#" fontSize={2}>
      <StyledOcticon icon={MarkGithubIcon} size={32} mr={2} />
      <span>GitHub</span>
    </Header.Link>
  </Header.Item>
  <Header.Item full>Menu</Header.Item>
  <Header.Item mr={0}>
    <Avatar
      src="https://github.com/octocat.png"
      size={20}
      square
      alt="@octocat"
    />
  </Header.Item>
</Header>
```

## Header with full-size item example 

```jsx live
<Header>
  <Header.Item>Item 1</Header.Item>
  <Header.Item
    full
    border={1}
    borderStyle="solid"
  >
    Item 2
  </Header.Item>
  <Header.Item mr={0}>Item 3</Header.Item>
</Header>
```

## Header with links example

```jsx live
<Header>
  <Header.Item>
    <Header.Link href="#">About</Header.Link>
  </Header.Item>
  <Header.Item>
    <Header.Link href="#">Releases</Header.Link>
  </Header.Item>
  <Header.Item>
    <Header.Link href="#">Team</Header.Link>
  </Header.Item>
</Header>
```

## System props

`Header` and `Header.Item` components get `COMMON` and `BORDER` system props. `Header.Link` component gets `COMMON`, `BORDER`, and `TYPOGRAPHY` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

### Header.Item

| Prop name  | Type    | Description                                                                            |
| :--------- | :------ | :------------------------------------------------------------------------------------- |
| full | Boolean | stretches item to fill the available space |

### Header.Link

| Prop name  | Type    | Description                                                                            |
| :--------- | :------ | :------------------------------------------------------------------------------------- |
| as | String | sets the HTML tag for the component |
| href | String | URL to be used for the Link |