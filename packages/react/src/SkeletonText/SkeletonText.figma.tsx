import {SkeletonText} from '../SkeletonText'
import figma from '@figma/code-connect'

const props = {
  size: figma.enum('size', {
    display: 'display',
    titleLarge: 'titleLarge',
    titleMedium: 'titleMedium',
    titleSmall: 'titleSmall',
    bodyLarge: 'bodyLarge',
    bodyMedium: 'bodyMedium',
    bodySmall: 'bodySmall',
    subtitle: 'subtitle',
  }),
}

figma.connect(SkeletonText, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30013-6946&m=dev', {
  props,
  example: ({size}) => <SkeletonText size={size} />,
})

figma.connect(SkeletonText, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30013-6984&m=dev', {
  props,
  variant: {lines: '2'},
  example: ({size}) => (
    <div>
      <SkeletonText size={size} />
      <SkeletonText size={size} />
    </div>
  ),
})

figma.connect('https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30013-6984&m=dev', {
  props,
  variant: {lines: '3'},
  example: ({size}) => (
    <div>
      <SkeletonText size={size} />
      <SkeletonText size={size} />
      <SkeletonText size={size} />
    </div>
  ),
})

figma.connect('https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30013-6984&m=dev', {
  props,
  variant: {lines: '4'},
  example: ({size}) => (
    <div>
      <SkeletonText size={size} />
      <SkeletonText size={size} />
      <SkeletonText size={size} />
      <SkeletonText size={size} />
    </div>
  ),
})

figma.connect('https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=30013-6984&m=dev', {
  props,
  variant: {lines: '5'},
  example: ({size}) => (
    <div>
      <SkeletonText size={size} />
      <SkeletonText size={size} />
      <SkeletonText size={size} />
      <SkeletonText size={size} />
      <SkeletonText size={size} />
    </div>
  ),
})
