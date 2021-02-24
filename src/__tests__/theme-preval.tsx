import {isColorValue, isShadowValue, filterObject} from '../theme-preval'

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
        '#24292e'
      ]
    },
    btn: {
      shadow: '0 1px 0 rgba(27,31,35,0.04)'
    }
  }

  it('filtering out shadow values results in correct values', () => {
    const filteredColors = filterObject(colors, (value: any) => isColorValue(value))
    expect(Object.keys(filteredColors)).not.toContain('btn')
    expect(Object.keys(filteredColors)).toContain('scale')
    expect(Object.keys(filteredColors.scale)).toContain('gray')
    expect(filteredColors.scale.gray).toEqual(colors.scale.gray)
  })

  it('filtering out color values results in correct values', () => {
    const filteredShadows = filterObject(colors, (value: any) => isShadowValue(value))
    expect(Object.keys(filteredShadows)).not.toContain('scale')
    expect(Object.keys(filteredShadows)).toContain('btn')
    expect(Object.keys(filteredShadows.btn)).toContain('shadow')
    expect(filteredShadows.btn.shadow).toEqual(colors.btn.shadow)
  })
})
