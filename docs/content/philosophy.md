---
title: Primer React Philosophy
---

## Presentational Components

We are focusing primarily on presentational components that help standardize common design patterns. Primer React components don't handle fetching and submitting data to/from APIs. If you would like to handle data in a Primer Component, feel free to create a wrapper around the Primer Component to do so.

## Assume that people will break the rules, provide safe ways for them to do so

While we aim to standardize design in Primer React, we also provide additional styling flexibility through the [`sx` prop](/overriding-styles). This enables small customizations to color and spacing, using values from the theme. Users also have the option to override the theme with a theme of their own.

## Pattern Components vs Helper Components

Our components can roughly be categorized into two different component types:

- Pattern Components

Pattern components help us repeat commonly used UI patterns and interactions in order to maintain our brand and provide a great user experience. Some examples of pattern components are `Button`, `Avatar`, or `Label`.

- Helper Components

Helper components are components that help the user achieve common CSS patterns while maintaining some control over values used. An example of a helper component is `Box`.
