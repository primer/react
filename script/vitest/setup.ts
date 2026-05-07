import failOnConsole from 'vitest-fail-on-console'

if (process.env.CI === 'true') {
  failOnConsole({
    allowMessage: message => {
      return [
        /Found duplicate ".+" slot\. Only the first will be rendered\./,
        /A choice group must be labelled using a `CheckboxOrRadioGroup\.Label` child/,
        /A radio input must have a `name` attribute\./,
        /The input field with the id .+ MUST have a FormControl\.Label child\./,
        /React does not recognize the `leadingVisual` prop on a DOM element\./,
        /The <Details> component must have a <summary> child component\./,
        /The above error occurred in the <.+> component:/,
        /The `Tooltip` component expects a single React element that contains interactive content\./,
        /Use the `aria-label` or `aria-labelledby` prop to provide an accessible label/,
        /Uncaught Invariant Violation:/,
        /validateDOMNesting\(\.\.\.\): <button> cannot appear as a descendant of <button>\./,
        /validateDOMNesting\(\.\.\.\): <td> cannot appear as a child of <div>\./,
      ].some(pattern => pattern.test(message))
    },
    silenceMessage: message => {
      return /Warning: An update to AnchoredOverlay inside a test was not wrapped in act/.test(message)
    },
    shouldFailOnAssert: true,
    shouldFailOnDebug: true,
    shouldFailOnInfo: true,
    shouldFailOnLog: true,
  })
}
