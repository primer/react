---
name: component-spec
description: Use when defining or using the specification for a component
---

# Component Spec

A `SPEC.md` file represents individual Primer component API specs which cover markup structure, expected behavior, accessibility considerations, and all options/configurations.

All components that are publicly exported from Primer must have a component
spec. Spec files must be kept up-to-date as functionality is added, updated, or
removed. Spec files must be complete and accurate, as they are used to generate documentation for Primer components.

## Template

Use this template when authoring component spec files.

```md
# {Component} spec

<!-- Provide a brief description of the component and its purpose -->

## Features

<!-- List the features of the component, including any variations or states -->

### {Feature name}

<!-- Provide a description of the feature and its purpose -->

#### Markup

<!-- Provide the HTML markup for the feature, including any necessary attributes or classes -->

#### Behavior

<!-- Describe the expected behavior of the feature, including any interactions or animations -->

#### API

<!-- Describe the API for the feature, including any props, methods, or events -->

#### Accessibility

<!-- Describe any accessibility considerations for the feature, including ARIA attributes or keyboard interactions -->

## Glossary

<!-- An optional glossary of terms of definitions used in the document -->
```
