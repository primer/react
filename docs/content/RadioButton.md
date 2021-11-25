---
title: RadioButton
description: Use radio buttons when users need to select one option from a list
status: Alpha
source: https://github.com/primer/react/blob/main/src/RadioButton.tsx
storybook: '/react/storybook?path=/story/forms-radio-button--default'
---

import {ComponentChecklist} from '../src/component-checklist'

## Default example

```jsx live
<>
  <form>
    <Box sx={{p: 3, pt: 0, display: 'flex', alignItems: 'center'}}>
      <RadioButton id="default-radio" value="active" name="group-name" />
      <Text as="label" htmlFor="default-radio" sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}}>
        Active
      </Text>
    </Box>
    <Box sx={{p: 3, display: 'flex', alignItems: 'center'}}>
      <RadioButton id="inactive-radio" disabled value="inactive" name="group-name" />
      <Text as="label" htmlFor="inactive-radio" sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}}>
        Inactive
      </Text>
    </Box>
  </form>
</>
```

<Note>
Please use a <a href="/react/Checkbox">Checkbox</a> if the user needs to select more than one option in a list
</Note>
<Note variant="warning">
Radio button components should always be accompanied by a corresponding label to improve support for assistive technologies.
</Note>

## Grouping RadioButton components

Use the provided `name` prop to group together related `RadioButton` components in a list.

```jsx live
<>
  <form>
    <Box key={`sub-radio-0`} sx={{p: 1, pl: 6, display: 'flex', alignItems: 'center'}}>
      <RadioButton id={`sub-radio-0`} value="1" name="radio-example" />
      <Text as="label" htmlFor={`sub-radio-0`} sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}}>
        <Text sx={{display: 'block'}}>Radio 1</Text>
      </Text>
    </Box>
    <Box key={`sub-radio-1`} sx={{p: 1, pl: 6, display: 'flex', alignItems: 'center'}}>
      <RadioButton id={`sub-radio-1`} value="2" name="radio-example" />
      <Text as="label" htmlFor={`sub-radio-1`} sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}}>
        <Text sx={{display: 'block'}}>Radio 2</Text>
      </Text>
    </Box>
    <Box key={`sub-radio-2`} sx={{p: 1, pl: 6, display: 'flex', alignItems: 'center'}}>
      <RadioButton id={`sub-radio-2`} value="3" name="radio-example" />
      <Text as="label" htmlFor={`sub-radio-2`} sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}}>
        <Text sx={{display: 'block'}}>Radio 3</Text>
      </Text>
    </Box>
    <Box key={`sub-radio-3`} sx={{p: 1, pl: 6, display: 'flex', alignItems: 'center'}}>
      <RadioButton id={`sub-radio-3`} value="4" name="radio-example" />
      <Text as="label" htmlFor={`sub-radio-3`} sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}}>
        <Text sx={{display: 'block'}}>Radio 4</Text>
      </Text>
    </Box>
  </form>
</>
```

## Component props

Native `<input>` attributes are forwarded to the underlying React `input` component and are not listed below.

| Name           | Type        |  Default  | Description                                                                              |
| :------------- | :---------- | :-------: | :--------------------------------------------------------------------------------------- |
| value          | String      | undefined | Required. A unique value that is never shown to the user.                                |
| name           | String      | undefined | Required. Used for grouping multiple radio buttons                                       |
| checked        | Boolean     | undefined | Optional. Modifies true/false value of the native radio                                  |
| defaultChecked | Boolean     | undefined | Optional. Selects the radio button by default in uncontrolled mode                       |
| onChange       | ChangeEvent | undefined | Optional. A callback function that is triggered when the checked state has been changed. |
| disabled       | Boolean     | undefined | Optional. Modifies the native disabled state of the native radio button                  |

## Component status

<ComponentChecklist
items={{
    propsDocumented: true,
    noUnnecessaryDeps: true,
    adaptsToThemes: true,
    adaptsToScreenSizes: true,
    fullTestCoverage: true,
    usedInProduction: false,
    usageExamplesDocumented: false,
    designReviewed: false,
    a11yReviewed: false,
    stableApi: false,
    addressedApiFeedback: false,
    hasDesignGuidelines: false,
    hasFigmaComponent: false
  }}
/>
