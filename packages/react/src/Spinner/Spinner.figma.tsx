import {Spinner} from '../../src'
import figma from '@figma/code-connect'

figma.connect(Spinner, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=11025-38126&m=dev', {
  props: {
    size: figma.enum('size', {
      small: 'small',
      medium: 'medium',
      large: 'large',
    }),
  },
  example: ({size}) => <Spinner size={size} />,
})
