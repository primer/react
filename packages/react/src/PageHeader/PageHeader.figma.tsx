import React from 'react'
import {PageHeader} from '../'
import figma from '@figma/code-connect'

figma.connect(PageHeader, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38380%3A2926', {
  props: {
    // No matching props could be found for these Figma properties:
    description: figma.boolean('hasDescription', {
      false: undefined,
      true: figma.children('_PageHeader.Description'),
    }),
    // "hasNavigation": figma.boolean('hasNavigation'),
    // "hasContextArea": figma.boolean('hasContextArea')
  },
  example: ({description}) => <PageHeader>{description}</PageHeader>,
})
