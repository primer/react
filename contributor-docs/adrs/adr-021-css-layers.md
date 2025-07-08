# CSS Layers

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | 🚧     |
| Adopted  | 🚧     |

## Context

During our transition to CSS Modules, we made use of the `:where()` pseudo-class
to help create stable selector specificity. Now that teams could provide a
`className` to a component we needed to ensure that selectors that we used in a
component had matching specificity to the given class name, otherwise we would
run into the risk of accidentally shipping a breaking change.

For example, consider setting a `color` on a component:

```css
/* v1.0.0 of a component */
.Component {
  color: var(--fgColor-default);
}

/* The override class placed on the same element as the component class */
.override {
  color: var(--fgColor-muted);
}
```

Now, in a future version of the component, we increase the specificity of the
selector:

```css
/* v1.1.0 of a component */
.Component[data-variant='default'] {
  color: var(--fgColor-default);
}
```

With this change, the `override` class will no longer override the color as it
did in the previous version.

To mitigate this, we can use the `:where()` pseudo-class to limit the
specificity of our selectors to `0,1,0`, for example:

```css
.Component:where([data-variant='default']) {
  color: var(--fgColor-default);
}

/* Or with nesting: */
.Component {
  &:where([data-variant='default']) {
    color: var(--fgColor-default);
  }
}
```

However, this approach requires us to use the `:where()` pseudo-class in every
selector where we would like to have stable specificity. This can lead to issues
where you may forget to use the `:where()` pseudo-class in a selector, or where
you are not sure if you need to use it or not so you add it everywhere.

## Decision

Instead of making use of the `:where()` pseudo-class in every selector, we will
use a CSS layer to create a stable selector specificity. This will allow us to
author our CSS without having to worry about the specificity of each selector.

Our example from earlier would now look like:

```css
@layer primer.components.component {
  .Component[data-variant='default'] {
    color: var(--fgColor-default);
  }
}
```

Using a CSS layer in this way allows us to author our CSS without having to
consider whether or not to use `:where()`. This is due to the nature of CSS
layers where if two layers are targeting the same element, the last layer
targeting that element will take precedence.

Since we are moving our CSS into a CSS layer, this means that later layers (in
particularly the anonymous layer) will take precedence when two rules are
matching the same element. For example:

```css
@layer primer.components.component {
  .Component[data-variant='default'] {
    color: var(--fgColor-default);
  }
}

.override {
  color: var(--fgColor-muted);
}
```

It's important to note that even though the `override` class has lower
specificity, it will still take precedence over the
`.Component[data-variant='default']` due to how CSS layers work.

### Impact

This decision will impact our component styles that are authored with CSS
Modules. For each file, we will need to update the module to be wrapped in a CSS
layer. This layer will be named following the convention:
`primer.components.<component-name>`

In addition, selectors that use `:where()` may now be refactored to no longer
use the `:where()` pseudo-class.

## Unresolved questions

- Is it possible for stylelint to have a rule to guarantee the presence of a CSS
  layer in a CSS Module file for a component?
