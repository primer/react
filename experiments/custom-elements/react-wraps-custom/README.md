# React + Custom Elements (1)

## The Goal

> ### Test a React component that wraps a custom element and imports its definition to its own JS bundle
> 
> We want to share components between dotcom and other web
> applications so that they are consistent in implementation and
> for users. It's likely that we will continue to use custom
> elements on dotcom for the foreseeable future, and use React
> for other github applications. It make sense for us to use
> custom elements open-sourced by GitHub within a React component
> library, and use React to encapsulate the styles along with it,
> so it's worth testing this in practice.

## Notes

This approach wraps [&lt;clipboard-copy&gt;](https://github.com/github/clipboard-copy-element)
as a React component that imports the custom element declaration
in the bundle.

### Pros
* There's a 1:1 relationship between the React component and the Web Component, down to the dependency version.
* The component API can be modified later to account for changes in the custom element implementation.

### Cons
_Are there any?_

### Etc.
* The
  [transform-custom-element-classes](https://github.com/github/babel-plugin-transform-custom-element-classes)
  babel plugin is required to bundle custom element
  definitions.
* Something in either React or [Parcel](https://parceljs.org/) is
  generating DOM output with `classname` attributes instead of
  `class`; I've placed the fix for this in
  [dangerfile.js](dangerfile.js).
* Eventually, we will need to account for [this
  RFC](https://github.com/reactjs/rfcs/pull/15), and any
  corresponding changes in React 17 related to custom
  elements.
