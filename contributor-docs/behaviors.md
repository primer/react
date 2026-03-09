_Note: This documentation is a draft and is expected to undergo several revisions before being adopted._

# Implementing Behaviors in Primer Components

Behaviors in Primer Components are implemented via React Hooks. Primer Components provides two types of behaviors: generic behaviors and component behaviors.

## Dependencies

**External dependencies:** Third-party/external dependencies are not allowed, except under very strict circumstances. If you need to use an external dependency, open an issue and discuss with the team.

**Internal dependencies:** Internal dependencies are fine and encouraged to reduce code duplication and maintain consistency. When taking an internal dependency, observe the following:

- No circular dependencies
- Components may depend on other components and component behaviors, but should avoid depending directly on generic behaviors.
- Component behaviors may depend on other component behaviors and generic behaviors.
- Generic behaviors may only depend on other generic behaviors.

See below for a visualization of allowed dependencies.

```
               ____________
              |            \*
+-------------V--------+   /
|   Generic behaviors  |---
+----------------------+
           ^
          *|     ___________
           |    |           \*
+----------|----V-------+   /
|  Component behaviors  |---
+-----------------------+
         ^
        1|    _____
         |   |     \*
+--------|---V-+   /
|  Components  |---
+--------------+

```

## Generic behaviors

Generic behaviors provide functionality that is not specific to any single component or class of components. If you can't tell which component it should operate on, it's probably a generic behavior. Generic behaviors are _low-level_. Generic behaviors may only have dependencies on other generic behaviors.

### Examples

- `useProvidedRefOrCreate`
- `usePosition`
- `useClickAway`
- `useTypeAhead`

## Component behaviors

Component behaviors specifically implement behaviors for components. Therefore, hooks that implement component behaviors should always return an object containing props objects to be spread across the elements that make up the component's JSX. While component behaviors do not necessarily have to be one-to-one, **a component may only use one component behavior**. Sometimes it makes sense to use the same component behavior on several components. For example: the Dialog, and Popover components may all use the `usePopover` component behavior.

### Component behavior examples

- `usePopover`
- `useComboBox`
- `useFilteredSearch`
- `useDetails`

## Implementation guidelines

All behaviors should be implemented as [React Hooks](https://reactjs.org/docs/hooks-intro.html).

Component behaviors should be relatively brief. A component behavior should build a component's experience through the combination of several configured generic behaviors.

Example: The Dialog component uses a `usePopover` behavior. The `usePopover` behavior in turn may call generic behaviors such as `usePosition` (to position the popover on the screen), `useClickAway` (to set up an event handler for clicking outside of the dialog), and `useFocusTrap` (to prevent focus from leaving the dialog while it is being shown).

### Component implementation

Component implementation is [discussed elsewhere](https://github.com/primer/react/blob/main/contributor-docs/CONTRIBUTING.md#developing-components), but with respect to behaviors, follow these guidelines.

- If a component has behaviors, it should make a call to exactly one component behavior hook.
- The hook will return an object containing multiple props objects. Each of the returned objects are props that should be spread onto the appropriate JSX element.
- Component implementations should be as clean as possible, mostly consisting of the JSX tree definition that the component renders.
- Component props and, in some circumstances, context values, should serve as arguments to component behavior hooks.

### Balancing API surface with supported scenarios

The [YAGNI Principle](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it) cautions developers against building out functionality that isn't presently needed, but as a library, Primer Components should carefully balance the API surface area with building a library that functions for a wide range of use cases. Since it is difficult to define a quantitative test to determine whether or not a component or a behavior should support a certain scenario, there will be some subjectivity when it comes to choosing to build certain features. When adding a feature that seems too specific, try to _generalize_ it. Can multiple use cases be accounted for by implementing a single generalized feature? Can a known needed use case be extrapolated into a feature that supports that use case along with other use cases that are not yet known to be needed? If so, use these considerations when designing your APIs.

### Sensible defaults, powerful configuration, and last-resort "escape hatches"

- Defaults should take users down the “happy path” and place them into the “pit of success.”
- Configuration allows the component to reach more use cases. Components that use configurations to deviate from defaults should be viewed as first-class supported scenarios, just as important as the defaults.
- Escape hatches may be necessary to support consumers with requirements that we haven’t considered. It should be cleared that using escape hatches “voids your warranty,” yet, they should be fully documented.

### Arguments to behaviors

- As mentioned above, behaviors should have sensible defaults but powerful configuration. Behaviors are configured via arguments passed to the hook.
- When possible, a hook should be able to be called with zero arguments to get all the defaults.
- Each argument that is required should have an individual parameter on the hook function.
- Optional arguments (i.e. “settings”) should be provided via a strongly typed settings object as the last argument to a hook function.

### Return value of behavior hooks

#### Component behavior hook return value

Component behavior hooks produce _props_. Therefore, the return value of a component behavior should be a collection of props objects, intended to be spread onto JSX elements that render a component.

- Each element of the object returned from a component behavior hook is a props object that can be spread onto a JSX element
- The names of the keys should accurately indicate the JSX element onto which those props should be spread

Example: The Dialog component uses a `usePopover` component behavior, which may return an object like:

```
{
  popoverProps: PropsObject,
  openClickTargetProps: PropsObject,
  closeClickTargetProps: PropsObject
}
```

Each of these props objects would then get spread onto their respective JSX elements.

#### Generic behavior hook return value

There are no restrictions on return values of generic behavior hooks. In fact, some behavioral hooks might not need to return anything. For example, a `useEscape` hook might simply set up a callback for an `Escape` keypress.

### Refs

- Often, a behavior will need to act on a real DOM element.
- In this case, the hook should return a ref as part of the returned props for that element. The ref will get spread onto the element, giving the ref access to it.
- Whenever you need a ref, it must be accepted as an optional setting to the hook. The hook then uses the `useProvidedRefOrCreate` hook to resolve a usable ref. Remember to return the resulting ref from the hook.

## Testing behaviors

- Whenever possible, test your changes in another application that makes heavy use of Primer Components.
- You may even want to build and “marinate” your component in another application before merging a change to Primer Components.
- Build the component, start using it in the application, and see how the component API feels. This approach works best for engineers at GitHub already working on a product written in React.
