---
componentId: counter_label
title: CounterLabel
status: Alpha
---

Use the CounterLabel component to add a count to navigational elements and buttons.

## Default example

```jsx live
<>
  <CounterLabel>12</CounterLabel>
  <CounterLabel scheme="primary">13</CounterLabel>
  <CounterLabel scheme="secondary">13</CounterLabel>
</>
```

## Component props

| Name   | Type   | Default | Description                                                                                                                                                                        |
| :----- | :----- | :-----: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| scheme | String |         | Pass in 'primary' for a darker background and inverse text, or 'gray-light' for a lighter background and primary text. Omitting the scheme prop renders the default counter scheme |
