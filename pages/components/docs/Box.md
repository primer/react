# Box

The Box component serves as a wrapper component for most layout related needs. Use Box to set values such as `display`,  `width`, `height`, and more. See the LAYOUT section of our [System Props](/components/docs/system-props) documentation for the full list of available props. In practice, this component is used frequently as a wrapper around other components to achieve Box Model related styling.

## Default example

```.jsx
<Box display='inline-block' width='400px' overflow='hidden' style={{border: '1px solid red'}}>
  parent
  <Box bg='blue.4' width='500px'>This should overflow the parent because Box shouldn't have the overflow prop available</Box>
</Box>
```

## System props

Box components get the `COMMON` and `LAYOUT` categories of system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Default | Description |
| :- | :- | :-: | :- |
| as | String | `div` | sets the HTML tag for the component|


export const meta = {displayName: 'Box'}
