
# CounterLabel

## Default example
```.jsx
<CounterLabel>12</CounterLabel>
<CounterLabel scheme={'gray'}>13</CounterLabel>
<CounterLabel scheme={'gray-light'}>13</CounterLabel>
```

## System props

CounterLabel components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Description |
| :- | :- | :- |
| scheme | String | Pass in 'gray' for a darker gray background and white text, or 'gray-light' for a lighter gray background and dark text. Omitting the scheme prop renders the default counter scheme |

export const meta = {displayName: 'CounterLabel'}
