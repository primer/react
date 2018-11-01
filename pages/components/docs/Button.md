# Buttons

## Default examples

```.jsx
<Button>Button</Button>
<ButtonDanger>Button Danger</ButtonDanger>
<ButtonOutline>Button Outline</ButtonOutline>
<ButtonPrimary>Button Primary</ButtonPrimary>
```

## System props

Button components get `COMMON` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Prop name | Type | Default | Description |
| :- | :- | :-: | :- |
| is | String | `button` | sets the HTML tag for the component |
| disabled | Boolean |  sets the `disabled` attribute on the Button |
| grouped | Boolean | | allows you to use Button in a line of Buttons without duplicate borders |
| onClick | Function | | function to be called when Button is clicked |
| size | String | | use `sm` for a small Button, or `large` for a large Button

export const meta = {displayName: 'Button'}
