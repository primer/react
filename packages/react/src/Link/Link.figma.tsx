import Link from './Link'
import figma from '@figma/code-connect'

figma.connect(
  Link,
  'https://www.figma.com/file/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?type=design&node-id=20953-78768&mode=design&t=HqwKHI6akvFT5reK-4',
  {
    props: {
      label: figma.string('link text'),
      inline: figma.boolean('inline'),
      trailingVisual: figma.boolean('trailingVisual?', {
        true: figma.instance('trailingVisual'),
        false: undefined,
      }),
      leadingVisual: figma.boolean('leadingVisual?', {
        true: figma.instance('leadingVisual'),
        false: undefined,
      }),
      muted: figma.boolean('muted'),
    },
    example: ({label, inline, muted, leadingVisual, trailingVisual}) => (
      <Link inline={inline} muted={muted} href="#">
        {leadingVisual}
        {label}
        {trailingVisual}
      </Link>
    ),
  },
)
