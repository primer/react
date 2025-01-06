import {alphanumeric, basic, datetime} from '../sorting'

const Second = 1000
const Minute = 60 * Second
const Hour = 60 * Minute
const Day = 24 * Hour
const today = Date.now()
const yesterday = today - Day

describe('sorting', () => {
  describe('alphanumeric', () => {
    test.each([
      [
        'characters only',
        {
          input: ['c', 'b', 'a'],
          sorted: ['a', 'b', 'c'],
        },
      ],
      [
        'numbers only',
        {
          input: ['3', '2', '1'],
          sorted: ['1', '2', '3'],
        },
      ],
      [
        'text with numbers',
        {
          input: ['test456', 'test789', 'test123'],
          sorted: ['test123', 'test456', 'test789'],
        },
      ],
      [
        'text and numbers',
        {
          input: ['test-c', '1', 'test-b', '2', 'test-a', '3'],
          sorted: ['1', '2', '3', 'test-a', 'test-b', 'test-c'],
        },
      ],
      [
        'text with same base',
        {
          input: ['test', 'test-123', 'test-123-test-456'],
          sorted: ['test', 'test-123', 'test-123-test-456'],
        },
      ],
      [
        'text case sensitive',
        {
          input: ['test456', 'Test456', 'test123'],
          sorted: ['test123', 'test456', 'Test456'],
        },
      ],
    ])('%s', (_name, options) => {
      expect(options.input.sort(alphanumeric)).toEqual(options.sorted)
    })
  })

  describe('basic', () => {
    test.each([
      [
        'text',
        {
          input: ['c', 'b', 'a'],
          sorted: ['a', 'b', 'c'],
        },
      ],
      [
        'numbers',
        {
          input: [3, 2, 1],
          sorted: [1, 2, 3],
        },
      ],
    ])('%s', (_name, options) => {
      expect(options.input.sort(basic)).toEqual(options.sorted)
    })
  })

  describe('datetime', () => {
    test.each([
      [
        'only Date objects',
        {
          input: [new Date(today), new Date(yesterday)],
          sorted: [new Date(yesterday), new Date(today)],
        },
      ],
      [
        'Date and Date.now()',
        {
          input: [new Date(today), yesterday],
          sorted: [yesterday, new Date(today)],
        },
      ],
      [
        'only Date.now()',
        {
          input: [today, yesterday],
          sorted: [yesterday, today],
        },
      ],
    ])('%s', (_name, options) => {
      expect(options.input.sort(datetime)).toEqual(options.sorted)
    })
  })
})
