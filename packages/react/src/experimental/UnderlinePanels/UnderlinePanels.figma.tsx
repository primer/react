import React from 'react'
import {UnderlinePanels} from '../'
import figma from '@figma/code-connect'

figma.connect(UnderlinePanels, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=39456%3A2213', {
  props: {
    // No matching props could be found for these Figma properties:
    // "label": figma.string('label'),
    // "counter": figma.boolean('counter?'),
    // "icon": figma.instance('icon'),
    // "leadingIcon": figma.boolean('leadingIcon?'),
    // "state": figma.enum('state', {
    //   "default": "default",
    //   "hover": "hover",
    //   "focus": "focus",
    //   "selected": "selected"
    // })
  },
  example: props => <UnderlinePanels />,
})
