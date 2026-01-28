import {UnderlineNav} from '../../src'
import figma from '@figma/code-connect'

figma.connect(
  UnderlineNav,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=26717-1390&t=9imbqLYmermiHP7U-4',
  {
    props: {
      items: figma.children('Item*'),
    },
    example: ({items}) => <UnderlineNav>{items}</UnderlineNav>,
  },
)

figma.connect(
  UnderlineNav.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=18843-84823&m=dev',
  {
    props: {
      label: figma.textContent('Label'),
      current: figma.enum('state', {
        selected: 'page',
        default: undefined,
        hover: 'false',
        focus: 'false',
      }),
      counter: figma.nestedProps('CounterLabel', {
        count: figma.textContent('text'),
      }),
      leadingVisual: figma.boolean('leadingIcon?', {
        false: undefined,
        true: figma.children('Icon'),
      }),
    },
    example: ({label, current, counter, leadingVisual}) => (
      <UnderlineNav.Item aria-current={current} counter={counter.count} leadingVisual={leadingVisual}>
        {label}
      </UnderlineNav.Item>
    ),
  },
)
