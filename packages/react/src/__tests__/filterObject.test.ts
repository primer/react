import {describe, expect, it} from 'vitest'
import {isColorValue, isShadowValue, filterObject} from '../utils/theme'

describe('filterObject', () => {
  const colors = {
    scale: {
      gray: [
        '#fafbfc',
        '#f6f8fa',
        '#e1e4e8',
        '#d1d5da',
        '#959da5',
        '#6a737d',
        '#586069',
        '#444d56',
        '#2f363d',
        '#24292e',
      ],
    },
    btn: {
      shadow: '0 1px 0 rgba(27,31,35,0.04)',
    },
  }

  it('filters out shadow values', () => {
    const expected = {
      scale: {
        gray: [
          '#fafbfc',
          '#f6f8fa',
          '#e1e4e8',
          '#d1d5da',
          '#959da5',
          '#6a737d',
          '#586069',
          '#444d56',
          '#2f363d',
          '#24292e',
        ],
      },
    }

    expect(filterObject(colors, (value: unknown) => isColorValue(value))).toEqual(expected)
  })

  it('filters out color values', () => {
    const expected = {
      btn: {
        shadow: '0 1px 0 rgba(27,31,35,0.04)',
      },
    }

    expect(filterObject(colors, (value: unknown) => isShadowValue(value))).toEqual(expected)
  })
})
