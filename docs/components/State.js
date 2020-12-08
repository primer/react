import React from 'react'

const State = (props) => {
  const result = React.useState(props.default)

  return props.children(result)
}

export default State
