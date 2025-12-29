type ConfigureKeys = 'include' | 'exclude'
type InputKeys<Input> = Exclude<Extract<keyof Input, string>, ConfigureKeys>

type Combination<Input> = {
  [Property in InputKeys<Input>]: Input[Property] extends ReadonlyArray<infer ElementType> ? ElementType : never
}

type Config<Input> = {
  [Property in InputKeys<Input>]: Input[Property] extends ReadonlyArray<unknown> ? Input[Property] : never
} & {
  include?: ReadonlyArray<Combination<Input>>
  exclude?: ReadonlyArray<Combination<Input>>
}

type Values<Input> = {
  [Key in InputKeys<Input>]: Input[Key] extends ReadonlyArray<unknown> ? Input[Key] : never
}[InputKeys<Input>]

export function matrix<const Input extends Config<Input>>(input: Input): Array<Combination<Input>> {
  const {include = [], exclude = [], ...scenarios} = input
  const excluded = exclude.map(scenario => {
    return Object.entries(scenario) as Array<[InputKeys<Input>, Combination<Input>]>
  })
  const keys = Object.keys(scenarios)
  const values = Object.values(scenarios) as Array<Values<Input>>
  const sets = product(values)

  return sets
    .map(set => {
      return Object.fromEntries(
        set.map((value, index) => {
          return [keys[index], value]
        }),
      ) as Combination<Input>
    })
    .filter(set => {
      const match = excluded.some(combination => {
        return combination.every(([key, value]) => {
          return set[key] === value
        })
      })
      if (match) {
        return false
      }
      return true
    })
    .concat(include)
}

function product<Sets extends ReadonlyArray<ReadonlyArray<unknown>>>([a, b, ...rest]: Sets): ReadonlyArray<
  ReadonlyArray<unknown>
> {
  if (rest.length === 0) {
    return a.flatMap(itemA => b.map(itemB => [itemA, itemB].flat()))
  }
  return product([product([a, b]), ...rest])
}

export function serialize<T extends string | boolean>(scenario: Record<string, T>): string {
  return Object.entries(scenario)
    .sort((a, b) => {
      return a[0].localeCompare(b[0])
    })
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}:"${value}"`
      }
      return `${key}:${value}`
    })
    .join(', ')
}
