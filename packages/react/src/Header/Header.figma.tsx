import React from 'react'
import {Header} from '../'
import figma from '@figma/code-connect'

figma.connect(Header, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=26738%3A6196', {
  props: {
    // No matching props could be found for these Figma properties:
    // "pRs": figma.boolean('PRs?'),
    // "createNewButton": figma.boolean('Create new button'),
    // "copilot": figma.boolean('Copilot?'),
    // "issues": figma.boolean('Issues?'),
    // "tabNav": figma.boolean('TabNav'),
    // "loggedin": figma.boolean('Logged-in'),
    // "type": figma.enum('Type', {
    //   "Desktop": "desktop",
    //   "Mobile": "mobile"
    // })
  },
  example: props => <Header />,
})
