# Link

## Default example

```.jsx
<Link mb={1} href="https://github.com">Link</Link>
```

## System props

Link components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Description |
| :- | :- | :- |
| href | String | URL to be used for the Link |
| muted | Boolean | Applies a gray text color to the Link |
| underline | Boolean | Adds underline to the Link |
| scheme | String | Can be `gray` or `gray-dark`, sets the text color accordingly. |

export const meta = {displayName: 'Link'}
