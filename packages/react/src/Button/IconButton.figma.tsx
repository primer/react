// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {figma} from '@figma/code-connect'
import {IconButton} from '../../src'
import React from 'react'

figma.connect(
  IconButton,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30468-5843&t=eGzObFz2btFEDDNj-4',
  {
    props: {
      icon: figma.instance('icon'),
      variant: figma.enum('variant', {
        primary: 'primary',
        secondary: 'secondary',
        danger: 'danger',
        outline: 'outline',
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
      <IconButton variant={variant} icon={icon} aria-label={ariaLabel} size={size} />
    ),
  },
)
