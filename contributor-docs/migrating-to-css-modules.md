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
- **Ensure All Visual Changes Are Completed:**
  - Make necessary visual changes **before** creating the CSS Modules refactor PR.

---

## How to Migrate

### Refactoring Styled-Components to CSS Modules

- **Replace `${get('...')}` Syntax:**

  - Migrate these to CSS variables find the appropriate variable in [our primitives docs](https://primer.style/foundations/primitives/color).

  ```diff
    {
  -   color: `${get('colors.fg.default')}`
  +   color: var(--fgColor-default)
    }
  ```

  - No need for fallbacks in CSS Modules.

### When Refactoring a Component

1. **Check for `className` and `style` Prop:**
   - Ensure the component accepts a `className` _on the top DOM level only_ for styling from outside of primer/react.
   - Ensure the component accepts a `style` prop for more dynamic styling like positioning.
2. **Feature Flagging:**

   - Add a feature flag to toggle the `sx` prop for controlled rollout (staff shipping). How it's used will be based on the implementation of the component. For most you'll be able to `useFeatureFlag` and toggle between components. For more complex styled components, you can use the utility `toggleStyledComponent` which will render based on the feature flag string provided.

     ```jsx
     /* When there is an existing styled component, use the `toggleStyledComponent` utility. */
     const StyledDiv = toggleStyledComponent(
       'primer_react_css_modules_team',
       'div',
       styled.div`
         display: flex;

         ${sx};
       `,
     )
     const enabled = useFeatureFlag('primer_react_css_modules_team')
     return <StyledDiv className={clsx({[classes.DivStyle]: enabled})} {...props} />
     ```

3. **Create CSS Module:**
   - Add a corresponding `{Component}.module.css` file.
4. **Import CSS Modules:**

   - Use the CSS module in the component.

     ```js
     import classes from './{Component}.module.css'
     ```

   - Add CSS classes behind the `primer_react_css_modules_team` feature flag. For guidelines on how to write styles, see our [CSS authoring guide](./authoring-css.md)

5. **Ensure Component still accepts `sx` styling**

   - Until we migrate all uses of `sx`, we need to ensure the component will accept `sx` props inside the feature flag. This will often default to using the `Box` component if an `sx` prop is passed in.

     ```jsx
     const enabled = useFeatureFlag('primer_react_css_modules_team')
     if (enabled) {
       if (sxProp !== defaultSxProp) {
         /* Use of Box here to support sx props */
         return <Box as="div" sx={sxProp} {...props} />
       }
       return <div {...props} />
     }
     ```

6. **Ensure Component accepts `className` along with our CSS Module class name**

### Testing the Migration

- **Support for `className`:**
  - Ensure the component works properly with the `className` prop. This will need a feature flag turned on when testing like this.
    ```js
    it('should support `className` on the outermost element', () => {
      const Element = () => <Component className={'test-class-name'} />
      const FeatureFlagElement = () => {
        return (
          <FeatureFlags
            flags={{
              primer_react_css_modules_team: true,
              primer_react_css_modules_staff: true,
              primer_react_css_modules_ga: true,
            }}
          >
            <Element />
          </FeatureFlags>
        )
      }
      expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
      expect(render(<FeatureFlagElement />).container.firstChild).toHaveClass('test-class-name')
    })
    ```
- **Handling `sx` Prop:**
  - Confirm the `sx` prop behaves correctly with the feature flag enabled.

#### Visual regression testing

Validate that no visual regressions occur when the feature flag is enabled. The `vrt*` tests are setup to compare the feature flagged component with the original component and will fail if there is a mismatch.

- Add `dev` stories for any edge cases spotted in production for the component (ie. `sx` prop, custom className, styled system attributes). `dev` stories may include things that we wouldn't normally recommend for the purpose of stress testing what happens when PRC components are overridden with custom styles.
- Setup VRT tests for `dev` stories. Copy an existing test in the corresponding test file in the [e2e directory](https://github.com/primer/react/tree/main/e2e/components) and update the id to match the new `dev` story.

Example test file:

```ts
import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Dev: Test color',
    id: 'components-{componentname}-dev--customcolor',
  },
] as const

test.describe('ComponentName', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('default @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            // Default state
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `ComponentName.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})
```

---

## Releasing a Component

- **Merge Process:**
  - Once merged into Dotcom, the component will be part of the `primer_react_css_modules_team` rollout.
  - We progress components through levels of feature flags as we roll them out to make sure we address any bugs with the minimum amount of audience.
- **Monitor Team Ship:**
  - Watch for any issues or regressions during the team ship phase. If anything is spotted, [create an issue in `github/primer`](https://github.com/github/primer/issues/new?template=04-bug-report.yml) and let us know in the [#primer slack channel](https://github-grid.enterprise.slack.com/archives/CSGAVNZ19).
