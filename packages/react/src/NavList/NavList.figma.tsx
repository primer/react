import {NavList} from '../../src'
import figma from '@figma/code-connect'

figma.connect(
  NavList,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=16716-62541&t=m8uYul4RVKTAkjzl-4',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({children}) => <NavList>{children}</NavList>,
  },
)

figma.connect(
  NavList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=40009-6314&t=3Scp7X8EXitkqgLF-4',
  {
    props: {
      actionList: figma.nestedProps('label and description', {
        text: figma.textContent('label'),
      }),
    },
    example: ({actionList}) => <NavList.Item href="#">{actionList.text}</NavList.Item>,
  },
)
/** Subitem **/
figma.connect(
  NavList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15175-71561&m=dev',
  {
    props: {
      actionList: figma.nestedProps('label and description', {
        text: figma.textContent('label'),
      }),
    },
    example: ({actionList}) => <NavList.Item href="#">{actionList.text}</NavList.Item>,
  },
)
/** Collapsible item **/
figma.connect(
  NavList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=16716-62586&m=dev',
  {
    props: {
      actionList: figma.nestedProps('label and description', {
        text: figma.textContent('label'),
      }),
      children: figma.children('NavList.Item/SubItem'),
    },
    example: ({actionList, children}) => (
      <NavList.Item>
        {actionList.text}
        <NavList.SubNav>{children}</NavList.SubNav>
      </NavList.Item>
    ),
  },
)

figma.connect(
  NavList.GroupHeading,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=40065-84253&t=3Scp7X8EXitkqgLF-4',
  {
    props: {
      actionList: figma.nestedProps('ActionList.GroupHeading', {
        title: figma.string('title'),
      }),
    },
    example: ({actionList}) => <NavList.GroupHeading>{actionList.title}</NavList.GroupHeading>,
  },
)

figma.connect(
  NavList.Divider,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=40065-83912&t=3Scp7X8EXitkqgLF-4',
  {
    props: {},
    example: () => <NavList.Divider />,
  },
)
