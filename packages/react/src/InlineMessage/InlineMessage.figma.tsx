import figma from '@figma/code-connect'
import {InlineMessage} from './InlineMessage'

figma.connect(InlineMessage, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=32109-348&m=dev', {
  props: {
    variant: figma.enum('variant', {
      success: 'success',
      warning: 'warning',
      critical: 'critical',
      unavailable: 'unavailable',
    }),
    size: figma.enum('size', {
      small: 'small',
      medium: 'medium',
    }),
    text: figma.string('text'),
  },
  example: ({size, variant, text}) => (
    <InlineMessage size={size} variant={variant}>
      {text}
    </InlineMessage>
  ),
})
