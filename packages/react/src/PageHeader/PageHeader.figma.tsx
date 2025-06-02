import {PageHeader} from '../'
import figma from '@figma/code-connect'

figma.connect(
  PageHeader,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=40002-2161&t=IXcS4U90x9HnYx6s-4',
  {
    props: {
      // No matching props could be found for these Figma properties:
      description: figma.children('_PageHeader.Description'),
      titleArea: figma.children('_PageHeader.TitleArea'),
      hasBorder: figma.boolean('hasBorder?'),
      navigation: figma.children('_PageHeader.Navigation'),
      contextArea: figma.children('_PageHeader.ContextArea'),
    },
    example: ({description, hasBorder, titleArea, navigation, contextArea}) => (
      <PageHeader hasBorder={hasBorder}>
        {titleArea}
        {contextArea}
        {description}
        {navigation}
      </PageHeader>
    ),
  },
)

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
      title: figma.children('_PageHeader.Title'),
      actions: figma.children('_PageHeader.Actions'),
      leadingAction: figma.children('_PageHeader.LeadingAction'),
      trailingAction: figma.children('_PageHeader.TrailingAction'),
      leadingVisual: figma.children('_PageHeader.LeadingVisual'),
      trailingVisual: figma.children('_PageHeader.TrailingVisual'),
    },
    example: ({variant, title, actions, leadingAction, trailingAction, leadingVisual, trailingVisual}) => (
      <>
        <PageHeader.TitleArea variant={variant}>
          {leadingVisual}
          {title}
          {trailingVisual}
        </PageHeader.TitleArea>
        {leadingAction}
        {trailingAction}
        {actions}
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

/* Description */
figma.connect(
  PageHeader.Description,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38380-2894&t=IXcS4U90x9HnYx6s-4',
  {
    example: () => <PageHeader.Description>{/*...*/}</PageHeader.Description>,
  },
)

/* Navigation */
figma.connect(
  PageHeader.Navigation,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38380-2885&t=IXcS4U90x9HnYx6s-4',
  {
    props: {
      underlineNav: figma.nestedProps('UnderlineNav', {
        items: figma.children('*'),
      }),
    },
    example: ({underlineNav}) => <PageHeader.Navigation>{underlineNav.items}</PageHeader.Navigation>,
  },
)

/* LeadingAction */
figma.connect(
  PageHeader.LeadingAction,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=40102-162217&t=wRHARmXHLT2f3NjB-4',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({children}) => <PageHeader.LeadingAction>{children}</PageHeader.LeadingAction>,
  },
)

/* TrailingAction */
figma.connect(
  PageHeader.TrailingAction,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=40102-162780&t=wRHARmXHLT2f3NjB-4',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({children}) => <PageHeader.TrailingAction>{children}</PageHeader.TrailingAction>,
  },
)

/* LeadingVisual */
figma.connect(
  PageHeader.LeadingVisual,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=40102-163620&m=dev',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({children}) => <PageHeader.LeadingVisual>{children}</PageHeader.LeadingVisual>,
  },
)

/* TrailingVisual */
figma.connect(
  PageHeader.TrailingVisual,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=40102-163412&m=dev',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({children}) => <PageHeader.TrailingVisual>{children}</PageHeader.TrailingVisual>,
  },
)

/* ContextArea */
figma.connect(
  PageHeader.ContextArea,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=38380-2874&t=wRHARmXHLT2f3NjB-4',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({children}) => <PageHeader.ContextArea>{children}</PageHeader.ContextArea>,
  },
)

/* ContextAreaActions */
figma.connect(
  PageHeader.ContextAreaActions,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=40102-164554&t=wRHARmXHLT2f3NjB-4',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({children}) => <PageHeader.ContextAreaActions>{children}</PageHeader.ContextAreaActions>,
  },
)
