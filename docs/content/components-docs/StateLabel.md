# StateLabel

Use StateLabel components to show the status of an issue or pull request.

## Default example

```.jsx
  <StateLabel status="issueOpened">Open</StateLabel>
```

## System props

StateLabel components get `COMMON` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| small | Boolean | | Used to create a smaller version of the default StateLabel |
| status | String | | Can be one of `issueOpened`, `issueClosed`, `pullOpened`, `pullClosed` or `pullMerged`.

export const meta = {displayName: 'StateLabel'}
