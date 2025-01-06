# React Component APIs: Contents as data vs. Contents as children

Consider a React component that renders a list of items. Here are two possible APIs that component might expose, both achieving an equivalent result.

### A: Contents passed as React children <!-- markdownlint-disable-line heading-increment -->

```jsx
<List>
  <List.Item>New file</List.Item>
  <List.Divider />
  <List.Item>Copy link</List.Item>
  <List.Item>Edit file</List.Item>
  <List.Item variant="danger">Delete file</List.Item>
</List>
```

### B: Contents passed as data

```jsx
<List
  items={[
    {text: 'New file'},
    ActionList.Divider,
    {text: 'Copy link'},
    {text: 'Edit file'},
    {text: 'Delete file', variant: 'danger'},
  ]}
/>
```

Is one API better than the other generally? What about in this context (a "List" component)? Are there situations where it is better to choose one over the other? Let's try to answer these questions.

## Both APIs have valid use cases

This section simply argues that both of the patterns above are valid. Once we do this, we can attempt to define the criteria that helps the API designer choose one over the other.

### Contents passed as React children

This is the most common way to define the structure of content in React. In fact, all HTML elements work this way:

```jsx
<div>
  <div>Some content</div>
  <div>More content</div>
</div>
```

```jsx
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

```jsx
<select>
  <option value="1">First option</option>
  <option value="1">Second option</option>
</select>
```

Though less common, sometimes the HTML schema puts tight restrictions on the kinds of children an element may contain:

- `<select>` elements may only contain `<option>` and `<optgroup>` children.
- `<ul>` may only contain `<li>` children.
- `<span>` elements may only contain [phrasing content](https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2).

Furthermore, for custom React components, there is a first-class approach for rendering your component's children:

```jsx
function MyFancyBox({children}) {
  return <div style="border: 4px double cornflowerblue;">{children}</div>
}

// usage
;<MyFancyBox>I have a blue border!</MyFancyBox>
```

I call this "first class" because the JSX children that are defined between your component's opening and closing tags are wrapped up into a special prop called `children`. It is the component's responsibility to render those children in the appropriate spot.

**Clearly, this is a valid approach for a component API.**

### Contents passed as data

An alternative approach is to accept data in the form of a prop, which eventually gets turned into a React element by the component's implementation. In plain HTML, this is far less common. One example is the `title` attribute, which results in a tooltip:

```html
<button title="Save">💾</button>
```

One _could_ imagine a parallel universe where a tooltip is achieved by some other means!

```html
<button>
  <title>Save</title>
  💾
</button>
```

In custom React components, this pattern can be more common. In this example, the text to render is passed as a prop, as data rather than as pre-created React elements (i.e. JSX):

```jsx
function WordWrap({text, charactersPerLine}) {
  const lines = []
  for (let low = 0; low + charactersPerLine < text.length; low += charactersPerLine) {
    lines.push(text.substr(low, charactersPerLine))
  }
  const remaining = text.length % charactersPerLine
  if (remaining !== 0) {
    lines.push(text.substr(text.length - remaining))
  }
  return (
    <>
      {lines.map((l, index) => (
        <div key={index + l}>{l}</div>
      ))}
    </>
  )
}

// usage
;<WordWrap text="the quick brown fox jumps over the lazy dog" charactersPerLine={5} />
```

For further customization, one could imagine an optional `renderLine` prop that is used to give consumers control over the way a single line is rendered (see the section "Customization of content passed as data" below).

## Can't we just stick to one of the two patterns?

As shown above, both patterns can be valid approaches based on the component. But _why_ did we choose the data API for `WordWrap`, and _why_ did we choose the React children API for `MyFancyBox`?

### Let's try swapping

Since both patterns are equally powerful, we should be able to write equivalent components using the alternate approach.

#### MyFancyBox

Let's start with `MyFancyBox`:

```jsx
function MyFancyBox({contents}) {
  const boxChildren = []
  if (typeof contents === 'string' || React.isValidElement(contents)) {
    boxChildren.push(contents)
  } else if (typeof contents === 'function') {
    boxChildren.push(contents())
  } // implementation abbreviated for clarity
  return <div style="border: 4px double cornflowerblue;">{boxChildren}</div>
}

// usage
;<MyFancyBox contents="I have a blue border!" />
```

This example is so esoteric that I think it's obvious which is superior. The original has a less-complex implementation and a clearer API (in the second, just looking at the usage example, there is no way to know that contents can also accept a React element or a function callback).

#### WordWrap

Now let's dive into `WordWrap`, implemented with a React children-based API:

```jsx
function WordWrap({children, charactersPerLine}) {
  const items = React.Children.toArray(children)
  let textContent = ''
  for (const child of items) {
    if (typeof child === 'string') {
      textContent += child
    }
  }
  const lines = []
  for (let low = 0; low + charactersPerLine < textContent.length; low += charactersPerLine) {
    lines.push(textContent.substr(low, charactersPerLine))
  }
  const remaining = textContent.length % charactersPerLine
  if (remaining !== 0) {
    lines.push(textContent.substr(textContent.length - remaining))
  }
  return (
    <>
      {lines.map((l, index) => (
        <div key={index + l}>{l}</div>
      ))}
    </>
  )
}

