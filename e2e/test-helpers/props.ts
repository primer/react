type Value = boolean | string | number

type MatrixInput = {
  [key: string]: Array<Value> | Array<Record<string, Value>> | undefined
  exclude?: Array<Record<string, Value>>
}

export function matrix(input: MatrixInput) {
  const keys: Array<string> = []
  const values = []
  const excluded: Array<Record<string, Value>> = []

  for (const [key, value] of Object.entries(input)) {
    if (key === 'exclude') {
      if (Array.isArray(value)) {
        excluded.push(...(value as Array<Record<string, Value>>))
      }
      continue
    }

    if (typeof value === 'undefined') {
      continue
    }

    keys.push(key)
    values.push(value)
  }

  const combinations = combine(...values).map(result => {
    const combination: Record<string, any> = {}

    for (let i = 0; i < result.length; i++) {
      const key = keys[i]
      combination[key] = result[i]
    }

    return combination
  })

  return combinations.filter(combination => {
    return excluded.every(options => {
      return !Object.keys(options).every(key => {
        return combination[key] === options[key]
      })
    })
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
      return a[0].localeCompare(b[0])
    })
    .map(([key, value]) => {
      return `${key}=${value}`
    })
  return values.join(',')
}
