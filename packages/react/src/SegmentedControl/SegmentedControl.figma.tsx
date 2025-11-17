import type React from 'react'
import {SegmentedControl} from './SegmentedControl'
import figma from '@figma/code-connect'

figma.connect(
  SegmentedControl,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=16122-79604&t=LhKEppN9LJfzQQ49-4',
  {
    props: {
      items: figma.children(['SegmentedControl.Button']),
      size: figma.enum('size', {
        medium: 'medium',
        small: 'small',
      }),
    },
    example: ({size, items}) => <SegmentedControl size={size}>{items}</SegmentedControl>,
  },
)

figma.connect(
  SegmentedControl.Button,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=16121-61223&m=dev',
  {
    props: {
      label: figma.string('label'),
      selected: figma.enum('state', {selected: true}),
      leadingIcon: figma.boolean('leadingIcon?', {
        true: figma.instance('icon').getProps<{name: string; fn: React.FC}>(),
        false: undefined,
      }),
    },
    example: ({selected, label, leadingIcon}) => (
      // @ts-expect-error: leadingIcon is optional
      <SegmentedControl.Button selected={selected} leadingVisual={leadingIcon.fn}>
        {label}
      </SegmentedControl.Button>
    ),
  },
)

figma.connect(
  SegmentedControl.IconButton,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=16231-63571&m=dev',
  {
    props: {
      selected: figma.enum('state', {selected: true}),
      icon: figma.instance('icon').getProps<{name: string; fn: React.ReactElement<any>}>(),
    },
    example: ({selected, icon}) => (
      <SegmentedControl.IconButton aria-label="Describe action" selected={selected} icon={icon.fn} />
    ),
  },
)
