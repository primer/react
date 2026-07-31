import Radio from '.'

export function doesNotAcceptType() {
  // @ts-expect-error Radio always renders an input with type="radio"
  return <Radio name="example" value="example" type="checkbox" />
}
