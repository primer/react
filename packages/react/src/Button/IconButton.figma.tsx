import {figma} from '@figma/code-connect'
import {IconButton} from '../../src'
import type {VariantType} from './types'
import type React from 'react'

figma.connect(
  IconButton,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30468-5843&t=eGzObFz2btFEDDNj-4',
  {
    props: {
      icon: figma.instance('icon').getProps<{name: string; fn: React.FC}>(),
      variant: figma.enum<VariantType>('variant', {
        primary: 'primary',
        secondary: 'default',
        danger: 'danger',
        invisible: 'invisible',
      }),
      size: figma.enum('size', {
        small: 'small',
        medium: 'medium',
        large: 'large',
      }),
      ariaLabel: figma.string('aria-label'),
    },
    example: ({icon, ariaLabel, variant, size}) => (
      <IconButton variant={variant} icon={icon.fn} aria-label={ariaLabel} size={size} />
    ),
  },
)
