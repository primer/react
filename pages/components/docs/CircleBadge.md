# CircleBadge

## Default example

```.jsx
<CircleBadge>
  <Octicon icon={Zap} />
</CircleBadge>
```

## System props

CircleBadge components get `COMMON` and `LAYOUT` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Description |
| :- | :- | :- |
| is | String | sets the HTML tag for the component, defaults to `button` |
| alt | String | alt tag |
| size | String or Number | Use `small`, `medium`, or `large` for default sizes, or provide a custom size |
| src | String | URL for image used in badge if `is` is set to `img` | 


export const meta = {displayName: 'CircleBadge'}
