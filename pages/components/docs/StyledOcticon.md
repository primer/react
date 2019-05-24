
# StyledOcticon

StyledOcticon renders an Octicon with common system props, including `color`, margin, and padding.

## Default example

```.jsx
<StyledOcticon icon={Check} size={32} color="green.5" mr={2} />
<StyledOcticon icon={X} size={32} color="red.5" />
```

## System props

StyledOcticon components get `COMMON` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

StyledOcticon passes all of its props except the common system props down to the [Octicon component](https://github.com/primer/octicons/tree/master/lib/octicons_react#usage), including:

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| ariaLabel | String | | Specifies the `aria-label` attribute, which is read verbatim by screen readers |
| icon | Octicon | | Octicon component used in the component |
| size | Number | 16 | Sets the uniform `width` and `height` of the SVG element |
| verticalAlign | String | `text-bottom` | Sets the `vertical-align` CSS property |


export const meta = {displayName: 'StyledOcticon'}
