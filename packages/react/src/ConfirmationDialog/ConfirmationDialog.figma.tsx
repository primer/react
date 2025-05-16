import {ConfirmationDialog} from '../'
import figma from '@figma/code-connect'

figma.connect(
  ConfirmationDialog,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=16593%3A65794',
  {
    props: {
      headerProps: figma.nestedProps('Header', {
        title: figma.string('title'),
      }),
    },
    example: ({headerProps}) => <ConfirmationDialog onClose={() => {}} title={headerProps.title} />,
  },
)
