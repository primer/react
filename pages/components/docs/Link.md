# Link

The Link component styles anchor tags with default blue styling and hover text decoration.

## Default example

```.jsx
<Link mb={1} href="https://github.com">Link</Link>
```

## System props

Link components get `COMMON` and `TYPOGRAPHY` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| href | String | | URL to be used for the Link |
| underline | Boolean | false | Adds underline to the Link |
| is | String | 'a' | Can be 'a', 'button', 'input', or 'summary'

export const meta = {displayName: 'Link'}
