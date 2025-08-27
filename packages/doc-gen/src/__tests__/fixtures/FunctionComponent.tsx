import React from 'react'

export function FunctionComponent({foo, bar = 42, baz}: {foo: string; bar?: number; baz?: boolean}) {
  return (
    <div>
      {foo}
      {bar}
      {baz ? 'yes' : 'no'}
    </div>
  )
}
