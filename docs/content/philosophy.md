---
title: Primer Components Philosophy
---

## Presentational Components
 We are focusing primarily on presentational components that help standardize common design patterns. Primer Components don't handle fetching and submitting data to/from APIs. If you would like to handle data in a Primer Component, feel free to create a wrapper around the Primer Component to do so.

## Assume that people will break the rules, provide safe ways for them to do so
While we aim to standardize design in Primer Components, we also try to provide safe ways for people to break rules. For example, we offer utility props via [styled-system](https://github.com/styled-system/styled-system) to allow users of the components some flexibility when it comes to color and spacing. Users also have the option to override the theme with a theme of their own.


## Pattern Components vs Helper Components

Our components can roughly be categorized into two different component types:


- Pattern Components

Pattern components represent a commonly used pattern in our UI. Some examples of pattern components are `Button`, `Avatar`, or `Label`.

- Helper Components

Helper components are components that help the user achieve common CSS patterns while maintaining some control over values used. Some examples of helper components are `Flex`, `Text`, `Grid`, and the `Position` components.