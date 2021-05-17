---
title: Spinner
status: alpha
---

Use Spinner to let users know that content is being loaded.

## Examples

### Default (Medium)

```jsx live
<Spinner />
```

### Small

```jsx live
<Spinner size="small"/>
```

### Large

```jsx live
<Spinner size="large"/>
```

## System props

Spinner components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

StyledOcticon passes all of its props except the common system props down to the [Octicon component](https://github.com/primer/octicons/tree/master/lib/octicons_react#usage), including:

| Name | Type                                   | Default  | Description                                              |
| :--- | :------------------------------------- | :------: | :------------------------------------------------------- |
| size | 'small' &#124; 'medium' &#124; 'large' | 'medium' | Sets the uniform `width` and `height` of the SVG element |
