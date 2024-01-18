---
componentId: side_nav
title: SideNav
status: Deprecated
---

The Side Nav is a vertical list of navigational links, typically used on the left side of a page. For maximum flexibility, SideNav elements have no default width or positioning.

## Deprecation

Use [NavList](/components/nav-list/react/latest) instead.

### Before

```jsx
<SideNav aria-label="Main">
  <SideNav.Link href="/" selected>
    Home
  </SideNav.Link>
  <SideNav.Link href="/about">About</SideNav.Link>
  <SideNav.Link href="/contact">Contact</SideNav.Link>
</SideNav>
```

### After

```jsx
<NavList aria-label="Main">
  <NavList.Item href="/" aria-current="page">
    Home
  </NavList.Item>
  <NavList.Item href="/about">About</NavList.Item>
  <NavList.Item href="/contact">Contact</NavList.Item>
</NavList>
```

## Default example

```jsx live
<SideNav bordered maxWidth={360} aria-label="Main">
  <SideNav.Link href="#account">
    <Text>Account</Text>
  </SideNav.Link>
  <SideNav.Link href="#home" selected>
    <Text>Profile</Text>
  </SideNav.Link>
  <SideNav.Link href="#emails">
    <Text>Emails</Text>
  </SideNav.Link>
  <SideNav.Link href="#notifications">
    <Text>Notifications</Text>
  </SideNav.Link>
</SideNav>
```

Different kinds of content can be added inside a SideNav item. Use system props to further style them if needed.

## Full variant

Add the `variant='full'` prop to a `SideNav.Link` to spread child elements across the link, which is useful for status icons, labels, and the like.

```jsx live
<SideNav bordered maxWidth={360} aria-label="Main">
  <SideNav.Link href="#url">
    <Text>Text Only</Text>
  </SideNav.Link>
  <SideNav.Link href="#url">
    <Avatar size={16} mr={2} src="https://avatars.githubusercontent.com/hubot?s=32" />
    <Text>With an avatar</Text>
  </SideNav.Link>
  <SideNav.Link href="#url">
    <Octicon sx={{mr: 2}} size={16} icon={ZapIcon} />
    <Text>With an Octicon</Text>
  </SideNav.Link>
  <SideNav.Link href="#url" variant="full" selected>
    <Text>With a status icon</Text>
    <Octicon sx={{mr: 2}} size={16} icon={DotIcon} color="success.fg" />
  </SideNav.Link>
  <SideNav.Link href="#url" variant="full">
    <Text>With a label</Text>
    <Label outline>label</Label>
  </SideNav.Link>
  <SideNav.Link href="#url" variant="full">
    <Text>With a counter</Text>
    <CounterLabel>16</CounterLabel>
  </SideNav.Link>
  <SideNav.Link href="#url">
    <Heading as="h5" sx={{fontSize: 1}}>
      A heading
    </Heading>
    <Text>and some more content</Text>
  </SideNav.Link>
</SideNav>
```

## Lightweight variant

Add the `variant="lightweight"` prop to `SideNav` to render an alternative, more lightweight version that has items with no borders and are more condensed.

```jsx live
<Box
  borderWidth="1px"
  borderStyle="solid"
  borderColor="border.default"
  borderRadius={2}
  p={3}
  backgroundColor="canvas.subtle"
  maxWidth={360}
>
  <Box
    borderStyle="solid"
    borderColor="border.default"
    borderWidth={0}
    borderBottomWidth={1}
    borderRadius={0}
    mb={2}
    pb={1}
  >
    <Heading as="h5" fontSize={1} color="fg.muted">
      Menu
    </Heading>
  </Box>
  <SideNav variant="lightweight">
    <SideNav.Link href="#url">
      <Text>Account</Text>
    </SideNav.Link>
    <SideNav.Link href="#url" selected>
      <Text>Profile</Text>
    </SideNav.Link>
    <SideNav.Link href="#url">
      <Text>Emails</Text>
    </SideNav.Link>
    <SideNav.Link href="#url">
      <Text>Notifications</Text>
    </SideNav.Link>
  </SideNav>
</Box>
```

It can also appear nested, as a sub navigation. Use margin/padding [System Props](/system-props) to add indentation.

```jsx live
<SideNav bordered maxWidth={360}>
  <SideNav.Link href="#url">
    <Octicon size={16} icon={PersonIcon} />
    <Text>Account</Text>
  </SideNav.Link>
  <SideNav.Link href="#url" selected>
    <Octicon mr={2} size={16} icon={SmileyIcon} />
    <Text>Profile</Text>
  </SideNav.Link>

  <SideNav bordered variant="lightweight" py={3} pl={6} backgroundColor="sidenav.selectedBg">
    <SideNav.Link href="#url" selected>
      <Text>Sub item 1</Text>
    </SideNav.Link>
    <SideNav.Link href="#url">
      <Text>Sub item 2</Text>
    </SideNav.Link>
    <SideNav.Link href="#url">
      <Text>Sub item 3</Text>
    </SideNav.Link>
  </SideNav>

  <SideNav.Link href="#url">
    <Octicon mr={2} size={16} icon={MailIcon} />
    <Text>Emails</Text>
  </SideNav.Link>
</SideNav>
```

## Usage with React Router

If using React Router, you can use the `as` prop to render the element as a `NavLink`. React Router will automatically handle setting `aria-current="page"` for you.

```
<SideNav.Link as={NavLink} to="...">...</SideNav.Link>
```

## Component props

### SideNav

| Name     | Type              | Default  | Description                                                                    |
| :------- | :---------------- | :------: | :----------------------------------------------------------------------------- |
| as       | String            |  'nav'   | Sets the HTML tag for the component.                                           |
| bordered | Boolean           |  false   | Renders the component with a border.                                           |
| variant  | String            | 'normal' | Set to `lightweight` to render [in a lightweight style](#lightweight-variant). |
| sx       | SystemStyleObject |    {}    | Style to be applied to the component                                           |

### SideNav.Link

| Name      | Type              | Default  | Description                                                                                       |
| :-------- | :---------------- | :------: | :------------------------------------------------------------------------------------------------ |
| as        | String            |   'a'    | Sets the HTML tag for the component.                                                              |
| href      | String            |          | URL to be used for the Link                                                                       |
| muted     | Boolean           |  false   | Uses a less prominent shade for Link color, and the default link shade on hover                   |
| selected  | Boolean           |  false   | Sets the link as selected, giving it a different style and setting the `aria-current` attribute.  |
| underline | Boolean           |  false   | Adds underline to the Link                                                                        |
| variant   | String            | 'normal' | Set to `full` to render [a full variant](#full-variant), suitable for including icons and labels. |
| sx        | SystemStyleObject |    {}    | Style to be applied to the component                                                              |
