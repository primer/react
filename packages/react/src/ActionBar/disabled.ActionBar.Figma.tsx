// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-nocheck
// import React from 'react'
// import {ActionBar} from '..'
// import figma from '@figma/code-connect'

// figma.connect(
//   ActionBar,
//   'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=17042-65810&t=ARVklwnsUc0zUmot-4',
//   {
//     props: {
//       items: figma.children(['ActionBar.IconButton', 'ActionBar.Divider']),
//     },
//     example: ({items}) => <ActionBar>{items}</ActionBar>,
//   },
// )

// figma.connect(
//   ActionBar.IconButton,
//   'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=35848-26016&m=dev',
//   {
//     props: {
//       iconButton: figma.nestedProps('IconButton', {
//         icon: figma.instance('icon'),
//         ariaLabel: figma.string('aria-label'),
//       }),
//     },
//     example: ({iconButton}) => <ActionBar.IconButton icon={iconButton.icon} aria-label={iconButton.ariaLabel} />,
//   },
// )

// figma.connect(
//   ActionBar.Divider,
//   'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=17042-65808&t=ARVklwnsUc0zUmot-4',
//   {
//     props: {},
//     example: () => <ActionBar.Divider />,
//   },
// )
