# StateLabel

Use StateLabel components to show the status of an issue or pull request.

## Default example

```.jsx
  <StateLabel state="open">Open</StateLabel>
```

## System props

StateLabel components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| icon | Node or Boolean | | Provide a component for the Icon or set to `true` to match the icon to the `state` prop |
| small | Boolean | | Used to create a smaller version of the default StateLabel |
| state | String | | Can be one of `open`, `reopened`, `closed`, or `merged`. Used to set background color and Octicon.

export const meta = {displayName: 'StateLabel'}
