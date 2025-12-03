import {ButtonGroup} from '../../src'
import figma from '@figma/code-connect'

figma.connect(ButtonGroup, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=36325-3634&m=dev', {
  props: {
    children: figma.children('*'),
  },
  example: ({children}) => <ButtonGroup>{children}</ButtonGroup>,
})
