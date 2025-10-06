import React from 'react'

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
