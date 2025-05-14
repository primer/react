import {Avatar} from '../../src'
import figma from '@figma/code-connect'

figma.connect(
  Avatar,
  'https://www.figma.com/file/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?type=design&node-id=3805-11&mode=design&t=n5UtEmPJTCzDEJKK-4',
  {
    props: {
      size: figma.enum('size', {
        '16px': 16,
        '20px': 20,
        '24px': 24,
        '28px': 28,
        '32px': 32,
        '40px': 40,
        '48px': 48,
        '64px': 64,
      }),
      square: figma.boolean('square'),
    },
    example: ({size, square}) => <Avatar src="/path/to/file/mona.png" size={size} square={square} />,
  },
)
