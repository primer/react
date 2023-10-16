---
title: Core Concepts
---

This document aims to discuss some of the core concepts of building with Primer React.

## Responsive props

It's really easy to set different values for most of our component props based on screen size! We take advantage of [styled-system](https://github.com/styled-system/styled-system)'s responsive props API in our components.

```
<Button display={['flex', 'flex', 'none']}/>

or

<Text fontSize={[1,1,1,4]}/>
```

## Providing your own theme

You can provide your own theme to Primer React! There are a few ways of doing this to varying degrees, checkout the [theme docs](https://primer.style/components/primer-theme) for more information.

## The `css` prop

When push comes to shove and you just _really_ need to add a custom CSS rule, you can do that with the `css` prop. Please don't abuse this :)

```
<Box css='border-bottom-right-radius: 0px' />

```

Please note that you will need to have the **[styled-components babel plugin](https://www.styled-components.com/docs/tooling#babel-plugin)** set up in your project in order to use the `css` prop.

## Types of components

We categorize our components into 3 general types. Building block components, pattern components, and helper components. Understanding how these types of components interact with each other can help you better understand how to get the most out of Primer React.

- Building Blocks

Building block components are components that are basic in their functions and can be used together with other components to build just about any UI. Some examples of building block components are `Box`, `Avatar`, `Details`, and `Link`.

- Pattern Components

Pattern components are components that are made up of several building block components to represent a commonly used pattern in our UI. Some examples of pattern components are `UnderlineNav` and `FilterList`. We plan on expanding our offering of pattern components in the near future.

- Helper Components

Helper components are components that help the user achieve common CSS patterns while maintaining some control over values used. An example of a helper component is `Box`.

## The `as` prop

The `as` prop is a feature that all of our components get from [styled-components](https://www.styled-components.com). It allows you to pass a HTML tag or another component to a Primer Component to be rendered as the base tag of that component along with all of it's styles and props.

For example, say you are using a `Button` component, and you really need to apply `Box` styles to it. You can compose `Box` and `Button` like so:

```.jsx
<Box display="flex" as={Button} href='https://github.com'>Hello</Box>
```

This will allow you to use all of the `Button` props _and_ all of the `Box` props without having to wrap your `Button` component in another `Box` component.

**This pattern does have some limitations.** Usage of the `as` prop can lead to unexpected output. In the example above, if the user had done `<Button as={Box}/>` instead, because the `Box`'s render method is ultimately applied, and `Box` components render `div`'s, you'll see that the rendered component is a `div` when ideally you'd like it to be a `button`. It is also not always clear how the styles in both components will interact and/or override each other.

For these reasons, **we recommend only using the `as` prop when you cannot achieve the same result by nesting components.** The `Box` / `Button` example could be done like so:

```.jsx
<Box display="flex">
  <Button href='https://github.com'>Hi</Button>
</Box>
```
