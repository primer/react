import {figma} from '@figma/code-connect'
import {Button} from '../../src'

const componentProps = {
  label: figma.textContent('Button'),
  disabled: figma.enum('state', {disabled: true}),
  inactive: figma.enum('state', {inactive: true}),
  size: figma.enum('size', {
    small: 'small',
    medium: 'medium',
    large: 'large',
  }),
  alignContent: figma.enum('alignContent', {
    start: 'start',
    center: 'center',
  }),
  variant: figma.enum('variant', {
    primary: 'primary',
    secondary: 'default',
    danger: 'danger',
    invisible: 'invisible',
  }),
  leadingVisual: figma.boolean('leadingVisual?', {
    true: figma.instance('leadingVisual'),
    false: undefined,
  }),
  trailingVisual: figma.boolean('trailingVisual?', {
    true: figma.instance('trailingVisual'),
    false: undefined,
  }),
}

figma.connect(
  Button,
  'https://www.figma.com/file/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?type=design&node-id=30258%3A5582&mode=design&t=TVF2yeiff0ZtzQll-1',
  {
    props: componentProps,
    example: ({size, disabled, inactive, alignContent, leadingVisual, trailingVisual, variant, label}) => (
      <Button
        size={size}
        disabled={disabled}
        inactive={inactive}
        alignContent={alignContent}
        variant={variant}
        leadingVisual={leadingVisual}
        trailingVisual={trailingVisual}
      >
        {label}
      </Button>
    ),
  },
)
