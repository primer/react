---
title: CounterLabel
---

Use the CounterLabel component to add a count to navigational elements and buttons.

## Default example
```.jsx live
<CounterLabel>12</CounterLabel>
<CounterLabel scheme={'gray'}>13</CounterLabel>
<CounterLabel scheme={'gray-light'}>13</CounterLabel>
```

## System props

CounterLabel components get `COMMON` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| scheme | String | | Pass in 'gray' for a darker gray background and white text, or 'gray-light' for a lighter gray background and dark text. Omitting the scheme prop renders the default counter scheme |
