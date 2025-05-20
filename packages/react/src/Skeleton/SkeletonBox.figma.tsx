import {SkeletonBox} from './'
import figma from '@figma/code-connect'

figma.connect(
  SkeletonBox,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=36445-82&t=yGFSCgMOJ0ItJpsF-4',
  {
    // @ts-ignore: needs comment for figma code connect
    example: () => <SkeletonBox height={/* set height */} width={/* set height */} />,
  },
)
