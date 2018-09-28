# Donut
The Donut component is a circular chart that shows the relative share of commit status states for a pull request.

## The `data` prop
The `data` prop is the simplest way to define the share of states. It takes an object literal with states as keys and the number of statuses with that state as values. Slices are always rendered clockwise in descending order by size.

```.jsx
<Donut data={{error: 2, pending: 3, success: 5}} />
```

When using the `data` prop, the fill of each slice comes from the corresponding value in the theme's `colors.state` object. In other words, if `theme.colors.state.error = "red"`, then the `error` slice will get `fill="red"`. You can customize the slice colors by either passing a custom `theme` prop or using the `Donut.Slice` component described below.

## System props

Donut components get `space` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Description |
| :- | :- | :- |
| data | Object | Use the keys `error`, `pending`, and `success` to set values used to generate slices in the chart |
| size | Number | Used to set the width and height of the component |

# Donut.Slice
If you need to customize the color of your slices, you can use the `Donut.Slice` component as a child of `Donut`.

```.jsx
<Donut>
  <Donut.Slice value={1} fill="pink" />
  <Donut.Slice value={1} fill="salmon" />
  <Donut.Slice value={1} fill="tomato" />
</Donut>
```

## `Donut.Slice` component props

| Prop name | Type | Description |
| :- | :- | :- |
| state | String | The commit status state which this slice represents |
| value | Number | The number of statuses with this slice's state |
| fill | String | The fill color of the slice, which overrides the color determined by the `state` prop |

export const meta = {displayName: 'Donut'}
