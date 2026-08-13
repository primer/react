interface CreateTableOptions {
  columns: readonly string[]
  rows: readonly (readonly string[])[]
  terminalWidth?: number
}

const ELLIPSIS = '…'

function normalizeCell(value: string) {
  return value.replace(/[^\S\r\n]*(?:\r\n|\r|\n)[^\S\r\n]*/g, ', ')
}

function getCharacterCount(value: string) {
  return Array.from(value).length
}

function truncate(value: string, width: number) {
  const characters = Array.from(value)

  if (characters.length <= width) {
    return value
  }

  return `${characters.slice(0, width - 1).join('')}${ELLIPSIS}`
}

function formatCell(value: string, width: number) {
  const content = truncate(value, width)
  return ` ${content}${' '.repeat(width - getCharacterCount(content))} `
}

function getTableWidth(columnWidths: readonly number[]) {
  return columnWidths.reduce((width, columnWidth) => width + columnWidth + 3, 1)
}

function fitColumnWidths(columnWidths: readonly number[], terminalWidth: number | undefined) {
  const widths = [...columnWidths]

  if (terminalWidth === undefined) {
    return widths
  }

  while (getTableWidth(widths) > terminalWidth) {
    const longestColumnWidth = Math.max(...widths)
    const longestColumnIndex = widths.indexOf(longestColumnWidth)

    if (longestColumnWidth <= 1) {
      break
    }

    widths[longestColumnIndex] -= 1
  }

  return widths
}

export function createTable({columns, rows, terminalWidth}: CreateTableOptions) {
  return {
    toString() {
      if (columns.length === 0) {
        return ''
      }

      const columnWidths = columns.map((column, columnIndex) => {
        return Math.max(
          getCharacterCount(normalizeCell(column)),
          ...rows.map(row => getCharacterCount(normalizeCell(row[columnIndex] ?? ''))),
        )
      })
      const fittedColumnWidths = fitColumnWidths(columnWidths, terminalWidth ?? process.stdout.columns)
      const formatRow = (row: readonly string[]) => {
        const cells = fittedColumnWidths.map((width, columnIndex) => {
          return formatCell(normalizeCell(row[columnIndex] ?? ''), width)
        })
        return `|${cells.join('|')}|`
      }
      const separator = `|${fittedColumnWidths.map(width => ` ${'-'.repeat(width)} `).join('|')}|`

      return [formatRow(columns), separator, ...rows.map(formatRow)].join('\n')
    },
  }
}
