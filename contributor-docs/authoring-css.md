# Authoring CSS

Primer React uses CSS Modules(link) for styling. CSS Modules allow us to write component scoped CSS while still authoring in a traditional `.css` file. This guide covers best practices for writing CSS in Primer React.

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

<div className={classes.Banner}>Banner</>
```

## Code styles 

### CSS class names

When component classnames are compiled, they receive a prefix of the component name `prc-{component}-` and a suffix of a random hash.

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

Use PascalCase for class names. Additional characters like `-` dashes or `_` underscores must be escaped with a `\` backslash in TSX for the class name to be recognized, which can be cumbersome.

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

Prefer using pseudo elements over classnames for state. 

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

only at top level (once)

### Component prop variants as data-attributes

When a component has a variant, prefer using a data-attribute over a modifier class.

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

TODO add responsive data-variants

data-variant as string
data-variant as boolean

### Specificity and nesting

Whenever possible, avoid deep nesting as it creates higher specificity selectors. Rely on stylelint to guide how many levels of nesting are acceptable.

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


- classname at the top level of a component

- baseline 2022
- supports
- one file per component
- linting

### Support

Prefer CSS features no newer than Baseline 2022. When using CSS features from Baseline 2023 or newer, provide an appropriate fallback for when the feature is unavailable.

Use `@supports` to target when a specific piece of functionality is not available

```css
@supports (container-type: inline-size) {
  container: banner / inline-size;
}
```

### Extra notes below

Import CSS modules after JS imports to avoid certain CSS ordering issues
When allowing className to be passed as a prop, prefer supporting a className only on the top-level element that is rendered instead of supporting multiple className’s



[Primer] Write selectors that target components that the current component owns
For example, don’t put all the styles for several components across different files in one single CSS Module file
Tip: when needing to style or target child components, consider using CSS 
Prefer one CSS Module file per component
Caveat: it is okay to have multiple components in a file and it is okay to have one CSS Module file for this scenario
Over time, breakout as-needed

side-effect properties
stylelint rule to check proper flex usage
