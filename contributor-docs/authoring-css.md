# Authoring CSS

Primer React uses [CSS Modules](https://github.com/css-modules/css-modules) for styling. CSS Modules allow us to write component scoped CSS while still authoring in a traditional `.css` file. This guide covers best practices for writing CSS in Primer React.

## Getting started

### File setup

Create a new `.css` file in the same directory as the component you are working on. Name the file the same as the component, and add the extension `.module.css`.

Example: `Button.modules.css`

### Importing CSS

Import the new CSS file into the component TSX file.

```tsx
import classes from './Button.module.css'
```

### Reference CSS classes

Reference CSS classes in the component TSX file using the `classes` object.

```css
/* Banner.module.css */

.Banner {
  background-color: var(--banner-bgColor);
}
```

```tsx
// Banner.tsx
import classes from './Button.module.css'
import {clsx} from 'clsx'

export function Banner({className}) {
  return <div className={clsx(classes.Banner, className)}>Banner</div>
}
```

## Code styles

### CSS classnames

When component classnames are compiled, they receive a prefix of the component name `prc-{folder}-{local}-` and a suffix of a random hash.

```css
/* Before compilation */
.Container {
  display: inline-block;
}

/* After compilation */
.prc-Button-Container-cBBI {
  display: inline-block;
}
```

Since classes are prefixed and hashed, the class names themselves can be named generically to represent their intention.

#### PascalCase

Use PascalCase for classnames. Additional characters like `-` dashes or `_` underscores must be escaped with a `\` backslash in TSX for the class name to be recognized, which can be cumbersome.

```css
/* Do */
.ButtonContent {
  display: inline-block;
}

/* Don't */
.button-content {
  display: inline-block;
}
```

#### Pseudo elements

Prefer using pseudo classes over classnames for state.

```css
/* Do */
.Button:disabled {
  opacity: 0.5;
}

/* Don't */
.ButtonDisabled {
  opacity: 0.5;
}
```

### `clsx` and className

Multiple classnames can be referenced on a single node using the `clsx` utility. This is also useful for providing a `className` prop alongside the default class name.

The `className` prop should only be offered on the top-level element of a component. Avoid offering multiple layers of `className` props to child elements. Consider offering a CSS variable for properties that a consumer may need to customize at the lower levels.

Ensure that other `...props` are spread before the `className` prop to avoid being overridden.

```tsx
import {clsx} from 'clsx'

export function Button({className, ...props}) {
  return <button {...props} className={clsx(classes.Button, className)} type="button" />
}
```

```tsx
// don't offer multiple classNames
export function Button({className, labelClassName}) {
  return (
    <button className={className} type="button">
      <div className={labelClassName}>{label}</div>
    </button>
  )
}
```

### Responsive design

We utilize PostCSS to allow for CSS variables to be used within media queries. The list of available media queries can be found in the [@primer/primitives viewport documentation](https://primer.style/foundations/primitives/size#viewport).

To use a viewport variable, write the `@media` rule as normal and place the variable in between the parentheses.

```css
@media screen and (--viewportRange-regular) {
  /* styles */
}
```

### Component prop variants as data-attributes

When a component has a variant, prefer using a data attribute over a modifier class.

Some common variants include:

- data-size
- data-variant
- data-loading

```css
/* Do */
.Button:where([data-size='small']) {
  height: var(--control-small-size);
}

/* Don't */
.ButtonSmall {
  height: var(--control-small-size);
}
```

Data attributes can be used as a boolean to represent a true or false state, or as a string to represent a specific value.

```css
/* boolean */

.Button:where([data-loading]) {
  cursor: not-allowed;
}

/* string */

.Button:where([data-size='small']) {
  height: var(--control-small-size);
}
```

#### Responsive data attributes

It is common to offer responsive props that allow the consumer to set styling based on the viewport size. This functionality can be extended via data attributes.

```tsx
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {getResponsiveAttributes} from '../internal/utils/getResponsiveAttributes'

// types
type PaddingScale = 'none' | 'condensed' | 'normal' | 'spacious'
type Padding = PaddingScale | ResponsiveValue<PaddingScale>

// prop
type StackProps = {
  padding?: Padding
}

// component
export function Stack({padding = 'normal'}: StackProps) {
  return <div {...getResponsiveAttributes('padding', padding)} />
}
```

```tsx
// usage
<Stack padding={{narrow: 'none', regular: 'normal'}} />
```

By default, we may offer a `padding` prop. The data attribute for `padding` might look like `data-padding="normal"`. To make the `padding` prop responsive, utilize the [ResponsiveValue](https://github.com/primer/packages/react/src/hooks/useResponsiveValue.ts) hook alongside the [getResponsiveAttributes](https://github.com/primer/react/src/internal/utils/getResponsiveAttributes.ts) utility.

```tsx
// apply the responsive data-attributes using getResponsiveAttributes
export function Stack({padding = 'normal'}: StackProps) {
  return <div {...getResponsiveAttributes('padding', padding)} />
}
```

By using `getResponsiveAttributes`, we can reference data attributes in the CSS file based on the prop type offerings.

```css
/* Stack.module.css */
.Stack {
  &:where([data-padding='none']),
  &:where([data-padding-narrow='none']) {
    padding: 0;
  }
}
```

### Specificity and nesting

Whenever possible, avoid deep nesting as it creates higher specificity selectors. Rely on `stylelint` to guide how many levels of nesting are acceptable.

#### Using `:where` to reduce specificity

The `:where` selector has a specificity of 0, which can be useful for allowing custom overrides. Use the `:where` selector for component options that utilize data-attributes like `&:where([data-size='small'])`.

### CSS variables

#### Primer primitives

Use CSS variables from `@primer/primitives` for size, typography, and color values. Certain components also have their own pattern level CSS variables from `@primer/primitives` that should be used.

#### Component CSS variables

CSS variables may also be used contextually to set component variants. These CSS variables are defined within the component CSS file.

```css
.Banner {
  background-color: var(--banner-bgColor);

  &:where([data-variant='critical']) {
    --banner-bgColor: var(--bgColor-danger-muted);
  }
}
```

#### Fallbacks

Avoid adding fallback values to CSS variables from `@primer/primitives`. These are added automatically and will be compiled to CSS variables with a fallback value.

### Support

Prefer CSS features no newer than Baseline 2022. When using CSS features from Baseline 2023 or newer, provide an appropriate fallback for when the feature is unavailable.

Use `@supports` to target when a specific piece of functionality is not available

```css
@supports (container-type: inline-size) {
  container: banner / inline-size;
}
```
