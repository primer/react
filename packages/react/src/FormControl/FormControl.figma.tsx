import figma from '@figma/code-connect'
import FormControl from '../FormControl'

/* eslint eslint-comments/no-use: off */
/* eslint-disable primer-react/direct-slot-children */

figma.connect(
  FormControl.Label,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=34462-69137&t=WXa19NDaeGGhlbLq-4',
  {
    props: {
      label: figma.textContent('Label'),
    },
    example: ({label}) => <FormControl.Label>{label}</FormControl.Label>,
  },
)

figma.connect(
  FormControl.Caption,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15341-47232&t=nIetmFV1SCcA8FZ2-4',
  {
    props: {
      caption: figma.textContent('Caption'),
    },
    example: ({caption}) => <FormControl.Caption>{caption}</FormControl.Caption>,
  },
)
/* eslint-enable primer-react/direct-slot-children */

figma.connect(
  FormControl.Validation,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=34428-2171&t=gvEqrj5KNY2nbDQs-4',
  {
    props: {
      text: figma.textContent('text'),
      variant: figma.enum('variant', {
        error: 'error',
        success: 'success',
      }),
    },
    example: ({text, variant}) => <FormControl.Validation variant={variant}>{text}</FormControl.Validation>,
  },
)
