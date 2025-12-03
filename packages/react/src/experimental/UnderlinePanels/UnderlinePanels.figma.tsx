// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type React from 'react'
import {UnderlinePanels} from '../'
import figma from '@figma/code-connect'
import type {IconProps} from '@primer/octicons-react'

figma.connect(UnderlinePanels, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=39456%3A2213', {
  props: {
    items: figma.children('UnderlinePanels.Tab*'),
  },
  example: ({items}) => <UnderlinePanels>{items}</UnderlinePanels>,
})

const UnderlinePanelsTabProps = {
  selected: figma.boolean('selected'),
  leadingIcon: figma.boolean('leadingIcon?', {
    true: figma.instance('icon').getProps<{name: string; fn: React.FC<IconProps>}>(),
    false: undefined,
  }),
  counter: figma.boolean('counter?'),
  counterProps: figma.nestedProps('CounterLabel', {
    value: figma.textContent('text'),
  }),
  label: figma.string('label'),
}

figma.connect(
  UnderlinePanels.Tab,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=39456-2213&t=Ruhmu4yrZlzn11My-4',
  {
    props: UnderlinePanelsTabProps,
    example: ({label, selected}) => <UnderlinePanels.Tab aria-selected={selected}>{label}</UnderlinePanels.Tab>,
  },
)

figma.connect(
  UnderlinePanels.Tab,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=39456-2213&t=Ruhmu4yrZlzn11My-4',
  {
    props: UnderlinePanelsTabProps,
    variant: {'leadingIcon?': true},
    example: ({label, selected, leadingIcon}) => (
      <UnderlinePanels.Tab aria-selected={selected} icon={leadingIcon.fn}>
        {label}
      </UnderlinePanels.Tab>
    ),
  },
)

figma.connect(
  UnderlinePanels.Tab,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=39456-2213&t=Ruhmu4yrZlzn11My-4',
  {
    props: UnderlinePanelsTabProps,
    variant: {'leadingIcon?': true, 'counter?': true},
    example: ({label, selected, leadingIcon, counterProps}) => (
      <UnderlinePanels.Tab aria-selected={selected} icon={leadingIcon.fn} counter={counterProps.value}>
        {label}
      </UnderlinePanels.Tab>
    ),
  },
)

figma.connect(
  UnderlinePanels.Tab,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=39456-2213&t=Ruhmu4yrZlzn11My-4',
  {
    props: UnderlinePanelsTabProps,
    variant: {'leadingIcon?': false, 'counter?': true},
    example: ({label, selected, counterProps}) => (
      <UnderlinePanels.Tab aria-selected={selected} counter={counterProps.value}>
        {label}
      </UnderlinePanels.Tab>
    ),
  },
)
