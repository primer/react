# StateLabel

Use StateLabel components to show the status of an issue or pull request.

## Default example

```.jsx
  <StateLabel scheme="open">Open</StateLabel>
```

## System props

StateLabel components get `COMMON` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| icon | Node | | Provide an Octicon to render in the label. Example: `icon={Check}` |
| small | Boolean | | Used to create a smaller version of the default StateLabel |
| scheme | String | | Can be one of `green`, `yellow`, `purple`, `gray` or `red`. Used to set background color.

export const meta = {displayName: 'StateLabel'}
