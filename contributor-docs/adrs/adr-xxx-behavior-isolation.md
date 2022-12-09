# ADR XXX: Isolating behaviors through custom clements and vanilla JavaScript

## Status

Adopted

## Related ADRs

- [ADR 002 Behavior Isolation](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-002-behavior-isolation.md)

## Providing behaviors via custom elements

### Context

While ADR 002 landed on the decision to:

 - Not share behaviour code between Primer View Components
 - Not use Custom Elements to drive behaviour of components
 
The assumptions, findings, and conclusions were weakly founded and have changed substantially since the approval of that ADR and many no longer hold true. This document will revisit some of those assumptions, and describe the current state of affairs, and conclude based on that:

### Updates on Findings

#### ShadowDOM

ShadowDOM is the preferred way for Custom Elements to mutate HTML, as their shadow root is encapsulated from the rest of the document. This means that a Custom Element is free to mutate HTML wihout disrupting reconcilers (such as React's Virtual DOM implementation) or observers (such as MutationObservers on the document).

ADR 002 describes complexity around Custom Elements and the ShadowDOM. It states that Primer React will accumulate added complexity if we were to implement Custom Elements with ShadowDOM, due to the requirement for polyfills.

Today, [ShadowDOM is very well supported](https://caniuse.com/shadowdomv1) across all modern browsers, and polyfills are not required to support GitHub Properties for ShadowDOM. GitHub.com has been using un-polyfilled ShadowDOM features for multiple years now, without issue.

Recently Primer React [added the Relative Time component](https://github.com/primer/react/pull/2484), a component that uses the ShadowDOM. This component works seamlessly with other components in the library, and does not require any additional support libraries to facilitate the use of ShadowDOM. The use of ShadowDOM within the underyling `relative-time` Custom Element allows it to update its display (a localised representation of the given time) without causing mismatches between React's internal representation of the DOM, and the DOM itself, as all updates are encapsulated away from React in the `relative-time`'s own private shadow root. This also means that React is able to do _less work_ reconciling updates to its `RelativeTime` component, which only needs to be re-rendered if the given datetime (or any other prop changes). This allows realtime updates of this component without triggering potentially costly re-renders from React.

#### SSR

Server Side Rendering, or "SSR" refers to construcing templates of HTML strings on the server side and delivering HTML. Custom Elements can be server rendered by specifying their tag name in the markup delivered, but they have no constraints around rendering on the server, as their behavior is entirely client side driven. Frameworks for the server such as Ruby on Rails can use "partials" or View Components to represent a custom elements markup for the server.

React's core library does not offer a way to represent React's component tree in either the real DOM, nor on the server. In this way, developers can use either the `react-dom` library on the client, or the `react-dom/server` library using a runtime like NodeJS on the server to deliver a similar experience to traditional server side applications built in frameworks like Ruby on Rails. This is sometimes referred to as "isomorphic" code. The unique selling point of "isomorphic" components, is that developers can write a component once and have it execute in both environments, delivering a string of HTML in a server response, and reconciling DOM operations on the client.

ADR 002 describes complexity around Custom Elements and Server Side Rendering. It claims that for Custom Elements to be well supported, that Primer React would need to accumulate added complexity which would be surfaced to the user, going on to claim that while libraries may exist their usage is antithetical to Custom Element patterns.

Primer React's [recent addition of the Relative Time component](https://github.com/primer/react/pull/2484) (itself a wrapper of the [`relative-time`](https://github.com/github/relative-time-element) custom element) demonstrates that a custom element can be loaded into a server side runtime such as NodeJS without causing error, by adding [2 additional lines of code to the element itself](https://github.com/github/relative-time-element/blob/4ab3f2807a02dfd687b2b7fa04553300ff87ddbe/src/relative-time-element.ts#L2-L3):

```typescript
const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window
const HTMLElement = root.HTMLElement || (null as unknown as typeof window['HTMLElement'])
```

These lines could also be added to the global context, to avoid adding it to each element.

The `RelativeTime` react component uses `@lit-labs/react`, which makes integrating the component into React painless, and requires [1 line of code for integration](https://github.com/primer/react/blob/d995bb8485fa1dfd0a3637b4851c5ac539b8416d/src/RelativeTime/RelativeTime.tsx#L8):

```typescript
const RelativeTime = styled(createComponent(React, 'relative-time', RelativeTimeElement))(sx)
```

There are no additional steps required for consumers of Primer React, and the component behaves as if it is a first-class React component, supporting the same properties and events as any regular React component. The server will render the Custom Element tag (in the case of the `RelativeTime` component, `<relative-time>`) and the client is able to assign class properties and use callbacks for events, as expected.

While React 18 and below require a small library like `@lit-labs/react`, due to the [lack of support for Custom Element](https://custom-elements-everywhere.com/libraries/react/results/results.html), React 19 [will likely need no such library](https://custom-elements-everywhere.com/libraries/react-experimental/results/results.html).

#### Styling with `styled-components`

Primer React currently uses a CSS-in-JS library called [`styled-components`](https://styled-components.com/). This library accumulates objects that map to CSS properties, and during runtime it will create a hash digest to use as the class name for the component, and inject the mapped CSS into a stylesheet on the page. This way, CSS lives in JavaScript object notation within the same file as the React Component itself. In addition to this, Primer React also uses [`styled-system`](https://styled-system.com/) which allows the use of style properties directly within a React Components props. Primer React uses the `sx` prop to allow for customisation of styles.

ADR 002 describes complexity around styling Custom Elements with the styled-components library. It claimed that a custom element must use another wrapping element to apply styles.

Today, Primer React's RelativeTime component can be styled using the `sx` prop, just like any other Primer React component.

#### Incompatibility with some React tools

React includes a feature called ["portals"](https://reactjs.org/docs/portals.html) which React describes as a "first-class way to render children into a DOM node that exists outside of the DOM hierarchy of the parent component". This allows React to reconcile its own component tree with specific entry points for other parts of the tree to be rendered in. A predominant use case for portals is to avoid issues around z-index or overflow, where a DOM node that is the child of an overflowing parent, is unable to break out of the overflow boundary. Portals attempt to solve this by simply moving the DOM node to a different part of the DOM tree.

ADR 002 claimed that some custom elements (citing examples such as `details-dialog` and `details-menu`) make assumptions about the DOM tree, which make it incompatible with React Portals. While this still remains true today, there are nuances which we should also consider.

It is generally good practice for Custom Elements to be flexible with regards to their children. But there are three common patterns which we see where these are restricted:

 - Custom Elements (and built in elements) can have a strict association with children via manual slot assignment. They are able to render only direct child nodes that match a set criteria. Creating Portals around these elements will not work.
 - Custom Elements may rely on event propagation from children. While Portals will capture events and redistribute them in accordance with the React tree, they do so using React's synthetic event system, and so creating Portals around children of Custom Elements may cause issues here.
 - Custom Elements (and built in elements) may rely on the "IDRef" pattern, where the custom element is pointed to the ID of another element via attribute (for example the `from` attribute). This pattern can work well with React Portals, as the Custom Element has a unique pointer to search for a single element within the entire DOM tree, not just its children. However due to the way React may add and remove elements from Portals during ts lifecycle, careful attention needs to be paid within the Custom Element to ensure it observes when its idref element is attached/detached from the document.

For many Custom Elements, this will simply not be an issue, but these three patterns may cause issues.

React Portals also come with their own caveats:

React Portals do not work with all elements and special consideration must already be made with regard to existing elements. For example while it is possible to create a React portal of any DOM element, elements which require a strict heirarchy such as `<details>/<summary>`, `<ul>/<li>`, `<dd>/<dt>` may cause issues if the child element is inside of a React Portal that gets moved to another part of the DOM (an [example is here](https://codepen.io/keithamus/pen/YzvMqjx?editors=0010), where you can see the `<details>` element provides a default `<summary>` of `"Details"` because the `<summary>` element has been moved).

React Portals will cause the document structure to change, which also means the Accessibility tree will change. For interactive elements within a Portal, this can cause issues with focus flow, unless very large remediation strategies are in place. This limits the usability of React Portals to either non-interactive elements, or elements which focus trap.

Given these constraints, it may not be correct to say that Custom Elements raise compatibility issues with React Portals, but rather that React Portals must be created with judicious consideration to how they may create issues within the DOM tree. When using React portals to work around z-index and overflow issues, this problem may better be solved with existing Web Platform standards such as the `<dialog>` element or `popover` attribute, neither of which introduce the caveats and considerations that React Portals do.

#### Extensibility

Custom Elements have two predominant modes of communication: their ancestors may set attributes on an element (or properties directly on the class instance) to communicate downward intent, and ancestors may also listen to events which Custom Elements will announce during their lifetimes, to allow ancestors to react. React components have similar modes of communication; instead of attributes React components have "props", and within a React components props, it may have callbacks which map to events.

Common in React applications is also the use of centralised state management. Centralised state management tools handle in memory data, and can dispatch it to arbitrary points in a React tree, which can then be mapped to props.

ADR 002 claimed that React Hooks offer better extensibility as they can interact with state which is driven by the consumer, while Custom Elements require listening to events on the document.

Given state management libraries are agnostic to the underyling framework, it is important to acknowledge that it is entirely possible to use state management libraries such as Redux or Mobx with many component frameworks such as Vue, Svelte or React, as well as with Custom Elements.

React components may also directly communicate with Custom Elements using the same mechanisms that React components communicate with built in elements - by passing props within JSX. A complication arises with React as it hard codes a list of attributes that map to class properties, and a list of `on*` prefixed callbacks that map to events. For example using the `hidden` prop on element rendered by React, react will look up the `hidden` property in its hard coded loookup table and map the prop to a `.hidden = ` call. Props given to JSX elements which are not in this hard coded table map to `setAttribute(name)` calls, and the result is stringified.

While React's support for custom events and custom attributes is not as robust as, say, Preact's, it is entirely possible to map attributes and events to React props.

Today, Primer React includes the `RelativeTime` component. Using the `@lit-labs/react` library `RelativeTime` wraps the `relative-time` custom element and automatically maps props directly to the class instance, and converts `on*` callback props to event listeners that can then observe event announcements from the element. In this way, `RelativeTime` behaves just like if it were written in React. The utilisation of the `@lit-labs/react` library requires 1 line of code:

```typescript
const RelativeTime = styled(createComponent(React, 'relative-time', RelativeTimeElement))(sx)
```

While React 18 and below require a small library like `@lit-labs/react`, due to the [lack of support for Custom Element](https://custom-elements-everywhere.com/libraries/react/results/results.html), React 19 [will likely need no such library](https://custom-elements-everywhere.com/libraries/react-experimental/results/results.html).


#### Organizational overhead

One consideration around sharing code between one or more implementations of primer is the organisational overhead of doing so.

ADR 002 enumerates concerns around development, including the issue of developing against multiple repositories and handling depdencies with `npm link`. It also enumerates concerns around orchestrating releases. Again, this is mostly a concern around the available tooling across multiple repositories and out of scope. 

These issues are not intrinsic to the use of shared code, however. For example sharing of code can be done within a monorepo. This is likely out of scope of the discussion of this ADR.

ADR 002 raises another concern around developement and contribution, with regard to familiarity of working with React and also the familiarity of working with Custom Elements, as well as the requirement for developers to context switch.

The Primer View Components library can serve as an example of handling these concerns. Today, Primer View Components has been successfully integrating and authoring components using Custom Elements for multiple years.

The Primer Behaviours library can also serve as an example of handling these concerns. Today, both Primer View Components and Primer React components utilise the `@primer/behaviors` library to manage shared code.

## Decision

### Custom elements

Given that today we are using custom elements to deliver many View Components, and the RelativeTime React component, it stands to reason that it is very much possible to continue doing so. Given it is of benefit to us to have shared behaviours across both Primer View Component and Primer React, this ADR concludes that we should continue to create components using Custom Elements where there is good precident to do so:

  - A component has client side driven behaviour
  - The component exists (or will need to exist) in both Primer React Components and Primer View Components
  - The component already exists as a Custom Element authored by GitHub
  - The component would benefit from using the ShadowDOM
