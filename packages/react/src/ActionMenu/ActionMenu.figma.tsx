import {ActionMenu} from '../../src'
import figma from '@figma/code-connect'

figma.connect(
  ActionMenu,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=26998-2424&t=GFf1GorpZXk4F8Mq-4',
  {
    props: {
      trigger: figma.children('trigger'),
      open: figma.boolean('open'),
      align: figma.enum('align', {
        right: 'end',
        left: 'start',
        center: 'center',
      }),
      actionList: figma.nestedProps('ActionMenu/Content', {
        items: figma.children('*'),
      }),
    },
    example: ({trigger, open, align, actionList}) => (
      <ActionMenu open={open}>
        <ActionMenu.Anchor>{trigger}</ActionMenu.Anchor>
        <ActionMenu.Overlay align={align}>{actionList.items}</ActionMenu.Overlay>
      </ActionMenu>
    ),
  },
)
