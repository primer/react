import figma from '@figma/code-connect'

figma.connect(
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=19009-64824&t=vS3nOEyUPfWAAP1y-4',
  {
    props: {
      icon: figma.children('*'),
    },
    example: ({icon}) => <>{icon}</>,
  },
)
