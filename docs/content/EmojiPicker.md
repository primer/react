---
title: Emoji Picker
description: Use Emoji Picker to select an emoji
status: Alpha
source: https://github.com/primer/react/blob/main/src/EmojiPicker/index.tsx
storybook: '/react/storybook?path=/story/composite-components-emoji-picker--default-emoji-picker'
---

## Default example

The `EmojiPicker` component allows users to select from a list of emojis, grouped by category

```jsx live
<>
  <EmojiPicker />
</>
```

## Custom Emojis example

Additional categories and items can be added if needed

```jsx live
const customCategories = [
    {
      id: 'github',
      name: 'GitHub',
      categoryIcon: <MarkGithubIcon />,
      emojis: [
        {
          name: 'Icon',
          emoji: <MarkGithubIcon />
        },
        {
          name: 'Logo',
          emoji: <LogoGithubIcon />
        }
      ]
    }
  ]

<>
  <EmojiPicker customCategories={customCategories} />
</>
```

## Component props

| Name             | Type     |  Default  | Description                                                                 |
| :--------------- | :------- | :-------: | :-------------------------------------------------------------------------- |
| customCategories | Object   | undefined | Optional. Allows for additional categories and items to b added to the list |
| onSelect         | Function | undefined | Optional. Callback called when an item has been selected                    |


## Component status

<ComponentChecklist
items={{
    propsDocumented: true,
    noUnnecessaryDeps: true,
    adaptsToThemes: true,
    adaptsToScreenSizes: true,
    fullTestCoverage: false,
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
