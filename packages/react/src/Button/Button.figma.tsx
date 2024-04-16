import {figma} from '@figma/code-connect'
import {ButtonComponent as Button} from './Button'
import React from 'react'

const componentProps = {
  disabled: figma.enum('state', {disabled: 'true'}),
  inactive: figma.enum('state', {inactive: 'true'}),
  size: figma.enum('size', {
    small: 'small',
    medium: 'medium',
    large: 'large',
  }),
  alignContent: figma.enum('alignContent', {
    start: 'start',
    center: 'center',
  }),
  variant: figma.enum('variant', {
    primary: 'primary',
    secondary: 'secondary',
    danger: 'danger',
    invisible: 'invisible',
  }),
  // leadingVisual: figma.instance('leadingVisual'),
  leadingVisual: figma.boolean('leadingVisual?', {
    true: figma.instance('leadingVisual'),
    false: undefined,
  }),
}

// figma.connect(
//   Button,
//   'https://www.figma.com/file/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?type=design&node-id=30258%3A5582&mode=design&t=TVF2yeiff0ZtzQll-1',
//   {
//     props: componentProps,
//     example: ({size, disabled, inactive, alignContent, variant}) => (
//       <Button
//         size={size}
//         disabled={disabled}
//         inactive={inactive}
//         alignContent={alignContent}
//         variant={variant}
//       ></Button>
//     ),
//   },
// )

figma.connect(
  Button,
  'https://www.figma.com/file/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?type=design&node-id=30258%3A5582&mode=design&t=TVF2yeiff0ZtzQll-1',
  {
    props: componentProps,
    example: ({size, disabled, inactive, leadingVisual, alignContent, variant}) => (
      <Button
        size={size}
        disabled={disabled}
        inactive={inactive}
        leadingVisual={leadingVisual}
        alignContent={alignContent}
        variant={variant}
      ></Button>
    ),
    // variant: {'leadingVisual?': true},
  },
)
// {
//   example: IconButton,
//   match: { 'HasIcon': true }
// },
// import { figma } from '@figma/code-connect'
// design: {
//       type: 'figma',
//       url: '',
//       examples: ['Playground'],
//       props: {
//         size: figma.enum('size', {
//           small: 'small',
//           medium: 'medium',
//           large: 'large',
//         }),
//         disabled: figma.enum('state', {disabled: 'true'}),
//         inactive: figma.enum('state', {inactive: 'true'}),
//       },
//     },
