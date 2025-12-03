import Heading from './Heading'
import figma from '@figma/code-connect'

figma.connect(
  Heading,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=21069-78785&t=LhKEppN9LJfzQQ49-4',
  {
    props: {
      text: figma.textContent('Text'),
      variant: figma.enum('variant', {
        large: 'large',
        medium: 'medium',
        small: 'small',
      }),
    },
    example: ({text, variant}) => <Heading variant={variant}>{text}</Heading>,
  },
)
