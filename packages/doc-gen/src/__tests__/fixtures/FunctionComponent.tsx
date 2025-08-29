import React from 'react'

export function FunctionComponent({
  foo,
  bar = 42,
  baz,
}: {
  /**
   * Updated description
   *
   * @default "new default value"
   */
  foo: string
  bar?: number
  baz?: boolean
}) {
  return (
    <div>
      {foo}
      {bar}
      {baz ? 'yes' : 'no'}
    </div>
  )
}
