
# Flash

## Default example

```.jsx
<Flash m={4} scheme="green"> Flash green </Flash>
```

## System props

Flash components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Description |
| :- | :- | :- |
| full | Boolean | Creates a full width Flash component|
| scheme | String | Can be one of `green`, `yellow`, or `red` - sets the background color, border, and text color of the Flash component

export const meta = {displayName: 'Flash'}
