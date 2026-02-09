# Prefer using `onSelect` instead of `onClick` for `ActionList.Item` components (`prefer-action-list-item-onselect`)

🔧 The `--fix` option on the [ESLint CLI](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule details

When using the `onClick` attribute on `ActionList.Item` components, this callback only fires when a user clicks on the element with a mouse. If the user navigates to the element with a keyboard and presses the `Enter` key, the callback will not fire. This produces an inaccessible experience for keyboard users.

Using `onSelect` will lead to a more accessible experience for keyboard users compared to using `onClick`.

This rule is generally auto-fixable, though you may encounter type checking errors that result from not properly handling keyboard events which are not part of the `onSelect` callback signature.

👎 Examples of **incorrect** code for this rule:

```jsx
<ActionList.Item onClick={handleClick} />
<ActionList.Item
  aria-label="Edit item 1"
  onClick={(event) => {
    event.preventDefault()
    handleClick()
  }}
/>
```

👍 Examples of **correct** code for this rule:

```jsx
<ActionList.Item onSelect={handleClick} />
<ActionList.Item
  aria-label="Edit item 1"
  onSelect={(event) => {
    event.preventDefault()
    handleClick()
  }}
/>
```
