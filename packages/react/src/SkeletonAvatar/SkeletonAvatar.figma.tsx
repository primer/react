import {SkeletonAvatar} from '../SkeletonAvatar'
import figma from '@figma/code-connect'

figma.connect(
  SkeletonAvatar,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=29994-6840&m=dev',
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
      square: figma.enum('shape', {
        circle: false,
        square: true,
      }),
    },
    example: ({size, square}) => <SkeletonAvatar size={size} square={square} />,
  },
)
