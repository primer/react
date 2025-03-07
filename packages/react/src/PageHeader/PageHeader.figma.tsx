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

/* TITLE AREA */
figma.connect(
  PageHeader.TitleArea,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38380-2931&m=dev',
  {
    props: {
      variant: figma.enum('Title size', {
        subtitle: 'subtitle',
        medium: 'medium',
        large: 'large',
      }),
      // children: figma.children('_PageHeader.Title'),
      // actions: figma.nestedProps('hasActions?', {
      //   false: undefined,
      //   true: figma.children('_PageHeader.Actions'),
      // }),
    },
    example: ({variant}) => (
      <>
        <PageHeader.TitleArea variant={variant}></PageHeader.TitleArea>
        {/* {actions} */}
      </>
    ),
  },
)

/* TITLE */
figma.connect(
  PageHeader.Title,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38380-2888&m=dev',
  {
    props: {
      title: figma.string('title'),
    },
    example: ({title}) => <PageHeader.Title>{title}</PageHeader.Title>,
  },
)

/* Actions */
figma.connect(
  PageHeader.Actions,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=39970-89643&t=fprKViURxkKXOe6Y-4',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({children}) => <PageHeader.Actions>{children}</PageHeader.Actions>,
  },
)
