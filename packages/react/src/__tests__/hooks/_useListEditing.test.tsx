import type {ListItem} from '../../drafts/MarkdownEditor/_useListEditing'
import {parseListItem, listItemToString} from '../../drafts/MarkdownEditor/_useListEditing'

describe('parseListItem', () => {
  it('should return null for a line that is not a list item', () => {
    expect(parseListItem('This is a test line')).toBeNull()
  })

  it('should parse a line that is a numbered list item', () => {
    expect(parseListItem('1. This is a test line')).toEqual({
      leadingWhitespace: '',
      text: 'This is a test line',
      delimeter: 1,
      middleWhitespace: ' ',
      taskBox: null,
    })
  })

  it('should parse a line that is a numbered list item and multiple spaces within', () => {
    expect(parseListItem('1.  This is a test line')).toEqual({
      leadingWhitespace: '',
      text: 'This is a test line',
      delimeter: 1,
      middleWhitespace: '  ',
      taskBox: null,
    })
  })

  it('should parse a line that is a bulleted list item', () => {
    expect(parseListItem('* This is a test line')).toEqual({
      leadingWhitespace: '',
      text: 'This is a test line',
      delimeter: '*',
      middleWhitespace: ' ',
      taskBox: null,
    })
  })

  it('should parse a line that is a task list item', () => {
    expect(parseListItem('- [x] This is a test line')).toEqual({
      leadingWhitespace: '',
      text: 'This is a test line',
      delimeter: '-',
      middleWhitespace: ' ',
      taskBox: '[x]',
    })

    // Up to 4 spaces are supported
    expect(parseListItem('-    [x] This is a test line')).toEqual({
      leadingWhitespace: '',
      text: 'This is a test line',
      delimeter: '-',
      middleWhitespace: '    ',
      taskBox: '[x]',
    })

    // 5 spaces are not supported
    expect(parseListItem('-     [x] This is a test line')).toEqual({
      leadingWhitespace: '',
      text: ' [x] This is a test line',
      delimeter: '-',
      middleWhitespace: '    ',
      taskBox: null,
    })

    // Tabs are supported
    expect(parseListItem('-	[x] This is a test line')).toEqual({
      leadingWhitespace: '',
      text: 'This is a test line',
      delimeter: '-',
      middleWhitespace: '	',
      taskBox: '[x]',
    })
  })
})

describe('listItemToString', () => {
  it('should convert a list item to a string', () => {
    const item = {
      leadingWhitespace: '',
      text: 'This is a test line',
      delimeter: 1,
      middleWhitespace: '   ',
      taskBox: null,
    }
    expect(listItemToString(item)).toBe('1.   This is a test line')
  })

  it('should convert a task list item to a string', () => {
    const item = {
      leadingWhitespace: '',
      text: 'This is a test line',
      delimeter: '-',
      middleWhitespace: '  ',
      taskBox: '[x]',
    } as ListItem
    expect(listItemToString(item)).toBe('-  [x] This is a test line')
  })
})
