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

export const ArrowComponent = ({alpha, beta = 'default'}: {alpha: number; beta?: string}) => {
  return (
    <span>
      {alpha}
      {beta}
    </span>
  )
}

export class ClassComponent extends React.Component<{x: string; y?: number}> {
  render() {
    return (
      <div>
        {this.props.x}
        {this.props.y}
      </div>
    )
  }
}

export default function DefaultExportComponent({a, b = false}: {a: string; b?: boolean}) {
  return (
    <div>
      {a}
      {b ? 'b' : ''}
    </div>
  )
}
