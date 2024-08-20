import React from 'react'
import {ActionBar} from '../../src'
import figma from '@figma/code-connect'

figma.connect(
  ActionBar,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=17042-65810&t=ARVklwnsUc0zUmot-4',
  {
    props: {
      items: figma.children(['IconButton', '_ActionBar.Divider']),
    },
    example: ({items}) => <ActionBar>{items}</ActionBar>,
  },
)

figma.connect(
  ActionBar.IconButton,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30468-5843&t=ARVklwnsUc0zUmot-4',
  {
    props: {
      icon: figma.instance('icon'),
    },
    example: ({icon}) => <ActionBar.IconButton icon={icon} />,
  },
)

figma.connect(
  ActionBar.Divider,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=17042-65808&t=ARVklwnsUc0zUmot-4',
  {
    props: {},
    example: () => <ActionBar.Divider />,
  },
)
