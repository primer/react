import {describe, expect, it} from 'vitest'
import {buildPaginationModel} from './model'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function first(array: Array<any>, count = 1) {
  const slice = array.slice(0, count)
  return count === 1 ? slice[0] : slice
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function last(array: Array<any>, count = 1) {
  const len = array.length
  const slice = array.slice(len - count, len)
  return count === 1 ? slice[0] : slice
}

describe('Pagination model', () => {
  it('correctly handles negative pages', () => {
    const model = buildPaginationModel(-10, 1, true, 1, 2)
    expect(first(model).type).toEqual('PREV')
    expect(first(model).disabled).toBe(true)
    expect(last(model).type).toEqual('NEXT')
    expect(last(model).disabled).toBe(true)
    expect(model.length).toBe(2)
  })

  it('correctly handles zero pages', () => {
    const model = buildPaginationModel(0, 1, true, 1, 2)
    expect(first(model).type).toEqual('PREV')
    expect(first(model).disabled).toBe(true)
    expect(last(model).type).toEqual('NEXT')
    expect(last(model).disabled).toBe(true)
    expect(model.length).toBe(2)
  })

  it('correctly handles 1 page', () => {
    const model = buildPaginationModel(1, 1, true, 1, 2)
    expect(first(model).type).toEqual('PREV')
    expect(first(model).disabled).toBe(true)
    expect(last(model).type).toEqual('NEXT')
    expect(last(model).disabled).toBe(true)
    expect(model.length).toBe(3)
  })

  it('correctly handles zero margin pages', () => {
    const model = buildPaginationModel(6, 2, true, 0, 2)

    const expected = [
      {
        type: 'PREV',
        num: 1,
        disabled: false,
      },
      {
        type: 'NUM',
        num: 1,
        selected: false,
        precedesBreak: false,
      },
      {
        type: 'NUM',
        num: 2,
        selected: true,
        precedesBreak: false,
      },
      {
        type: 'NUM',
        num: 3,
        selected: false,
        precedesBreak: false,
      },
      {
        type: 'NUM',
        num: 4,
        selected: false,
        precedesBreak: false,
      },
      {
        type: 'NUM',
        num: 5,
        selected: false,
        precedesBreak: false,
      },
      {
        type: 'NUM',
        num: 6,
        selected: false,
        precedesBreak: false,
      },
      {
        type: 'NEXT',
        num: 3,
        disabled: false,
      },
    ]

    expect(model).toMatchObject(expected)
  })

  it('correctly handles zero surrounding pages', () => {
    const model = buildPaginationModel(7, 4, true, 1, 0)

    const expected = [
      {
        type: 'PREV',
        num: 3,
        disabled: false,
      },
      {
        type: 'NUM',
        num: 1,
        selected: false,
        precedesBreak: true,
      },
      {
        type: 'BREAK',
        num: 2,
      },
      {
        type: 'NUM',
        num: 4,
        selected: true,
        precedesBreak: true,
      },
      {
        type: 'BREAK',
        num: 5,
      },
      {
        type: 'NUM',
        num: 7,
        selected: false,
        precedesBreak: false,
      },
      {
        type: 'NEXT',
        num: 5,
        disabled: false,
      },
    ]

    expect(model).toMatchObject(expected)
  })

  it('correctly handles zero margin and surrounding pages', () => {
    const model = buildPaginationModel(50, 3, true, 0, 0)

    const expected = [
      {
        type: 'PREV',
        num: 2,
        disabled: false,
      },
      {
        type: 'BREAK',
        num: 1,
      },
      {
        type: 'NUM',
        num: 3,
        selected: true,
        precedesBreak: true,
      },
      {
        type: 'BREAK',
        num: 4,
      },
      {
        type: 'NEXT',
        num: 4,
        disabled: false,
      },
    ]

    expect(model).toMatchObject(expected)
  })

  it('sets disabled on prev links', () => {
    const model1 = buildPaginationModel(10, 1, true, 1, 2)
    expect(first(model1).type).toEqual('PREV')
    expect(first(model1).disabled).toBe(true)

    const model2 = buildPaginationModel(10, 2, true, 1, 2)
    expect(first(model2).type).toEqual('PREV')
    expect(first(model2).disabled).toBe(false)
  })

  it('sets disabled on next links', () => {
    const model1 = buildPaginationModel(10, 10, true, 1, 2)
    expect(last(model1).type).toEqual('NEXT')
    expect(last(model1).disabled).toBe(true)

    const model2 = buildPaginationModel(10, 9, true, 1, 2)
    expect(last(model2).type).toEqual('NEXT')
    expect(last(model2).disabled).toBe(false)
  })

  it('sets the page number for prev and next links', () => {
    const model = buildPaginationModel(10, 5, true, 1, 2)
    expect(first(model).num).toEqual(4)
    expect(last(model).num).toEqual(6)
  })

  it('ensures margin pages on the left', () => {
    const model = buildPaginationModel(10, 10, true, 2, 0)
    const slice = first(model, 5)

    const expected = [
      {type: 'PREV', num: 9},
      {type: 'NUM', num: 1},
      {type: 'NUM', num: 2},
      {type: 'BREAK'},
      {type: 'NUM'},
    ]

    expect(slice).toMatchObject(expected)
  })

  it('ensures margin pages on the right', () => {
    const model = buildPaginationModel(10, 1, true, 2, 0)
    const slice = last(model, 5)

    const expected = [
      {type: 'NUM', precedesBreak: true},
      {type: 'BREAK'},
      {type: 'NUM', num: 9},
      {type: 'NUM', num: 10},
      {type: 'NEXT', num: 2},
    ]

    expect(slice).toMatchObject(expected)
  })

  it('ensures that the current page is surrounded by the right number of pages', () => {
    const model = buildPaginationModel(10, 5, true, 1, 1)
    const expected = [
      {type: 'PREV', num: 4},
      {type: 'NUM', num: 1, precedesBreak: true},
      {type: 'BREAK'},
      {type: 'NUM', num: 4},
      {type: 'NUM', num: 5, selected: true},
      {type: 'NUM', num: 6, precedesBreak: true},
      {type: 'BREAK'},
      {type: 'NUM', num: 10},
      {type: 'NEXT', num: 6},
    ]
    expect(model).toMatchObject(expected)
  })

  it('adds items to the right if it hits bounds to the left', () => {
    const model = buildPaginationModel(15, 2, true, 1, 1)
    const expected = [
      {type: 'PREV', num: 1},
      {type: 'NUM', num: 1},
      {type: 'NUM', num: 2, selected: true},
      {type: 'NUM', num: 3},
      // normally with a surround of 1, only 1 and 3 would be shown
      // however, since we don't overlap, the window is extended to 5
      {type: 'NUM', num: 4},
      {type: 'NUM', num: 5, precedesBreak: true},
      {type: 'BREAK'},
    ]
    expect(first(model, 7)).toMatchObject(expected)
  })

  it('adds items to the left if it hits bounds to the right', () => {
    const model = buildPaginationModel(15, 14, true, 1, 1)
    const expected = [
      // normally with a surround of 1, only 13 and 15 would be shown
      // however, since we don't overlap, the window is extended to 11
      {type: 'BREAK'},
      {type: 'NUM', num: 11},
      {type: 'NUM', num: 12},
      {type: 'NUM', num: 13},
      {type: 'NUM', num: 14, selected: true},
      {type: 'NUM', num: 15},
      {type: 'NEXT', num: 15},
    ]
    expect(last(model, 7)).toMatchObject(expected)
  })

  it('adds a page when there would be only one page hidden by the left ellipsis', () => {
    const model = buildPaginationModel(15, 5, true, 1, 2)
    const expected = [
      {type: 'PREV', num: 4},
      {type: 'NUM', num: 1},
      {type: 'NUM', num: 2},
      {type: 'NUM', num: 3},
      {type: 'NUM', num: 4},
      {type: 'NUM', num: 5, selected: true},
      {type: 'NUM', num: 6},
      {type: 'NUM', num: 7, precedesBreak: true},
      {type: 'BREAK'},
    ]
    expect(first(model, 9)).toMatchObject(expected)
  })

  it('adds a page when there would be only one page hidden by the right ellipsis', () => {
    const model = buildPaginationModel(15, 11, true, 1, 2)
    const expected = [
      {type: 'BREAK'},
      {type: 'NUM', num: 9},
      {type: 'NUM', num: 10},
      {type: 'NUM', num: 11, selected: true},
      {type: 'NUM', num: 12},
      {type: 'NUM', num: 13},
      {type: 'NUM', num: 14},
      {type: 'NUM', num: 15},
      {type: 'NEXT', num: 12},
    ]
    expect(last(model, 9)).toMatchObject(expected)
  })

  it('correctly creates breaks next to the next/prev links when margin is 0', () => {
    const model = buildPaginationModel(10, 5, true, 0, 1)
    const expected = [
      {type: 'PREV'},
      {type: 'BREAK', num: 1},
      {type: 'NUM', num: 4},
      {type: 'NUM', num: 5, selected: true},
      {type: 'NUM', num: 6, precedesBreak: true},
      {type: 'BREAK', num: 7},
      {type: 'NEXT'},
    ]
    expect(model).toMatchObject(expected)
  })
})
