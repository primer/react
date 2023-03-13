# ADR 004: Strict props or Composite components

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | 🚧     |

<br/>

_Note: Consumer is used multiple times on this page. It refers to the developers consuming the component API and not end users._

<br/>

## Decision:

1. Prefer using children for “content”

2. For composite components, the API should be decided by how much customisation is available for children.

For components that have design decisions baked in, should use strict props. For example, the color of the icon inside a Button component is decided by the `variant` prop on the Button. The API does not allow for changing that.

```jsx
<Button variant="danger" leadingIcon={TrashIcon}>
  Delete branch
</Button>
```

On the other hand, if we want consumers to have more control over children, a composite API is the better choice.

```jsx
<ActionList.Item>
  <ActionList.LeadingVisual>
    <Avatar src="https://github.com/mona.png" />
  <ActionList.LeadingVisual>
  mona
</ActionList.Item>
```

## Prefer using children for “content”

With React, `children` is the out-of-the-box way for putting [phrasing content](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#phrasing_content) inside your component. By using `children` instead of our own custom prop, we can make the API “predictable” for its consumers.

<img width="373" alt="image" src="https://user-images.githubusercontent.com/1863771/144945223-70c4c800-5827-4985-9f18-0ab416eba058.png"> <!-- markdownlint-disable-line no-default-alt-text -->

```jsx
// prefer this
<Flash variant="success">Changes saved!</Flash>
// over this
<Flash variant="success" text="Changes saved!"/>
```

<br/><br/>

Children as an API for content is an open and composable approach. The contract here is that the `Flash` controls the container while the consumer of the component controls how the contents inside look.

Take this example of composition:

<img width="377" alt="flash with icon" src="https://user-images.githubusercontent.com/1863771/144945208-308393e0-013d-45a9-a14d-a51bf4d4cfad.png">

```jsx
import {Flash} from '@primer/react'
import {CheckIcon} from '@primer/octicons-react'

render(
  <Flash variant="success">
    <CheckIcon /> Changes saved!
  </Flash>,
)
```

<br/>

### Pros of this approach here:

1. The component is aware of recommended use cases and comes with those design decisions backed-in. For example, using an `Icon` with `Flash` is a recognised use case. We don’t lock-in a specific icons, but we do set the size, variant-compatible color and the margin between the icon and text.

   For example:

     <img width="373" alt="flash variants" src="https://user-images.githubusercontent.com/1863771/144945213-a16fe4a3-af07-4b10-9bcb-369ec0f35a77.png">

   ```jsx
   <Flash variant="success">
     <CheckIcon /> Changes saved!
   </Flash>
   <Flash variant="danger">
     <AlertIcon /> Your changes were not saved!
   </Flash>
   ```

2. You can bring your own icon components, the component does not depend on a specific version of octicons.
3. When a product team wants to explore a use cases which isn’t baked into the component, they are not blocked by our team.

   Example:

   <img width="375" alt="flash with icon and close" src="https://user-images.githubusercontent.com/1863771/144945209-1480b9f5-895d-458d-8c68-4ce7b6d6b7b4.png">

   ```jsx
   <Flash variant="success" sx={{display: 'flex', justifyContent: 'space-between'}}>
     <span>
       <CheckIcon /> Changes saved!
     </span>
     <Button variant="invisible" icon={CheckIcon} aria-label="Hide flash message" onClick={onDismiss} />
   </Flash>
   ```

<br/>

### Tradeoffs of this approach / When not to use children

Our goal isn't to put all content inside children though. Composition offers flexibility to the consumer of the component; this flexibility, however, can also lead to inconsistencies.

<img width="375" alt="image 6" src="https://user-images.githubusercontent.com/1863771/144945216-6237084d-3d97-45c7-9505-6aed473afb03.png">

```jsx
<Flash variant="success">
  // uh oh, we don't know if that color or icon size is the right choice!
  <CheckIcon size={20} color="success.emphasis" /> Changes saved!
</Flash>

<Flash variant="success">
  <CheckIcon /> Changes saved!
</Flash>
```

_Note: We need to assume good intent here, developers using the components aren’t trying to break the system. They are either trying to implement something that the system’s happy path does not support OR there are multiple ways of doing something with Primer and they have unintentionally picked the approach that is not recommended._

<br/>

The general wisdom is to _Make the right (recommended) thing easy to do and the wrong (not recommended) hard to do_. When going off the happy path, developers should feel some friction, some weight, code that “feels hacky” or feels like a workaround.

In the above case, if we want to make the recommended path easier and other paths harder, we can change the API to look something like this:

```jsx
<Flash variant="success" icon={CheckIcon}>
  Changes saved!
</Flash>
```

We are still using `children` for text content, but we have moved the `icon` back as a prop with reduced flexibility.

When intentionally going off the happy path, developers can still drop down an abstraction level to add an `Icon` to `children`, though they would have to pick up the additional effort of setting compatible color, size and margin themselves. However, when it’s unintentional, it would feel like way too much work that the component should be doing automatically.

```jsx
<Flash variant="success">
  <CheckIcon size={20} color="success.emphasis" sx={{marginRight: 2}} />
  Changes saved!
</Flash>
```

<br/>

_Sidenote: We might want to name this prop `leadingIcon`, even if there is no `trailingIcon`. Consistent names across components plays a big role in making the API predictable._

---

<br/>

You can see this pattern used in `Button`:

The icon gets its color and margin based on the variant and size of the `Button`. This is the happy path we want folks to be on, so we ask for the icon component instead of asking the developer to render the icon.

<img width="141" alt="image 9" src="https://user-images.githubusercontent.com/1863771/144945219-a853ed1c-f21d-412e-a388-6d74ec436645.png">

```jsx
<Button leadingIcon={SearchIcon}>Search</Button>
<Button leadingIcon={SearchIcon} variant="primary" size="large">Search</Button>
```

```jsx
// we prefer this:
<Button leadingIcon={SearchIcon}>Search</Button>
// over these:
<Button><SearchIcon/> Search</Button>
<Button leadingIcon={<SearchIcon/>}>Search<Button>
```

<br/>

---

<br/>

## Flexibility is a spectrum and the case for composite components

<br/>

### 1. Scenarios where we want to restrict flexibility and bake-in design decisions for the most part, but allow some configuration.

Consider this fake example:

<img width="388" alt="image 7" src="https://user-images.githubusercontent.com/1863771/144945217-fd5eeab0-bfa5-4c53-9add-621dcd87b48c.png">

We want users to be able to customise if the `Icon` is outline or filled. (I know I know the example is bit silly, but please go with it)

<br/>

Extending our `strict` API, we could add another prop to the component:

```jsx
<Flash variant="success" icon={CheckIcon} iconVariant="filled">
  Changes saved!
</Flash>
```

When we have an “element” and “elementProp” as props on a component, it’s a sign that we should create a child component here that is tied to the parent component:

```jsx
<Flash variant="success">
  <Flash.Icon icon={CheckIcon} variant="filled" />
  Changes saved!
</Flash>
```

<br/>

The `Parent.Child` syntax signals that this component is tied to the parent.

We can look at `Flash.Icon` as a stricter version of `Icon` that automatically works with different variants of `Flash`. It does not need to support all the props of `Icon` like size or color, only the ones that are compatible in the context of a `Flash`.

It can be tempting to "future proof" our API and adopt this pattern early, but we should resist that until the use case presents itself. _It is always easier to open up the API later than to close it down._

<br/>

_Note: We might want to name this component `Flash.LeadingIcon`, even if there is no `trailingIcon`. We should try to keep the names consistent across components with the same behavior, but that should not be a deciding factor in making the choice between prop or child component._

<br/>

---

<br/>

We use this pattern as well in `Button`, `Button.Counter` is a restricted version of `CounterLabel` that automatically adjusts based on the variant and size of a `Button`:

<img width="184" alt="image 8" src="https://user-images.githubusercontent.com/1863771/144945218-5154b8a1-8854-4335-926c-08a4ffac6d9d.png">

````jsx
<Button>
  Watch <Button.Counter>1</Button.Counter>
</Button>

<Button variant="primary">
  Upvote <Button.Counter>1</Button.Counter>
</Button>

<br/>

---

<br/>

### 2. Exposing customisation options for internal components:

Another place where composite patterns lead to aesthetic predictable APIs is when we want to expose customisation options for internal components.

For Example, [legacy ActionMenu](https://primer.style/react/deprecated/ActionMenu) accepted `overlayProps` and `anchorContent` to pass it down to the implementation details:

<img width="337" alt="image 10" src="https://user-images.githubusercontent.com/1863771/144945221-b6a4e7f0-5134-4485-bfd0-1e4b2e77a70e.png">

```jsx
<ActionMenu overlayProps={{width: 'medium'}} anchorContent="Open column menu">
</ActionMenu>
````

<br/>

When we see a a prop which resembles “childProps" or `renderChild` on the container/parent, it's a sign that we should surface this detail in the API by creating a composite component:

```jsx
// we created an additional layer so that
// the overlay props go on the overlay component
<ActionMenu>
  <ActionMenu.Button>Open column menu</ActionMenu.Button>
  <ActionMenu.Overlay width="medium">
    <ActionList>...</ActionList>
  </ActionMenu.Overlay>
</ActionMenu>
```

<br/>

---

<br/>

### 3. Layout components with unstructured content

In components where there is a place for consumers to fill in freeform or unstructured content, we should prefer the composite children components. This is especially common in the cases of Dialogs, Menus, Groups.

Consider this fake `Flash` example where description is unstructured content:

<img width="599" alt="image 11" src="https://user-images.githubusercontent.com/1863771/144945222-91b2e7c8-479e-4076-833f-824c29b93f61.png">

```jsx
// prefer this:
<Flash variant="success" icon={CheckIcon}>
  <Flash.Title>Changes saved</Flash.Title>
  <Flash.Description>
    These changes will be applied to your next build. <Link href="/docs/builds">Learn more about builds.</Link>
   </Flash.Description>
</Flash>

// over this:
// Trying to systemise content by finding patterns in
// unconstructured content can lead to overly prescriptive API
// that is not prectictable and hard to remember
<Flash
  variant="success"
  icon={CheckIcon}
  text="Changes saved"
  description="These changes will be applied to your next build."
  link={{ text: "Learn more about builds.", url: "/docs/builds" }}
/>
```

<br/>

_Sidenote: It’s tempting to change `icon` to `Flash.Icon` here so that it’s consistent with the rest of the contents. This is a purely aesthetic optional choice here:_

```jsx
<Flash variant="success">
  <Flash.Icon icon={CheckIcon} />
  <Flash.Title>Changes saved</Flash.Title>
  <Flash.Description>
    These changes will be applied to your next build. <a href="/docs/builds">Learn more about builds.</a>
  </Flash.Description>
</Flash>
```

<br/>

---

<br/>

We use this pattern in `ActionList` :

<img width="484" alt="actionlist" src="https://user-images.githubusercontent.com/1863771/144945215-253e2af5-37ae-40d8-bc1c-7a75780428be.png">

```jsx
<ActionList showDividers>
  <ActionList.Item>
    <ActionList.LeadingVisual><Avatar src=""/></ActionList.LeadingVisual>
    mona
    <ActionList.Description>Monalisa Octocat</ActionList.Description>
  <ActionList.Item>
  <ActionList.Item>
    <ActionList.LeadingVisual><Avatar src=""/></ActionList.LeadingVisual>
    primer-css
    <ActionList.Description variant="block">GitHub</ActionList.Description>
  <ActionList.Item>
</ActionList>
```

---

<br/>

### Case study with Button:

<img width="195" alt="image 12" src="https://user-images.githubusercontent.com/1863771/145045540-9c5326ee-60f8-4678-aca3-46a754ce16bb.png">

Prefer using children for “content”

```jsx
// we prefer:
<Button>Watch<Button>
<Button variant="primary">Watch<Button>

// over this:
<Button label="Watch"/>
<Button label="Watch" variant="primary"/>
```

<img width="227" alt="image 13" src="https://user-images.githubusercontent.com/1863771/145045542-0d80491b-75e1-4304-b9fe-8c2cca80b298.png">

The Icon should adapt to variant and size of the `Button`. We could use a `EyeIcon` in children here:

```jsx
<Button>
  <EyeIcon /> Watch
</Button>
```

But, we want to discourage customising the Icon’s color and size in the application. So, in the spirit of making the right thing easy and the wrong thing hard, we ask for the component in a prop instead:

```jsx
// we prefer:
<Button leadingIcon={EyeIcon}>Watch</Button>
// over these:
<Button><EyeIcon/> Watch</Button>
<Button leadingIcon={<EyeIcon/>}>Watch</Button>
```

<img width="293" alt="image 14" src="https://user-images.githubusercontent.com/1863771/145045544-1a1651f1-fbcf-4022-8e9b-b37558bb2466.png">

We want to add a `Counter` that adapts to the variant without supporting all the props of a `CounterLabel` like `scheme`.

`Button.Counter` is a restricted version of `CounterLabel`, making the right thing easy and wrong thing hard:

```jsx
// we prefer:
<Button leadingIcon={EyeIcon}>
  Watch <Button.Counter>1</Button.Counter>
</Button>
// over this:
<Button>
  <EyeIcon/> Watch <CounterLabel>1</CounterLabel>
</Button>

// it's possible to make a strong case for this option as well:
<Button leadingIcon={EyeIcon} counter={1}>Watch</Button>
```
