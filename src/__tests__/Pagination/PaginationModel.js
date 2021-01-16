import 'babel-polyfill'
import {buildPaginationModel} from '../../Pagination/model'

function first(array, count = 1) {
  const slice = array.slice(0, count)
  return count === 1 ? slice[0] : slice
}

function last(array, count = 1) {
  const len = array.length
  const slice = array.slice(len - count, len)
  return count === 1 ? slice[0] : slice
}

describe('Pagination model', () => {
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
      {type: 'NUM'}
    ]

    expect(slice).toMatchObject(expected)
  })

  it('ensures margin pages on the right', () => {
    const model = buildPaginationModel(10, 1, true, 2, 0)
    const slice = last(model, 5)

    const expected = [
      {type: 'NUM'},
      {type: 'BREAK'},
      {type: 'NUM', num: 9},
      {type: 'NUM', num: 10},
      {type: 'NEXT', num: 2}
    ]

    expect(slice).toMatchObject(expected)
  })

  it('ensures that the current page is surrounded by the right number of pages', () => {
    const model = buildPaginationModel(10, 5, true, 1, 1)
    const expected = [
      {type: 'PREV', num: 4},
      {type: 'NUM', num: 1},
      {type: 'BREAK'},
      {type: 'NUM', num: 4},
      {type: 'NUM', num: 5, selected: true},
      {type: 'NUM', num: 6},
      {type: 'BREAK'},
      {type: 'NUM', num: 10},
      {type: 'NEXT', num: 6}
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
      // however, since 1 was already shown, we extend to 4
      {type: 'NUM', num: 4},
      {type: 'BREAK'}
    ]
    expect(first(model, 6)).toMatchObject(expected)
  })

  it('adds items to the left if it hits bounds to the right', () => {
    const model = buildPaginationModel(15, 14, true, 1, 1)
    const expected = [
      // normally with a surround of 1, only 13 and 15 would be shown
      // however, since 15 was already shown, we extend to 12
      {type: 'BREAK'},
      {type: 'NUM', num: 12},
      {type: 'NUM', num: 13},
      {type: 'NUM', num: 14, selected: true},
      {type: 'NUM', num: 15},
      {type: 'NEXT', num: 15}
    ]
    expect(last(model, 6)).toMatchObject(expected)
  })

  it('correctly creates breaks next to the next/prev links when margin is 0', () => {
    const model = buildPaginationModel(10, 5, true, 0, 1)
    const expected = [
      {type: 'PREV'},
      {type: 'BREAK', num: 1},
      {type: 'NUM', num: 4},
      {type: 'NUM', num: 5, selected: true},
      {type: 'NUM', num: 6},
      {type: 'BREAK', num: 10},
      {type: 'NEXT'}
    ]
    expect(model).toMatchObject(expected)
  })
})
