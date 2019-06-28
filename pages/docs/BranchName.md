# BranchName

BranchName is a label-type component rendered as an `<a>` tag by default with monospace font and blue background.

## Default example

```.jsx
<BranchName>a_new_feature_branch</BranchName>
```

## System props

BranchName components get `COMMON` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| as | String | `<a>` | sets the HTML tag for the component |
| href | String | | a URL to link the component to |

export const meta = {displayName: 'BranchName'}
