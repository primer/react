import React from 'react'
import {ToggleSwitch} from '../../src'
import figma from '@figma/code-connect'

/**
 * -- This file was auto-generated by `figma connect create` --
 * `props` includes a mapping from Figma properties and variants to
 * suggested values. You should update this to match the props of your
 * code component, and update the `example` function to return the
 * code example you'd like to see in Figma
 */

figma.connect(
  ToggleSwitch,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=13518-50189&t=rBGihCejTKqmfwci-4',
  {
    props: {
      focused: figma.boolean('focused'),
      size: figma.enum('size', {
        medium: 'medium',
        small: 'small',
      }),
      loading: figma.enum('state', {
        loading: true,
      }),
      checked: figma.boolean('checked'),
      labelposition: figma.enum('label position', {
        start: 'start',
        end: 'end',
      }),
    },
    example: ({size, checked, labelposition, loading}) => (
      <ToggleSwitch size={size} checked={checked} statusLabelPosition={labelposition} loading={loading} />
    ),
  },
)
