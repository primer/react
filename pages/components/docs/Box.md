# Box

The Box component serves as a wrapper component for most layout related needs. Use Box to set values such as `display`,  `width`, `height`, and more. See the LAYOUT section of our [System Props](/components/docs/system-props) documentation for the full list of available props. In practice, this component is used frequently as a wrapper around other components to acheive Box Model related styling.

## Default example

```.jsx
<Box display="block">
 <Label m={1}>Box can be used to create block level elements</Label>
</Box>

<Label m={1}>Default label</Label>
```

## System props

Box components get the `COMMON` and `LAYOUT` categories of system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Default | Description |
| :- | :- | :-: | :- |
| is | String | `div` | sets the HTML tag for the component|


export const meta = {displayName: 'Box'}
