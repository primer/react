import TabNav from './TabNav'
import figma from '@figma/code-connect'

figma.connect(TabNav, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=24375-94677&m=dev', {
  props: {
    children: figma.children('TabNav.Link'),
    trailingAction: figma.boolean('trailingAction?', {
      true: figma.children('Action'),
      false: undefined,
    }),
  },
  example: ({children, trailingAction}) => (
    <TabNav>
      {children}
      {trailingAction}
    </TabNav>
  ),
})

figma.connect(
  TabNav.Link,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=18247-69223&t=hRAVLxy8fN4FzpK2-4',
  {
    props: {
      selected: figma.enum('state', {selected: true}),
      label: figma.string('label'),
      counter: figma.boolean('counter?', {
        true: figma.children('CounterLabel'),
        false: undefined,
      }),
      leadingVisual: figma.boolean('leadingVisual?', {
        true: figma.children('leadingVisual'),
        false: undefined,
      }),
    },
    example: ({label, selected, counter, leadingVisual}) => (
      <TabNav.Link selected={selected}>
        {leadingVisual}
        {label}
        {counter}
      </TabNav.Link>
    ),
  },
)
