type TableValue = string | number | boolean | null | undefined

interface TableColumn<T> {
  readonly header: string
  readonly getValue: (item: T) => TableValue
}

function formatTable<T>(items: readonly T[], columns: readonly TableColumn<T>[]): string {
  const header = `| ${columns.map(column => escapeCell(column.header)).join(' | ')} |`
  const separator = `| ${columns.map(() => '---').join(' | ')} |`
  const rows = items.map(item => {
    return `| ${columns
      .map(column => {
        return escapeCell(column.getValue(item))
      })
      .join(' | ')} |`
  })

  return [header, separator, ...rows].join('\n')
}

function formatKeyValueTable(rows: readonly (readonly [string, TableValue])[]): string {
  return formatTable(rows, [
    {
      header: 'Field',
      getValue: row => row[0],
    },
    {
      header: 'Value',
      getValue: row => row[1],
    },
  ])
}

function escapeCell(value: TableValue): string {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return String(value).replaceAll('|', '\\|').replaceAll('\n', '\\n')
}

export {formatKeyValueTable, formatTable}
export type {TableColumn, TableValue}
