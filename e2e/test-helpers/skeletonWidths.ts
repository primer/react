const skeletonWidths = [
  {
    selector: '[data-component="FilteredActionList.Skeleton"] > [data-component="Stack"] > [data-component="Stack"]',
    property: '--loading-skeleton-width',
    widths: [80, 52.5, 67.5, 40, 72.5],
  },
  {
    selector: '.PRIVATE_TreeView-item-skeleton',
    property: '--tree-item-loading-width',
    widths: [67, 47, 73, 64, 50],
  },
  {
    selector: '.TableCellSkeletonItem',
    property: '--skeleton-item-width',
    widths: [85, 67.5, 80, 60, 75],
  },
] as const

// Preserve the existing visual baselines even in browsers that support random().
const deterministicSkeletonWidths = skeletonWidths
  .flatMap(({selector, property, widths}) =>
    widths.map((width, index) => `${selector}:nth-of-type(5n + ${index + 1}) { ${property}: ${width}% !important; }`),
  )
  .join('\n')

export {deterministicSkeletonWidths, skeletonWidths}