// usage
;<WordWrap charactersPerLine={5}>the quick brown fox jumps over the lazy dog</WordWrap>
```

Let's get the obvious out of the way: the component implementation is more complex. Instead of receiving the raw text as a prop, the component has to iterate through its children, figure out which ones are text nodes, and build up the string.

But sometimes we are willing to make the sacrifice of increasing the complexity of our components if they become easier to use for our consumers. Is that what is happening here? One could argue that our new API is more straightforward and more readable! It's clear that the child text node of `WordWrap` will serve as the eventually-rendered contents, whereas the prop passed (`charactersPerLine`) is more of a configuration of the behavior.

On the other hand, if you are consuming this `WordWrap`, you might be left more confused. It is not clear without reading the code what is allowed as a child node. Can I include links or styled elements? How does it respond to receiving component children? In fact, if we want to the [principle of least surprise](https://en.wikipedia.org/wiki/Principle_of_least_astonishment), it may be necessary to support links or bolded text. While possible, this greatly increases the complexity of the component. Even if we do support this, it might be hard to discover this feature unless the user reads the docs or source code.

The first `WordWrap` implementation comparatively has a very strict API, easily discovered (with strong typing), and there is no possible way to use it which would produce a surprising result.

Because of the trade-offs described, I postulate that the first implementation of `WordWrap` is superior.

### The hybrid approach

It is possible to build a component API that supports both patterns. In other words, the consumer can pass data as a prop, which gets rendered into React elements, while also accepting those children being passed in directly.

We do not recommend this approach. The resulting behavior can be very hard to predict. How do the elements generated from data interact with the passed-in children? How are they ordered? Furthermore, the approach likely does not improve the developer experience.

## The ownership of React elements

I shall make the following claim:

> The owner of a React element is the component that _originally_ added it to the component tree.

For example, take the following two implementations of a simple (contrived) List component:

```jsx
function List({children, ordered}) {
  const Elem = ordered ? 'ol' : 'ul'
  return <Elem>{children}</Elem>
}
function Item({children}) {
  return <li>{children}</li>
}

// usage
function MyApp() {
  return (
    <List ordered={true}>
      <Item>Apple</Item>
      <Item>Banana</Item>
      <Item>Cantaloupe</Item>
    </List>
  )
}
```

```jsx
function List({items, ordered}) {
  const Elem = ordered ? 'ol' : 'ul'
  const listItems = items.map(i => <li key={i}>i</li>)
  return <Elem>{listItems}</Elem>
}

// usage
function MyApp() {
  return <List ordered={true} items={['Apple', 'Banana', 'Cantaloupe']} />
}
```

In the first example, `MyApp` "owns" the `List` and its 3 `Item`s. In the second example, `MyApp` only "owns" `List`, while the `List` owns the `Item`s it renders.

Why do I bring this up? If you assume that the _owner_ of an element has the _highest authority_ to configure that element (i.e. change the element type, its props, and its children), then any component API should strive to be designed to respect this assumption.

I believe this is a reasonable assumption: an element owner should be able to expect that the element will be rendered as close to the definition as possible. Otherwise, this violates the principle of least surprise.

### The `React.Children` anti-pattern

Based on the above assumption, using `React.Children` can be an anti-pattern. `React.Children` allows a component to reach into elements that it does not own. In our `WordWrap` example that uses React children, it is clear that we do not respect the owner (as defined above) of these elements. We iterate through children, ignoring anything that is not a text node.

With this reasoning, it's also easy to argue that `React.cloneElement` should be an anti-pattern. While that is true, there are ways to use `React.cloneElement` to simply augment children without altering their primary purpose or function. Adding additional props is a common use.

While anti-patterns sometimes have their valid uses, those uses should be individually scrutinized and avoided where possible.

## Customization of content passed as data

One significant benefit to the contents as children pattern is the fact that it lends itself very naturally to customization. Since the parent owns the children, it can create whatever children it likes, deciding their props and element types. This level of customization can be achieved using the contents as data pattern too, but it's not quite as straightforward (for the component author or the component consumer).

One common practice is for a component to accept a "render prop." The render prop is a function that returns JSX (the same as a function component). That function should be passed any data that may be needed for rendering. Of course, components should ship with a default renderer and not rely on being passed a render prop.

## How to decide

At this point we have shown that both patterns are valid, so how do we know which to use? Here is a comparison of the two approaches:

### Advantages of data contract

- Strongly typed
- All use cases are clearly defined
- Easy to manipulate data
- Easy to define a "pit of success" and lead the user there
- Can support "escape hatches"
- Component retains ownership of rendered contents
- Usually less code in the implementation

### Advantages of children-based contract

- Indicates flexibility
- Leaves room for a flexible implementation
- Recognizable from HTML
- Easier to read
- Ownership of contents remains with a parent or ancestor component

Based on these observations, here are some guidelines to decide which type of API to build:

### When to use a data contract

- Data doesn't cleanly transfer to an element structure
- Data needs to be manipulated before being converted to an element structure
- Certain well-defined scenarios need to be supported
- You want to control the types and structure of child elements
- The default rendering of the component is useful in many cases
- You are building a composite component

### When to use a children-based contract

- Your component doesn't care about the structure of children
- Your component doesn't need to use `React.Children`
- Your component is flexible enough to accommodate almost any child structure
- You are building an intermediate component that provides behaviors or styles to a container
