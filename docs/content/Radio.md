---
title: Radio
description: Use radios when a user needs to select one option from a list
status: Alpha
source: https://github.com/primer/react/blob/main/src/Radio.tsx
storybook: '/react/storybook?path=/story/forms-radio-button--default'
---

## Default example

```jsx live
<>
  <Radio value="one" name="radio-group-name" />
  <Radio value="two" name="radio-group-name" />
  <Radio disabled value="three" name="radio-group-name" />
</>
```

<Note>
Please use a [Checkbox](/Checkbox) if the user needs to select more than one option in a list
</Note>
<Note variant="warning">
Radio components should always be accompanied by a corresponding label to improve support for assistive technologies.
</Note>

## Grouping Radio components

Use the `name` prop to group together related `Radio` components in a list.

```jsx live
<form>
  <Box sx={{p: 1, display: 'flex', alignItems: 'center'}}>
    <Radio id="radio-0" value="1" name="radio-example" />
    <Text as="label" htmlFor="radio-0" sx={{fontSize: 1, marginLeft: 1}}>
      <Text sx={{display: 'block'}}>Radio 1</Text>
    </Text>
  </Box>
  <Box sx={{p: 1, display: 'flex', alignItems: 'center'}}>
    <Radio id="radio-1" value="2" name="radio-example" />
    <Text as="label" htmlFor="radio-1" sx={{fontSize: 1, marginLeft: 1}}>
      <Text sx={{display: 'block'}}>Radio 2</Text>
    </Text>
  </Box>
  <Box sx={{p: 1, display: 'flex', alignItems: 'center'}}>
    <Radio id="radio-2" value="3" name="radio-example" />
    <Text as="label" htmlFor="radio-2" sx={{fontSize: 1, marginLeft: 1}}>
      <Text sx={{display: 'block'}}>Radio 3</Text>
    </Text>
  </Box>
  <Box sx={{p: 1, display: 'flex', alignItems: 'center'}}>
    <Radio id="radio-3" value="4" name="radio-example" />
    <Text as="label" htmlFor="radio-3" sx={{fontSize: 1, marginLeft: 1}}>
      <Text sx={{display: 'block'}}>Radio 4</Text>
    </Text>
  </Box>
</form>
```

## Component props

Native `<input>` attributes are forwarded to the underlying React `input` component and are not listed below.

| Name           | Type        |  Default  | Description                                                                              |
| :------------- | :---------- | :-------: | :--------------------------------------------------------------------------------------- |
| value          | String      | undefined | Required. A unique value that is never shown to the user.                                |
| name           | String      | undefined | Required. Used for grouping multiple radios                                              |
| checked        | Boolean     | undefined | Optional. Modifies true/false value of the native radio                                  |
| defaultChecked | Boolean     | undefined | Optional. Selects the radio by default in uncontrolled mode                              |
| onChange       | ChangeEvent | undefined | Optional. A callback function that is triggered when the checked state has been changed. |
| disabled       | Boolean     | undefined | Optional. Modifies the native disabled state of the native radio                         |

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
