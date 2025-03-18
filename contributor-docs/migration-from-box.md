# Migration away from `Box`

## Why Migrate?

The `Box` component is a utility component that provides a convenient way to apply styles to elements and is simply a `div` element by default. However, it can be less performant than using standard HTML elements with CSS Modules. It has now been deprecated.

### Box using the `sx` prop

Replace the Box component with a standard HTML element such as `div`.

```jsx
<Box sx={{p: 3, bg: 'gray.1'}}>Content here</Box>
```

```jsx
<div className={classes.example}>Content here</div>
```

### Box using the `as` prop

If the Box is currently using the `as` prop to render a different HTML element, make sure to use that element instead.

```jsx
<Box as="section" sx={{p: 3, bg: 'gray.1'}}>
  Content here
</Box>
```

```jsx
<section className={classes.example}>Content here</section>
```

### Box using style attributes

If the Box is using style attributes, you can replace it with a standard HTML element and use CSS Modules to apply the styles.

```jsx
<Box minWidth={200} maxWidth={400} sx={{p: 3, bg: 'gray.1'}}>
  Content here
</Box>
```

```jsx
<div className={clsx(classes.example)}>Content here</div>
```

```css
.example {
  padding: 16px;
  background-color: var(--gray-1);
  min-width: 200px;
  max-width: 400px;
}
```
