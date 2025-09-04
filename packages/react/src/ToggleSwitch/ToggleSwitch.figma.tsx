import {ToggleSwitch} from '../../src'
import figma from '@figma/code-connect'

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
      <ToggleSwitch
        aria-labelledby=""
        size={size}
        checked={checked}
        statusLabelPosition={labelposition}
        loading={loading}
      />
    ),
  },
)
