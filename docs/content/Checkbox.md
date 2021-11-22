---
title: Checkbox
status: Alpha
source: https://github.com/primer/react/blob/main/src/Checklist.tsx
---

import {ComponentChecklist} from '../src/component-checklist'

`Checkbox` is a form component that applies Primer design language to a native HTML checkbox input element.

## Default example

The `Checkbox` component can operate in both controlled and uncontrolled modes.

```jsx live
<>
  <Box as="form" p={3} pt={0} sx={{display: 'flex', alignItems: 'center'}}>
    <Checkbox id="default-checkbox" />
    <Text as="label" htmlFor="default-checkbox" sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}}>
      Default checkbox
    </Text>
  </Box>
  <Box as="form" p={3} sx={{display: 'flex', alignItems: 'center'}}>
    <Checkbox id="always-checked-checkbox" checked={true} />
    <Text as="label" htmlFor="always-checked-checkbox" sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}}>
      Always checked
    </Text>
  </Box>
  <Box as="form" p={3} sx={{display: 'flex', alignItems: 'center'}}>
    <Checkbox id="always-unchecked-checkbox" checked={false} />
    <Text as="label" htmlFor="always-unchecked-checkbox" sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}}>
      Always unchecked
    </Text>
  </Box>

  <Box as="form" p={3} sx={{display: 'flex', alignItems: 'center'}}>
    <Checkbox id="inactive-checkbox" checked={true} disabled />
    <Text as="label" htmlFor="inactive-checkbox" sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}}>
      Inactive
    </Text>
  </Box>
</>
```

import { useState } from 'react'
import { useMDXScope } from "gatsby-plugin-mdx/context";

export const MyDynamicButton = () => {
const [count, setCount] = useState(0)
return (
<button onClick={() => setCount(count + 1)}>Clicked {count} times!</button>
)
}

<Note variant="warning">
Checkbox components should always be accompanied by a corrosponding label to improve support for assistive technologies.
</Note>

## Indeterminate example

An `indeterminate` checkbox state can be used if the inputs value is neither true nor false. This can be useful in situations where you are required to display an incomplete state, that is dependent on other external selections to force a binary decision of the parent checkbox.

```jsx live
<>
  <Box as="form" p={3} pt={0} pb={1} sx={{display: 'flex', alignItems: 'center'}}>
    <Checkbox id="indeterminate-checkbox" onChange={() => {}} indeterminate={true} />
    <Text as="label" sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}} htmlFor="controlled-checkbox">
      <Text sx={{display: 'block'}}>Default checkbox</Text>
    </Text>
  </Box>
  <Box key={`sub-checkbox-0`} as="form" p={1} pl={6} sx={{display: 'flex', alignItems: 'center'}}>
    <Checkbox id={`sub-checkbox-0`} checked={true} onChange={() => {}} />
    <Text as="label" sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}} htmlFor={`sub-checkbox-0`}>
      <Text sx={{display: 'block'}}>Checkbox 1</Text>
    </Text>
  </Box>
  <Box key={`sub-checkbox-1`} as="form" p={1} pl={6} sx={{display: 'flex', alignItems: 'center'}}>
    <Checkbox id={`sub-checkbox-1`} checked={false} onChange={() => {}} />
    <Text as="label" sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}} htmlFor={`sub-checkbox-1`}>
      <Text sx={{display: 'block'}}>Checkbox 2</Text>
    </Text>
  </Box>
  <Box key={`sub-checkbox-2`} as="form" p={1} pl={6} sx={{display: 'flex', alignItems: 'center'}}>
    <Checkbox id={`sub-checkbox-2`} checked={false} onChange={() => {}} />
    <Text as="label" sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}} htmlFor={`sub-checkbox-2`}>
      <Text sx={{display: 'block'}}>Checkbox 3</Text>
    </Text>
  </Box>
  <Box key={`sub-checkbox-3`} as="form" p={1} pl={6} sx={{display: 'flex', alignItems: 'center'}}>
    <Checkbox id={`sub-checkbox-3`} checked={false} onChange={() => {}} />
    <Text as="label" sx={{fontSize: 2, fontWeight: 'bold', marginLeft: 1}} htmlFor={`sub-checkbox-3`}>
      <Text sx={{display: 'block'}}>Checkbox 4</Text>
    </Text>
  </Box>
</>
```

## Component props

Native `<input>` attributes are forwarded to the underlying React `input` component and are not listed below.

| Name           | Type    |  Default  | Description                                                                                                                                             |
| :------------- | :------ | :-------: | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| checked        | Boolean | undefined | Optional. Modifies on/off state of the native checkbox                                                                                                  |
| defaultChecked | Boolean | undefined | Optional. Checks the input by default in uncontrolled mode                                                                                              |
| disabled       | Boolean | undefined | Optional. Modifies the native disabled state of the native checkbox                                                                                     |
| indeterminate  | Boolean | undefined | Optional. Applies an [indeterminate](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#attr-indeterminate) state to the checkbox |

## Component Status

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
