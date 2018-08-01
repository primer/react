import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {space} from 'styled-system'
import styled from 'react-emotion'

const colorScheme = (scheme, outline) => {
  if (outline) {
    return {
      'Label--outline-green': scheme === 'green'
    }
  } else {
    return {
      'Label--gray': scheme == null || scheme === 'gray',
      'Label--gray-darker': scheme === 'gray-darker',
      'Label--orange': scheme === 'orange',
      'bg-green': scheme === 'green'
    }
  }
}

const Label = styled(({className, outline, scheme, ...rest}) => {
  const classes = classnames(
    className,
    'Label',
    outline && 'Label--outline',
    colorScheme(scheme, outline)
  )
  return <span className={classes} {...rest} />
})(space)

Label.propTypes = {
  ...space.propTypes,
  outline: PropTypes.bool,
  scheme: PropTypes.oneOf(['gray', 'gray-darker', 'green', 'orange'])
}

export default Label
