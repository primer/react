import {AvatarPair} from '../../src'
import figma from '@figma/code-connect'

figma.connect(AvatarPair, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=13006-42855', {
  props: {
    children: figma.children('*'),
  },
  example: ({children}) => <AvatarPair>{children}</AvatarPair>,
})
