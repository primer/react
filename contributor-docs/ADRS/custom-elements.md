# Custom element usage in Primer React Components ADR

## Status

## Related Documents
- April 18th, 2018: [Custom Elements Example](https://github.com/primer/components/pull/13)
- May 8th, 2018:  [Custom Elements Experiment](https://github.com/primer/components/pull/14)
- May 18th 2018: [React & Custom Elements](https://docs.google.com/document/d/1b6D2jW3ztQJiKEtQINbb4JoHJ3F3szU6lBX-fGce6aY/edit?usp=sharing)
- October 16th 2019: [Issue exploring pros & cons of reusing .com JS in React](https://github.com/github/issues-index-experiment/issues/90)
- November 15th 2019: [Experiment porting PRC to web components](https://github.com/github/ui-engineering/issues/12#issuecomment-558257842)
- November 27th 2019: [Usage of custom elements in IIE project](https://github.com/github/issues-index-experiment/pull/133)
- November 27th 2019: [Styling custom elements with styled components](https://github.slack.com/archives/CMZ4DC9BL/p1574883198055600)
- June 9th 2020: [Discussion in Slack about using skatejs for SSR](https://github.slack.com/archives/C0ER2LCG2/p1591707104461300)
- November 10th 2020: [Replace dialog with details-dialog](https://github.com/primer/components/issues/907)

## Context
Throughout the last few years folks from the Design Infrastructure, Web Systems & UI Platform teams have discussed the idea of using custom elements for behaviors in Primer React Components. The main goal of using custom elements in PRC is to be able to author behaviors once and reuse them in any framework. Several experiments have been conducted which are listed above.

## Assumptions
De-duplication is not our highest or only priority. Attempts at de-duplication must be weighed against changes to the maintainer, developer, and customer experience.

## Findings

### Developer Experience Regressions
- Rendering custom elementMs in SSR applications is a bit tricky and requires a third party framework such as [@skatejs/ssr](https://github.com/skatejs/skatejs/tree/master/packages/ssr). This is a hit to developer experience because it would require consumers of PRC to set up the service, PRC won’t work right out of the box (in applications using SSR, such as all of our Doctocat sites) without it if we use custom elements in the library.

- You cannot style custom elements with styled-components[^1]. This means that if a component wants to use a custom element to get behaviors and you also want to style that component, you must use another wrapper div to apply styles. This feels awkward and introduces unnecessary markup to the DOM.

```jsx
export const ClipboardCopy = () => {
 return <clipboard-copy for="span">Copy button</clipboard-copy>;
};

// passing a custom element to styled components results in no styles being applied
const StyledClipboardCopy = styled(ClipboardCopy)`
 background-color: red;
`;

const App = () => {
 return (
   <ThemeProvider theme={theme}>
     <BaseStyles className="App">
       <StyledClipboardCopy for=”span” />
       <span id="span">Content from span tag.</span>
     </BaseStyles>
   </ThemeProvider>
 );
};

```



View in CodeSandbox: https://codesandbox.io/s/demo-styling-custom-element-g973d?file=/src/index.tsx:285-599

Instead you would have to do something like this:

```jsx
const ClipboardCopy = () => {
  return <clipboard-copy for="span">Copybutton</clipboard-copy>;
};

const StyledClipboardCopyWrapper = styled.span`
  background-color: red;
`;

const App = () => {
  return (
   <>
    <StyledClipboardCopyWrapper>
     <ClipboardCopy />
    </StyledClipboardCopyWrapper>
    <span id="span">Content from span tag.</span>
  </>
 );
};
```



View in CodeSandbox: https://codesandbox.io/s/demo-styling-custom-element-2-xt9g9?file=/src/index.tsx

This also means we would need to be careful to never export a component with a custom element as the top level node.

### Incompatibility with some React tools
Some of our GitHub custom elements such as details-dialog and details-menu make assumptions about the DOM tree. For example, details-dialog expects a `details` element to wrap the custom element and uses this assumption[^2] to determine whether or not clicks are happening inside or outside of the dialog and closes the dialog if the click happened outside of the dialog. This makes sense in most cases and is a nice way of enforcing proper usage of the details element, but breaks down when used with [React Portals](https://reactjs.org/docs/portals.html) which are often used to ensure menus are displayed correctly in cases where a parent has an overflow: hidden applied to it, or incompatible z-index.

### Extensibility
Building behaviors in React Hooks gives us the ability to provide things like state and state change hooks to the consumer of the component. This allows the user to build on additional behaviors to the component based on the state or other variables provided to the component consumer. Doing the same with custom elements would require listening to events on the document[^3] and reacting to them. This is certainly do-able, but goes against some of the foundational principles of React (reacting to changes in the DOM vs changes in React state).

### Organizational Overhead
GitHub’s custom elements are all managed in different repos which introduces more maintenance overhead.
Reacting to changes will take a bit more time, as we’ll need to wait for changes to be made to the custom elements until we can update Primer React Components (versus having behavior Hooks in PRC that we can update at our leisure).
Engineers who want to contribute to Primer React Components to build new components and behaviors would need to be familiar with both custom elements and React, two very different paradigms, and context switch between the two.

### Other
- The custom element & web component API progress slower than React due to changes needing to go through the whatwq standards process.

### Risks of not switching to custom elements for behaviors
- We spend extra time building behaviors in React that have already been built in our [custom elements library](https://github.github.io/web-systems-documentation/#custom-elements).
  - There are currently 19 behaviors/components listed on the custom elements documentation site. Several of these we have already implemented in React in either PRC, Doctocat, or other React applications at GitHub which can be upstreamed (details-dialog, details-menu, clipboard-copy, text-expander, autocomplete, task-list via drag and drop hooks, tab-container, text-expander).
- We decide not to invest further in React at GitHub and have wasted time we could have spent building more custom elements.
  - This seems unlikely as there seems to be clear consensus that we will continue to build more and more highly interactive products.
- The React library is abandoned and becomes obsolete
  - This is a risk with any technology that we may use, seems highly unlikely in the near term, and is also a risk for custom elements.
- Behaviors in .com using custom elements and behaviors in PRC diverge, leading to an inconsistent experience
  - This is probably the biggest risk we face, but moving to custom elements isn’t necessarily the only or best solution. We should explore other ways of detecting divergence such as integration tests.

### Decision
Due to the challenges listed above and our priorities listed in the [Assumptions](#assumptions) section, we are not investing time in building out behaviors with custom elements in our Primer React Components library. Instead, we should spend time expanding coverage using React Hooks and focus on finding other approaches for making sure implementation of behaviors in our different stacks are consistent (such as integration tests).


[^1]: https://codesandbox.io/s/demo-styling-custom-element-g973d?file=/src/index.tsx
[^2]: https://github.com/github/details-dialog-element/blob/main/src/index.ts#L195
[^3]: https://github.com/github/details-dialog-element#details-dialog-close