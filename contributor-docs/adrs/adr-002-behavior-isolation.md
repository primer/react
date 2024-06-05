# ADR 2: Isolating behaviors through custom clements and vanilla JavaScript

## Status

| Stage         | Status                                     |
| ------------- | ------------------------------------------ |
| Approved      | ✅                                         |
| Adopted       | ✅                                         |
| Superseded by | [ADR 010](./adr-010-behavior-isolation.md) |

## Related documents

- April 18th, 2018: [Custom Elements Example](https://github.com/primer/react/pull/13)
- May 8th, 2018: [Custom Elements Experiment](https://github.com/primer/react/pull/14)
- May 18th 2018: [React & Custom Elements](https://docs.google.com/document/d/1b6D2jW3ztQJiKEtQINbb4JoHJ3F3szU6lBX-fGce6aY/edit?usp=sharing)
- October 16th 2019: [Issue exploring pros & cons of reusing .com JS in React](https://github.com/github/issues-index-experiment/issues/90)
- November 15th 2019: [Experiment porting PRC to web components](https://github.com/github/ui-engineering/issues/12#issuecomment-558257842)
- November 27th 2019: [Usage of custom elements in IIE project](https://github.com/github/issues-index-experiment/pull/133)
- November 27th 2019: [Styling custom elements with styled components](https://github.slack.com/archives/CMZ4DC9BL/p1574883198055600)
- June 9th 2020: [Discussion in Slack about using skatejs for SSR](https://github.slack.com/archives/C0ER2LCG2/p1591707104461300)
- November 10th 2020: [Replace dialog with details-dialog](https://github.com/primer/react/issues/907)
- January 27th 2021: [Guidelines for authoring behaviors](https://github.com/primer/react/pull/992)
- February 1st 2021: [Example of a vanilla JS behavior & accompanying hook](https://github.com/T-Hugs/components/commit/105c3a191681381377f5aa193cb241a2189db8a6)

## Providing behaviors via custom elements

### Context

Throughout the last few years folks from the Design Infrastructure, Web Systems, and UI Platform teams have discussed the idea of using custom elements for behaviors in Primer React. The main goal of using custom elements in Primer React is to be able to author behaviors once and reuse them in any framework. Several experiments have been conducted which are listed above.

### Assumptions

De-duplication is not our highest or only priority. Attempts at de-duplication must be weighed against changes to the maintainer, developer, and customer experience.

### Findings

#### Developer experience regressions

- Custom elements rendering their own subtrees (ShadowDOM) requires polyfills for as-yet implemented specifications. This means Primer React will accumulate added complexity if we were to implement Custom Elements with ShadowDOM.

- Implementing Custom Elements in Primer React will require a division of client side and server side code, as custom elements should only be executed in a browser environment. Currently Primer React is "isomorphic" - in that the code can be executed anywhere that React can be, which includes NodeJS server runtimes, as well as the client side. While not insurmountable this does mean Primer React will accumulate added complexity, which likely will be surfaced to the user.

- While it's possible to add server side libraries to enable Custom Elements to be rendered on the Server, this adds more complexity and is antithetical to the usage patterns of custom elements.

- As of this writing, you cannot style custom elements with styled-components[^1]. This means that if a component wants to use a custom element to get behaviors and you also want to style that component, you must use another wrapper div to apply styles. This is a bug in styled-components and should be fixed in the next release.

#### Incompatibility with some React tools

Some of our GitHub custom elements such as `details-dialog` and `details-menu` make assumptions about the DOM tree. For example, `details-dialog` expects a `details` element to wrap the custom element and uses this assumption[^2] to determine whether or not clicks are happening inside or outside of the dialog and closes the dialog if the click happened outside of the dialog. This makes sense in most cases and is a nice way of enforcing proper usage of the details element, but breaks down when used with [React Portals](https://reactjs.org/docs/portals.html) which are often used to ensure menus are displayed correctly in cases where a parent has an overflow: hidden applied to it, or incompatible z-index.

#### Extensibility

Building behaviors in React Hooks gives us the ability to provide things like state and state change hooks to the consumer of the component. This allows the user to build on additional behaviors to the component based on the state or other variables provided to the component consumer. Doing the same with custom elements would require listening to events on the document[^3] and reacting to them. This is certainly do-able, but goes against some of the foundational principles of React (reacting to changes in the DOM vs changes in React state).

#### Organizational overhead

- GitHub’s custom elements are all managed in different repos which introduces more maintenance overhead.
  - You'd need to npm link while developing if you want to test changes out with the presentational components themselves instead of making changes and seeing updates instantly. npm link usually doesn't work well with hot module reloading either.
  - You'd need to draft & publish releases to both libraries every time you want to update the behavior
  - If the behaviors are shared between github.com and Primer React, you'd need to do careful testing in both environments to make sure that changes don't create any regressions. That greatly widens the context that engineers need to keep in mind every time a change is made.
- Reacting to changes will take a bit more time as we’ll need to orchestrate releases between custom elements and Primer React - as opposed to having behaviors already present in Primer React which can be versioned in lockstep.
- Engineers who want to contribute to Primer React Components to build new components and behaviors would need to be familiar with both custom elements and React, two very different paradigms, and context switch between the two.

#### Other

- The custom element and web component API progress slower than React due to changes needing to go through the whatwg standards process.

#### Risks of not switching to custom elements for behaviors

- We spend extra time building behaviors in React that have already been built in our [custom elements library](https://github.github.io/web-systems-documentation/#custom-elements).
  - There are currently 19 behaviors/components listed on the custom elements documentation site. Several of these we have already implemented in React in either Primer React, Doctocat, or other React applications at GitHub which can be upstreamed (details-dialog, details-menu, clipboard-copy, text-expander, autocomplete, task-list via drag and drop hooks, tab-container, text-expander).
- We decide not to invest further in React at GitHub and have wasted time we could have spent building more custom elements.
  - This seems unlikely as there seems to be clear consensus that we will continue to build more and more highly interactive products.
- The React library is abandoned and becomes obsolete.
  - This is a risk with any technology that we may use, seems highly unlikely in the near term.
  - While also a possibility for custom elements, the track record demonstrates deprecations of Web APIs is extremely rare and has a long deprecation path.
- Behaviors in github.com using custom elements and behaviors in Primer REact diverge, leading to an inconsistent experience.
  - This is probably the biggest risk we face, but moving to custom elements isn’t necessarily the only or best solution. We should explore other ways of detecting divergence such as integration tests.

## Providing behaviors through vanilla JavaScript

A simpler method of isolating component behaviors is to implement them in vanilla JavaScript (or TypeScript). This way, they can be shared between React components and web components. Both types of consumers would need to hook up the vanilla behavior to the component(s) that use(s) them.

In some cases, this strategy is very straightforward. When a behavior can be made to have no dependencies other than the DOM, it is easy to isolate and consume in various frameworks. Behaviors that have effects on interactions/events, shared state, and component styles will be more difficult to isolate in this manner.

### Interactions and events

Many user interactions rely on DOM events, such as `click`, `keypress`, and `focus`. React's event system is _not_ the same as the native DOM event system. React implements a [SyntheticEvent](https://reactjs.org/docs/events.html) that wraps native events. Working with both `SyntheticEvent`s and native events simultaneously is significant additional complexity for maintainers and consumers. However, vanilla JavaScript must operate only using native events. This makes isolating behaviors that automatically hook up event listeners to DOM elements difficult to achieve, and the resulting simultaneous usage of native events and `SyntheticEvent` has the potential to degrade both the maintainer's and the consumer's developer experience using Primer React.

### Shared state

There are countless ways to manage state in a web application. React has its own ecosystem of state management strategies and libraries (in addition to its own primitive constructs for state management). Since there is no standard state management pattern in vanilla JavaScript, introducing such a pattern would add a new layer of complexity to the component behavior API.

### Component styles

Since Primer React uses styled-components to manage CSS styles, any behaviors that affect styles should be doing so with styled-components. Any vanilla JavaScript behaviors that affect styles will add complexity by introducing a second mechanism for applying styles, since they will not be able to use styled-components.

## Decision

### Custom elements

Due to the challenges listed above and our priorities listed in the [Assumptions](#assumptions) section, we are not investing time in building out behaviors with custom elements in our Primer React library. Instead, we should spend time expanding coverage using React Hooks and focus on finding other approaches for making sure implementation of behaviors in our different stacks are consistent (such as integration tests).

### Vanilla JavaScript behaviors

Some behaviors can be implemented as vanilla JavaScript without introducing additional complexity to Primer React or its consumers. In cases where this is possible, behaviors will be implemented with no dependencies except the DOM and consumed within React Hooks to provide their functionality to Primer React.

In general, _portions of behaviors_ that affect or rely on **user interactions and events**, **shared state**, or **CSS styles** should be kept in React Hooks. Parts of the behavior that can be implemented in isolation of these concepts should be built with no dependency on React or other libraries.

[^1]: https://codesandbox.io/s/demo-styling-custom-element-g973d?file=/src/index.tsx
[^2]: https://github.com/github/details-dialog-element/blob/main/src/index.ts#L195
[^3]: https://github.com/github/details-dialog-element#details-dialog-close
