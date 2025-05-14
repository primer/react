import {AvatarStack} from '../../src'
import figma from '@figma/code-connect'

figma.connect(
  AvatarStack,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=3805-24&t=eMfIgDUcIkVQzl79-4',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({children}) => <AvatarStack>{children}</AvatarStack>,
  },
)
