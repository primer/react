import {Dialog, type ResponsiveValue} from '../'
import figma from '@figma/code-connect'

figma.connect(Dialog, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=16593%3A65798', {
  props: {
    // These props were automatically mapped based on your linked code:
    position: figma.enum('position', {
      center: 'center',
      left: 'left',
      right: 'right',
      bottom: 'bottom' as ResponsiveValue<'bottom'>,
    }),
    // No matching props could be found for these Figma properties:
    // "size": figma.enum('size', {
    //   "small": "small",
    //   "medium": "medium",
    //   "large": "large",
    //   "full": "full",
    //   "xlarge": "xlarge",
    //   "small-portrait": "small-portrait",
    //   "medium-portrait": "medium-portrait"
    // })
  },
  example: props => <Dialog onClose={() => {}} position={props.position} />,
})
