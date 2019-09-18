---
title: Primer Components Philosophy
---

## Presentational Components
 We are focusing primarily on presentational components that display UI. This doesn't mean we won't ever handle complex JS behavior beyond UI interaction in our components, but for now we are focusing on simple, UI components that don't handle submitting or fetching data. If you would like to handle data in a Primer Component, feel free to create a container component or high order component around the Primer Component to do so.

## Assume that people will break the rules, provide safe ways for them to do so
While one of the goals of a design system is to enforce consistent UI, successful design system tools must also provide _some_ flexibility to it's users. Otherwise, you will have a stagnant component library that can't adapt to real life implementations. We offer utility props via [styled-system] to allow users of the components some flexibility when it comes to color and spacing.

Another important aspect of providing safe ways for users to break rules is our Primer Theme. The theme is a collection of common design values such as spacing, font sizes, colors, and more. While you're able to tweak some styles, adjusting these values with other values from the theme helps us keep design iterations within the realm of our design system.


## Building Blocks vs Pattern Components vs Helper Components

All of our components can be categorized into three different types.

- Building Blocks

Building block components are components that are basic in their functions and can be used together with other components to build just about any UI. Some examples of building block components are `Box`, `Avatar`, `Details`, and `Link`.

- Pattern Components

Pattern components are components that are made up of several building block components to represent a commonly used pattern in our UI. Some examples of pattern components are `UnderlineNav` and `FilterList`. We plan on expanding our offering of pattern components in the near future.

- Helper Components

Helper components are components that help the user achieve common CSS patterns while maintaining some control over values used. Some examples of helper components are `Flex`, `Text`, `Grid`, and the `Position` components.

## Building block components should be flexible

Building block components are meant to be flexible and highly reusable. They lean on our basic design system tokens like font sizes, spacing, and colors - but they are flexible in many ways so that users can manipulate them as needed while staying close to our design system.

## Pattern components should be opinionated
Pattern components are much more opinionated than building block components. They represent common UI patterns in GitHub and do not allow as much visual flexibility.
