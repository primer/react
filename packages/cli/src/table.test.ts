import {describe, expect, test} from 'vitest'
import {createTable} from './table'

describe('createTable', () => {
  test('formats columns and rows as a padded markdown table', () => {
    const table = createTable({
      columns: ['Name', 'Description'],
      rows: [
        ['Button', 'Triggers action'],
        ['Link', 'Navigates'],
      ],
      terminalWidth: 100,
    })

    expect(table.toString()).toBe(
      [
        '| Name   | Description     |',
        '| ------ | --------------- |',
        '| Button | Triggers action |',
        '| Link   | Navigates       |',
      ].join('\n'),
    )
  })

  test('truncates the widest column to fit the terminal', () => {
    const table = createTable({
      columns: ['Name', 'Description'],
      rows: [['Button', 'Triggers action']],
      terminalWidth: 24,
    })

    expect(table.toString()).toBe(
      ['| Name   | Description |', '| ------ | ----------- |', '| Button | Triggers a… |'].join('\n'),
    )
  })

  test('renders missing row values as empty cells', () => {
    const table = createTable({
      columns: ['Name', 'Status'],
      rows: [['Button']],
      terminalWidth: 100,
    })

    expect(table.toString()).toBe(['| Name   | Status |', '| ------ | ------ |', '| Button |        |'].join('\n'))
  })

  test('normalizes newlines in cells to commas', () => {
    const table = createTable({
      columns: ['Name', 'Description'],
      rows: [
        ['Button\nIconButton', 'Triggers an action'],
        ['Link', 'Navigates\r\n  somewhere'],
      ],
      terminalWidth: 100,
    })

    expect(table.toString()).toBe(
      [
        '| Name               | Description          |',
        '| ------------------ | -------------------- |',
        '| Button, IconButton | Triggers an action   |',
        '| Link               | Navigates, somewhere |',
      ].join('\n'),
    )
  })

  test('truncates normalized multiline cells', () => {
    const table = createTable({
      columns: ['Name', 'Description'],
      rows: [['Button', 'Triggers action\nNavigates elsewhere']],
      terminalWidth: 24,
    })

    expect(table.toString()).toBe(
      ['| Name   | Description |', '| ------ | ----------- |', '| Button | Triggers a… |'].join('\n'),
    )
  })
})
