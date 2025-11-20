import {CounterLabel} from '../../src'
import figma from '@figma/code-connect'

figma.connect(
  CounterLabel,
  'https://www.figma.c1om/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=18959-64970&t=9imbqLYmermiHP7U-4',
  {
    props: {
      variant: figma.enum('variant', {
        primary: 'primary',
        secondary: 'secondary',
      }),
      count: figma.textContent('text'),
    },
    example: ({variant, count}) => <CounterLabel variant={variant}>{count}</CounterLabel>,
  },
)
