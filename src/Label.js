import React from 'react'
import classnames from 'classnames'

const colorScheme = (scheme, outline) => {
  if (outline) {
    return {
      'Label--outline-green': scheme === 'green'
    }
  } else {
    return {
      'Label--gray': (scheme == null || scheme === 'gray'),
      'Label--gray-darker': scheme === 'gray-darker',
      'Label--orange': scheme === 'orange',
      'bg-green': scheme === 'green'
    }
  }
}

const Label = props => {
  const { outline, scheme } = props
  return <span
    className={classnames(
      'Label',
      outline ? 'Label--outline' : '',
      colorScheme(scheme, outline)
    )}>
    {props.children}
  </span>
}

export default Label
