import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import sass from 'sass.macro'
import {injectGlobal} from 'emotion'
import {withSystemProps} from './system-props'

injectGlobal(sass`
  @import "primer-support/index.scss";
  @import "primer-labels/lib/labels.scss";
`)

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

function Label({className, outline, scheme, ...rest}) {
  const classes = classnames(className, 'Label', outline && 'Label--outline', colorScheme(scheme, outline))
  return <span className={classes} {...rest} />
}

Label.propTypes = {
  outline: PropTypes.bool,
  scheme: PropTypes.oneOf(['gray', 'gray-darker', 'green', 'orange'])
}

export default withSystemProps(Label, ['space'])
