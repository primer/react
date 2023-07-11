# ADR 010: Isolating behaviors through custom elements and vanilla JavaScript

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | ✅     |

## Context

While [ADR 002](https://github.com/primer/react/blob/main/contributor-docs/adrs/adr-002-behavior-isolation.md) landed on the decision to:

- Share JavaScript behaviour as "vanilla" functions which can be used between Primer View Components (PVC) and Primer React (PRC), consumed via React Hooks in PRC.
- Not use Custom Elements to drive behaviour of components.

Our perspective on the ADR has changed since its approval and this document will address those changes.

## Updates on Findings

### JavaScript functions and React Hooks

Currently, we share some behaviours across PVC and PRC as JavaScript functions. Behaviours like `focusTrap`, `focusZone`, `anchoredPosition` are developed within `primer/behaviors` and can be imported into PVC or PRC and utilised.

The drawbacks to using JavaScript functions that we can currently see, is that they:

- Do not have standard invocation pattern, they are called like functions but the arguments they take can become complex quickly.
- They need to be "wired in" manually into our components, requiring the passing of containing elements and other state.
- They're difficult for engineers to use as they do not apply the standard component pattern of each of the respective frameworks. For example an engineer cannot add a `FocusTrap` component to an element to make it trap focus, instead an engineer must create their own component which calls into this behaviour.

This complexity bears the biggest weight in Primer React, as we add abstractions of these behaviours out into Hooks, which creates another layer of complexity and indirection. If we remodelled these as Web Components, we'd vastly simplify a lot of this:

- Web Components have a standard invocation pattern and can be adopted into the component model of each respective framework (see below).
- Web Components do not need to be wired in manually, as they are part of the tree that they share association with. This means they can manage their own internal state and be driven by other components far more easily.
- Engineers _can_ easily drop a Web Component into their tree to add the desired behavior. For example an engineer can add a `<focus-trap>` element into their tree to make it trap focus. This does not require additional components or hooks to deliver the functionality.

Taking a closer look at an example behaviour can clarify this. Looking at `focusTrap` as an example, we can see for it to work it needs a container element. It also needs to know where the initial focus is (another element), and we need to able to manage the lifecycle of how Focus Trap works, so it gets an abort signal too. These are all passed in as arguments into the `focusTrap` function.

In React, to make this slightly easier, we create a [~100LOC `useFocusTrap` hook](https://github.com/primer/react/blob/a0db832302702b869aa22b0c4049ad9305ef631f/src/hooks/useFocusTrap.ts). However this hook can only really solve the issue of state management, and so it simplifies the creation of React refs and the Abort Controller, but the refs still need to be managed inside of component code.

When it comes to actually implementing the `useFocusTrap` hook, [we end up supplying the refs](https://github.com/primer/react/blob/5dd4bb1f7f92647197160298fc1f521b23b4823b/src/AnchoredOverlay/AnchoredOverlay.tsx#L106), as they typically [need additional management](https://github.com/primer/react/blob/5dd4bb1f7f92647197160298fc1f521b23b4823b/src/AnchoredOverlay/AnchoredOverlay.tsx#L147-L152), making the hook somewhat of a leaky abstraction.

The additional overhead of the hook now requires [documentation](https://github.com/primer/react/blob/b3e422042f118637886ab988aea1672d2c2fe78f/docs/content/focusTrap.mdx#usefocustrap-hook) and [tests](https://github.com/primer/react/blob/5dd4bb1f7f92647197160298fc1f521b23b4823b/src/stories/useFocusTrap.stories.tsx), in addition to the docs and tests we already have for the behavior.

It's a little simpler using PVC if the View Component needs additional behaviour, as we already have a Web Component we don't need concepts like refs, we only need to pass `this`. [The AbortController still needs to be created to help manage the lifecycle of the trap](https://github.com/primer/view_components/blob/ac33b436f817e982108e313ad12f2d388d91dcd3/app/components/primer/alpha/modal_dialog.ts#L72-L75).

In both instances, a component is required to manage focus trapping, as the `focusTrap` function needs a container to attach to. If this were a Web Component it would be its own container, and so would not need a component to invoke it, as it would _be_ a component. In addition, a Web Component could manage its own lifecycle and provide a far simpler method of invocation and management of state than the function.

On top of this complexity, there's also the complexity of the behaviour itself. To properly manage focus trap, the focusTrap function creates [two sentinel elements and appends them to do the DOM](https://github.com/primer/behaviors/blob/acbcc744f56837166c2a3f76bab1f3572b61d0ca/src/focus-trap.ts#L67-L68). This increases complexity in debugging code, as there are surprising new DOM elements in the tree. This also [effects tests](https://github.com/primer/react/blob/386561a37b2b6f1f9d4b597e0ac6ede3a40ccbf7/src/__tests__/__snapshots__/AnchoredOverlay.test.tsx.snap#L222-L239). A Web Component would be able to utilise ShadowDOM to create clean separation of utility elements required by the behavior.

While `focusTrap` has been used as an example, it should be noted this is not exceptional, rather representitive. `focusZone` has a similarl [`useFocusZone` hook](https://github.com/primer/react/blob/5dd4bb1f7f92647197160298fc1f521b23b4823b/src/hooks/useFocusZone.ts), as does `anchoredPosition` with [`useAnchoredPosition`](https://github.com/primer/react/blob/5dd4bb1f7f92647197160298fc1f521b23b4823b/src/hooks/useAnchoredPosition.ts).

Were these behaviours Web Components, then they would be their own container, they would have lifecycle hooks to manage internal state, and they would have a standard invocation pattern. We'd simply drop `<focus-trap active={isActive}>` into a component. The element would manage lifecycle thanks to the hooks the browser provides, and interactive state could be managed via React (or in the case of VC, another WC).

By modelling these behaviours as Web Components we simplify their application for engineers. Instead of requiring engineers to understand another hook, this would fit transparently into the already understood concept of components.

Specifically for behaviours like `focusZone` and `focusTrap` it makes understanding of the component far simpler too: by having the component existing within a tree of other components, an engineer can more easily understand the relationship of _what elements this component would affect_. This is currently opaque with the current functions, as they are not part of the tree.

### ShadowDOM

ShadowDOM is the preferred way for Custom Elements to mutate HTML, as their shadow root is encapsulated from the rest of the document. This means that a Custom Element is free to mutate HTML within the ShadowDOM wihout disrupting reconcilers (such as React's Virtual DOM implementation) or observers (such as MutationObservers on the document). Any mutations within the ShadowDOM are private to that element. Frameworks like React can still interact with light DOM nodes as they normally would.

ShadowDOM exists in browsers today, and powers some built in elements, like `<input>`, `<textarea>`, `<button>`, `<video>` and so on. The browser can build these elements out of many other elements which can be toggled off and on. For example, in Chrome, an `<input>` has an underlying ShadowDOM of:

```html
<div pseudo="-webkit-onput-placeholder" id="placeholder" style="display: none !important">Placeholder content</div>
<div>input contents</div>
```

Whenever the `input.placeholder` is changed, Chrome will change the textcontent of the `div[id=placeholder]` element. Similarly whenever text is input into the element, the plain `<div>`'s textcontent is changed. This happens transparently and without userland libraries (like React) being able to influence this.

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
const HTMLElement = root.HTMLElement || (null as unknown as (typeof window)['HTMLElement'])
```

These lines could also be added to the global context, to avoid adding it to each element.

The `RelativeTime` react component uses `@lit-labs/react`, which makes integrating the component into React painless, and requires [1 line of code for integration](https://github.com/primer/react/blob/d995bb8485fa1dfd0a3637b4851c5ac539b8416d/src/RelativeTime/RelativeTime.tsx#L8):

```typescript
const RelativeTime = styled(createComponent(React, 'relative-time', RelativeTimeElement))(sx)
```

There are no additional steps required for consumers of Primer React, and the component behaves as if it is a first-class React component, supporting the same properties and events as any regular React component. The server will render the Custom Element tag (in the case of the `RelativeTime` component, `<relative-time>`) and the client is able to assign class properties and use callbacks for events, as expected.

While React 18 and below require a small library like `@lit-labs/react`, due to the [lack of support for Custom Element](https://custom-elements-everywhere.com/libraries/react/results/results.html), React 19 [will likely need no such library](https://custom-elements-everywhere.com/libraries/react-experimental/results/results.html).

Custom Elements ShadowDOM content can be rendered either client side (when the element connects to the DOM) or server side using a `<template>` element which allows the browser to piece together ShadowDOM content as the HTML stream in. This is known as "Declarative ShadowDOM". Declarative ShadowDOM is not always necessary, as it depends on the use case of the element which is being rendered. Declarative ShadowDOM is supported in Chrome and Safari 17 (at the time of writing this is unreleased, but [technology preview 162 includes DSD support](https://webkit.org/blog/13703/release-notes-for-safari-technology-preview-162/). For other browsers a DSD polyfill is a few additional lines of code.

There may be additional considerations of when to use ShadowDOM, when to use Declarative ShadowDOM, and when to not use ShadowDOM at all. These considerations are outside of the scope of this document, as they will depend on the component being created. With respect to server side rendering, ShadowDOM is, in essence, no different to a component using other client side only APIs, such as `navigator`, or `location`. It, however, is not a blocker for adoption with respect to SSR.

### Styling with `styled-components`

Primer React currently uses a CSS-in-JS library called [`styled-components`](https://styled-components.com/). This library accumulates objects that map to CSS properties, and during runtime it will create a hash digest to use as the class name for the component, and inject the mapped CSS into a stylesheet on the page. This way, CSS lives in JavaScript object notation within the same file as the React Component itself. In addition to this, Primer React also uses [`styled-system`](https://styled-system.com/) which allows the use of style properties directly within a React Components props. Primer React uses the `sx` prop to allow for customisation of styles.

ADR 002 describes complexity around styling Custom Elements with the styled-components library. It claimed that a custom element must use another wrapping element to apply styles.

Today, Primer React's RelativeTime component can be styled using the `sx` prop, just like any other Primer React component.

### Styling considerations with Custom Elements

One consideration with Custom Elements is that they always represent a node in the DOM tree. This means components which only represent behaviour (such as `<focus-trap>`) can influence or even interrupt non-inheritable CSS properties as they flow through a document. For example if an element that needs focus trapping uses `display: flex`, using `<focus-trap>` as a component within the flex element will require the `<focus-trap>` element to be styled with `display: flex`. Many built-in elements require the same consideration, for example `<form>`, `<datalist>`, `<picture>` and so on.

One mitigation for this is to replace non-semantic elements (such as `<div>` or `<span>`) within a tree with the custom element. Another is to replace "semantic" elements with Custom Elements that offer a similar behavior. In the case of `<relative-time>` it can replace the `<time>` element and offer equivalent semantic value.

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

### Extensibility

Custom Elements have two predominant modes of communication: their ancestors may set attributes on an element (or properties directly on the class instance) to communicate downward intent, and ancestors may also listen to events which Custom Elements will announce during their lifetimes, to allow ancestors to react. React components have similar modes of communication; instead of attributes React components have "props", and within a React components props, it may have callbacks which map to events.

Common in React applications is also the use of centralised state management. Centralised state management tools handle in memory data, and can dispatch it to arbitrary points in a React tree, which can then be mapped to props.

ADR 002 claimed that React Hooks offer better extensibility as they can interact with state which is driven by the consumer, while Custom Elements require listening to events on the document.

Given state management libraries are agnostic to the underyling framework, it is important to acknowledge that it is entirely possible to use state management libraries such as Redux or Mobx with many component frameworks such as Vue, Svelte or React, as well as with Custom Elements.

React components may also directly communicate with Custom Elements using the same mechanisms that React components communicate with built in elements - by passing props within JSX. A complication arises with React as it hard codes a list of attributes that map to class properties, and a list of `on*` prefixed callbacks that map to events. For example using the `hidden` prop on element rendered by React, react will look up the `hidden` property in its hard coded loookup table and map the prop to a `.hidden =` call. Props given to JSX elements which are not in this hard coded table map to `setAttribute(name)` calls, and the result is stringified.

While React's support for custom events and custom attributes is not as robust as, say, Preact's, it is entirely possible to map attributes and events to React props.

Today, Primer React includes the `RelativeTime` component. Using the `@lit-labs/react` library `RelativeTime` wraps the `relative-time` custom element and automatically maps props directly to the class instance, and converts `on*` callback props to event listeners that can then observe event announcements from the element. In this way, `RelativeTime` behaves just like if it were written in React. The utilisation of the `@lit-labs/react` library requires 1 line of code:

```typescript
const RelativeTime = styled(createComponent(React, 'relative-time', RelativeTimeElement))(sx)
```

While React 18 and below require a small library like `@lit-labs/react`, due to the [lack of support for Custom Element](https://custom-elements-everywhere.com/libraries/react/results/results.html), React 19 [will likely need no such library](https://custom-elements-everywhere.com/libraries/react-experimental/results/results.html).

### Organizational overhead

One consideration around sharing code between one or more implementations of primer is the organisational overhead of doing so.

ADR 002 enumerates concerns around development, including the issue of developing against multiple repositories and handling depdencies with `npm link`. It also enumerates concerns around orchestrating releases. Again, this is mostly a concern around the available tooling across multiple repositories and out of scope.

These issues are not intrinsic to the use of shared code, however. For example sharing of code can be done within a monorepo. This is out of scope of the discussion of this ADR.

ADR 002 raises another concern around developement and contribution, with regard to familiarity of working with React and also the familiarity of working with Custom Elements, as well as the requirement for developers to context switch.

The Primer View Components library can serve as an example of handling these concerns. Today, Primer View Components has been successfully integrating and authoring components using Custom Elements for multiple years.

The Primer Behaviours library can also serve as an example of handling these concerns. Today, both Primer View Components and Primer React components utilise the `@primer/behaviors` library to manage shared code.

One concern comes with regard to Custom Elements using a global registry of tag names to hook into behaviours. On any given page, only one Custom Element definition can use a given tag name at a time - for example there cannot be two different versions of `RelativeTime` using the `<relative-time>` tag. GitHub has been using Custom Elements since 2014, and many of our components have had breaking changes and we've not found this limitation to be an issue. Having said that, it is possible to remediate this issue in several ways: such as naming the tags differently between versions or between libraries.

Organizational overhead of shared dependencies is something that we will have to address in the future, regardless of the decision to utilise Custom Elements, and so it will be addressed in later ADRs. It is out of the scope of this ADR to mandate decisions on remediation strategies for shared dependencies.

## Decision

### Custom elements

- We may use Custom Elements to share behaviour between PVC and PRC.
- Where existing built in HTML elements provide the necessary semantics and UI required, we should continue to use those. This is to say that Custom Elements to not provide a stand-in for _all_ elements on the page.
- Where there is no client side behaviour nor no benefit to using ShadowDOM, a Custom Element should not be used.

## Not Decided

### Custom Elements

- This ADR does not conclude with a decision on how custom elements should be written. It does not enforce a decision on language or tooling.
- This ADR does not enforce a decision that custom elements _must be written_ in any circumstances. It merely decides that we _may_ chose to use this technology as we see fit.

### Repositories

- This ADR does not conclude with a decision on where custom elements should live. We _may_ continue to use the existing set of custom elements we have, which are in various repositories, or we _may_ write custom elements in a monorepo. This is not a decision enforced by this ADR.

### Rewrites

- This ADR does not conclude with a decision to rewrite any existing component or behavior in use today. We _may_ consider the use of custom elements during refactors but this ADR does not enforce a decision to rewrite any existing code.

## Consequences

- By using `@lit-labs/ssr` today, we introduce a new dependency into Primer React. This may be removed later should React support Custom Elements out of the box (which seems likely for React 19), but for now we will need to continue to ship this dependency.
- This decision may expediate the need to resolve organisational overhead issues. Deciding to use custom elements to share more code among PVC and PRC may highlight other areas which need to be addressed in subsequen PRs.
