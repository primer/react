---
title: Checkbox
status: Alpha
---

Checkbox is a form component that applies Primer design language to a native HTML checkbox input element.

> This is implemented as a controlled Component. Please avoid mutating the `checked` value of the underlying DOM element.

## Default example

```jsx live
<>
  <Checkbox checked={true} />
  <Checkbox disabled />
  <Checkbox checked={true} disabled />
  <Checkbox checked={true} indeterminate />
  <Checkbox checked={true} indeterminate disabled />
  <br />
  <br />
  <Checkbox checked={true} label="A simple checkbox with label" />
  <Checkbox disabled label="Disabled" />
  <Checkbox disabled checked={true} label="Checked + Disabled" />
  <Checkbox indeterminate checked={true} label="Indeterminate" />
  <Checkbox indeterminate disabled checked={true} label="Indeterminate + Disabled" />
</>
```

## Component props

Native `<input>` attributes are forwarded to the underlying React `input` component and are not listed below.

| Name          | Type    |  Default  | Description                                                                                                                                   |
| :------------ | :------ | :-------: | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| checked       | Boolean |   false   | Modifies enabled/disabled state of the native checkbox                                                                                        |
| label         | String  | undefined | An optional label                                                                                                                             |
| disabled      | Boolean |   false   | Modifies the native disabled state of the native checkbox                                                                                     |
| block         | Boolean |   false   | Applies the maximum width available from the parent                                                                                           |
| indeterminate | Boolean |   false   | Applies an [indeterminate](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#attr-indeterminate) state to the checkbox |
