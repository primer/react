---
"@primer/react": patch
---

Deprecate SideNav in favor of [NavList](https://primer.style/NavList).

## Before

```jsx
<SideNav aria-label="Main">
  <SideNav.Link href="/" selected>
    Home
  </SideNav.Link>
  <SideNav.Link href="/about">About</SideNav.Link>
  <SideNav.Link href="/contact">Contact</SideNav.Link>
</SideNav>
```

## After

```jsx
<NavList aria-label="Main">
  <NavList.Item href="/" aria-current="page">
    Home
  </NavList.Item>
  <NavList.Item href="/about">About</NavList.Item>
  <NavList.Item href="/contact">Contact</NavList.Item>
</NavList>
```
