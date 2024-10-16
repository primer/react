# Primer React Styled Components to CSS Modules Refactoring Guide

This guide outlines the steps to follow when refactoring Primer React components from Styled Components to CSS Modules.

---

## Table of Contents

- [Primer React Styled Components to CSS Modules Refactoring Guide](#primer-react-styled-components-to-css-modules-refactoring-guide)
  - [Table of Contents](#table-of-contents)
  - [Before Refactoring a Component](#before-refactoring-a-component)
  - [How to Migrate](#how-to-migrate)
    - [Refactoring Styled-Components to CSS Modules](#refactoring-styled-components-to-css-modules)
    - [When Refactoring a Component](#when-refactoring-a-component)
    - [Testing the Migration](#testing-the-migration)
  - [Releasing a Component](#releasing-a-component)

---

## Before Refactoring a Component

- **Verify VRT (Visual Regression Testing) Coverage:**
  - Check for missing VRT coverage. We utilize the VRT tests to make sure we're matching styling in production with current expectations. Components should have a Storybook story for every "feature" or option available that impacts the UI for VRT to capture in a screenshot.
  - Make sure there are `dev` stories for any edge cases spotted in production for the component (ie. sx prop, custom className, styled system attributes). `dev` stories may include things that we wouldn't normally recommend for the purpose of stress testing what happens when PRC components are overridden with custom styles. 
- **Ensure All Visual Changes Are Completed:**
  - Make necessary visual changes **before** creating the CSS Modules refactor PR.

---

## How to Migrate

### Refactoring Styled-Components to CSS Modules

- **Replace `${get('...')}` Syntax:**
  - Migrate these to CSS Modules classes.
  - No need for fallbacks in CSS Modules.

### When Refactoring a Component

1. **Check for `className` and `style` Prop:**
   - Ensure the component accepts a `className` *on the top dom level only* for styling from outside of primer/react.
   - Ensure the component accepts a `style` prop for more dynamic styling like positioning.
2. **Feature Flagging:**
   - Add a feature flag to toggle the `sx` prop for controlled rollout (staff shipping).
3. **Create CSS Module:**
   - Add a corresponding `{Component}.module.css` file.
4. **Import CSS Modules:**
   - Use the CSS module in the component.

      ```js
        import classes from './{Component}.module.css'
      ```
   - Add CSS classes behind the `primer_react_css_modules_team` feature flag.
5. **Ensure Component still accepts sx styling**
   - Until we migrate all uses of sx, we need to ensure the component will accept sx props inside the feature flag. This will often default to using the `Box` component if an sx prop is passed in.

     ```jsx
      const enabled = useFeatureFlag('primer_react_css_modules_team')
      if (enabled) {
        if (sxProp !== defaultSxProp) {
          /* Use of Box here to support sx props */
          return <Box as='div' sx={sxProp} {...props} />
        }
        return <div {...props} />
      }
     ```
6. **Ensure Component accepts `className` along with our CSS Module class name**

### Testing the Migration

- **Support for `className`:**
  - Ensure the component works properly with the `className` prop.
- **Regression Testing:**
  - Validate that no regressions occur when the feature flag is enabled.
- **Handling `sx` Prop:**
  - Confirm the `sx` prop behaves correctly with the feature flag enabled.

---

## Releasing a Component

- **Merge Process:**
  - Once merged into dotcom, the component will be part of the `primer_react_css_modules_team` rollout.
  - We progress components through levels of feature flags as we roll them out to make sure we address any bugs with the minimum amount of audience.
- **Monitor Team Ship:**
  - Watch for any issues or regressions during the team ship phase.
