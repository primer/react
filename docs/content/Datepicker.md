---
title: Datepicker
description: Use datepicker to select a single date, multiple dates, or a range of dates
status: Alpha
source: https://github.com/primer/react/blob/main/src/Datepicker/index.tsx
storybook: '/react/storybook?path=/story/composite-components-datepicker--default-date-picker'
---

## Default example

The `Datepicker` component offers a variety of usages, such as single-select, multi-select, and range-select. The default usage is single-select

```jsx live
<>
  <DatePicker />
</>
```

## Multi-selection example

With a multi-select datepicker, the user is able to select multiple dates (with an option of a maximum).

```jsx live
<>
  <DatePicker variat="multi" maxSelections={5} />
</>
```

## Range-selection example

With a range-select datepicker, the user is able to select a range of dates by selecting the start and end dates (with an option of a maximum range size, supplied in days).

```jsx live
<>
  <DatePicker variat="range" maxRangeSize={14} />
</>
```

## Component props

Native `<input>` attributes are forwarded to the underlying React `input` component and are not listed below.

| Name                  | Type                                 |     Default      | Description                                                                                                                                                |
| :-------------------- | :----------------------------------- | :--------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| anchoredOverlayProps  | Object                               |    undefined     | Optional. Additional properties passed to the overlay                                                                                                      |
| anchorRef             | ReactRef                             |    undefined     | Optional. React Ref object that, if supplied, will be the anchor for the datepicker                                                                        |
| anchorVariant         | 'button', 'icon-only', 'input'       |     'button'     | Optional. For the built in anchor, how it is displayed to the user                                                                                         |
| compressedHeader      | Boolean                              |      false       | Optional. Provides a set of dropdowns for quick movement over large time spans                                                                             |
| configuration         | Object                               |    undefined     | Optional. Escape hatch to send the entire datepicker configuration as a single prop                                                                        |
| confirmation          | Boolean                              |      false       | Optional. Determines whether the user must hit 'Apply' before changes will be saved.                                                                       |
| confirmUnsavedChanges | Boolean                              |      false       | Optional. If true, the user will be prompted to save when they attempt to close the datepicker with unsaved changes. Note: this will enable `confirmation` |
| dateFormat            | 'short', 'long', String              |     'short'      | Optional. The format in which to display dates                                                                                                             |
| disabled              | Boolean                              |      false       | Optional. Disable the datepicker component                                                                                                                 |
| disableWeekends       | Boolean                              |      false       | Optional. If true, disables weekend days from being selected                                                                                               |
| iconPlacement         | 'start', 'end', 'none'               |     'start'      | Optional. Specifies where the calendar icon is placed on the control                                                                                       |
| maxDate               | Date                                 |    undefined     | Optional. Sets the maximum date that can be selected. Also restricts browsing of dates beyond provided month                                               |
| maxRangeSize          | Number                               |    undefined     | Optional. Applicable only to variant of type `range`, specifies the maximum range able to be selected                                                      |
| maxSelections         | Number                               |    undefined     | Optional. Applicable only to variant of type `multi`, specifies the maximum number of selections able to be selected                                       |
| minDate               | Date                                 |    undefined     | Optional. Sets the minimum date that can be selected. Also restricts browsing of dates before provided month                                               |
| open                  | Boolean                              |    undefined     | Optional. Forcibly sets the open/close state of the datepicker                                                                                             |
| onChange              | Function                             |    undefined     | Optional. Callback that is called when the date has changed (and has been confirmed, when `confirmation` is true)                                          |
| onClose               | Function                             |    undefined     | Optional. Callback that is called when the datepicker closes                                                                                               |
| onOpen                | Function                             |    undefined     | Optional. Callback that is called when the datepicker opens                                                                                                |
| placeholder           | String                               | 'Choose Date...' | Optional. Text that is displayed when no date has been selected                                                                                            |
| renderAnchor          | Function                             |    undefined     | Callback that is called to render a custom anchor component                                                                                                |
| value                 | Date, Date[], {from: Date, to: Date} |    undefined     | Optional. Selected date value. Type is dependant on which `variant` is set                                                                                 |
| variant               | 'single', 'multi', 'range'           |     'single'     | Optional. Specifies which selection interaction the user is allowed                                                                                        |
| view                  | '1-month', '2-month'                 |    '1-month'     | Optional. Determines whether the datepicker shows 1 or 2 months at a time                                                                                  |
| weekStartsOn          | String (day of the week)             |     'Sunday'     | Optional. Specifies which day of the week the calendar months should begin on                                                                              |

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
