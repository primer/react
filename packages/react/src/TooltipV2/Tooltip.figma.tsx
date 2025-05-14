import {Tooltip} from './Tooltip'
import figma from '@figma/code-connect'

figma.connect(Tooltip, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=25702-1394&m=dev', {
  props: {
    label: figma.string('Label'),
  },
  example: ({label}) => <Tooltip text={label} />,
})
