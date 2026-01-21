const {flattenComponents} = require('../flatten-components')

const mockComponents = passedObj => {
  return {
    Button: 'button',
    Link: 'a',
    Spinner: 'svg',
    Radio: 'input',
    TextInput: {
      Action: 'button',
      self: 'input',
    },
    ...passedObj,
  }
}

describe('getElementType', function () {
  it('flattens passed object 1-level deep', function () {
    const result = flattenComponents(mockComponents())

    const expectedResult = {
      Button: 'button',
      Link: 'a',
      Spinner: 'svg',
      Radio: 'input',
      TextInput: 'input',
      'TextInput.Action': 'button',
    }

    expect(result).toEqual(expectedResult)
  })

  it('ignores objects nested deeper than 1-level', function () {
    const result = flattenComponents(
      mockComponents({
        Select: {
          Items: {
            self: 'div',
          },
          Option: 'option',
          self: 'select',
        },
      }),
    )

    const expectedResult = {
      Button: 'button',
      Link: 'a',
      Spinner: 'svg',
      Radio: 'input',
      TextInput: 'input',
      'TextInput.Action': 'button',
      'Select.Items': {
        self: 'div',
      },
      Select: 'select',
      'Select.Option': 'option',
    }

    expect(result).toEqual(expectedResult)
  })
})
