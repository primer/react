import {Heading, Popover, Text} from '../../src'
import figma from '@figma/code-connect'

figma.connect(Popover, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=19015-63778&m=dev', {
  props: {
    body: figma.string('body'),
    heading: figma.string('heading'),
    action: figma.children('Action'),
    caret: figma.enum('caret', {
      top: 'top',
      'top-left': 'top-left',
      'top-right': 'top-right',
      bottom: 'bottom',
      'bottom-left': 'bottom-left',
      'bottom-right': 'bottom-right',
      left: 'left',
      'left-top': 'left-top',
      'left-bottom': 'left-bottom',
      right: 'right',
      'right-top': 'right-top',
      'right-bottom': 'right-bottom',
    }),
  },
  example: ({caret, heading, body, action}) => (
    <Popover caret={caret}>
      <Popover.Content>
        <Heading style={{fontSize: 'var(--text-title-size-small)'}}>{heading}</Heading>
        <Text as="p">{body}</Text>
        {action}
      </Popover.Content>
    </Popover>
  ),
})
