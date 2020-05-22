---
title: StateLabel
---
Use StateLabel components to show the status of an issue or pull request.

## Default example

```jsx live
<StateLabel status="issueOpened">Open</StateLabel>
<StateLabel status="issueClosed">Closed</StateLabel>
<StateLabel status="pullOpened">Open</StateLabel>
<StateLabel status="pullClosed">Closed</StateLabel>
<StateLabel status="pullMerged">Merged</StateLabel>
<StateLabel status="draft">Draft</StateLabel>
```

## System props

StateLabel components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| variant | String | 'normal' | a value of `small` or `normal` results in a smaller or larger version of the StateLabel. |
| status | String | | Can be one of `issueOpened`, `issueClosed`, `pullOpened`, `pullClosed`, `pullMerged`, or `draft`.
