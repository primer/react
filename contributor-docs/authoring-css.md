# Authoring CSS

Primer React uses CSS Modules(link) for styling. CSS Modules allows us to write component scoped CSS while still authoring in a traditional `.css` file. This guide covers best practices for writing CSS in Primer React.

## Getting started

## Code styles 



- classname style
- pseudo elements
- nesting
- variants data attributes
- use where
- classname at the top level of a component
- no fallbacks
- baseline 2022
- supports
- one file per component
- linting

Prefer class names that are easy to import in JavaScript
Tip: avoid dashes, use camelCase or PascalCase
Prefer pseudo-class over a custom class name
Tip: use .ComponentName:disabled over .ComponentName--disabled
Prefer data attributes over modifier classes
Tip: data-variant=”primary” over .ComponentName--primary
Prefer selectors with the least specificity needed
Tip: avoid deep nesting as it creates higher specificity selectors
Tip: use the :where selector to have a specificity of 0, for example :where([data-variant=”primary’])
Import CSS modules after JS imports to avoid certain CSS ordering issues
When allowing className to be passed as a prop, prefer supporting a className only on the top-level element that is rendered instead of supporting multiple className’s
If targeting a in a component is needed, prefer using a stable class name
Note: the specificity of styles applied to this part of the component is not a part of the public API
Another alternative is to allow customization through CSS Custom Properties that can be set with a custom className
[Primer] avoid setting fallback values for design tokens from Primitives (these are added automatically)
Ideally use CSS features no newer than Baseline 2022
When using CSS features from Baseline 2023 or newer, provide an appropriate fallback for when the feature is unavailable
Tip: use @supports to target when a specific piece of functionality is not available
[Primer] Write selectors that target components that the current component owns
For example, don’t put all the styles for several components across different files in one single CSS Module file
Tip: when needing to style or target child components, consider using CSS Custom Properties as a bridge between parent and child (reference)
Prefer one CSS Module file per component
Caveat: it is okay to have multiple components in a file and it is okay to have one CSS Module file for this scenario
Over time, breakout as-needed
