type MatrixInput = {
  [key in string]: Array<boolean | string | number>
}

export function matrix(input: MatrixInput) {
  const keys = Object.keys(input)
  const values = Object.values(input)

  return combine(...values).map(result => {
    const combination: Record<string, any> = {}

    for (let i = 0; i < result.length; i++) {
      const key = keys[i]
      combination[key] = result[i]
    }

    return combination
  })
}

function combine(...values: Array<Array<unknown>>): Array<Array<unknown>> {
  if (values.length === 0) {
    throw new Error(`combine() must be given at least one Array of values`)
  }

  if (values.length === 1) {
    return values[0].map(value => [value])
  }

  if (values.length === 2) {
    return values[0].flatMap(a => {
      return values[1].map(b => {
        return [a, b].flat()
      })
    })
  }

  return combine(combine(values[0], values[1]), ...values.slice(2))
}

export function serialize(combination: Record<string, boolean | string | number>) {
  const values = Object.entries(combination)
    .sort((a, b) => {
      return b[0].localeCompare(a[0])
    })
    .map(([key, value]) => {
      return `${key}:${value}`
    })
  return values.join(',')
}
