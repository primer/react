import type React from 'react'

export interface TableColumnLayout {
  maxWidth?: React.CSSProperties['maxWidth']
  minWidth?: React.CSSProperties['minWidth']
  width?: 'grow' | 'growCollapse' | 'auto' | React.CSSProperties['width']
}

export function getGridTemplateColumns(columns: TableColumnLayout[]): string {
  return columns
    .map(column => {
      const width = column.width ?? 'grow'
      let minWidth: React.CSSProperties['minWidth'] = 'auto'
      let maxWidth: React.CSSProperties['maxWidth'] = '1fr'

      if (width === 'auto') maxWidth = 'auto'
      if (width === 'grow' && !column.maxWidth) minWidth = 'max-content'
      if (width === 'growCollapse') minWidth = 0
      if (column.minWidth !== undefined) minWidth = column.minWidth
      if (column.maxWidth !== undefined) maxWidth = column.maxWidth

      if (typeof width !== 'number' && ['grow', 'growCollapse', 'auto'].includes(width)) {
        const min = typeof minWidth === 'number' ? `${minWidth}px` : minWidth
        const max = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
        return min === max ? min : `minmax(${min}, ${max})`
      }

      return typeof width === 'number' ? `${width}px` : width
    })
    .join(' ')
}
