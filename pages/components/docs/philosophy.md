# Primer Components Philosophy


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
